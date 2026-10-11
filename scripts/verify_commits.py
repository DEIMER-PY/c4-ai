"""Require Conventional Commits with type-specific emoji."""
import argparse
from pathlib import Path
import re
import subprocess
EMOJIS = {"feat": "✨", "fix": "🐛", "docs": "📝", "refactor": "♻️", "test": "🧪", "chore": "🔧", "ci": "👷", "perf": "⚡", "build": "📦", "revert": "⏪"}
PATTERN = re.compile(r"^(feat|fix|docs|refactor|test|chore|ci|perf|build|revert)(\([a-zA-Z0-9._/-]+\))?!?: (.+)$")
parser = argparse.ArgumentParser()
mode = parser.add_mutually_exclusive_group(required=True)
mode.add_argument("--message-file")
mode.add_argument("--message")
mode.add_argument("--base")
args = parser.parse_args()
if args.base:
    subjects = subprocess.check_output(["git", "log", "--format=%s", args.base + "..HEAD"], encoding="utf-8").splitlines()
elif args.message_file:
    lines = Path(args.message_file).read_text(encoding="utf-8").splitlines()
    subjects = [lines[0] if lines else ""]
else:
    subjects = [args.message]
invalid = []
for subject in subjects:
    match = PATTERN.fullmatch(subject)
    if not match:
        invalid.append(subject)
        continue
    content, emoji = match.group(3), EMOJIS[match.group(1)]
    if not content.startswith(emoji + " ") or not content[len(emoji):].strip():
        invalid.append(subject)
if invalid:
    raise SystemExit("Invalid commits; expected type(scope): emoji description\n" + "\n".join(invalid))
print(f"OK: {len(subjects)} conventional commit(s) with emojis.")
