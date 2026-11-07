"""End-to-end: CLI -> persisted session -> read-only API -> verifiable evidence export.

The provider is simulated at the HTTP transport layer, so the real Gateway, budget,
checkpointing, CLI and API code all run unchanged. No network is used unless
C4_LIVE_E2E=1 is set (then one real `c4 doctor --probe` call goes to Grok).
"""
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import httpx
from fastapi.testclient import TestClient
from typer.testing import CliRunner

from c4.api import create_app
from c4.cli import app
from c4.services import run_evidence
from c4.tools.grok import Gateway, Settings

ROOT = Path(__file__).resolve().parents[2]
DATASET_V2 = ROOT / 'datasets/sample/refunds_v2.json'
KEY = 'SECRET-E2E-KEY-0123456789'
TARGET = 'boundary_day_31_expired'
FEEDBACK: list[dict] = []  # previous_attempt payloads received by the simulated diagnoser


def expected_by_input() -> dict[str, str]:
    data = json.loads(DATASET_V2.read_text(encoding='utf-8'))
    return {json.dumps(c['input'], sort_keys=True): c['expected']['action'] for c in data['cases']}


def grok_transport(mode: str = 'accept') -> httpx.MockTransport:
    """Simulated Grok: baseline fails only the target case; candidate behaviour depends on mode."""
    answers = expected_by_input()
    target_input = json.dumps({'order_id': 'syn_ord_005', 'days_since_purchase': 31}, sort_keys=True)
    regress_input = json.dumps({'order_id': 'syn_ord_001', 'days_since_purchase': 5}, sort_keys=True)

    def handler(request: httpx.Request) -> httpx.Response:
        if mode == 'timeout':
            raise httpx.ReadTimeout('timeout ' + KEY, request=request)
        body = json.loads(request.content)
        system = body['messages'][0]['content']
        payload = json.loads(body['messages'][1]['content'])
        if 'root_cause' in system and 'previous_attempt' in payload:
            FEEDBACK.append(payload['previous_attempt'])
            output = {'root_cause': 'Candidate denied a valid in-window order.',
                      'candidate_prompt': 'REPAIRED refunds test agent. Deny only orders older than 30 days.',
                      'rationale': 'Keep in-window refunds.'}
        elif 'root_cause' in system:
            # A hostile provider echoing the credential must never reach persisted evidence.
            output = {'root_cause': 'Baseline ignores the 30-day window.',
                      'candidate_prompt': 'FIXED refunds test agent. Deny orders older than 30 days.',
                      'rationale': 'Enforce max_days. Echo: ' + KEY}
        else:
            key = json.dumps(payload['customer'], sort_keys=True)
            fixed = system.startswith(('FIXED', 'REPAIRED'))
            action = answers[key]
            if not fixed and key == target_input:
                action = 'refund_order'
            if system.startswith('FIXED') and mode in {'regress', 'repair'} and key == regress_input:
                action = 'deny_refund'
            output = {'action': action}
        return httpx.Response(200, json={'choices': [{'message': {'content': json.dumps(output)}}],
                                         'usage': {'prompt_tokens': 600, 'completion_tokens': 8}})
    return httpx.MockTransport(handler)


class AgentEndToEndTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.store = Path(self.tmp.name)
        self.runner = CliRunner()

    def cli(self, args: list[str], mode: str = 'accept', max_calls: int = 80, fix_attempts: int = 2):
        settings = Settings('https://grok.e2e.test/v1', 'grok-4.7', KEY, max_calls=max_calls, max_seconds=600,
                            max_fix_attempts=fix_attempts)
        with patch('c4.cli.Settings.from_env', return_value=settings), \
             patch('c4.cli.Gateway', side_effect=lambda s: Gateway(s, httpx.Client(transport=grok_transport(mode)))):
            result = self.runner.invoke(app, ['--store', str(self.store), '--json', *args])
        return result, json.loads(result.output.strip().splitlines()[-1])

    def assert_no_secret_persisted(self):
        for path in self.store.rglob('*'):
            if path.is_file():
                self.assertNotIn(KEY, path.read_text(encoding='utf-8', errors='replace'), path)

    def test_stepwise_cycle_accepts_and_is_visible_in_api_and_export(self):
        result, state = self.cli(['start', '--dataset', str(DATASET_V2), '--target', TARGET])
        self.assertEqual(result.exit_code, 0, result.output)
        sid = state['id']
        self.assertEqual(state['incident']['status'], 'diagnosing')
        # Each step is a fresh process-equivalent gateway resuming from the persisted checkpoint.
        result, state = self.cli(['patch', sid])
        self.assertEqual(result.exit_code, 0, result.output)
        self.assertEqual(state['patch']['approval_status'], 'proposed')
        result, state = self.cli(['eval', sid])
        self.assertEqual(result.exit_code, 0, result.output)
        self.assertEqual(state['report']['decision'], 'accepted')
        self.assertEqual(state['evaluation']['before'], {'passed': 31, 'total': 32})
        self.assertEqual(state['evaluation']['after'], {'passed': 32, 'total': 32})
        self.assertEqual(len(state['calls']), 2 + 64)
        self.assertIn('[REDACTED]', state['patch']['rationale'])
        self.assert_no_secret_persisted()

        with TestClient(create_app(self.store)) as api:
            incidents = api.get('/api/v1/incidents').json()['items']
            self.assertEqual([i['status'] for i in incidents], ['resolved'])
            overview = api.get('/api/v1/metrics/overview').json()
            self.assertEqual(overview['total_executions'], 1)
            self.assertEqual(overview['verdict_breakdown']['accepted'], 1)
            self.assertGreater(overview['total_cost_usd'], 0)
            self.assertIn('c4_evaluations_total{status="accepted"} 1', api.get('/metrics').text)

        report = run_evidence.build(self.store)
        execution = report['executions'][0]
        self.assertEqual(execution['session_id'], sid)
        self.assertEqual(execution['tools_used'], ['trace_reader', 'patch_writer', 'eval_runner'])
        self.assertEqual(execution['usage']['cost_source'], 'recorded_at_call_time')
        version = json.loads(DATASET_V2.read_text(encoding='utf-8'))['version']
        self.assertEqual(report['by_dataset'][f'refunds_v2@{version}']['completed_evaluations'], 1)
        exported = self.store / 'export.json'
        exported.write_text(json.dumps(report), encoding='utf-8')
        self.assertEqual(run_evidence.check(self.store, exported), 0)
        self.assertNotIn(KEY, exported.read_text(encoding='utf-8'))

        evidence = self.store / sid / 'evidence.json'
        evidence.write_text(evidence.read_text(encoding='utf-8').replace('"accepted"', '"rejected"'), encoding='utf-8')
        self.assertEqual(run_evidence.check(self.store, exported), 1, 'tampering must be detected')

    def test_regression_is_rejected_end_to_end(self):
        result, state = self.cli(['demo', '--dataset', str(DATASET_V2), '--target', TARGET], mode='regress')
        self.assertEqual(result.exit_code, 2, result.output)
        self.assertEqual(state['report']['decision'], 'rejected')
        self.assertEqual(state['evaluation']['regressions'], ['valid_standard_day_5'])

    def test_rejected_candidate_is_repaired_with_evaluation_feedback(self):
        FEEDBACK.clear()
        result, state = self.cli(['demo', '--dataset', str(DATASET_V2), '--target', TARGET], mode='repair', max_calls=100)
        self.assertEqual(result.exit_code, 0, result.output)
        self.assertEqual(state['report']['decision'], 'accepted')
        attempts = state['repair_attempts']
        self.assertEqual([a['decision'] for a in attempts], ['rejected', 'accepted'])
        self.assertEqual(attempts[0]['regressions'], ['valid_standard_day_5'])
        self.assertEqual(attempts[1]['regressions'], [])
        self.assertNotEqual(attempts[0]['candidate_sha256'], attempts[1]['candidate_sha256'])
        # Repair reuses baseline results: 2 (inspect+diagnose) + 64 (both prompts) + 1 (repair) + 32 (candidate only).
        self.assertEqual(len(state['calls']), 99)
        self.assertEqual(state['candidate_agent']['version'], '1.0.2')
        self.assertIn('REPAIRED', state['patch']['diff'])
        self.assertEqual(len(FEEDBACK), 1)
        failing = FEEDBACK[0]['failing_cases']
        self.assertEqual([c['case_id'] for c in failing], ['valid_standard_day_5'])
        self.assertEqual(failing[0]['observed'], {'action': 'deny_refund'})
        self.assertEqual(FEEDBACK[0]['regressions'], ['valid_standard_day_5'])
        self.assertIn('tras 2 intentos', state['report']['summary'])

    def test_repair_stops_before_exceeding_call_budget(self):
        result, state = self.cli(['demo', '--dataset', str(DATASET_V2), '--target', TARGET], mode='repair', max_calls=80)
        self.assertEqual(result.exit_code, 2, result.output)
        self.assertEqual(state['repair_stopped'], 'insufficient_call_budget')
        self.assertEqual(len(state['repair_attempts']), 1)
        self.assertEqual(len(state['calls']), 66)

    def test_single_attempt_configuration_keeps_previous_behaviour(self):
        result, state = self.cli(['demo', '--dataset', str(DATASET_V2), '--target', TARGET], mode='repair',
                                 max_calls=100, fix_attempts=1)
        self.assertEqual(result.exit_code, 2, result.output)
        self.assertNotIn('repair_stopped', state)
        self.assertEqual(len(state['calls']), 66)

    def test_budget_exhaustion_fails_safely_and_is_counted(self):
        result, state = self.cli(['demo', '--dataset', str(DATASET_V2), '--target', TARGET], max_calls=10)
        self.assertEqual(result.exit_code, 1, result.output)
        self.assertEqual(state['job']['error']['code'], 'budget_exceeded')
        self.assertEqual(state['report']['decision'], 'needs_human_review')
        self.assertEqual(len(state['calls']), 10)
        report = run_evidence.build(self.store)
        self.assertEqual(report['verdict_breakdown']['failed'], 1)
        self.assertEqual(report['failed_by_error_code'], {'budget_exceeded': 1})

    def test_provider_timeout_is_retryable_and_sanitized(self):
        result, state = self.cli(['demo', '--dataset', str(DATASET_V2), '--target', TARGET], mode='timeout')
        self.assertEqual(result.exit_code, 1, result.output)
        self.assertEqual(state['job']['error']['code'], 'provider_timeout')
        self.assertTrue(state['job']['error']['retryable'])
        self.assertNotIn(KEY, result.output)
        self.assert_no_secret_persisted()

    def test_empty_store_reports_zero_and_ignores_archived_files(self):
        with TestClient(create_app(self.store)) as api:
            overview = api.get('/api/v1/metrics/overview').json()
        self.assertEqual(overview['total_executions'], 0)
        self.assertEqual(overview['total_cost_usd'], 0)


@unittest.skipUnless(os.environ.get('C4_LIVE_E2E') == '1', 'Live Grok E2E disabled; set C4_LIVE_E2E=1 (consumes credits).')
class LiveGrokE2E(unittest.TestCase):
    def test_doctor_probe_reaches_grok(self):
        proc = subprocess.run([sys.executable, '-m', 'c4.cli', '--json', 'doctor', '--probe'], cwd=ROOT,
                              capture_output=True, text=True, timeout=120)
        self.assertEqual(proc.returncode, 0, proc.stdout + proc.stderr)
        self.assertEqual(json.loads(proc.stdout)['probe'], 'succeeded')


if __name__ == '__main__':
    unittest.main()
