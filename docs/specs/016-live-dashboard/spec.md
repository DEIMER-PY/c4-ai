# Dashboard conectado y entrega responsive
Estado: Ready. Fecha: 2026-10-17. C4-006. Deimer autoriza integración y pulido frontend en esta sesión; no hay PR remoto abierto de Santiago al comenzar.

FR-001 / AC-001: adaptador HTTP del servidor Next.js sobre GET v1 existentes; seleccionar modo api por defecto y demo explícito por entorno. No inventar endpoints ni claves en navegador. Desconexión muestra error, nunca fallback silencioso a fixtures.
FR-002 / AC-002: navegar lista → incidente → patch/reporte → evaluación real del CLI; paginación completa, cancelación por timeout, 404/503/costo desconocido y evidencia parcial. Jobs sin listado documentado se muestran como no disponibles, no cero inventado.
FR-003 / AC-003: UI oscura violeta/cian inspirada en Aurora: barra lateral, cabecera, métricas y comparación visible. Responsive escritorio/tablet/móvil, teclado y reduced motion. No copiar assets o cifras del ecommerce. Las capturas responsive son prototipos web, no app nativa instalada.
FR-004 / AC-004: tests de adaptador y fallos, frontend build/typecheck/lint y regresión; prueba HTTP real navegador → Next.js → API → evidencia. Capturas por viewport. Mantener CLI/runtime inalterados en esta feature.
FR-005 / AC-005 (hallazgo de validación): arranque local c4-api con SelectorEventLoop, tras reproducir WinError64 del Proactor de Uvicorn en Windows. Mantener binding loopback, puerto/almacén configurables y mismos contratos; comprobar consultas concurrentes sin proveedores. Excepción acotada al límite runtime de FR-004, sin cambiar lógica de evaluación.

No modifica contratos v1, DB, endpoints de escritura ni capacidades de máquina. C4-006 solo cierra si se cumplen criterios disponibles; listado jobs/métricas globales queda explícitamente pendiente de acuerdo compartido.
