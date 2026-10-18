# Plan técnico: website de producto y documentación
Fuente: [spec](spec.md). Estado: Draft.

## Decisiones vinculadas a requisitos
FR-001 → Next.js App Router con `output: "export"` en `apps/website`, separado del dashboard: la web es pública y estática, el dashboard lee evidencia local por servidor. Mismas versiones exactas que apps/dashboard (Next 16.4.2, React 19.3.0, TS 5.9.3, Tailwind 4.3.3) para no duplicar mantenimiento. Alternativa descartada: rutas dentro del dashboard, porque mezclaría contenido público con datos locales y no permite export estático.
FR-002/FR-003 → Pestañas y copiar como Client Components pequeños (`"use client"` solo ahí); resto Server Components prerenderizados. Vitrina con capturas reales optimizadas (`next/image` con `unoptimized` por export estático) y transcripciones en HTML, no imágenes de texto.
FR-004/FR-005 → Cifras y estados en un único módulo de datos tipado (`src/content/evidence.ts`) con fuente y fecha de cada valor; los componentes no escriben números a mano.
FR-006 → Docs en MDX (`@next/mdx`) dentro de `src/content/docs`, con índice tipado para la navegación. Se escriben para usuarios y enlazan a los documentos canónicos del repo; no copian especificaciones internas. Alternativa: páginas TSX, descartada por mantenimiento del texto.
FR-007 → Componente de video que recibe la URL por configuración; sin URL muestra "Próximamente".
FR-009 → Tokens de diseño en CSS (`@theme`), tipografía con `next/font`, motion con CSS y `prefers-reduced-motion`; sin GSAP, Three.js ni Lenis: la composición de las referencias no los necesita.
FR-010 → Vitest + Testing Library para pestañas, copiar e índice de docs; build estático y revisión con Playwright en 390/820/1440.

## Contratos y datos
No consume API ni contratos v1. Evidencia citada: sesión `c4_6378409a…` (Grok, 14 llamadas, 5/6 → 6/6, 0 regresiones, seguridad aprobada, costo desconocido) y capturas de `docs/assets`. Antes de publicar, regenerar o confirmar esas cifras.

## Componentes y flujo
Layout (header, footer) → `/` (Hero, InstallCommand, ProductShowcase, HowItWorks, Evidence, Integrations, VideoSlot, DocsCards) → `/docs/[slug]` (DocsSidebar, contenido MDX, anterior/siguiente).

## Riesgos y límites
Promesas no verificables en la web (mitigación: módulo de evidencia y revisión AC-005). Comando de instalación sin decidir (CL-W01). Capturas con IDs o rutas locales: revisar que no expongan datos privados. Hosting y dominio quedan fuera hasta la decisión de privacidad.

## Validación
AC-001 → captura 1440 sin scroll del hero + vitrina. AC-002 → prueba de componente de copiar y revisión manual. AC-003 → prueba de pestañas con teclado. AC-004 → seguir la guía en una carpeta limpia hasta `c4 doctor`. AC-005 → checklist de contenido contra evidencia. AC-006 → `pnpm build`, typecheck, lint, test y capturas por viewport.

## Rollout
Rama `santiago/feat-020-website`, PR a develop con capturas y revisión de Deimer antes del merge. Sin despliegue público en esta feature.
