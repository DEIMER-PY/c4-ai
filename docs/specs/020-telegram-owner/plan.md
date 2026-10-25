# Plan
Leer diagnóstico local de getMe/getChat, estado gateway y eventos de remitente bloqueado. Comparar nombre privado de Telegram con la respuesta humana y relación user_id==chat_id. Mantener identidad solo en artifacts ignorados.

Usar hermes_cli.config.save_env_value desde el entorno instalado de Hermes para las dos variables, con copia local en backups. Reiniciar mediante CLI oficial, sin autoaceptar hooks. Verificar estado conectado y enviar prueba al chat del propietario validado. Usuario envía frase de consulta de C4; revisar solo metadatos y respuesta de esa prueba. No reiniciar ni cambiar proveedor sin necesidad.

Archivos versionados: docs/specs/020-telegram-owner/**, docs/integraciones/HERMES.md, docs/equipo/ESTADO.md, docs/specs/README.md y evidencia saneada. Configuración/backup en Hermes local, fuera de Git. Validar docs/CI y PR→develop; no nuevas pruebas de aplicación porque no cambia código del producto.

Hallazgo AC005: user input llega, pero el proveedor xai intenta codex_responses con host del reto; hay rechazo de override OAuth y timeout120s. Usar save_config del cliente oficial y proveedor nombrado c4-reto, key_env C4_GROK_API_KEY y modelo/base ya verificados en .env local del proyecto; no imprimir valores. Comprobar provider/api_mode/base/key equivalentes con resolver de Hermes. Reiniciar prueba colgada con HERMES_RESTART_DRAIN_TIMEOUT=2 solo en el proceso CLI, sin persistir ese límite global. Reprobar mensaje y conservar estados fallidos previos.

Actualizar también docs/entregas/S1_REPORTE_TECNICO.md con nota posterior a la captura del video, sin alterar retrospectivamente el snapshot ni sus métricas.
