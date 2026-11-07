"""Projection of REAL local C4 AI sessions into publishable, verifiable evidence.

Shared by `scripts/export_run_evidence.py` (committed evidence + S3 cost report) and the
read-only API metrics endpoints, so every number shown anywhere derives from persisted
sessions with real provider usage. Nothing here calls a model.
"""
import hashlib
import json
from datetime import UTC, datetime
from pathlib import Path

from c4.tools.rates import RATES_PER_MILLION, calculate_cost_usd, normalize_model_key
from c4.tools.sanitizer import PiiSanitizer

SCHEMA = 'c4-real-runs-1'
SANITIZER = PiiSanitizer()


def percentile(values: list[int], q: float) -> int | None:
    if not values:
        return None
    ordered = sorted(values)
    return ordered[min(len(ordered) - 1, round(q * (len(ordered) - 1)))]


def summarize(path: Path) -> dict | None:
    raw = path.read_bytes()
    state = json.loads(raw)
    calls = state.get('calls', [])
    if state.get('provenance') != 'synthetic_cases_real_provider' or not any(
            c.get('status') == 'succeeded' for c in calls):
        return None
    known = [c for c in calls if c.get('input_tokens') is not None and c.get('output_tokens') is not None]
    recorded = all(c.get('cost_usd') is not None for c in known)
    # Sessions recorded before c4/tools/rates.py existed kept tokens but cost_usd=None:
    # recompute from the real reported tokens and label the source instead of guessing.
    cost = sum(c['cost_usd'] if c.get('cost_usd') is not None else
               (calculate_cost_usd(c['model'], c['input_tokens'], c['output_tokens'], c.get('provider')) or 0.0)
               for c in known)
    latencies = [c['latency_ms'] for c in calls if isinstance(c.get('latency_ms'), int)]
    evaluation = state.get('evaluation')
    error = (state.get('job') or {}).get('error') or {}
    diff = (state.get('patch') or {}).get('diff')
    target = state.get('target_provider') or {'provider': 'grok', **state['provider']}
    return {
        'session_id': state['id'],
        'created_at': state['created_at'],
        'evidence_sha256': hashlib.sha256(raw).hexdigest(),
        'dataset': {'id': state['dataset']['data']['id'], 'version': state['dataset']['data']['version'],
                    'sha256': state['dataset']['sha256'], 'cases': len(state['dataset']['data']['cases'])},
        'target_case_id': state['target_case_id'],
        'reasoning': {'provider': 'grok', 'model': state['provider']['model']},
        'target': {'provider': target['provider'], 'model': target['model']},
        'tools_used': [name for key, name in (('inspection', 'trace_reader'), ('proposal', 'patch_writer'),
                                              ('evaluation', 'eval_runner')) if key in state],
        'job_status': state['job']['status'],
        'stage': state['job']['stage'],
        'error_code': error.get('code'),
        'decision': (state.get('report') or {}).get('decision'),
        'repair_attempts': [{'attempt': a['attempt'], 'after': a['after'], 'regressions': a['regressions'],
                             'security_passed': a['security_passed'], 'decision': a['decision']}
                            for a in state.get('repair_attempts', [])],
        'repair_stopped': state.get('repair_stopped'),
        'evaluation': None if not evaluation or evaluation.get('status') != 'completed' else {
            'before': evaluation['before'], 'after': evaluation['after'],
            'regressions': evaluation['regressions'], 'security_passed': evaluation['security_passed']},
        'usage': {
            'calls': len(calls),
            'succeeded_calls': sum(c.get('status') == 'succeeded' for c in calls),
            'input_tokens': sum(c['input_tokens'] for c in known),
            'output_tokens': sum(c['output_tokens'] for c in known),
            'token_coverage': f'{len(known)}/{len(calls)}',
            'cost_usd': round(cost, 6),
            'cost_source': 'recorded_at_call_time' if recorded else 'recomputed_from_reported_tokens',
            'latency_ms_total': sum(latencies),
            'latency_ms_p50': percentile(latencies, 0.5),
            'latency_ms_p95': percentile(latencies, 0.95),
        },
        'patch_diff': SANITIZER.sanitize_text(diff[:4000])[0] if diff else None,
    }


def build(store: Path) -> dict:
    executions, skipped = [], 0
    for path in sorted(store.glob('c4_*/evidence.json')):
        try:
            row = summarize(path)
        except (OSError, ValueError, KeyError, TypeError):
            row = None  # Corrupt or partial checkpoint: never invent a summary for it.
        if row is None:
            skipped += 1
        else:
            executions.append(row)
    executions.sort(key=lambda r: r['created_at'])
    breakdown = {'accepted': 0, 'rejected': 0, 'needs_human_review': 0, 'failed': 0, 'incomplete': 0}
    errors: dict[str, int] = {}
    for row in executions:
        if row['job_status'] == 'failed':
            breakdown['failed'] += 1
            errors[row['error_code'] or 'unknown'] = errors.get(row['error_code'] or 'unknown', 0) + 1
        elif row['job_status'] != 'succeeded':
            breakdown['incomplete'] += 1
        else:
            breakdown[row['decision'] or 'needs_human_review'] += 1
    total_cost = round(sum(r['usage']['cost_usd'] for r in executions), 6)
    by_dataset: dict[str, dict] = {}
    for row in executions:
        key = f"{row['dataset']['id']}@{row['dataset']['version']}"
        bucket = by_dataset.setdefault(key, {'cases': row['dataset']['cases'], 'sessions': 0, 'completed_evaluations': 0,
                                             'cost_usd': 0.0, 'calls': 0, 'input_tokens': 0, 'output_tokens': 0})
        bucket['sessions'] += 1
        bucket['completed_evaluations'] += row['evaluation'] is not None
        bucket['cost_usd'] = round(bucket['cost_usd'] + row['usage']['cost_usd'], 6)
        for field in ('calls', 'input_tokens', 'output_tokens'):
            bucket[field] += row['usage'][field]
    for bucket in by_dataset.values():
        bucket['cost_usd_per_session'] = round(bucket['cost_usd'] / bucket['sessions'], 6)
        bucket['cost_usd_per_case_evaluated'] = round(
            bucket['cost_usd'] / (bucket['sessions'] * bucket['cases']), 6)
    models = sorted({r['reasoning']['model'] for r in executions} | {r['target']['model'] for r in executions})
    return {
        'schema_version': SCHEMA,
        'generated_at': datetime.now(UTC).isoformat(),
        'generator': 'scripts/export_run_evidence.py',
        'provenance': 'synthetic_cases_real_provider',
        'note': ('Cada ejecución es una sesión real de C4 AI contra Grok. Los casos del dataset son sintéticos; '
                 'las llamadas, tokens y latencias son reales y reportados por el proveedor.'),
        'cost_method': {
            'formula': 'cost_usd = (input_tokens * input_rate + output_tokens * output_rate) / 1e6',
            'rates_usd_per_million': {m: RATES_PER_MILLION.get(normalize_model_key(m)) for m in models},
            'source': 'c4/tools/rates.py (tabla interna; contrastar con el consumo del panel del reto)',
        },
        'total_executions': len(executions),
        'skipped_sessions_without_provider_calls': skipped,
        'verdict_breakdown': breakdown,
        'failed_by_error_code': errors,
        'total_calls': sum(r['usage']['calls'] for r in executions),
        'total_tokens_consumed': sum(r['usage']['input_tokens'] + r['usage']['output_tokens'] for r in executions),
        'total_cost_usd': total_cost,
        'by_dataset': by_dataset,
        'executions': executions,
    }


def markdown(report: dict, evidence_path: str) -> str:
    lines = [
        '# Reporte de costo por tarea (S3)',
        '',
        f"Generado automáticamente por `{report['generator']}` el {report['generated_at'][:10]} a partir de "
        f"[evidencia real]({evidence_path}). No editar a mano: regenerar con el script.",
        '',
        report['note'],
        '',
        '## Totales',
        '',
        '| Métrica | Valor |',
        '|---|---|',
        f"| Ejecuciones reales | {report['total_executions']} |",
        f"| Aceptadas / rechazadas / revisión humana / fallidas / incompletas | {report['verdict_breakdown']['accepted']} / "
        f"{report['verdict_breakdown']['rejected']} / {report['verdict_breakdown']['needs_human_review']} / "
        f"{report['verdict_breakdown']['failed']} / {report['verdict_breakdown']['incomplete']} |",
        f"| Llamadas al proveedor | {report['total_calls']} |",
        f"| Tokens reportados | {report['total_tokens_consumed']} |",
        f"| Costo total | ${report['total_cost_usd']:.4f} USD |",
        '',
        '## Costo por dataset',
        '',
        '| Dataset | Casos | Sesiones | Evaluaciones completas | Llamadas | Costo total | Costo por tarea (sesión) | Costo por caso evaluado |',
        '|---|---|---|---|---|---|---|---|',
    ]
    for key, b in report['by_dataset'].items():
        lines.append(f"| `{key}` | {b['cases']} | {b['sessions']} | {b['completed_evaluations']} | {b['calls']} | "
                     f"${b['cost_usd']:.4f} | ${b['cost_usd_per_session']:.4f} | ${b['cost_usd_per_case_evaluated']:.5f} |")
    if report['failed_by_error_code']:
        lines += ['', '## Fallos por código', '', '| Código | Sesiones |', '|---|---|']
        lines += [f'| `{code}` | {count} |' for code, count in sorted(report['failed_by_error_code'].items())]
    lines += ['', '## Ejecuciones', '',
              '| Sesión | Fecha (UTC) | Dataset | Caso objetivo | Resultado | Antes → Después | Intentos | Llamadas | Tokens | Costo | p95 ms |',
              '|---|---|---|---|---|---|---|---|---|---|---|']
    for r in report['executions']:
        u, ev = r['usage'], r['evaluation']
        result = {'failed': f"failed: `{r['error_code']}`", 'succeeded': r['decision']}.get(r['job_status'], 'incompleta')
        score = f"{ev['before']['passed']}/{ev['before']['total']} → {ev['after']['passed']}/{ev['after']['total']}" if ev else '—'
        lines.append(f"| `{r['session_id']}` | {r['created_at'][:16].replace('T', ' ')} | {r['dataset']['id']}@{r['dataset']['version']} | "
                     f"`{r['target_case_id']}` | {result} | {score} | {len(r['repair_attempts']) or (1 if ev else '—')} | {u['calls']} | {u['input_tokens'] + u['output_tokens']} | "
                     f"${u['cost_usd']:.4f} | {u['latency_ms_p95']} |")
    method = report['cost_method']
    lines += ['', '## Método de costo', '', f"`{method['formula']}`. Tarifas: {method['source']}. "
              'Las sesiones previas a la tabla de tarifas (17-oct) guardaron tokens reales sin `cost_usd`; '
              'su costo se recalcula desde esos tokens y se marca `cost_source: recomputed_from_reported_tokens`.', '']
    lines += [f"- `{model}`: {rate}" for model, rate in method['rates_usd_per_million'].items()]
    lines += ['', 'Verificación: `uv run --locked python scripts/export_run_evidence.py --check '
              + evidence_path.replace('../', 'docs/') + '` compara cada `evidence_sha256` con el almacén privado.', '']
    return '\n'.join(lines)


def check(store: Path, evidence: Path) -> int:
    report = json.loads(evidence.read_text(encoding='utf-8'))
    failures = 0
    for row in report['executions']:
        path = store / row['session_id'] / 'evidence.json'
        actual = hashlib.sha256(path.read_bytes()).hexdigest() if path.exists() else None
        if actual != row['evidence_sha256']:
            failures += 1
            print(f"MISMATCH {row['session_id']}: {'missing' if actual is None else 'hash differs'}")
    print(json.dumps({'checked': len(report['executions']), 'mismatches': failures}))
    return 1 if failures else 0
