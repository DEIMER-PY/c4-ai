"""Automated visual evidence capture tool using Playwright for C4 AI."""
import argparse
import hashlib
import json
import sys
from datetime import UTC, datetime
from pathlib import Path

VIEWPORTS = {
    "desktop": {"width": 1920, "height": 1080, "is_mobile": False},
    "tablet": {"width": 768, "height": 1024, "is_mobile": True},
    "mobile": {"width": 375, "height": 812, "is_mobile": True},
}


def build_manifest(entries: list[dict], output_dir: Path) -> Path:
    manifest_path = output_dir / "visual-evidence-manifest.json"
    manifest_data = {
        "generated_at": datetime.now(UTC).isoformat(),
        "total_captures": len(entries),
        "captures": entries,
    }
    manifest_path.write_text(json.dumps(manifest_data, indent=2, ensure_ascii=True), encoding="utf-8")
    return manifest_path


def parse_args(args=None):
    parser = argparse.ArgumentParser(description="Capture multi-resolution visual evidence with Playwright CLI.")
    parser.add_argument("--url", default="http://127.0.0.1:3000", help="URL or local path to render.")
    parser.add_argument("--output-dir", default="docs/assets/showcase", help="Output directory for screenshots.")
    parser.add_argument("--viewports", nargs="+", default=["desktop", "tablet", "mobile"], choices=list(VIEWPORTS.keys()))
    parser.add_argument("--dry-run", action="store_true", help="Print plan and validate setup without running browser.")
    return parser.parse_args(args)


def run_capture(url: str, output_dir: Path, viewports: list[str], dry_run: bool = False) -> int:
    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        from playwright.sync_api import sync_playwright  # type: ignore
        has_playwright = True
    except ImportError:
        has_playwright = False

    if dry_run or not has_playwright:
        print("[*] MODO SIMULADO / DIAGNÓSTICO DE CAPTURA VISUAL")
        print(f"    Destino: {output_dir}")
        print(f"    URL objetivo: {url}")
        print(f"    Resoluciones planificadas: {', '.join(viewports)}")
        if not has_playwright:
            print("[-] Playwright no está instalado en el entorno actual.")
            print("    Para capturas reales: pip install playwright && playwright install chromium")
        return 0

    entries = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for vp_name in viewports:
            vp = VIEWPORTS[vp_name]
            context = browser.new_context(
                viewport={"width": vp["width"], "height": vp["height"]},
                is_mobile=vp["is_mobile"],
            )
            page = context.new_page()
            try:
                page.goto(url, wait_until="networkidle", timeout=15000)
                filename = f"{vp_name}-capture.png"
                target_file = output_dir / filename
                page.screenshot(path=str(target_file), full_page=True)

                raw_bytes = target_file.read_bytes()
                sha256 = hashlib.sha256(raw_bytes).hexdigest()
                entries.append({
                    "viewport": vp_name,
                    "resolution": f"{vp['width']}x{vp['height']}",
                    "filename": filename,
                    "sha256": sha256,
                    "bytes": len(raw_bytes),
                })
                print(f"[+] Captura exitosa: {filename} ({sha256[:12]}...)")
            except Exception as err:
                print(f"[-] Error capturando {vp_name}: {err}", file=sys.stderr)
            finally:
                context.close()
        browser.close()

    if entries:
        manifest_file = build_manifest(entries, output_dir)
        print(f"[+] Manifiesto de evidencia sellado en: {manifest_file}")

    return 0


def main():
    args = parse_args()
    return run_capture(args.url, Path(args.output_dir), args.viewports, args.dry_run)


if __name__ == "__main__":
    sys.exit(main())
