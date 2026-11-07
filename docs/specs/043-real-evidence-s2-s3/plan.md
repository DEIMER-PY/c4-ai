# Plan 043: Evidencia real y E2E
Spec: [043](spec.md).

## Decisiones
- La proyección vive en `c4/services/run_evidence.py`, que reutiliza `PiiSanitizer` y `calculate_cost_usd`. Así la API y el script comparten una sola fuente (FR-001).
- El archivo publicado se llama `docs/evidencia/2026-11-07-ejecuciones-reales.json` y usa el schema `c4-real-runs-1` (FR-002).
- El reporte `docs/entregas/S3_REPORTE_COSTOS.md` se genera con `--markdown` y no se edita a mano (FR-003).
- El runner lee el gasto desde la evidencia persistida y reserva `--per-run-usd` antes de cada sesión (FR-004).
- Las pruebas E2E usan `httpx.MockTransport` sobre `Gateway`, sin red. La prueba live se activa solo con `C4_LIVE_E2E=1` (FR-005).
- La evidencia ilustrativa se mueve a `docs/evidencia/archivo/` con una nota, para conservar la trazabilidad del error.

## Riesgos
- Las tarifas de `rates.py` son una tabla interna. Se declaran en `cost_method` y hay que contrastarlas con el panel del reto.
- Los casos siguen siendo sintéticos. Se declara así y se planea un dataset con políticas públicas reales.

## Validación
`unittest` (unit, integration, evals), `scripts/verify_docs.py`, `export_run_evidence.py --check` y CI.
