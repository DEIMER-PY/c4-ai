"""Prepare project-local Obsidian settings; no plugins or global registration."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
settings_path = ROOT / ".obsidian" / "app.json"
settings_path.parent.mkdir(exist_ok=True)
settings = json.loads(settings_path.read_text(encoding="utf-8")) if settings_path.exists() else {}
if not isinstance(settings, dict):
    raise SystemExit("Existing Obsidian settings must be an object; left unchanged.")
settings.update({
    "useMarkdownLinks": True,
    "newLinkFormat": "relative",
    "attachmentFolderPath": "docs/assets",
    "alwaysUpdateLinks": False,
})
settings_path.write_text(json.dumps(settings, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("Project-local Obsidian settings ready. Open this folder as vault in Obsidian:")
print(ROOT)
print(".obsidian remains untracked; each teammate runs this script in their own clone.")
