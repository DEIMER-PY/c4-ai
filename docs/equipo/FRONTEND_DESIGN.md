# Guía frontend de C4 AI

Aplicación de la [skill entregada por Deimer](../referencias/FRONTEND_SKILL.md), revisada2026-10-17. Es una referencia de selección; las reglas comunes y los criterios SDD del repositorio siguen gobernando el trabajo. Responsable de UX/frontend: Santiago/Claude; Deimer revisa integración y evidencia.

## Stack seleccionado y rectificaciones

| Capa | Selección en este proyecto | Aplicación |
|---|---|---|
| Framework | Next.js App Router + React + TypeScript | Conservar componentes de servidor para cargar evidencia y cliente para interacción local |
| Estilos | Tailwind y variables CSS | Tokens únicos para superficies, acentos y estados; respetar personalización local |
| Componentes | shadcn/ui con Base UI instalado | Reutilizar componentes existentes; el botón actual importa @base-ui/react/button. La mención genérica a Radix en la skill no describe esta instalación |
| Iconos | Lucide | Familia consistente; ocultar iconos decorativos a lectores de pantalla y nombrar los botones |
| Gráficos | Comparación existente y datos trazables | No inventar series de tiempo ni métricas de producción para rellenar widgets de una plantilla |
| Animación | CSS puntual y reduced-motion actual | Añadir Motion únicamente cuando una interacción lo justifique; GSAP para una secuencia compleja identificada, no ambos por defecto |
| Referencia visual | Figma Mega Chart Kit / violeta-cian C4 | [Alcance verificado](../referencias/FIGMA_DASHBOARD.md); no confundir portada con dashboard editable |

Astro, Nuxt y SvelteKit son opciones para otros casos de uso, no migraciones acordadas. Aceternity, Magic UI, React Bits, Lottie y Spline son recursos opcionales: evaluar necesidad, accesibilidad, licencia y peso antes de incorporarlos. No instalar varias familias de iconos ni motores de animación por catálogo. Lenis/Locomotive y efectos3D no son necesarios para consultar incidentes/evidencia. Remotion pertenece al video y no se agrega al bundle del dashboard.

## Criterios de diseño y validación

1. Mantener jerarquía clara: resumen real, incidentes, comparación por caso y evidencia. Formularios y colores editables deben explicar dónde se guardan sus cambios.
2. Distinguir API real, modo Demo y simulación local; costos desconocidos continúan como Desconocido. Ningún control visual cambia baseline, parche o decisión del gate.
3. Verificar desktop/tablet/móvil, ausencia de overflow, teclado, foco visible, etiquetas, tablas legibles y estados vacío/cargando/error. Revisar contraste después de personalizar colores, incluidos badges y gráficos; el cálculo de texto por sí solo no certifica toda la pantalla.
4. Animar únicamente cambios que ayuden a comprender estado o navegación. Respetar prefers-reduced-motion, evitar animaciones decorativas continuas en tablas y no transmitir progreso ficticio.
5. Consultar galerías como inspiración, no como aprobación de licencia ni sustituto de pruebas. Descargar solo recursos necesarios y conservar su procedencia; ninguna URL temporal Figma en producción.
6. Cerrar una tarea con build, tipos, lint, pruebas pertinentes y revisión visual de sus AC. Si el entorno bloquea una comprobación, registrarla como pendiente; no reutilizar una captura antigua como prueba de una interfaz nueva.

## Orden para Santiago

Leer AGENTS.md, estado/backlog, esta guía, API y spec023 antes de editar. Revisar los cambios locales de personalización con Deimer para evitar editar el mismo archivo simultáneamente. Continuar C4-006 sobre el adaptador HTTP existente: contratos de jobs/métricas aún requieren acuerdo; una librería visual no crea esos endpoints.

Feature desde develop, commits `type(scope): emoji descripción`, PR hacia develop y revisión cruzada. No se modifican contratos por adoptar esta referencia. Esta revisión conserva dependencias instaladas y no afirma una nueva validación visual del dashboard.
