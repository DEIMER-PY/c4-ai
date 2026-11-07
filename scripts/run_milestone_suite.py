"""Run real C4 AI sessions against Grok with a hard USD ceiling.

Each session is a full `c4 demo` (inspect -> diagnose -> patch -> evaluate the
whole dataset -> decide). Spend is read back from the persisted evidence, so the
ceiling is enforced from real provider usage, never from estimates.

Usage:
    uv run --locked python scripts/run_milestone_suite.py --budget-usd 4.5 \
        --dataset datasets/sample/refunds_v2.json --target boundary_day_31_expired ...
"""
import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

DEFAULT_TARGETS = [
    'boundary_day_31_expired', 'boundary_day_35_expired', 'boundary_day_60_expired',
    'boundary_day_365_annual_expired', 'policy_gift_card_non_refundable', 'policy_final_sale_clearance',
    'policy_service_already_rendered', 'legal_fraud_investigation_hold', 'policy_third_party_marketplace_item',
    'policy_customer_damaged_abuse',
]


def session_cost(store: Path, session_id: str) -> float:
    state = json.loads((store / session_id / 'evidence.json').read_text(encoding='utf-8'))
    return sum(c.get('cost_usd') or 0.0 for c in state.get('calls', []))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dataset', default='datasets/sample/refunds_v2.json')
    parser.add_argument('--store', default='artifacts/runs')
    parser.add_argument('--env-file', default='.env')
    parser.add_argument('--target', action='append', dest='targets')
    parser.add_argument('--budget-usd', type=float, required=True, help='Hard ceiling for the whole suite.')
    parser.add_argument('--per-run-usd', type=float, default=0.5, help='Worst-case spend reserved per session.')
    args = parser.parse_args(argv)
    targets = args.targets or DEFAULT_TARGETS
    store = Path(args.store)
    env = {**os.environ, 'C4_MAX_MODEL_CALLS': os.environ.get('C4_MAX_MODEL_CALLS', '80'),
           'C4_MAX_JOB_SECONDS': os.environ.get('C4_MAX_JOB_SECONDS', '1800')}
    spent, results = 0.0, []
    for target in targets:
        if spent + args.per_run_usd > args.budget_usd:
            print(json.dumps({'stopped': 'budget_ceiling', 'spent_usd': round(spent, 6)}), flush=True)
            break
        proc = subprocess.run([sys.executable, '-m', 'c4.cli', '--json', '--store', str(store), '--env-file', args.env_file, 'demo',
                               '--dataset', args.dataset, '--target', target],
                              capture_output=True, text=True, encoding='utf-8', errors='replace', env=env)
        try:
            payload = json.loads(proc.stdout.strip().splitlines()[-1])
        except (IndexError, ValueError):
            payload = {'error': {'code': 'unparseable_output'}}
        sid = payload.get('id')
        cost = session_cost(store, sid) if sid else 0.0
        spent += cost
        row = {'target': target, 'session_id': sid, 'exit_code': proc.returncode,
               'job_status': payload.get('job', {}).get('status'),
               'decision': payload.get('report', {}).get('decision'),
               'error': (payload.get('job', {}).get('error') or payload.get('error') or {}).get('code'),
               'cost_usd': round(cost, 6), 'spent_usd': round(spent, 6)}
        results.append(row)
        print(json.dumps(row), flush=True)
    print(json.dumps({'sessions': len(results), 'spent_usd': round(spent, 6)}), flush=True)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
