# Plan del dashboard con mocks
Fuente: [spec](spec.md); [API](../../arquitectura/API.md); [diseño](../../producto/DASHBOARD.md).
FR-001: App Router, TypeScript, Tailwind/shadcn, Recharts; fijar versiones compatibles al bootstrap.
FR-002: rutas /, /incidents, /incidents/[id], /evaluations/[id].
FR-003: adaptador en src/lib para examples/contracts/api-responses.json; tipos en src/types y componentes en src/components.
FR-004/005: estados explícitos, formatter de costo nullable, badge textual Demo.
FR-006: tablas semánticas, foco visible y responsive. Gráficas solo para datos disponibles.
No modificar fixtures/contrato: proponer cambios primero mediante ADR/Issue.
Santiago declara archivos antes de implementar; especificación propia puede ajustarse en su rama.
