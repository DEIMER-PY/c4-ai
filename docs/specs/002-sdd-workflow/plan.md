# Plan técnico SDD
Fuente: [spec](spec.md).
## Decisiones
FR-001/002: specs dentro de docs/specs/<numero>-<feature>, para acceso desde Obsidian y GitHub.
FR-003: plan separado de intención; referenciar contratos existentes, no duplicarlos.
FR-004: tasks con identificadores y ownership; enlazar Issue/PR/commit al completar.
FR-005: actualizar AGENTS, CLAUDE y onboarding, manteniendo una sola política.
FR-006: añadir referencias a plantillas PR e Issues y matriz de evidencia.
## Estructura
Una guía docs/equipo/SDD.md, índice docs/specs/README.md y tres templates en docs/specs/templates.
La especificación marco del producto describirá MVP y escenarios, remitiendo a contratos y PRD.
## Riesgos
Specs desactualizadas: actualización en mismo PR que cambia conducta.
Duplicación de reglas: AGENTS remite a guía; CLAUDE remite a AGENTS.
Ceremonia excesiva: features pequeñas usan documentos breves, sin omitir criterios.
## Validación
Verificador documental actual comprueba enlaces/JSON; revisión humana comprueba traza FR/AC y dudas.
No afirmar que verificador Markdown valida semánticamente cumplimiento SDD.
