# API local de consulta de evidencia
Estado: Verified localmente; pendiente CI. Responsable: Deimer/Codex. C4-002/003, entrega parcial. Fecha: 2026-10-17.

FR-001 / AC-001: implementar GET /api/v1/agents, /incidents, /incidents/{id}, /runs/{id}, /jobs/{id}, /patches/{id}, /evaluations/{id} y /incidents/{id}/report usando los contratos v1 existentes y el almacén CLI; sin acceso al proveedor ni modificación de evidencia.
FR-002 / AC-002: listas paginadas con items/next_cursor; IDs no son rutas, datos inválidos responden 422, ausentes 404, evidencia corrupta/incoherente 503 sin filtrar contenido ni rutas. No ocultar corrupción como lista vacía. Un reporte accepted requiere evaluación completa y gate coherente.
FR-003 / AC-003: OpenAPI disponible; instalación con uv y servidor ligado a 127.0.0.1. Sin claves, CORS permisivo ni autenticación de producción. Compartir con Santiago documentación de rutas y límites; no modificar su frontend ni inventar endpoints pendientes de revisión.
FR-004 / AC-004: pruebas HTTP sobre datos sintéticos, paginación, fallidos/incompletos, errores, contratos y ausencia de red/escritura; smoke HTTP real con evidencia existente. Mantener C4-002/003 abiertas: PostgreSQL, migraciones, operaciones de escritura y workers pendientes.

No cambia esquemas v1. GET /metrics y listados extra de parches/jobs siguen pendientes de especificación/revisión compartida. Sin despliegue ni promesa de escalabilidad.
