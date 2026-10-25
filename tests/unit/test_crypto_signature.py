"""Unit tests for the evidence signing and cryptographic verification engine."""
import unittest

from c4.tools.crypto import EvidenceSigner, get_default_signer, sign_evidence, verify_evidence


class TestCryptoSignature(unittest.TestCase):
    def setUp(self):
        self.signer = EvidenceSigner(secret_key=b"test-secret-key-for-unit-tests-12345")

    def test_node_public_id_format(self):
        self.assertTrue(self.signer.node_public_id.startswith("node_"))
        self.assertEqual(len(self.signer.node_public_id), 21)

    def test_canonicalization_order_independence(self):
        payload_a = {"decision": "accepted", "regressions": 0, "session_id": "c4_01"}
        payload_b = {"session_id": "c4_01", "decision": "accepted", "regressions": 0}

        sig_a = self.signer.sign_payload(payload_a)
        sig_b = self.signer.sign_payload(payload_b)
        self.assertEqual(sig_a, sig_b)

    def test_sign_and_verify_roundtrip(self):
        payload = {"verdict": "accepted", "score": "32/32", "merkle_root": "a" * 64}
        sig = self.signer.sign_payload(payload)

        self.assertTrue(self.signer.verify_payload(payload, sig))

    def test_tamper_detection(self):
        payload = {"verdict": "accepted", "score": "32/32"}
        sig = self.signer.sign_payload(payload)

        # Alter payload
        tampered = {"verdict": "rejected", "score": "32/32"}
        self.assertFalse(self.signer.verify_payload(tampered, sig))

    def test_global_helper_functions(self):
        payload = {"test": "data"}
        sig = sign_evidence(payload)
        self.assertTrue(verify_evidence(payload, sig))
        self.assertFalse(verify_evidence({"test": "tampered"}, sig))


if __name__ == "__main__":
    unittest.main()
