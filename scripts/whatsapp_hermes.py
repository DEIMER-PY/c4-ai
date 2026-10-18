"""Read-only WhatsApp prerequisites; --setup delegates to Hermes in a human TTY."""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re
import subprocess
import sys

from dotenv import dotenv_values

REQUIRED = (
    "WHATSAPP_CLOUD_PHONE_NUMBER_ID", "WHATSAPP_CLOUD_ACCESS_TOKEN",
    "WHATSAPP_CLOUD_APP_SECRET", "WHATSAPP_CLOUD_VERIFY_TOKEN",
    "WHATSAPP_CLOUD_ALLOWED_USERS",
)
TRUTHY = {"true", "1", "yes", "on"}


def inspect(home: Path) -> dict:
    """Return only flags/codes. Shape checks are not Meta authentication checks."""
    errors: list[str] = []
    try:
        values = dotenv_values(home / ".env", interpolate=False) if (home / ".env").is_file() else {}
    except (OSError, UnicodeError):
        values = {}
        errors.append("env_unreadable")
    configured = {key: bool((values.get(key) or "").strip()) for key in REQUIRED}
    for key, present in configured.items():
        if not present:
            errors.append("missing:" + key)
    phone_id = (values.get(REQUIRED[0]) or "").strip()
    token = (values.get(REQUIRED[1]) or "").strip()
    secret = (values.get(REQUIRED[2]) or "").strip()
    allowed = [part.strip() for part in (values.get(REQUIRED[4]) or "").split(",") if part.strip()]
    if phone_id and not re.fullmatch(r"[0-9]{13,20}", phone_id):
        errors.append("invalid_phone_number_id_shape")
    if token and (not token.startswith("EAA") or len(token) < 100):
        errors.append("invalid_access_token_shape")
    if secret and not re.fullmatch(r"[a-fA-F0-9]{32}", secret):
        errors.append("invalid_app_secret_shape")
    if configured[REQUIRED[4]] and (not allowed or any(not re.fullmatch(r"[0-9]{7,15}", user) for user in allowed)):
        errors.append("invalid_allowed_users_shape")
    allow_all = (values.get("WHATSAPP_CLOUD_ALLOW_ALL_USERS") or "").strip().lower() in TRUTHY
    if allow_all:
        errors.append("allow_all_users_enabled")
    executable = home / "bin" / ("hermes.exe" if os.name == "nt" else "hermes")
    installed = executable.is_file()
    adapter = (home / "hermes-agent/gateway/platforms/whatsapp_cloud.py").is_file()
    if not installed:
        errors.append("hermes_executable_missing")
    if not adapter:
        errors.append("adapter_source_not_detected_in_expected_layout")
    return {
        "mode": "offline_local_env_inspection",
        "hermes_executable_present": installed,
        "adapter_source_present": adapter,
        "configured": configured,
        "allow_all_users": allow_all,
        "issues": errors,
        "local_prerequisites_ready": not errors,
        "meta_credentials_verified": False,
        "webhook_verified": False,
        "end_to_end_verified": False,
        "note": "Inspects the local .env and expected native-install layout only; does not inspect YAML overrides, authenticate, send messages or change configuration.",
    }


def main(argv: list[str] | None = None) -> int:
    default_home = Path(os.environ["HERMES_HOME"]) if os.environ.get("HERMES_HOME") else (
        Path.home() / "AppData/Local/hermes" if os.name == "nt" else Path.home() / ".hermes"
    )
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--hermes-home", type=Path, default=default_home)
    parser.add_argument("--setup", action="store_true", help="Start Hermes' official credential wizard in this interactive terminal.")
    args = parser.parse_args(argv)
    home = args.hermes_home.expanduser().resolve()
    if args.setup:
        if not sys.stdin.isatty() or not sys.stdout.isatty():
            print("setup_requires_human_interactive_terminal", file=sys.stderr)
            return 2
        executable = home / "bin" / ("hermes.exe" if os.name == "nt" else "hermes")
        if not executable.is_file():
            print("hermes_executable_missing", file=sys.stderr)
            return 2
        environment = dict(os.environ, HERMES_HOME=str(home))
        # No credentials in argv, no shell evaluation, and no captured wizard output.
        return subprocess.call([str(executable), "whatsapp-cloud"], env=environment)
    result = inspect(home)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0 if result["local_prerequisites_ready"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
