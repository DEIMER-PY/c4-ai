# Tareas
Responsable Deimer/Codex. Dependencias: Hermes instalado, Telegram configurado por usuario, spec018 y confirmación humana de identidad.

- [x] AC-001: token válido, gateway activo, chat privado/nombre coincidentes y allowlist incorrecta identificada.
- [x] AC-002: copia local, corrección y reconexión/destino verificados.
- [x] AC-003: prueba completa Telegram/Hermes/MCP/respuesta.
- [ ] AC-004: registro saneado, verificación documental y PR/CI.
- [x] AC-005: proveedor custom del gateway, resolución y respuesta reales sin OAuth fuera de origen.

Prueba final: mensaje humano B recibido, herramientas mcp__c4_ai__get_report y get_evaluation ejecutadas y evidencia estructurada comprobada; respuesta accepted,5/6→6/6,cero regresiones,delivery_obligations=delivered,19,110s. No confundir el primer intento interrumpido o el saludo de restauración con esta prueba final. Protocolo SSE/herramienta del gateway adicional:1solicitud HTTP200/2375ms,usage no reportado. Métricas de sesión en evidencia son acumuladas, no costo del workflow. CI/PR pendientes de integración.
