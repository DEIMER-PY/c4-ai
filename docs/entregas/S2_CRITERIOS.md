# Auditoría de criterios oficiales: Semana S2

Fuente: [Reto Agente 2026](https://reto.pltk.mx/), revisada el 2026-11-07. Hito S2 ("Herramientas reales"): 3 herramientas, manejo de errores, 10 ejecuciones y un video de 2 minutos. Este documento no se asigna puntos: la calificación corresponde al harness y al jurado.

> **Corrección del 2026-11-07.** La versión anterior citaba `2026-10-25-diez-ejecuciones-calificadas.json`, que **no corresponde a ejecuciones reales**. Se archivó en [`docs/evidencia/archivo/`](../evidencia/archivo/README.md) y se reemplazó por una proyección verificable de sesiones reales ([spec 043](../specs/043-real-evidence-s2-s3/spec.md)).

## Matriz de cumplimiento S2

| Criterio oficial | Estado | Evidencia verificable |
|---|---|---|
| **3 herramientas reales** | Cumple | `trace_reader` (inspector determinista), `patch_writer` (diagnóstico y candidato con Grok) y `eval_runner` (baseline contra candidato sobre el dataset completo), en `c4/tools/refunds.py` y `c4/services/reliability.py`. Cada ejecución exportada lista `tools_used`. |
| **Manejo de errores** | Cumple | `WorkflowError` tipado. Reintentos acotados con backoff para timeout, conexión y 5xx; el 429 no se reintenta. Cada intento queda registrado y cuenta contra el presupuesto (`c4/tools/grok.py`). Hay tope de llamadas y tiempo (`budget_exceeded`). La salida inválida va a `needs_human_review` y las regresiones o fallas de seguridad se rechazan. Pruebas: `tests/unit/test_gateway_retries.py`, `tests/unit/test_reliability.py` y E2E en `tests/integration/test_agent_e2e.py`. |
| **10 ejecuciones** | Cumple, con evidencia real | [`docs/evidencia/2026-11-07-ejecuciones-reales.json`](../evidencia/2026-11-07-ejecuciones-reales.json): cada entrada es una sesión real contra Grok con `session_id` y SHA-256 del `evidence.json` original. Incluye los éxitos, los rechazos y los fallos reales (por ejemplo, `provider_timeout`) tal como ocurrieron. Resumen en el [reporte de costos](S3_REPORTE_COSTOS.md). |
| **Video de 2 minutos** | Publicado | https://www.youtube.com/watch?v=DqAuvL8im9M (120 s). |

## Cómo verificar

```powershell
uv run --locked python scripts/export_run_evidence.py --check docs/evidencia/2026-11-07-ejecuciones-reales.json
uv run --locked python -m unittest discover -s tests/integration -v
```

`--check` necesita el almacén privado `artifacts/runs/`, que se puede compartir con el jurado si lo pide. Las pruebas E2E no usan red.
