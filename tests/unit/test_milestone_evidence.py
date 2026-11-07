"""Published S2/S3 evidence must be a faithful projection of real sessions (spec 043)."""
import json
import re
import tempfile
import unittest
from pathlib import Path

from c4.services import run_evidence

ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / 'docs/evidencia/2026-11-07-ejecuciones-reales.json'
ARCHIVED = ROOT / 'docs/evidencia/archivo/2026-10-25-diez-ejecuciones-ilustrativas.json'


class PublishedEvidenceTests(unittest.TestCase):
    def setUp(self):
        self.data = json.loads(EVIDENCE.read_text(encoding='utf-8'))

    def test_schema_and_minimum_executions(self):
        self.assertEqual(self.data['schema_version'], run_evidence.SCHEMA)
        self.assertEqual(self.data['generator'], 'scripts/export_run_evidence.py')
        self.assertGreaterEqual(self.data['total_executions'], 10)
        self.assertEqual(len(self.data['executions']), self.data['total_executions'])

    def test_every_execution_is_a_real_session_id_with_hash(self):
        for row in self.data['executions']:
            self.assertRegex(row['session_id'], r'^c4_[0-9a-f]{32}$')
            self.assertRegex(row['evidence_sha256'], r'^[0-9a-f]{64}$')
            self.assertEqual(row['reasoning']['provider'], 'grok')
            self.assertGreater(row['usage']['succeeded_calls'], 0)

    def test_totals_are_consistent(self):
        rows = self.data['executions']
        self.assertEqual(sum(self.data['verdict_breakdown'].values()), len(rows))
        self.assertAlmostEqual(sum(r['usage']['cost_usd'] for r in rows), self.data['total_cost_usd'], places=5)
        self.assertEqual(sum(r['usage']['calls'] for r in rows), self.data['total_calls'])

    def test_s3_has_completed_evaluation_on_32_case_set(self):
        v2 = [b for key, b in self.data['by_dataset'].items() if key.startswith('refunds_v2@')]
        self.assertTrue(v2)
        self.assertTrue(all(b['cases'] >= 30 for b in v2))
        self.assertGreaterEqual(sum(b['completed_evaluations'] for b in v2), 1)
        self.assertTrue(all(b['cost_usd_per_session'] > 0 for b in v2))

    def test_illustrative_ids_never_leak_into_real_evidence(self):
        archived = json.loads(ARCHIVED.read_text(encoding='utf-8'))
        fake_ids = {e['execution_id'] for e in archived['executions']}
        text = EVIDENCE.read_text(encoding='utf-8')
        self.assertFalse(any(fake in text for fake in fake_ids))
        self.assertIsNone(re.search(r'(?i)\b(sk|gsk|xai)-[A-Za-z0-9]{20,}', text))


class RunEvidenceProjectionTests(unittest.TestCase):
    def write(self, root: Path, sid: str, state: dict):
        (root / sid).mkdir(parents=True)
        (root / sid / 'evidence.json').write_text(json.dumps(state), encoding='utf-8')

    def base(self, sid, calls):
        return {'id': sid, 'provenance': 'synthetic_cases_real_provider', 'created_at': '2026-11-07T00:00:00+00:00',
                'dataset': {'data': {'id': 'd', 'version': '1', 'cases': [{}]}, 'sha256': 'a' * 64},
                'target_case_id': 't', 'provider': {'base_url': 'https://x', 'model': 'grok-4.7'},
                'job': {'status': 'succeeded', 'stage': 'report', 'error': None}, 'calls': calls,
                'report': {'decision': 'accepted'}}

    def test_legacy_sessions_recompute_cost_from_real_tokens_and_label_it(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            call = {'status': 'succeeded', 'model': 'grok-4.7', 'provider': 'grok', 'input_tokens': 1_000_000,
                    'output_tokens': 0, 'cost_usd': None, 'latency_ms': 10}
            self.write(root, 'c4_' + 'a' * 32, self.base('c4_' + 'a' * 32, [call]))
            self.write(root, 'c4_' + 'b' * 32, self.base('c4_' + 'b' * 32, []))  # no provider calls
            (root / ('c4_' + 'c' * 32)).mkdir()
            (root / ('c4_' + 'c' * 32) / 'evidence.json').write_text('{corrupt', encoding='utf-8')
            report = run_evidence.build(root)
        self.assertEqual(report['total_executions'], 1)
        self.assertEqual(report['skipped_sessions_without_provider_calls'], 2)
        usage = report['executions'][0]['usage']
        self.assertEqual(usage['cost_usd'], 2.0)
        self.assertEqual(usage['cost_source'], 'recomputed_from_reported_tokens')


if __name__ == '__main__':
    unittest.main()
