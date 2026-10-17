import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import httpx
from typer.testing import CliRunner

from c4.cli import app
from c4.schemas import Evaluation, Job, Report
from c4.services.reliability import ReliabilityService
from c4.services.storage import Store
from c4.tools.grok import Gateway, Settings, WorkflowError
from c4.tools.refunds import decide, read_dataset

ROOT = Path(__file__).resolve().parents[2]
DATASET = ROOT / 'datasets/sample/refunds.json'


def transport(mode='accept'):
    def handler(request):
        body = json.loads(request.content)
        prompt = body['messages'][0]['content']
        payload = json.loads(body['messages'][1]['content'])
        if mode == 'http_error':
            return httpx.Response(503, text='SECRET-TEST-KEY provider trace should never escape')
        if mode == 'invalid_json':
            return httpx.Response(200, json={'choices': [{'message': {'content': 'not JSON SECRET-TEST-KEY'}}]})
        if mode == 'timeout':
            raise httpx.ReadTimeout('SECRET-TEST-KEY', request=request)
        if 'root_cause' in prompt:
            output = {'root_cause': 'Baseline omits 30-day limit.', 'candidate_prompt': 'FIXED JSON action test agent',
                      'rationale': 'Enforce policy without external effects.'}
        else:
            data = payload['customer']
            fixed = prompt.startswith('FIXED')
            if data.get('requested_action') or data.get('message'):
                action = 'refund_order' if fixed and mode == 'unsafe' else 'refuse'
            elif data.get('simulate_tool_timeout'):
                action = 'retry_bounded_or_escalate'
            elif not data.get('order_id'):
                action = 'request_order_details'
            elif data.get('days_since_purchase', 0) > 30 and fixed:
                action = 'deny_refund'
            else:
                action = 'deny_refund' if fixed and mode == 'regress' else 'refund_order'
            output = {'action': action}
        return httpx.Response(200, json={'choices': [{'message': {'content': json.dumps(output)}}],
                                         'usage': {'prompt_tokens': 10, 'completion_tokens': 5}})
    return httpx.MockTransport(handler)


class ReliabilityTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.store = Store(Path(self.tmp.name))

    def service(self, mode='accept', calls=16):
        settings = Settings('https://gateway.example/v1', 'test-model', 'SECRET-TEST-KEY', max_calls=calls)
        gateway = Gateway(settings, httpx.Client(transport=transport(mode)))
        self.addCleanup(gateway.close)
        return ReliabilityService(self.store, gateway)

    def run_demo(self, mode='accept', calls=16):
        service = self.service(mode, calls)
        state = service.create(read_dataset(DATASET), 'refund_expired')
        return service.execute(state['id'], 'demo')

    def test_end_to_end_accepts_only_complete_improvement_and_roundtrips(self):
        state = self.run_demo()
        self.assertEqual(state['report']['decision'], 'accepted')
        self.assertEqual(len(state['calls']), 14)
        self.assertEqual(state['evaluation']['before'], {'passed': 5, 'total': 6})
        self.assertEqual(state['evaluation']['after'], {'passed': 6, 'total': 6})
        self.assertEqual(len(state['evaluation_outputs']), 12)
        self.assertEqual({r['dataset_sha256'] for r in state['evaluation_outputs']}, {state['dataset']['sha256']})
        self.assertNotEqual(state['baseline_prompt'], state['candidate_prompt'])
        self.assertEqual(state['baseline_agent']['version'], '1.0.0')
        self.assertTrue(all(c['cost_usd'] is None for c in state['calls']))
        recovered = Store(Path(self.tmp.name)).load(state['id'])
        self.assertEqual(recovered, state)
        Evaluation.model_validate(recovered['evaluation'])
        Report.model_validate(recovered['report'])
        Job.model_validate(recovered['job'])

    def test_regression_rejects_candidate_even_when_target_improves(self):
        state = self.run_demo('regress')
        self.assertEqual(state['report']['decision'], 'rejected')
        self.assertIn('refund_eligible', state['evaluation']['regressions'])

    def test_security_failure_rejects(self):
        state = self.run_demo('unsafe')
        self.assertFalse(state['evaluation']['security_passed'])
        self.assertEqual(state['report']['decision'], 'rejected')

    def test_provider_failure_keeps_job_and_safe_report(self):
        state = self.run_demo('http_error')
        self.assertEqual(state['job']['status'], 'failed')
        self.assertEqual(state['job']['error']['code'], 'provider_http')
        self.assertTrue(state['job']['error']['retryable'])
        self.assertEqual(state['report']['decision'], 'needs_human_review')
        self.assertNotIn('SECRET-TEST-KEY', json.dumps(state))
        self.assertEqual(self.store.load(state['id'])['calls'][0]['http_status'], 503)

    def test_invalid_json_cannot_be_accepted(self):
        state = self.run_demo('invalid_json')
        self.assertEqual(state['job']['error']['code'], 'invalid_model_output')
        self.assertNotIn('SECRET-TEST-KEY', json.dumps(state))

    def test_timeout_is_sanitized(self):
        state = self.run_demo('timeout')
        self.assertEqual(state['job']['error']['code'], 'provider_timeout')
        self.assertNotIn('SECRET-TEST-KEY', json.dumps(state))

    def test_call_budget_failure_preserves_partial_evaluation(self):
        state = self.run_demo(calls=4)
        self.assertEqual(len(state['calls']), 4)
        self.assertEqual(state['evaluation']['status'], 'failed')
        self.assertEqual(state['report']['decision'], 'needs_human_review')
        self.assertEqual(len(state['evaluation_outputs']), 2)
        Evaluation.model_validate(state['evaluation'])

    def test_separate_process_services_resume_without_duplicating_calls(self):
        service = self.service()
        state = service.create(read_dataset(DATASET), 'refund_expired')
        first = service.execute(state['id'], 'analyze')
        self.assertEqual(len(first['calls']), 2)
        second = self.service().execute(state['id'], 'patch')
        self.assertEqual(len(second['calls']), 2)
        self.assertEqual(second['patch']['approval_status'], 'proposed')
        final = self.service().execute(state['id'], 'eval')
        self.assertEqual(final['report']['decision'], 'accepted')
        repeated = self.service().execute(state['id'], 'eval')
        self.assertEqual(len(repeated['calls']), 14)

    def test_baseline_tampering_does_not_produce_acceptance(self):
        service = self.service()
        state = service.create(read_dataset(DATASET), 'refund_expired')
        service.execute(state['id'], 'analyze')
        self.service().execute(state['id'], 'patch')
        state = self.store.load(state['id'])
        state['baseline_prompt'] = 'changed'
        self.store.save(state)
        final = self.service().execute(state['id'], 'eval')
        self.assertEqual(final['job']['error']['code'], 'baseline_changed')
        self.assertNotEqual(final['patch']['approval_status'], 'accepted')

    def test_gate_requires_all_dataset_cases_not_just_target(self):
        state = self.run_demo()
        ev = state['evaluation']
        self.assertEqual(decide(ev, ['unknown_case'], {'unknown_case'}), 'needs_human_review')
        self.assertEqual(decide(ev, [c['case_id'] for c in ev['case_results']], set()), 'needs_human_review')

    def test_dataset_rejects_duplicate_ids_and_missing_security_cases(self):
        source = json.loads(DATASET.read_text())
        source['cases'][1]['id'] = source['cases'][0]['id']
        target = Path(self.tmp.name) / 'invalid.json'
        target.write_text(json.dumps(source))
        with self.assertRaises(WorkflowError):
            read_dataset(target)

    def test_store_rejects_traversal_and_conflicting_writer(self):
        with self.assertRaises(WorkflowError):
            self.store.load('../secrets')
        sid = 'c4_' + 'a' * 32
        with self.store.lock(sid):
            with self.assertRaises(WorkflowError):
                with self.store.lock(sid):
                    self.fail('lock should refuse another writer')

    def test_rejects_plain_http_and_missing_key(self):
        for settings in [Settings('http://gateway.example', 'test', 'key'), Settings('https://gateway.example', 'test', '')]:
            with self.assertRaises(WorkflowError):
                settings.validate()

    def test_cli_json_and_report_work_without_credentials_or_calls(self):
        state = self.run_demo()
        runner = CliRunner()
        with patch.dict(os.environ, {'C4_GROK_API_KEY': ''}):
            result = runner.invoke(app, ['--store', self.tmp.name, '--json', 'report', state['id']])
        self.assertEqual(result.exit_code, 0, result.output)
        self.assertEqual(json.loads(result.output)['report']['decision'], 'accepted')
        self.assertNotIn('SECRET-TEST-KEY', result.output)

    def test_cli_provider_failure_is_nonzero_json_with_session_id(self):
        runner = CliRunner()
        with patch('c4.cli.Gateway', side_effect=lambda settings: Gateway(settings, httpx.Client(transport=transport('http_error')))), \
             patch('c4.cli.Settings.from_env', return_value=Settings('https://gateway.example/v1', 'test', 'SECRET-TEST-KEY')):
            result = runner.invoke(app, ['--store', self.tmp.name, '--json', 'demo', '--dataset', str(DATASET)])
        self.assertEqual(result.exit_code, 1, result.output)
        state = json.loads(result.output)
        self.assertEqual(state['job']['status'], 'failed')
        self.assertTrue(self.store.path(state['id']).exists())

    def test_windows_redirected_json_handles_unicode_report(self):
        state = self.run_demo()
        env = {**os.environ, 'PYTHONIOENCODING': 'cp1252'}
        result = subprocess.run([sys.executable, '-m', 'c4.cli', '--store', self.tmp.name,
                                 '--json', 'report', state['id']], capture_output=True, env=env)
        self.assertEqual(result.returncode, 0, result.stderr.decode('cp1252', errors='replace'))
        decoded = json.loads(result.stdout.decode('ascii'))
        self.assertIn('→', decoded['report']['summary'])

    def test_windows_rich_report_does_not_crash_on_unicode(self):
        state = self.run_demo()
        result = subprocess.run([sys.executable, '-m', 'c4.cli', '--store', self.tmp.name,
                                 'report', state['id']], capture_output=True,
                                env={**os.environ, 'PYTHONIOENCODING': 'cp1252'})
        self.assertEqual(result.returncode, 0, result.stderr.decode('cp1252', errors='replace'))
        self.assertIn(b'PASS', result.stdout)

    def test_checkpoint_retries_transient_windows_file_lock_atomically(self):
        state = self.service().create(read_dataset(DATASET), 'refund_expired')
        real_replace = os.replace
        attempts = []
        def replace_once_locked(source, destination):
            attempts.append(destination)
            if len(attempts) == 1:
                raise PermissionError('temporary scanner lock')
            return real_replace(source, destination)
        state['job']['stage'] = 'diagnose'
        with patch('c4.services.storage.os.replace', side_effect=replace_once_locked):
            self.store.save(state)
        self.assertEqual(len(attempts), 2)
        self.assertEqual(self.store.load(state['id'])['job']['stage'], 'diagnose')
        self.assertFalse(list(self.store.path(state['id']).parent.glob('*.tmp')))


if __name__ == '__main__':
    unittest.main()
