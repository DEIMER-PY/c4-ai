"""Export publishable evidence from REAL local C4 AI sessions.

Reads `artifacts/runs/c4_*/evidence.json` (private, gitignored) and writes a
sanitized summary that is safe to commit. Every exported execution keeps its
real session ID and the SHA-256 of the original evidence file, so a reviewer
holding the private store can verify that nothing was invented:

    uv run --locked python scripts/export_run_evidence.py \
        --out docs/evidencia/2026-11-07-ejecuciones-reales.json \
        --markdown docs/entregas/S3_REPORTE_COSTOS.md
    uv run --locked python scripts/export_run_evidence.py --check docs/evidencia/2026-11-07-ejecuciones-reales.json
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from c4.services.run_evidence import build, check, markdown  # noqa: E402


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--store', type=Path, default=Path('artifacts/runs'))
    parser.add_argument('--out', type=Path)
    parser.add_argument('--markdown', type=Path)
    parser.add_argument('--check', type=Path)
    args = parser.parse_args(argv)
    if args.check:
        return check(args.store, args.check)
    if not args.out:
        parser.error('--out o --check es obligatorio')
    report = build(args.store)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    if args.markdown:
        rel = Path('..') / args.out.relative_to(args.out.parts[0]) if args.out.parts[0] == 'docs' else args.out
        args.markdown.write_text(markdown(report, rel.as_posix()), encoding='utf-8')
    print(json.dumps({'executions': report['total_executions'], 'total_cost_usd': report['total_cost_usd'],
                      'verdicts': report['verdict_breakdown']}))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
