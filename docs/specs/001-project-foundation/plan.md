# Plan del marco funcional
Fuente: [spec](spec.md).
## Decisiones existentes
[Arquitectura](../../arquitectura/ARQUITECTURA.md), [stack](../../arquitectura/STACK.md), [datos](../../arquitectura/DATOS.md), [contratos](../../arquitectura/API.md).
FR-001/006: Pydantic y servicios compartidos, PostgreSQL/JSONB y adaptadores API/CLI.
FR-002/003: Inspector/Diagnoser/Patcher con herramientas tipadas y versiones inmutables.
FR-004/005: Evaluator + Sentinel + gate determinista; [protocolo](../../arquitectura/EVALUACIONES.md).
FR-007: Dashboard Next.js consumiendo mismos contratos; fixtures como puente.
FR-008: Redis/RQ, etapas persistidas, límites de ejecución.
## Validación
[Demo/aceptación](../../producto/DEMO.md) y [seguridad](../../arquitectura/SEGURIDAD.md).
Formalizar spec/plan específicos antes de implementar cada tarea funcional del backlog.
No es un plan de desplegar servicios en esta entrega documental.
