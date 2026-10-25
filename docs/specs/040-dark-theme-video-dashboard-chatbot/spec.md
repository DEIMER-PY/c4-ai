# Spec 040: Dark Theme C4, Video YouTube, Chatbot ChatGPT-Style, SVGs de SO y Rediseño de Dashboard

## Contexto y Misión
El usuario solicita transformar la experiencia visual y funcional del ecosistema C4 AI:
1. **Paleta Oscura Oficial C4**: Eliminar el fondo blanco del sitio web que resulta agresivo a la vista, aplicando el tema oscuro nativo con colores de marca C4 (espacio profundo `#070b14`, acentos cian fluorescente `#06b6d4`, violeta eléctrico `#8b5cf6` y esmeralda de seguridad `#10b981`).
2. **Video de Demostración YouTube**: Integrar el video oficial del proyecto (`https://www.youtube.com/watch?v=DqAuvL8im9M`) directamente embebido dentro de la web con un marco moderno macOS con bordes luminosos y metadatos.
3. **Chatbot Web Inteligente (Estilo ChatGPT / Claude.ai)**: Implementar un asistente interactivo flotante en `apps/website` con soporte Markdown, chips de preguntas frecuentes, avatares diferenciados, streaming de respuestas y base de conocimiento profunda de C4 AI.
4. **SVGs Vectoriales de Sistemas Operativos y GitHub**: Incorporar iconos vectoriales nítidos para Windows, macOS y Linux para ilustrar la compatibilidad universal, además del enlace oficial al repositorio de GitHub con insignias.
5. **Dashboard Renovado e Intuitivo**: Actualizar `apps/dashboard` para operar en tema oscuro nativo por defecto, con métricas destacadas, insignias de estado y accesos rápidos ergonómicos.
6. **Documentación de GitHub con Capturas Reales**: Eliminar la sensación genérica del README y documentación mediante mockups y capturas visuales vectoriales de alta definición.

---

## Requisitos Funcionales (FR)
- **FR-001**: `apps/website` debe cargar por defecto en tema oscuro (`#070b14` / `#0b101d`) con tipografía de alto contraste y acentos neón sin destellos blancos.
- **FR-002**: `apps/website` debe embeber el video de YouTube `DqAuvL8im9M` en `VideoSlot` y en una pestaña del `ProductShowcase` con reproductor responsivo 16:9 y ventana macOS.
- **FR-003**: `apps/website` debe incorporar el componente `C4Chatbot` flotante estilo Claude.ai / ChatGPT con base de conocimiento, chips de preguntas rápidas y renderizado de bloques de código.
- **FR-004**: Crear iconos SVG vectoriales para Windows, macOS, Linux y GitHub en `apps/website/src/components/icons.tsx`.
- **FR-005**: `apps/dashboard` debe inicializarse en tema oscuro nativo (`dark`) con tarjetas KPI mejoradas e iconos de SO y enlace a GitHub en el topbar/sidebar.
- **FR-006**: Actualizar `README.md` con las insignias de SO, enlace al video de YouTube y mockups visuales detallados.

---

## Criterios de Aceptación (AC)
- **AC-001**: El sitio web compila sin errores (`pnpm build`) y pasa todas las pruebas unitarias (`pnpm test`).
- **AC-002**: El video de YouTube se visualiza y reproduce correctamente mediante un `iframe` responsivo con aislamiento de cookies (`youtube-nocookie.com`).
- **AC-003**: El chatbot permite abrir/cerrar, seleccionar chips de preguntas, escribir mensajes libres y recibir respuestas estructuradas en Markdown con bloques de código.
- **AC-004**: Los iconos SVG de Windows, Apple, Linux y GitHub se renderizan con precisión vectorial tanto en el header/hero como en el footer.
- **AC-005**: `apps/dashboard` compila y pasa sus 40 pruebas en Vitest.
- **AC-006**: `python scripts/verify_docs.py` pasa con cero errores.
