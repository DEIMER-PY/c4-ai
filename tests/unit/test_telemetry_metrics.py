"""Unit tests for the enterprise observability endpoints: /healthz, /metrics, and overview."""
import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

from c4.api import create_app


class TestTelemetryMetricsApi(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.client = TestClient(create_app(self.root))
        self.addCleanup(self.client.close)

    def test_healthz_endpoint_returns_components(self):
        res = self.client.get("/healthz")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("version", data)
        self.assertIn("uptime_seconds", data)
        self.assertIn("components", data)
        self.assertEqual(data["components"]["store"]["status"], "ok")
        self.assertEqual(data["components"]["rate_engine"]["status"], "ok")
        self.assertEqual(data["components"]["pii_sanitizer"]["status"], "ok")

    def test_metrics_prometheus_format(self):
        res = self.client.get("/metrics")
        self.assertEqual(res.status_code, 200)
        self.assertIn("text/plain", res.headers.get("content-type", ""))

        text = res.text
        self.assertIn("c4_evaluations_total", text)
        self.assertIn("c4_tokens_total", text)
        self.assertIn("c4_cost_usd_total", text)
        self.assertIn("c4_circuit_breaker_trips", text)

    def test_metrics_overview_json_endpoint(self):
        res = self.client.get("/api/v1/metrics/overview")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("total_executions", data)
        self.assertIn("verdict_breakdown", data)
        self.assertIn("total_tokens_consumed", data)


if __name__ == "__main__":
    unittest.main()
