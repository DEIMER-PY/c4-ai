"""Application service shared by CLI and a future API adapter."""
import difflib
import hashlib
from datetime import UTC, datetime
from time import monotonic
from uuid import uuid4

from c4.schemas import Agent, CaseResult, Error, Evaluation, Incident, Job, Patch, Report, Run, Score, Usage
from c4.services.storage import Store
from c4.tools.grok import Gateway, WorkflowError
from c4.tools.refunds import BASELINE_PROMPT, decide, patch_writer, run_agent, trace_reader


def now():
    return datetime.now(UTC)


def dump(model):
    return model.model_dump(mode='json')


class ReliabilityService:
    def __init__(self, store: Store, gateway: Gateway):
        self.store, self.gateway = store, gateway

    def create(self, dataset: dict, target: str) -> dict:
        data = dataset['data']
        if target not in {c['id'] for c in data['cases']}:
            raise WorkflowError('invalid_target', 'El caso objetivo no pertenece al dataset.')
        sid = 'c4_' + uuid4().hex
        state = {
            'id': sid, 'schema_version': 'cli-evidence-1', 'provenance': 'synthetic_cases_real_provider',
            'created_at': now().isoformat(), 'dataset': dataset, 'target_case_id': target,
            'provider': {'base_url': self.gateway.settings.base_url, 'model': self.gateway.settings.model},
            'limits': {'max_calls': self.gateway.settings.max_calls, 'max_tokens': self.gateway.settings.max_tokens,
                       'max_seconds': self.gateway.settings.max_seconds},
            'baseline_prompt': BASELINE_PROMPT, 'baseline_sha256': hashlib.sha256(BASELINE_PROMPT.encode()).hexdigest(),
            'calls': [], 'evaluation_outputs': [],
        }
        state['baseline_agent'] = dump(Agent(id=sid + '_baseline', name='Refunds test agent', version='1.0.0',
            prompt_ref='evidence:baseline_prompt', config_ref='evidence:provider', created_at=now()))
        state['incident'] = dump(Incident(id=sid + '_incident', run_id=sid + '_run',
            category='policy_violation', severity='high', summary='Incidente de prueba pendiente de inspección',
            root_cause=None, status='detected'))
        state['job'] = dump(Job(id=sid + '_job', incident_id=state['incident']['id'], stage='inspect',
            status='queued', attempts=0, error=None, updated_at=now()))
        self.store.save(state)
        return state

    def checkpoint(self, state: dict, stage: str, status: str = 'running'):
        state['calls'] = self.previous_calls + list(self.gateway.records)
        state['job'].update(stage=stage, status=status, updated_at=now().isoformat())
        self.store.save(state)

    def execute(self, session_id: str, operation: str) -> dict:
        # Exclusive lock prevents two CLI processes from spending on the same session.
        with self.store.lock(session_id):
            state = self.store.load(session_id)
            if state['job']['status'] == 'failed':
                raise WorkflowError('failed_session', 'Sesión fallida conservada; inicia una demo nueva. Consulta report para evidencia.')
            self.previous_calls = list(state['calls'])
            self.gateway.calls = len(self.previous_calls)
            elapsed = (now() - datetime.fromisoformat(state['created_at'])).total_seconds()
            remaining = state['limits']['max_seconds'] - elapsed
            if remaining <= 0:
                self.gateway.started = monotonic() - self.gateway.settings.max_seconds
            else:
                self.gateway.started = monotonic() - max(0, self.gateway.settings.max_seconds - remaining)
            # Limits cannot be enlarged when resuming with a new environment.
            from dataclasses import replace
            self.gateway.settings = replace(self.gateway.settings,
                max_calls=min(self.gateway.settings.max_calls, state['limits']['max_calls']),
                max_tokens=min(self.gateway.settings.max_tokens, state['limits']['max_tokens']))
            if state['provider'] != {'base_url': self.gateway.settings.base_url, 'model': self.gateway.settings.model}:
                raise WorkflowError('provider_changed', 'No se puede cambiar proveedor/modelo dentro de una comparación.')
            self.gateway.records.clear()
            state['job']['attempts'] += 1
            try:
                if operation == 'analyze':
                    self.analyze(state)
                elif operation == 'patch':
                    self.patch(state)
                elif operation == 'eval':
                    self.eval_runner(state)
                elif operation == 'demo':
                    self.analyze(state)
                    self.patch(state)
                    self.eval_runner(state)
                else:
                    raise WorkflowError('invalid_operation', 'Operación desconocida.')
                self.checkpoint(state, state['job']['stage'], 'succeeded')
            except WorkflowError as error:
                state['job']['error'] = dump(Error(code=error.code, message=str(error), retryable=error.retryable, details={}))
                state['incident']['status'] = 'needs_human_review'
                if 'patch' in state:
                    state['patch']['approval_status'] = 'needs_human_review'
                if 'evaluation' in state:
                    state['evaluation']['status'] = 'failed'
                state['report'] = self.make_report(state, 'needs_human_review', 'Evidencia incompleta: ' + str(error))
                self.checkpoint(state, state['job']['stage'], 'failed')
            return state

    def analyze(self, state: dict):
        if 'proposal' in state:
            return
        self.checkpoint(state, 'inspect')
        case = next(c for c in state['dataset']['data']['cases'] if c['id'] == state['target_case_id'])
        if 'run' not in state:
            output = run_agent(self.gateway, state['baseline_prompt'], case, 'initial_baseline')
            record = self.gateway.records[-1]
            state['run'] = dump(Run(id=state['incident']['run_id'], agent_id=state['baseline_agent']['id'],
                status='succeeded', input_payload=case['input'], output_payload=output,
                trace=[{'tool': 'test_action_prediction', 'case_id': case['id'], 'output': output}],
                latency_ms=record['latency_ms'], usage=Usage(input_tokens=record['input_tokens'],
                output_tokens=record['output_tokens'], cost_usd=None), created_at=now()))
        state['inspection'] = trace_reader(state['run'], case['expected'])
        if not state['inspection']['mismatch']:
            raise WorkflowError('no_incident', 'El baseline ya cumple el caso objetivo; no se fabrica una mejora.')
        state['incident'].update(status='diagnosing', summary='La acción del agente incumple la política del caso objetivo.')
        self.checkpoint(state, 'diagnose')
        state['proposal'] = patch_writer(self.gateway, state['inspection'], state['dataset']['data']['policy'], state['baseline_prompt'])
        state['incident']['root_cause'] = state['proposal']['root_cause']
        self.checkpoint(state, 'diagnose')

    def patch(self, state: dict):
        if 'patch' in state:
            return
        if 'proposal' not in state:
            raise WorkflowError('missing_diagnosis', 'Ejecuta analyze antes de patch.')
        self.checkpoint(state, 'patch')
        proposal = state['proposal']
        state['candidate_prompt'] = proposal['candidate_prompt']
        state['candidate_agent'] = dump(Agent(id=state['id'] + '_candidate', name='Refunds candidate', version='1.0.1',
            prompt_ref='evidence:candidate_prompt', config_ref='evidence:provider', created_at=now()))
        diff = '\n'.join(difflib.unified_diff(state['baseline_prompt'].splitlines(), state['candidate_prompt'].splitlines(),
                                            fromfile='baseline', tofile='candidate', lineterm=''))
        if not diff:
            raise WorkflowError('empty_patch', 'El candidato no cambia el baseline.')
        state['patch'] = dump(Patch(id=state['id'] + '_patch', incident_id=state['incident']['id'],
            baseline_agent_id=state['baseline_agent']['id'], candidate_agent_id=state['candidate_agent']['id'],
            patch_type='prompt', diff=diff, rationale=proposal['rationale'], approval_status='proposed'))
        state['incident']['status'] = 'patch_proposed'
        self.checkpoint(state, 'patch')

    def eval_runner(self, state: dict):
        """Run both test versions; checkpoint every controlled prediction."""
        if 'report' in state:
            return
        if 'patch' not in state:
            raise WorkflowError('missing_patch', 'Ejecuta patch antes de eval.')
        if hashlib.sha256(state['baseline_prompt'].encode()).hexdigest() != state['baseline_sha256']:
            raise WorkflowError('baseline_changed', 'El baseline dejó de ser inmutable.')
        state['patch']['approval_status'] = 'evaluating'
        state['incident']['status'] = 'evaluating'
        data = state['dataset']['data']
        state['evaluation'] = dump(Evaluation(id=state['id'] + '_evaluation', patch_id=state['patch']['id'],
            dataset_id=data['id'], dataset_version=data['version'], before=Score(passed=0,total=0),
            after=Score(passed=0,total=0), regressions=[], security_passed=False, target_case_id=state['target_case_id'],
            case_results=[], status='running'))
        self.checkpoint(state, 'evaluate')
        rows = []
        for case in data['cases']:
            passed = {}
            for stage in ('before', 'after'):
                output = run_agent(self.gateway, state['baseline_prompt' if stage == 'before' else 'candidate_prompt'],
                                   case, f'evaluate:{stage}:{case["id"]}')
                passed[stage] = output == case['expected']
                state['evaluation_outputs'].append({'case_id': case['id'], 'stage': stage, 'output': output,
                    'expected': case['expected'], 'passed': passed[stage], 'dataset_sha256': state['dataset']['sha256']})
                self.checkpoint(state, 'evaluate')
            rows.append(CaseResult(case_id=case['id'], before_passed=passed['before'], after_passed=passed['after']))
            state['evaluation']['case_results'] = [dump(r) for r in rows]
            self.checkpoint(state, 'evaluate')
        mandatory = {c['id'] for c in data['cases'] if c['mandatory_security']}
        evaluation = Evaluation(id=state['evaluation']['id'], patch_id=state['patch']['id'],
            dataset_id=data['id'], dataset_version=data['version'],
            before=Score(passed=sum(r.before_passed for r in rows), total=len(rows)),
            after=Score(passed=sum(r.after_passed for r in rows), total=len(rows)),
            regressions=[r.case_id for r in rows if r.before_passed and not r.after_passed],
            security_passed=all(r.after_passed for r in rows if r.case_id in mandatory),
            target_case_id=state['target_case_id'], case_results=rows, status='completed')
        state['evaluation'] = dump(evaluation)
        self.checkpoint(state, 'decide')
        decision = decide(state['evaluation'], [c['id'] for c in data['cases']], mandatory)
        state['patch']['approval_status'] = decision
        state['incident']['status'] = {'accepted':'resolved', 'rejected':'rejected', 'needs_human_review':'needs_human_review'}[decision]
        state['report'] = self.make_report(state, decision,
            f'{evaluation.before.passed}/{len(rows)} → {evaluation.after.passed}/{len(rows)}; '
            f'{len(evaluation.regressions)} regresiones. Decisión: {decision}. Solo agente de prueba.')
        self.checkpoint(state, 'report')

    def make_report(self, state: dict, decision: str, summary: str) -> dict:
        return dump(Report(id=state['id'] + '_report', incident_id=state['incident']['id'],
            patch_id=state.get('patch', {}).get('id'), evaluation_id=state.get('evaluation', {}).get('id'),
            decision=decision, summary=summary, evidence_refs=['evidence.json', 'sha256:' + state['dataset']['sha256']]))
