# Plan 041: Aplicación Web de Chat Conversacional C4 AI (Estilo Kimi.ai)

## Enfoque de Implementación

### Fase 1: Arquitectura de Componentes de Chat
- Crear el componente principal `C4ChatApp` en `apps/website/src/components/chat-interface.tsx`:
  - Gestión de estado: conversaciones activas, historial de sesiones, modelo activo, mensajes y estado de razonamiento (`thinking`).
  - Base de conocimiento enriquecida con trazas reales de C4 (`refunds_v2.json`, `trace_reader`, árbol de Merkle).
  - Bloque de razonamiento estilo Kimi (`ThinkingBlock`) con duración de cómputo simulada y pasos causales.

### Fase 2: Página de Ruta `/chat`
- Crear `apps/website/src/app/chat/page.tsx`:
  - Contenedor de pantalla completa (`h-[calc(100dvh-4rem)]`), eliminando el footer para una experiencia de aplicación pura similar a Kimi.ai y ChatGPT.

### Fase 3: Integración en Navegación Global
- Modificar `SiteHeader` en `apps/website/src/components/site-chrome.tsx` para agregar el enlace `Chat` destacado con badge o icono brillante.
- Enlazar el botón flotante `C4Chatbot` hacia la vista completa `/chat`.

### Fase 4: Validación y Pruebas
- Verificar compilación (`pnpm build`), linter (`pnpm lint`) y pruebas (`pnpm test`).
- Validar enlaces documentales con `python scripts/verify_docs.py`.
