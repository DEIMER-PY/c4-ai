"""Unit tests for the 10 qualified executions milestone evidence and integrity proofs."""
import hashlib
import json
import unittest
from pathlib import Path

from c4.schemas.audit import IntegrityProof
from c4.tools.rates import calculate_cost_usd

EVIDENCE_PATH = Path("docs/evidencia/2026-10-25-diez-ejecuciones-calificadas.json")


class TestMilestoneEvidence(unittest.TestCase):
    def setUp(self):
        self.assertTrue(EVIDENCE_PATH.exists(), f"Evidence file missing at {EVIDENCE_PATH}")
        self.data = json.loads(EVIDENCE_PATH.read_text(encoding="utf-8"))

    def test_evidence_file_structure(self):
        self.assertEqual(self.data["schema_version"], "1.0.0")
        self.assertEqual(self.data["total_executions"], 10)
        self.assertEqual(len(self.data["executions"]), 10)

    def test_evidence_has_valid_verdict_distribution(self):
        verdicts = [e["gate_verdict"]["decision"] for e in self.data["executions"]]
        self.assertIn("accepted", verdicts)
        self.assertIn("rejected", verdicts)
        self.assertIn("needs_human_review", verdicts)
        self.assertIn("failed_budget", verdicts)

        breakdown = self.data["verdict_breakdown"]
        self.assertGreaterEqual(breakdown["accepted"], 4)
        self.assertGreaterEqual(breakdown["rejected"], 3)
        self.assertGreaterEqual(breakdown["needs_human_review"], 1)
        self.assertGreaterEqual(breakdown["failed_budget"], 1)

    def test_each_execution_has_cryptographic_integrity_and_merkle_root(self):
        for ex in self.data["executions"]:
            proof = ex["integrity_proof"]
            self.assertTrue(proof["is_valid"])

            # Verify Merkle Root derivation
            computed_root = IntegrityProof.compute_root(
                proof["dataset_hash"],
                proof["baseline_prompt_hash"],
                proof["candidate_prompt_hash"],
                proof["verdict_hash"],
            )
            self.assertEqual(
                proof["sha256_merkle_root"],
                computed_root,
                f"Merkle root mismatch for execution {ex['execution_id']}",
            )

    def test_each_execution_telemetry_and_deterministic_cost(self):
        for ex in self.data["executions"]:
            telemetry = ex["telemetry"]
            model = ex["model"]
            provider = ex["provider"]
            prompt_tokens = telemetry["prompt_tokens"]
            comp_tokens = telemetry["completion_tokens"]

            self.assertEqual(telemetry["total_tokens"], prompt_tokens + comp_tokens)
            self.assertGreater(telemetry["latency_ms"], 0)

            expected_cost = calculate_cost_usd(
                model=model,
                input_tokens=prompt_tokens,
                output_tokens=comp_tokens,
                provider=provider,
            )

            self.assertEqual(telemetry["cost_usd"], expected_cost)

            if provider == "ollama":
                self.assertEqual(telemetry["cost_usd"], 0.0)

    def test_gate_verdict_zero_regressions_rule(self):
        for ex in self.data["executions"]:
            decision = ex["gate_verdict"]["decision"]
            eval_data = ex["evaluation"]

            if decision == "accepted":
                self.assertEqual(
                    eval_data["regressions_count"],
                    0,
                    f"Execution {ex['execution_id']} accepted despite {eval_data['regressions_count']} regressions",
                )
                self.assertTrue(eval_data["mandatory_security_passed"])
                self.assertGreaterEqual(eval_data["candidate_score"], eval_data["baseline_score"])

            if eval_data["regressions_count"] > 0:
                self.assertEqual(
                    decision,
                    "rejected",
                    f"Execution {ex['execution_id']} with regressions must be rejected",
                )


if __name__ == "__main__":
    unittest.main()
