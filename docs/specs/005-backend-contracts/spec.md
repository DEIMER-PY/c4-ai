# Contratos tipados del backend
ID: C4-BACKEND-005. Estado: Verified para contratos tipados; C4-002 completa sigue En curso. Responsable: Deimer/Codex.
## Requisitos
FR-001: Implementar modelos Pydantic v2 para Agent, Run, Incident, Patch, Evaluation, Job, Report y escenario sintético sin alterar contratos JSON v1.
FR-002: Rechazar campos desconocidos, números negativos/bools como contadores, IDs vacíos y fechas sin zona.
FR-003: Evaluación completada conserva conteos por caso, IDs únicos y regresiones consistentes; una aceptación referencia parche/evaluación.
FR-004: Versiones de Agent inmutables y costo desconocido nullable, sin convertirlo a cero.
FR-005: Proyecto Python 3.12 con pyproject/uv.lock y pruebas de fixtures/casos inválidos en CI.
## Aceptación
AC-001: Fixture scenario y tres bundles de API parsean correctamente y serializan JSON.
AC-002: Datos inválidos producen errores antes de persistir o llamar a un modelo.
AC-003: Intentar modificar Agent falla; null cost se conserva.
AC-004: Casos de evaluación inconsistentes y reporte accepted sin evaluación se rechazan.
AC-005: Tests reproducibles y CI; PR hacia develop.
## Límites
No API, migraciones, servicios de evaluación, gateway o dashboard en esta feature. C4-002 completa sigue En curso.
Los modelos validan integridad de datos; no sustituyen el gate completo de aprobación de C4-005.
