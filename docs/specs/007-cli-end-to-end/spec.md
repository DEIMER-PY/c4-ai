# CLI end to end con Grok
Estado: Verified localmente; integración por PR19 hacia develop. Responsable: Deimer/Codex. Tareas: C4-001 y C4-003; entrega parcial de C4-002/C4-005.
Fecha: 2026-10-17.

## Objetivo
Ejecutar hoy un ciclo reproducible de confiabilidad sobre el agente de prueba de reembolsos: ejecución real con Grok, incidente, diagnóstico, candidato declarativo, evaluación y decisión persistida. Las imágenes compartidas orientan colores violeta/cian, identidad y jerarquía; sus métricas, versiones y agentes no son evidencia del producto.

## Requisitos
FR-001: CLI Typer/Rich instalable como c4, con doctor, demo, analyze, patch, eval, compare y report. Modo JSON para automatización; sin métricas ficticias ni animaciones que simulen progreso.
FR-002: Gateway configurable por entorno, clave solo local, HTTPS, timeout, límites de llamadas/tokens/tiempo y errores saneados. Nunca mostrar clave ni cuerpo HTTP de error.
FR-003: trace_reader, patch_writer y eval_runner ejecutan operaciones controladas; diagnóstico/candidato mediante Grok. Nunca ejecutar código, comandos ni herramientas solicitadas por el modelo.
FR-004: Dataset sintético versionado; baseline inmutable y candidato separado. Evaluar ambos sobre exactamente los mismos casos y checksum. Guardar respuestas, latencias, tokens reportados y costo desconocido como null.
FR-005: Aceptar solo evaluación completa, objetivo antes fallido/después aprobado, mejora total, cero regresiones y todos los casos obligatorios de seguridad aprobados. En otros casos rechazar o pedir revisión humana; un fallo preserva job y evidencia.
FR-006: Evidencia local durable por IDs con escrituras atómicas; API futura reutilizará el servicio. Esta entrega usa archivos locales y no declara completadas PostgreSQL, API, colas o integración dashboard.
FR-007: Revisar PR18/C4-004 y abrir vista previa del dashboard existente sin mezclar mocks con evidencia real. Registrar clarificaciones y rúbricas pendientes.

## Aceptación
AC-001: Instalación bloqueada por uv.lock y ayuda/doctor reproducibles sin revelar secretos.
AC-002: Ejecución CLI contra Grok conserva diagnóstico, prompt candidato, resultados por caso, IDs y reporte recuperable por otro proceso.
AC-003: Pruebas cubren aceptación, regresión, seguridad, fallo proveedor, JSON inválido, límites y recuperación de evidencia; CI ejecuta esas pruebas.
AC-004: Salida JSON válida, código de salida distinguible para error/rechazo/revisión, baseline no modificado, ningún candidato aceptado sin evaluación.
AC-005: Dashboard revisado con build/tests/typecheck/lint y vista previa; documentar límites y tareas pendientes sin cerrar tareas incompletas.

## Límites
No publicar repo/tablero, cambiar contratos v1 existentes, aplicar cambios en producción, construir escritorio/web marketing ni grabar video en esta feature. Hermes y Tauri se estudian como siguiente fase. La rotación de la clave ya presente en historial requiere el panel del titular; sanear la plantilla no la revoca.
