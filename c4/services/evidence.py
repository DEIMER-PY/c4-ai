"""Read-only projection of CLI checkpoints onto existing v1 contracts."""
import re
from pathlib import Path

from pydantic import ValidationError

from c4.schemas import Agent, Evaluation, Incident, Job, Patch, Report, Run
from c4.services.storage import Store
from c4.tools.grok import WorkflowError
from c4.tools.refunds import decide

MODELS = {'agents':Agent, 'incidents':Incident, 'runs':Run, 'jobs':Job,
          'patches':Patch, 'evaluations':Evaluation, 'reports':Report}
FIELDS = {'baseline_agent':'agents', 'candidate_agent':'agents', 'incident':'incidents',
          'run':'runs', 'job':'jobs', 'patch':'patches', 'evaluation':'evaluations', 'report':'reports'}


class EvidenceError(Exception):
    def __init__(self, status, code, message):
        self.status, self.code, self.message = status, code, message


def identifier(value: str):
    if not re.fullmatch(r'[A-Za-z0-9_-]{3,150}',value):
        raise EvidenceError(422,'invalid_id','Identificador inválido.')
    return value


class EvidenceReader:
    def __init__(self, root: Path):
        self.store = Store(root)

    def index(self):
        entities = {name:{} for name in MODELS}
        try:
            root = self.store.root.resolve()
            if root.exists() and not root.is_dir():
                raise ValueError('not a directory')
            for path in sorted(root.glob('c4_*/evidence.json')):
                sid = path.parent.name
                self.store.path(sid)  # Enforce CLI session syntax before access.
                if not path.resolve().is_relative_to(root):
                    raise ValueError('external link')
                state = self.store.load(sid)
                if state['id'] != sid:
                    raise ValueError('session mismatch')
                current = {}
                for field, name in FIELDS.items():
                    if field in state:
                        model = MODELS[name].model_validate(state[field])
                        identifier(model.id)
                        if model.id in entities[name]:
                            raise ValueError('duplicate entity')
                        entities[name][model.id] = current[field] = model
                incident = current['incident']
                for field in ('job','patch','report'):
                    if field in current and current[field].incident_id != incident.id:
                        raise ValueError('incident relationship')
                if 'run' in current and current['run'].id != incident.run_id:
                    raise ValueError('run relationship')
                if 'patch' in current:
                    patch = current['patch']
                    if patch.baseline_agent_id != current['baseline_agent'].id or patch.candidate_agent_id != current['candidate_agent'].id:
                        raise ValueError('agent relationship')
                if 'evaluation' in current and current['evaluation'].patch_id != current['patch'].id:
                    raise ValueError('evaluation relationship')
                if 'report' in current:
                    report = current['report']
                    if (report.patch_id != getattr(current.get('patch'),'id',None) or
                            report.evaluation_id != getattr(current.get('evaluation'),'id',None)):
                        raise ValueError('report relationship')
                    if report.decision == 'accepted':
                        cases = state['dataset']['data']['cases']
                        decision = decide(state['evaluation'],[c['id'] for c in cases],
                                          {c['id'] for c in cases if c['mandatory_security']})
                        if (decision != 'accepted' or current['patch'].approval_status != 'accepted'
                                or current['job'].status != 'succeeded'):
                            raise ValueError('unsafe accepted report')
            return entities
        except (OSError,ValueError,KeyError,TypeError,ValidationError,WorkflowError):
            raise EvidenceError(503,'invalid_evidence','Evidencia no disponible o incoherente; revisar el almacén local.') from None

    def page(self, name, limit=20, cursor=None):
        if cursor is not None:
            identifier(cursor)
        items = self.index()[name]
        ids = [key for key in sorted(items) if cursor is None or key > cursor]
        selected = ids[:limit]
        return {'items':[items[key] for key in selected],
                'next_cursor':selected[-1] if len(ids)>limit else None}

    def get(self, name, entity_id):
        identifier(entity_id)
        item = self.index()[name].get(entity_id)
        if item is None:
            raise EvidenceError(404,'not_found','Recurso no encontrado en la evidencia local.')
        return item

    def report(self, incident_id):
        identifier(incident_id)
        index = self.index()
        if incident_id in index['incidents']:
            for report in index['reports'].values():
                if report.incident_id == incident_id:
                    return report
        raise EvidenceError(404,'not_found','Reporte todavía no disponible para este incidente.')
