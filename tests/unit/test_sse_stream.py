"""Unit tests for the SSE real-time streaming and signature API endpoints."""
import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

from c4.api import create_app
from c4.tools.crypto import sign_evidence


class TestSseStreamApi(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.client = TestClient(create_app(self.root))
        self.addCleanup(self.client.close)

    def test_signature_public_id_endpoint(self):
        res = self.client.get("/api/v1/signature/public-id")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("node_public_id", data)
        self.assertEqual(data["algorithm"], "HMAC-SHA256")

    def test_signature_verify_endpoint(self):
        payload = {"incident_id": "inc_01", "decision": "accepted"}
        sig = sign_evidence(payload)

        # Valid payload
        res = self.client.post("/api/v1/signature/verify", json={"payload": payload, "signature": sig})
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json()["is_valid"])

        # Tampered payload
        tampered_res = self.client.post(
            "/api/v1/signature/verify",
            json={"payload": {"incident_id": "inc_01", "decision": "rejected"}, "signature": sig},
        )
        self.assertEqual(tampered_res.status_code, 200)
        self.assertFalse(tampered_res.json()["is_valid"])

    def test_sse_streaming_endpoint(self):
        res = self.client.get("/api/v1/runs/c4_test_streaming_session/stream")
        self.assertEqual(res.status_code, 200)
        self.assertIn("text/event-stream", res.headers.get("content-type", ""))

        content = res.text
        self.assertIn("event: init", content)
        self.assertIn("event: stage", content)
        self.assertIn("event: case_eval", content)
        self.assertIn("event: verdict", content)
        self.assertIn("event: done", content)
        self.assertIn('"status": "completed"', content)


if __name__ == "__main__":
    unittest.main()
