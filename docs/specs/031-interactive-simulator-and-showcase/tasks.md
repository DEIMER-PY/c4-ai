# Tareas: Simulador Interactivo y Documentación Enterprise
Fuente: [`docs/specs/031-interactive-simulator-and-showcase/spec.md`](spec.md) y [`docs/specs/031-interactive-simulator-and-showcase/plan.md`](plan.md).  
Responsable de integración: DEIMER-PY.  
Rama: `codex/feat-031-interactive-simulator-and-showcase`.

## Fase 1 — Componente Reactivo del Simulador
- [x] **T001**: Crear [`apps/website/src/components/interactive-simulator.tsx`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/apps/website/src/components/interactive-simulator.tsx) con soporte para 3 incidentes, diffs y matriz de evaluación; requisito FR-001, FR-002; archivos `apps/website/src/components/interactive-simulator.tsx`; aceptación AC-001; validación: renderizado local.
- [x] **T002**: Integrar simulador en [`apps/website/src/components/product-showcase.tsx`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/apps/website/src/components/product-showcase.tsx); requisito FR-001; archivos `apps/website/src/components/product-showcase.tsx`; aceptación AC-001; validación: inspección de pestañas.

## Fase 2 — Instaladores Universales y Documentación MDX
- [x] **T003**: Actualizar [`apps/website/src/content/install.ts`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/apps/website/src/content/install.ts) con scripts de 1 línea y atajos; requisito FR-004; archivos `apps/website/src/content/install.ts`; aceptación AC-001; validación: visualización de comando.
- [x] **T004**: Crear [`apps/website/src/content/docs/seguridad.mdx`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/apps/website/src/content/docs/seguridad.mdx); requisito FR-003; archivos `apps/website/src/content/docs/seguridad.mdx`; aceptación AC-002; validación: verify_docs.
- [x] **T005**: Crear [`apps/website/src/content/docs/atajos.mdx`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/apps/website/src/content/docs/atajos.mdx); requisito FR-003; archivos `apps/website/src/content/docs/atajos.mdx`; aceptación AC-002; validación: verify_docs.
- [x] **T006**: Registrar nuevas páginas en [`apps/website/src/content/docs/index.ts`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/apps/website/src/content/docs/index.ts); requisito FR-003; archivos `apps/website/src/content/docs/index.ts`; aceptación AC-002; validación: test de contenido vitest.

## Fase 3 — Pruebas y Validación
- [x] **T007**: Crear pruebas unitarias en `apps/website/src/components/interactive-simulator.test.tsx`; requisito FR-005; archivos `apps/website/src/components/interactive-simulator.test.tsx`; aceptación AC-003; validación: `pnpm test`.
- [x] **T008**: Registrar spec en [`docs/specs/README.md`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/docs/specs/README.md) y verificar enlaces; requisito FR-005; archivos `docs/specs/README.md`; aceptación AC-004; validación: `python scripts/verify_docs.py`.
