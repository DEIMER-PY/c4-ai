# Tareas
- [x] T01 Deimer: inspeccionar checkpoints sin modificar sesiones; especificar corrección.
- [x] T02 Deimer: observador opcional, progreso Rich y cancelación durable; FR-001–004.
- [x] T03 Deimer: pruebas antes de primera respuesta, conteos, JSON e interrupción; AC-001–003.
- [x] T04 Deimer: documentación, commit con emoji, push y PR/CI hacia develop.

Evidencia local: 36 pruebas backend aprobadas. AC-001 comprueba que sesión, ruta y etapa se imprimen antes de la primera respuesta y que aparecen 6/12 y 12/12 guardadas. AC-002 mantiene las 14 llamadas del transporte de prueba y un único JSON; AC-003 verifica salida 130, evidencia parcial y liberación del bloqueo. No se ejecutaron nuevas solicitudes reales.

Publicación mediante feature codex/fix-c4-003-cli-progress y PR hacia develop; integrar únicamente con CI aprobada.
