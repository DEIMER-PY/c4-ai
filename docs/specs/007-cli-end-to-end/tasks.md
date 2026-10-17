# Tareas
- [x] T01 Deimer: revisar remoto/PR18 y crear especificación; FR-007.
- [x] T02 Deimer: configuración segura/gateway/doctor; FR-002, AC-001.
- [x] T03 Deimer: servicio, almacenamiento y herramientas; FR-003–006.
- [x] T04 Deimer: CLI y diseño violeta/cian; FR-001, AC-004.
- [x] T05 Deimer: pruebas y ejecución real acotada; AC-002–004.
- [x] T06 Deimer: validar/mostrar dashboard, documentar rúbricas y evaluación desktop; AC-005.
- [ ] T07 Deimer: evidencia/docs, commit con emoji, push y PR hacia develop; revisión antes del merge.

T02 precede T03, T03 precede T04/T05. No marcar verificado el gateway sin solicitud real exitosa. No cerrar C4-002 por almacenamiento local ni C4-004 sin revisar sus criterios pendientes.

## Evidencia de validación
AC-001: uv sync --locked, ayuda y doctor ejecutados. AC-002: docs/evidencia/2026-10-17-cli.json conserva ciclo real 5/6 → 6/6, 14 llamadas, 20.730 tokens, sin regresiones. AC-003/004: pruebas de fallos/regresiones/límites/JSON y lectura entre procesos, incluyendo regresión cp1252 en Windows. AC-005: dashboard 32 pruebas, build/typecheck/lint y navegador (desktop/móvil/teclado/estados); ver ENTREGA_S1.

Resultado local final: 33 pruebas backend aprobadas; verificación de 81 Markdown, nueve JSON y 15 SVG aprobada. Dashboard: 32 pruebas, build, typecheck y lint aprobados. Incidencia de bloqueo transitorio Windows resuelta mediante reintento acotado del reemplazo atómico y prueba de regresión.
