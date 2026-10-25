import json
import tempfile
import unittest
from pathlib import Path

from scripts.capture_visual_evidence import build_manifest, parse_args, run_capture


class DesktopPackagingTests(unittest.TestCase):
    def setUp(self):
        self.root = Path(__file__).resolve().parents[2]

    def test_desktop_package_json_validity(self):
        pkg_file = self.root / "apps/desktop/package.json"
        self.assertTrue(pkg_file.exists(), "package.json missing in apps/desktop")
        data = json.loads(pkg_file.read_text(encoding="utf-8"))
        self.assertEqual(data["name"], "c4-desktop")
        self.assertIn("desktop:build", data["scripts"])

    def test_tauri_conf_json_validity(self):
        conf_file = self.root / "apps/desktop/src-tauri/tauri.conf.json"
        self.assertTrue(conf_file.exists(), "tauri.conf.json missing in apps/desktop/src-tauri")
        data = json.loads(conf_file.read_text(encoding="utf-8"))
        self.assertEqual(data["identifier"], "com.c4ai.desktop")
        windows = data["app"]["windows"]
        self.assertEqual(len(windows), 1)
        self.assertEqual(windows[0]["width"], 1280)
        self.assertEqual(windows[0]["height"], 860)

    def test_cargo_toml_and_main_rs_exist(self):
        cargo_file = self.root / "apps/desktop/src-tauri/Cargo.toml"
        main_rs = self.root / "apps/desktop/src-tauri/src/main.rs"
        self.assertTrue(cargo_file.exists())
        self.assertTrue(main_rs.exists())
        cargo_text = cargo_file.read_text(encoding="utf-8")
        self.assertIn('name = "c4-desktop"', cargo_text)
        self.assertIn("tauri", cargo_text)

    def test_capture_visual_evidence_dry_run(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            ret = run_capture("http://127.0.0.1:3000", Path(tmp_dir), ["desktop", "mobile"], dry_run=True)
            self.assertEqual(ret, 0)

    def test_build_manifest_structure(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            out_path = Path(tmp_dir)
            entries = [
                {
                    "viewport": "desktop",
                    "resolution": "1920x1080",
                    "filename": "desktop-capture.png",
                    "sha256": "a" * 64,
                    "bytes": 1024,
                }
            ]
            manifest_file = build_manifest(entries, out_path)
            self.assertTrue(manifest_file.exists())
            data = json.loads(manifest_file.read_text(encoding="utf-8"))
            self.assertEqual(data["total_captures"], 1)
            self.assertEqual(data["captures"][0]["viewport"], "desktop")

    def test_parse_args(self):
        args = parse_args(["--dry-run", "--viewports", "tablet"])
        self.assertTrue(args.dry_run)
        self.assertEqual(args.viewports, ["tablet"])


if __name__ == "__main__":
    unittest.main()
