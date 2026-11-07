# Feature: Evidencia real y verificable para S2/S3 y E2E del agente
ID: C4-CORE-043. Estado: Implementing. Responsable: DEIMER-PY (con Claude). Revisores: Santiago/Claude, Codex.

## Problema y usuario
Para S2 y S3 del [Reto Agente 2026](https://reto.pltk.mx/), el jurado y el harness automático necesitan comprobar 10 ejecuciones, un set propio de 30 o más casos y el costo por tarea. Las bases dicen que el consumo debe estar ligado a tareas reales y que **inflar el contador descalifica**. Una auditoría del 2026-11-07 encontró lo siguiente:
- `docs/evidencia/2026-10-25-diez-ejecuciones-calificadas.json` (spec 034) no corresponde a sesiones reales. Sus IDs no existen en `artifacts/runs/` y mezcla proveedores que no se ejecutaron. La API `/metrics` y la de overview lo servían como si lo fuera.
- Las sesiones reales contra Grok existen, pero están en un almacén privado y gitignorado, sin una proyección publicable.
- El repositorio es público pero no tenía `LICENSE`, y las bases exigen licencia abierta.
- No había pruebas E2E del agente: `tests/integration/` y `tests/evals/` estaban vacíos.

## Alcance
Incluido:
- Licencia MIT.
- Proyección verificable de las sesiones reales (`c4/services/run_evidence.py` y `scripts/export_run_evidence.py`).
- Runner con tope de USD (`scripts/run_milestone_suite.py`) y corridas reales nuevas sobre `refunds_v2` (32 casos).
- Reporte de costo generado.
- API de métricas calculada en vivo desde el almacén.
- Pruebas E2E con proveedor simulado y una live opcional.
- Gate en CI.
- Corrección de los documentos de entrega S2/S3/S4.

Excluido:
- Dataset con datos de clientes reales.
- Corrida S4 de 1.000 unidades y 12 h.
- Modo watcher autónomo.
Todo esto queda como siguiente feature.

Límite de gasto autorizado por Deimer el 2026-11-07: USD 5.

## Requisitos
- FR-001: Ninguna cifra de ejecuciones, tokens o costo publicada en `docs/` o servida por la API puede provenir de datos construidos a mano.
- FR-002: Cada ejecución exportada conserva su `session_id` real y el SHA-256 del `evidence.json` original, y `--check` lo verifica.
- FR-003: El costo por tarea se calcula con tokens reportados por el proveedor. Si una sesión antigua carece de `cost_usd`, se recalcula desde sus tokens y se etiqueta `recomputed_from_reported_tokens`.
- FR-004: El runner aborta antes de superar el tope de USD indicado.
- FR-005: Hay pruebas E2E del ciclo inspect→diagnose→patch→evaluate→decide para aceptado, rechazado, fallo de presupuesto, salida inválida y timeout. Verifican que la credencial nunca se persiste.
- FR-006: El CI ejecuta `tests/integration` y `tests/evals`.
- FR-007: El repositorio declara una licencia abierta.
- FR-008 (pedido por Deimer el 2026-11-07): la documentación principal (README y `docs/arquitectura/AGENTE.md`) usa diagramas UML sin estilos y tablas, sin insignias ni afirmaciones no verificables, e incluye capturas reales del CLI sobre sesiones reales (`scripts/capture_cli_evidence.py`).
- FR-009: El dataset de 32 casos declara en `policy` todas las reglas que sus casos esperan (v2.1.0).

## Aceptación
- AC-001: Dado el almacén real, cuando se ejecuta `export_run_evidence.py --check`, entonces hay 0 discrepancias.
- AC-002: Dada la evidencia exportada, hay al menos 10 ejecuciones reales y al menos una evaluación completa sobre el dataset de 32 casos con `cost_usd`.
- AC-003: `GET /api/v1/metrics/overview` sobre un almacén vacío devuelve 0 ejecuciones, y nunca lee `docs/evidencia/archivo/`.
- AC-004: `python -m unittest discover -s tests/integration` y `-s tests/evals` pasan sin red.
- AC-005: `LICENSE` existe y `pyproject.toml` declara `license = "MIT"`.
- AC-006: Las capturas en `docs/assets/cli/` son salida de `c4 report` sobre IDs presentes en la evidencia exportada y no contienen rutas locales absolutas.

## Casos de error
Las sesiones corruptas o sin llamadas exitosas se omiten y se cuentan en `skipped_sessions_without_provider_calls`. Las sesiones abandonadas cuentan como `incomplete`. Si el runner falla, no persiste nada inventado: usa el estado guardado por `ReliabilityService`.

## Dudas bloqueantes
Ninguna. Decisiones del 2026-11-07: reemplazar la evidencia ilustrativa por la real, aplicar el tope de USD 5 y cubrir en este ciclo las fases A (integridad), B (evidencia real) y C (E2E).

## Aprobación y cambios
Deimer (DEIMER-PY), 2026-11-07. Reemplaza el FR-001 de la [spec 034](../034-s2-s3-milestones-and-evidence/spec.md).
