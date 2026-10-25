# Plan 040: Dark Theme C4, Video YouTube, Chatbot ChatGPT-Style, SVGs de SO y Rediseño de Dashboard

## Enfoque de Implementación

### Fase 1: Paleta C4 Dark Mode y Tipografía
- Actualizar `apps/website/src/app/globals.css` para redefinir los tokens de color `:root` a la paleta espacial oscura de C4 (`#070b14` papel base, `#0d1322` superficies elevadas, `#1e293b` bordes, `#f8fafc` texto principal, `#06b6d4` cian y `#8b5cf6` violeta).
- Asegurar que la documentación `/docs` y el layout utilicen fondos oscuros de alto contraste sin deslumbrar al usuario.

### Fase 2: Componente de Iconos Vectoriales (Windows, macOS, Linux, GitHub)
- Crear `apps/website/src/components/icons.tsx` con componentes SVG nativos (`WindowsIcon`, `AppleIcon`, `LinuxIcon`, `GithubIcon`, `YouTubeIcon`, `BotIcon`).
- Añadir el selector/insignia de compatibilidad multiplataforma en `apps/website/src/components/install-command.tsx` y en el footer.
- Añadir enlace al repositorio de GitHub en el header con icono y contador/badge.

### Fase 3: Integración de Video YouTube
- Actualizar `VideoSlot` en `apps/website/src/components/landing-sections.tsx` con un contenedor 16:9 estilizado con cabecera macOS (`🔴 🟡 🟢`) y `iframe` de `https://www.youtube-nocookie.com/embed/DqAuvL8im9M`.
- Agregar pestaña de video en `ProductShowcase`.

### Fase 4: Chatbot Web Interactivo (Estilo ChatGPT / Claude.ai)
- Crear `apps/website/src/components/c4-chatbot.tsx`:
  - Botón flotante en la esquina inferior derecha con pulso de estado activo.
  - Modal o panel conversacional con cabecera, selector de modelo simulado (`Grok-4.7 Reliability Agent`), botones de minimizar y limpiar chat.
  - Chips de preguntas rápidas sugeridas.
  - Hilo de mensajes con avatar C4 vs Usuario, formato Markdown de respuestas y bloques de código con botón de copia.
  - Motor de respuestas context-aware para responder dudas de instalación, arquitectura, costos, benchmark y seguridad.
- Montar `C4Chatbot` en `apps/website/src/app/layout.tsx`.

### Fase 5: Rediseño Visual de `apps/dashboard`
- Actualizar `apps/dashboard/src/app/globals.css` para que el tema oscuro sea el predeterminado con gradientes neón y tarjetas KPI nítidas.
- Agregar insignias de SO e hipervínculo a GitHub en el sidebar y topbar.

### Fase 6: Actualización de README y Documentación
- Actualizar `README.md` con enlaces directos al video de YouTube, capturas visuales, insignias de sistemas operativos y detalles del asistente interactivo.
- Validar enlaces y fixtures con `python scripts/verify_docs.py`.
- Ejecutar tests de frontend (`apps/website`, `apps/dashboard`) y backend.
