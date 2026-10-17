# Plan
Añadir callback opcional al servicio después de cada checkpoint durable. El adaptador CLI lo transforma en mensajes Rich de etapa/respuestas y muestra spinner con tiempo transcurrido en terminal interactiva. En redirecciones emitir líneas reales con flush; en JSON no instalar observador ni progreso.

Capturar KeyboardInterrupt dentro de execute para guardar cancelación antes de liberar el lock; reutilizar el manejo de fallo que lleva a revisión humana. No reintentar llamadas ni afirmar que el proveedor canceló su consumo.

Archivos: c4/cli.py, c4/services/reliability.py, tests/unit/test_reliability.py, docs/arquitectura/CLI.md, docs/equipo/ESTADO.md, docs/specs/README.md y docs/specs/008-cli-progress. C4-003 mantiene pendiente su integración API.

Validación con MockTransport y CliRunner, incluida captura del mensaje antes de devolver la primera respuesta, interrupción y modo JSON. Sin nuevas solicitudes reales ni cambios en sesiones del usuario.
