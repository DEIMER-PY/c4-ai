from datetime import UTC, datetime
import unittest

from pydantic import ValidationError

from c4.schemas.audit import AuditLogEntry, IntegrityProof
from c4.schemas.compliance import EuAiActAssessment, OwaspCheck, Soc2Control


class ComplianceSchemasTests(unittest.TestCase):
    def test_audit_log_entry_success_and_hash_calculation(self):
        now = datetime.now(UTC)
        entry = AuditLogEntry(
            entry_id="audit_12345",
            timestamp=now,
            session_id="c4_session_01",
            actor="c4-gate",
            action="gate_verdict_rendered",
            resource_type="verdict",
            resource_hash="a" * 64,
            signature="hmac_test_sig",
            metadata={"decision": "accepted"},
        )
        self.assertEqual(entry.session_id, "c4_session_01")
        computed_hash = entry.calculate_entry_hash()
        self.assertEqual(len(computed_hash), 64)
        # Deterministic
        self.assertEqual(computed_hash, entry.calculate_entry_hash())

    def test_audit_log_entry_rejects_malformed_hash(self):
        with self.assertRaises(ValidationError):
            AuditLogEntry(
                entry_id="audit_bad",
                timestamp=datetime.now(UTC),
                session_id="c4_session_bad",
                actor="c4-gate",
                action="gate_verdict_rendered",
                resource_type="verdict",
                resource_hash="too_short_hash",  # Not 64 hex chars
            )

    def test_integrity_proof_merkle_computation(self):
        d_hash = "1" * 64
        b_hash = "2" * 64
        c_hash = "3" * 64
        v_hash = "4" * 64
        root = IntegrityProof.compute_root(d_hash, b_hash, c_hash, v_hash)
        self.assertEqual(len(root), 64)

        proof = IntegrityProof(
            session_id="c4_proof_session",
            dataset_hash=d_hash,
            baseline_prompt_hash=b_hash,
            candidate_prompt_hash=c_hash,
            verdict_hash=v_hash,
            merkle_root=root,
            verified_at=datetime.now(UTC),
            is_valid=True,
        )
        self.assertTrue(proof.is_valid)

    def test_owasp_check_model(self):
        check = OwaspCheck(
            control_id="LLM01_prompt_injection",
            name="Mitigación de Inyección de Prompt",
            status="compliant",
            mitigation_mechanism="Sanitización en 3 niveles y validación determinista de restricciones de dominio",
            evidence_ref="datasets/sample/refunds_v2.json",
        )
        self.assertEqual(check.status, "compliant")

        with self.assertRaises(ValidationError):
            OwaspCheck(
                control_id="INVALID_CONTROL",  # type: ignore
                name="Fallo",
                status="compliant",
                mitigation_mechanism="None",
            )

    def test_eu_ai_act_assessment(self):
        assessment = EuAiActAssessment(
            system_classification="high_risk",
            human_oversight_enforced=True,
            risk_management_active=True,
            data_governance_documented=True,
            technical_documentation_complete=True,
            record_keeping_logging_active=True,
            accuracy_robustness_cybersecurity=True,
            assessed_at=datetime.now(UTC),
        )
        self.assertEqual(assessment.system_classification, "high_risk")
        self.assertTrue(assessment.human_oversight_enforced)

    def test_soc2_control(self):
        control = Soc2Control(
            trust_criteria="processing_integrity",
            control_id="PI-01",
            description="Evaluación paralela con dataset inmutable idéntico antes de admitir cualquier candidato",
            implemented=True,
            audit_evidence="c4.services.reliability.ReliabilityService",
        )
        self.assertTrue(control.implemented)


if __name__ == "__main__":
    unittest.main()
