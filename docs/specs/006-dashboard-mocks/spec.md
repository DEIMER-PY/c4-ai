# Dashboard inicial de Santiago
ID: C4-UI-006. Issue: C4-004 / #4. Estado: Ready para revisión técnica de Santiago; implementación pendiente.
Responsable: Santiago/Claude; revisión de integración: Deimer.
## Requisitos
FR-001: Preparar Next.js App Router/TypeScript/pnpm en apps/dashboard con lockfile y comandos reproducibles.
FR-002: Overview y lista de incidentes, detalle por ID y comparación de evaluación mediante fixtures.
FR-003: Tipar datos según contratos v1 y aislar adaptador de mocks de componentes.
FR-004: Loading, vacío, error, queued/failed y evidencia incompleta no se presentan como éxito.
FR-005: Demo visible en datos sintéticos y costos null como Desconocido.
FR-006: Interfaz accesible, teclado, móvil y evidencia de build/typecheck.
## Aceptación
AC-001: Desde overview se abre incidente y comparación aceptada/rechazada.
AC-002: Comparación muestra before/after, dataset/version y regresiones por IDs.
AC-003: Listas vacías, error de proveedor y revisión humana tienen estado claro.
AC-004: No hay clave, llamada al gateway ni botón de aplicar a producción en frontend.
AC-005: Capturas desktop/móvil, build/typecheck y PR hacia develop.
## Fuera de alcance
Login, hosting, llamadas Grok y cambios de contratos/backend.
## Clarificaciones (revisión Santiago/Claude)
Revisión de la spec contra API.md, schemas.json y api-responses.json. Pendientes de respuesta de Deimer.
CL-001 (bloquea AC-001): no hay operación que liste los patches/evaluaciones de un incidente; solo POST /incidents/{id}/patches y GET /incidents/{id}/report, que devuelve un único Report. El fixture tiene tres reports (accepted/rejected/needs_human_review) para inc_refunds_001. Propuesta: el adaptador de mocks agrupa por incident_id y se documenta como endpoint pendiente (p. ej. GET /incidents/{id}/patches).
CL-002 (bloquea overview de FR-002): GET /metrics no tiene schema ni fixture, y no existe listado de jobs. Propuesta: overview derivado de los fixtures con etiqueta Demo, sin inventar totales; la forma real se acuerda antes de C4-006.
CL-003: DASHBOARD.md pide agente/versión y fecha en la lista de incidentes, pero Incident no tiene created_at ni agent_id (solo run_id) y api-responses.json no incluye runs. Propuesta: mostrar run_id y omitir fecha hasta que el contrato lo incluya.
CL-004: ningún fixture de api-responses.json trae costo; cost/usage solo existe en Run. Propuesta: FR-005 se cubre con el formatter nullable y una prueba unitaria, sin dato visible en pantalla por ahora.
CL-005: la evaluación incompleta trae before/after 0/0. La UI no debe mostrar 0 % de pass rate: con total 0 se muestra "Sin datos".
