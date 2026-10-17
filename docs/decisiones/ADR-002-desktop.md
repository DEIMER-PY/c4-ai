# Ajuste de escritorio e integración Hermes
Fecha de actualización: 2026-10-17. Estado: propuesta de distribución Tauri; integración MCP Hermes verificada por spec018.

C4 ya dispone de CLI end-to-end, chat streaming y dashboard conectado a API local. Hermes v0.22.2 está instalado por Deimer y descubre cuatro herramientas MCP de evidencia. [Configuración y límites](../integraciones/HERMES.md). Telegram→C4 sigue pendiente de prueba humana; el puente no altera permisos nativos del agente ni permite aplicar cambios en producción.

Tauri2 es candidato para distribuir la interfaz y el core Python como sidecar. Requiere build por plataforma, validación IPC, permisos mínimos, firma y actualizaciones. La guía oficial Next.js utiliza export estático; el dashboard actual tiene datos del servidor y rutas dinámicas, por lo que no puede empaquetarse sin adaptar esa arquitectura o mantener un servidor local controlado. No se ha construido ni probado un instalador Tauri.

Secuencia: cerrar evidencia S1 → completar API de ejecución/persistencia → spec de escritorio con sidecar mínimo y prueba de credenciales/arranque/cierre → instaladores y web de documentación. El [prototipo responsive](../prototipos/index.html) muestra las vistas web implementadas y no promete capacidades nativas. Jev es otro experimento (triage probabilístico), distinto de Hermes y de la UI.

Fuentes: [Tauri Next.js](https://v2.tauri.app/start/frontend/nextjs/), [Tauri sidecars](https://v2.tauri.app/develop/sidecar/), [Hermes MCP](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp).
