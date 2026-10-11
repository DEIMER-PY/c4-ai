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
