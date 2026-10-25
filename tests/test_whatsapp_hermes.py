import contextlib
import io
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from scripts.whatsapp_hermes import inspect, main


class WhatsAppHermesReadinessTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.home = Path(self.temp.name)
        self.values = {
            "WHATSAPP_CLOUD_PHONE_NUMBER_ID": "1234567890123456",
            "WHATSAPP_CLOUD_ACCESS_TOKEN": "EAA" + "x" * 110,
            "WHATSAPP_CLOUD_APP_SECRET": "a" * 32,
            "WHATSAPP_CLOUD_VERIFY_TOKEN": "synthetic-verify-only",
            "WHATSAPP_CLOUD_ALLOWED_USERS": "15555550123",
        }

    def prepare(self):
        (self.home / "bin").mkdir(exist_ok=True)
        (self.home / "bin" / ("hermes.exe" if os.name == "nt" else "hermes")).touch()
        adapter = self.home / "hermes-agent/gateway/platforms/whatsapp_cloud.py"
        adapter.parent.mkdir(parents=True, exist_ok=True)
        adapter.touch()
        (self.home / ".env").write_text("\n".join(f"{key}={value}" for key, value in self.values.items()), encoding="utf-8")

    def test_missing_configuration_is_not_ready_and_writes_nothing(self):
        self.assertFalse(inspect(self.home)["local_prerequisites_ready"])
        self.assertEqual(list(self.home.iterdir()), [])

    def test_shape_ready_does_not_claim_real_verification_or_leak_secrets(self):
        self.prepare()
        before = (self.home / ".env").read_bytes()
        result = inspect(self.home)
        self.assertTrue(result["local_prerequisites_ready"])
        for flag in ["meta_credentials_verified", "webhook_verified", "end_to_end_verified"]:
            self.assertFalse(result[flag])
        serialized = json.dumps(result)
        for value in self.values.values():
            self.assertNotIn(value, serialized)
        self.assertEqual((self.home / ".env").read_bytes(), before)

    def test_invalid_inputs_and_allow_all_are_reported_without_values(self):
        self.values.update({
            "WHATSAPP_CLOUD_PHONE_NUMBER_ID": "+15555550123",
            "WHATSAPP_CLOUD_ACCESS_TOKEN": "invalid-synthetic-token",
            "WHATSAPP_CLOUD_APP_SECRET": "not-hex",
            "WHATSAPP_CLOUD_ALLOWED_USERS": "*",
            "WHATSAPP_CLOUD_ALLOW_ALL_USERS": "on",
        })
        self.prepare()
        result = inspect(self.home)
        self.assertFalse(result["local_prerequisites_ready"])
        self.assertTrue(result["allow_all_users"])
        self.assertTrue({"invalid_phone_number_id_shape", "invalid_access_token_shape", "invalid_app_secret_shape", "invalid_allowed_users_shape", "allow_all_users_enabled"}.issubset(result["issues"]))

    def test_diagnostic_exit_codes_and_cli_output(self):
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(main(["--hermes-home", str(self.home)]), 2)
            self.prepare()
            self.assertEqual(main(["--hermes-home", str(self.home)]), 0)

    def test_setup_refuses_noninteractive_execution(self):
        with patch("sys.stdin.isatty", return_value=False), patch("scripts.whatsapp_hermes.subprocess.call") as launch, contextlib.redirect_stderr(io.StringIO()):
            self.assertEqual(main(["--hermes-home", str(self.home), "--setup"]), 2)
            launch.assert_not_called()


if __name__ == "__main__":
    unittest.main()
