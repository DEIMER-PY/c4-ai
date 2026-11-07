"""Capture REAL C4 CLI output as SVG terminal renders for the documentation.

Runs the actual `c4` commands in-process against the local evidence store and
records exactly what Rich prints (no editing, no mock data). Commands that only
read persisted sessions (`report`, `s`) make no provider calls; `demo` does.

    uv run --locked python scripts/capture_cli_evidence.py report c4_<id> --out docs/assets/cli/report-rejected.svg
    uv run --locked python scripts/capture_cli_evidence.py s --out docs/assets/cli/status.svg
"""
import argparse
import io
import sys
from pathlib import Path

from rich.console import Console
from rich.terminal_theme import MONOKAI
from typer.testing import CliRunner

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import c4.cli as cli  # noqa: E402


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', nargs='+', help='Arguments passed to c4, e.g. report c4_<id>')
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--width', type=int, default=140)
    parser.add_argument('--store', default='artifacts/runs')
    args = parser.parse_args(argv)
    recorder = Console(record=True, width=args.width, force_terminal=True, color_system='truecolor',
                       file=io.StringIO())
    cli.console = recorder  # The CLI prints through this module-level console.
    result = CliRunner().invoke(cli.app, ['--store', args.store, *args.command])
    text = recorder.export_text(clear=False)
    if not text.strip():
        print(result.output)
        return 1
    args.out.parent.mkdir(parents=True, exist_ok=True)
    svg = recorder.export_svg(title='c4 ' + ' '.join(args.command), theme=MONOKAI)
    # Only redaction applied: the absolute checkout path (contains the local username) becomes '.'.
    root = str(Path.cwd().resolve())
    svg = svg.replace(root, '.')
    if root in svg:
        raise SystemExit('absolute path still present; widen --width so it is not wrapped')
    args.out.write_text(svg, encoding='utf-8')
    print(f'{args.out} exit={result.exit_code} lines={len(text.splitlines())}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
