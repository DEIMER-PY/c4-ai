# Integración Hermes mediante MCP
Estado: Verified. Responsable Deimer/Codex. Fecha: 2026-10-17.

FR-001 / AC-001: servidor MCP stdio con herramientas list_incidents/get_incident/get_report/get_evaluation, basado en EvidenceReader y contratos existentes; solo lectura, sin claves ni llamadas a modelos.
FR-002 / AC-002: root de evidencia configurado explícitamente por entorno; validación de IDs, límites, errores saneados y sin aceptar por opinión. No exponer lectura arbitraria del disco ni shell ni evaluación remota.
FR-003 / AC-003: registrar únicamente este servidor en Hermes local v0.22.2, sin modificar proveedor, permisos nativos, sesiones, credenciales o configuración Telegram. Verificar descubrimiento y llamada MCP real. Configuración local fuera de Git y sin datos personales.
FR-004 / AC-004: tests de herramientas y protocolo, documentación de qué hace Hermes y qué hace C4; Telegram sigue reportado por Deimer, sin mensajes de prueba enviados por Codex. Indicar que sesiones existentes pueden requerir /reload-mcp desde el cliente de Hermes.

El harness C4 conserva evaluación y gate. Hermes actúa como interfaz/orquestador externo con las herramientas que el usuario haya habilitado en Hermes; no convertir esa instalación en autorización general para modificar la máquina.
