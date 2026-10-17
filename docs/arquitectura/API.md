# Contratos v1 — API y CLI
Estado: **especificación**, endpoints no implementados. Fuente legible de tipos: [JSON Schema](../../examples/contracts/schemas.json); [fixture completo](../../examples/contracts/scenario.json).
Versionar cambios incompatibles; ambos responsables deben aprobarlos.
## Convenciones
Base /api/v1. JSON UTF-8, fechas UTC, id de correlación en cada trabajo. Listados devuelven items y next_cursor nullable.
Errores: {code, message, retryable, details}; datos inválidos 422, recurso ausente 404, estado incompatible 409, proveedor no disponible 503.
Operaciones asíncronas devuelven 202 con Job; 202 no significa éxito del análisis.
## Operaciones previstas
| Método / ruta | Entrada | Respuesta |
|---|---|---|
| POST /agents | Nombre, versión y refs de prompt/config | Agent, 201 |
| GET /agents | cursor opcional | Lista Agent |
| POST /runs | Versión de agente, inputs, outputs y traza | Run, 201 |
| GET /runs/{id} | ID | Run |
| POST /runs/{id}/analyze | Objetivo, dataset_id y dataset_version | Job, 202 |
| GET /jobs/{id} | ID | Job |
| GET /incidents | cursor opcional | Lista Incident |
| GET /incidents/{id} | ID | Incident |
| POST /incidents/{id}/patches | Diagnóstico/evidencia disponibles | Job, 202 |
| GET /patches/{id} | ID | Patch |
| POST /patches/{id}/evaluate | dataset_id, dataset_version | Job, 202 |
| GET /evaluations/{id} | ID | Evaluation con before/after |
| GET /incidents/{id}/report | ID | Report |
| GET /metrics | Filtro de periodo | Totales reales, pendientes y cobertura de costos |

API no ofrece aplicar un parche a producción. Las aprobaciones humanas quedan para una fase posterior.
## Estados
Run: succeeded, failed.
Incident: detected, diagnosing, patch_proposed, evaluating, resolved, rejected, needs_human_review.
Patch: proposed, evaluating, accepted, rejected, needs_human_review.
Evaluation: pending, running, completed, failed.
Job: queued, running, succeeded, failed; stage identifica paso actual.
Report.decision: accepted, rejected, needs_human_review.
Aceptar exige evaluación completed y controles del [protocolo](EVALUACIONES.md). Failed no puede convertirse en accepted.
## CLI prevista sobre contratos API
Ya existe un [CLI local por sesiones](CLI.md) para el primer ciclo end to end. Los comandos siguientes describen el adaptador HTTP futuro; no son la sintaxis de esa entrega local.
c4 analyze RUN_ID --dataset DATASET --dataset-version VERSION
c4 patch INCIDENT_ID
c4 eval PATCH_ID --dataset DATASET --dataset-version VERSION
c4 compare EVALUATION_ID
c4 report INCIDENT_ID
La CLI comparte servicios; no duplica lógica de aprobación.
## Mock frontend
[Ejemplos de API](../../examples/contracts/api-responses.json) incluyen listas, trabajo pendiente, rechazo, evidencia incompleta y error del proveedor.
No llamar al gateway desde navegador; clave solo en backend. Mocks deben mostrar etiqueta Demo / datos sintéticos.
