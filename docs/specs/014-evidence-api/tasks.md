# Tareas
Responsable: Deimer/Codex. Dependencias: contratos005, CLI007–013.
- [x] AC-001: servicio de consulta y rutas v1.
- [x] AC-002: validación, gate y errores/paginación.
- [x] AC-003: instalación y handoff Santiago.
- [x] AC-004: pruebas, smoke real, documentación y PR/CI.

Evidencia: 65 pruebas Python aprobadas (8 API). HTTP real Uvicorn con 10 incidentes locales; reporte Qwen HTTP200/rejected y evaluación HTTP200/completed. Servidor auxiliar cerrado. Cero llamadas a modelos. Sandbox Windows bloqueaba socketpair del event loop; pruebas HTTP ejecutadas fuera del sandbox. Contratos/frontend sin cambios. PR27 hacia develop; quality aprobada en run39050620545.
