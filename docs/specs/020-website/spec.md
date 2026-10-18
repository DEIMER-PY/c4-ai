# Website de producto y documentación
ID: C4-UI-020. Estado: Draft. Responsable: Santiago/Claude. Revisores: Deimer.

## Problema y usuario
C4 AI ya cierra el ciclo con evidencia real (CLI, API, dashboard, Hermes), pero no tiene una página que explique qué hace, cómo se instala y cómo se usa. Público: desarrolladores que operan agentes, jueces del reto y equipos que evalúan adoptar C4. Necesitan entender la propuesta en segundos, instalarlo sin leer documentos internos y confiar en que lo mostrado es verificable.

## Alcance
Incluido: landing de producto y sección de documentación de uso en `apps/website`, con dirección visual inspirada en Cursor CLI (cursor.com/cli) y Kimi Code (kimi.com/code), pedida por Deimer: página clara y minimalista, titular centrado, comando de instalación con pestañas por sistema y botón copiar, ventana de producto grande con pestañas sobre un fondo con textura, y tarjetas hacia la documentación.

Excluido: publicación, dominio y hosting (pendientes de la decisión de privacidad de ENTREGA_S1), precios, registro/login, analítica, instalador de escritorio y cualquier llamada a modelos desde la web. No se copian textos, imágenes ni assets de las referencias; solo patrones de composición.

Dependencias: evidencia real de `c4 demo` (sesión del 2026-10-17, 5/6 → 6/6), capturas de `docs/assets`, guía del CLI (docs/arquitectura/CLI.md), API (apps/api/README.md), Hermes (docs/integraciones/HERMES.md) y el video de C4-008 de Deimer.

## Requisitos
FR-001: App Next.js (App Router, TypeScript, Tailwind) en `apps/website` con pnpm, lockfile y versiones exactas, exportable como sitio estático sin servidor.
FR-002: Hero centrado con titular, subtítulo, comando de instalación con pestañas (PowerShell / Linux-macOS) y copiar, y dos acciones: "Ver documentación" y "Ver demo".
FR-003: Vitrina de producto con pestañas Terminal (CLI), Dashboard y Hermes, mostrando capturas o transcripciones de ejecuciones reales con su procedencia visible (casos sintéticos, proveedor real, fecha).
FR-004: Secciones "Cómo funciona" (detectar → diagnosticar → candidato → evaluar → decidir) y "Evidencia, no promesas" con el resultado real 5/6 → 6/6, 0 regresiones, seguridad aprobada y costo desconocido.
FR-005: Integraciones y estado honesto: disponible solo lo verificado (Grok, Groq/Qwen como agente evaluado, Hermes MCP); lo demás como planificado (escritorio, Telegram/WhatsApp hasta su prueba, base de datos, workers).
FR-006: Documentación en `/docs` con navegación lateral: Introducción, Instalación, Configuración (.env sin valores), Primer ciclo (`c4 doctor`, `c4 demo`), CLI y consola, API local, Dashboard, Hermes, Límites y seguridad, Preguntas frecuentes.
FR-007: Espacio para el video de presentación de C4-008; mientras no exista, se muestra un estado "Próximamente" sin video simulado.
FR-008: Honestidad del contenido: ninguna métrica, cliente, testimonio, precio, descarga o capacidad que no exista; claves siempre como marcadores (`tu-clave`), nunca valores.
FR-009: Accesibilidad AA, navegación por teclado, `prefers-reduced-motion`, responsive 390/820/1440 sin scroll horizontal, metadata y Open Graph por página, contenido indexable (nada esencial solo en canvas o video).
FR-010: Calidad verificable: build estático, typecheck, lint, pruebas de los componentes con lógica (pestañas, copiar, navegación de docs) y capturas por viewport.

## Aceptación
AC-001: Dado un visitante en escritorio, cuando abre `/`, entonces entiende qué es C4 y ve el comando de instalación y la vitrina sin desplazarse más de una pantalla.
AC-002: Dado el hero, cuando cambia de pestaña de sistema y pulsa copiar, entonces el comando correcto queda en el portapapeles y un mensaje accesible lo confirma.
AC-003: Dada la vitrina, cuando recorre sus pestañas con teclado, entonces cada vista muestra una ejecución real con procedencia y fecha.
AC-004: Dado `/docs`, cuando sigue Instalación → Configuración → Primer ciclo en una máquina limpia con sus propias claves, entonces llega a `c4 doctor` exitoso sin consultar documentos internos.
AC-005: Dado cualquier texto del sitio, cuando se revisa contra la evidencia del repo, entonces no hay cifras, capacidades ni estados inventados y lo planificado está marcado como tal.
AC-006: Dado `pnpm build`, cuando termina, entonces genera el sitio estático sin errores y pasan typecheck, lint, pruebas y la revisión visual en 390/820/1440.

## Casos de error
Portapapeles bloqueado: mostrar el comando seleccionable y avisar que se copie a mano. Video no disponible: estado "Próximamente". JavaScript desactivado: el contenido y los comandos siguen visibles; solo se pierden las pestañas interactivas (se muestra la primera). Ruta de docs inexistente: 404 con enlace al índice.

## Dudas bloqueantes
CL-W01 (comando del hero): el repo es privado y no hay instalador público; hoy se instala con `git clone` + `uv sync`. ¿Mostramos esos pasos tal cual, o habrá un instalador (`uv tool install`, script) antes de publicar?
CL-W02 (idioma): ¿solo español, o español e inglés desde el inicio? Afecta estructura de rutas y contenido.
CL-W03 (dirección visual): las referencias son claras y minimalistas; el dashboard y el CLI son oscuros violeta/cian. Propuesta: sitio claro con acento violeta y ventanas de producto oscuras, para que la vitrina resalte. ¿De acuerdo?
CL-W04 (marca): ¿usamos el logo y banner de `docs/assets/c4-ai-banner.svg` o hay identidad nueva?

No bloquean construir: publicación, dominio y hosting (se deciden antes del deploy, no antes del código).

## Aprobación y cambios
Pendiente revisión de Deimer. Referencias pedidas por Deimer en chat del 2026-10-17: Cursor CLI y Kimi Code (preferida); Kiro como referencia secundaria.
