# Tareas: website de producto y documentación
Fuente: [spec](spec.md) y [plan](plan.md). Responsable de integración: Santiago.

- [x] W-T01: Santiago — estudiar referencias (Cursor CLI, Kimi Code) y escribir spec/plan/tasks; FR-001–010.
- [ ] W-T02: Santiago — resolver CL-W01–W04 con Deimer y pasar la spec a Ready.
- [x] W-T03: Santiago — bootstrap `apps/website` (Next.js, pnpm, export estático, tokens de diseño); FR-001, FR-009; depende W-T02.
- [x] W-T04: Santiago — hero con comando y copiar; FR-002; AC-001, AC-002; depende W-T03.
- [x] W-T05: Santiago — vitrina de producto con pestañas y módulo de evidencia; FR-003, FR-004, FR-008; AC-003, AC-005; depende W-T03.
- [x] W-T06: Santiago — cómo funciona, integraciones, video y tarjetas de docs; FR-004, FR-005, FR-007; depende W-T05.
- [x] W-T07: Santiago — documentación MDX con navegación; FR-006; AC-004; depende W-T03.
- [x] W-T08: Santiago — pruebas, build estático, revisión de contenido y capturas 390/820/1440; FR-010; AC-005, AC-006; depende W-T04–W-T07.
- [ ] W-T09: Santiago — PR a develop con evidencia y revisión de Deimer antes del merge; depende W-T08.

W-T05 y W-T07 pueden avanzar en paralelo si no editan los mismos archivos.

## Evidencia y handoff
Tarea → rama `santiago/feat-020-website` → commits → PR → pruebas → aceptación. No marcar tareas sin evidencia.
