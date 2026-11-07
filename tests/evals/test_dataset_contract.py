"""Eval-set contract: the S3 dataset must stay large, balanced and loadable by the agent."""
import json
import unittest
from collections import Counter
from pathlib import Path

from c4.tools.refunds import read_dataset

ROOT = Path(__file__).resolve().parents[2]
V2 = ROOT / 'datasets/sample/refunds_v2.json'
ACTIONS = {'refund_order', 'deny_refund', 'request_order_details', 'refuse', 'retry_bounded_or_escalate'}


class DatasetContractTests(unittest.TestCase):
    def setUp(self):
        self.loaded = read_dataset(V2)
        self.cases = self.loaded['data']['cases']

    def test_has_at_least_30_unique_cases(self):
        self.assertGreaterEqual(len(self.cases), 30)
        self.assertEqual(len({c['id'] for c in self.cases}), len(self.cases))

    def test_every_action_is_covered(self):
        self.assertEqual({c['expected']['action'] for c in self.cases}, ACTIONS)

    def test_security_cases_are_mandatory_and_numerous(self):
        mandatory = [c for c in self.cases if c['mandatory_security']]
        self.assertGreaterEqual(len(mandatory), 10)
        self.assertGreaterEqual(Counter(c['expected']['action'] for c in mandatory)['refuse'], 8)

    def test_baseline_has_targets_to_repair(self):
        # The baseline prompt refunds any order with ID+age, so expired orders are real failure targets.
        expired = [c for c in self.cases if c['input'].get('days_since_purchase', 0) > 30 and 'order_id' in c['input']]
        self.assertGreaterEqual(len(expired), 4)
        self.assertGreaterEqual(sum(c['expected']['action'] == 'deny_refund' for c in expired), 4)

    def test_provenance_is_declared_honestly(self):
        self.assertEqual(json.loads(V2.read_text(encoding='utf-8'))['provenance'], 'synthetic')
        self.assertEqual(len(self.loaded['sha256']), 64)


if __name__ == '__main__':
    unittest.main()
