# SDD — desarrollo guiado por especificaciones
Metodología acordada por Deimer. La especificación es la fuente de intención; la implementación y pruebas deben cumplirla.
## Flujo obligatorio
1. Specify: escribir spec.md con usuario, problema, alcance, requisitos FR y aceptación AC.
2. Clarify: resolver dudas bloqueantes y confirmar límites con el responsable humano.
3. Plan: escribir plan.md con decisiones, contratos, riesgos y validación vinculados a FR.
4. Tasks: dividir tasks.md por responsable, archivos y dependencias.
5. Implement: trabajar por feature desde develop, usando commits convencionales con emojis.
6. Verify: adjuntar evidencia por AC, revisar y actualizar especificación cuando cambie conducta.
## Artefactos
[Índice](../specs/README.md). Por feature: docs/specs/<numero>-<feature>/spec.md, plan.md y tasks.md.
[Plantillas](../specs/templates/spec.md). No duplicar contratos: enlazar [API](../arquitectura/API.md).
Estados de spec: Draft, Ready, Implementing, Verified. Ready necesita aceptación del responsable y cero dudas bloqueantes.
Contrato/arquitectura compartidos necesitan revisión de ambos. Verified necesita evidencia de todos los AC relevantes.
## Paralelismo
Deimer/Codex y Santiago/Claude consumen misma spec y fixtures.
Marcar [P] solo cuando no comparten archivos ni dependen de resultados pendientes.
Si una tarea cambia contrato, actualizar spec/plan/fixture primero, comunicar impacto y después implementar.
## PR y feedback
PR enlaza spec, FR/AC afectados, tareas y evidencia. Cerrar Issue solo con aceptación comprobada.
Un bug se reproduce y actualiza spec/criterios antes o junto al fix; cambios urgentes conservan trazabilidad.
Slack comunica; GitHub/Markdown preservan acuerdos. Ningún agente interpreta el chat privado del otro como fuente automática.
## Herramientas
Esta adopción usa Markdown/Git y plantillas propias; no requiere instalar Spec Kit ni comandos /speckit.
Referencia metodológica: [GitHub Spec Kit — SDD](https://github.com/github/spec-kit/blob/main/spec-driven.md).
