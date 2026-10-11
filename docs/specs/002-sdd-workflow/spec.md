# Adopción SDD
ID: C4-SDD-002. Estado: preparación metodológica verificada; revisión de onboarding por Santiago pendiente. Aprobación de alcance: instrucción de Deimer el 2026-10-11.
Responsable: Deimer/Codex. Revisión compartida: Santiago/Claude.
## Objetivo
Que cada feature se desarrolle a partir de una especificación versionada y criterios verificables, manteniendo alineados a ambos agentes.
## Requisitos
- FR-001: Cada feature crea spec.md, plan.md y tasks.md antes de implementar.
- FR-002: La especificación define problema, usuario, alcance, requisitos identificados, escenarios de aceptación y dudas.
- FR-003: El plan enlaza decisiones técnicas y contratos a requisitos, con riesgos y validación.
- FR-004: Las tareas identifican responsable, archivos, dependencias y evidencia; [P] solo para tareas independientes.
- FR-005: Codex y Claude leen la spec y registran cambios de alcance antes de implementarlos.
- FR-006: PR enlaza spec y evidencia; feature no se considera verificada por completar documentos solamente.
## Alcance
Metodología, plantillas, reglas compartidas y traza inicial. No instalar Spec Kit ni generar aplicación en esta feature.
## Aceptación
AC-001: Un integrante puede iniciar una feature con tres plantillas enlazadas.
AC-002: AGENTS y CLAUDE remiten a las mismas reglas SDD.
AC-003: Tarea ejemplo tiene requisitos→tareas→validación.
AC-004: Spec en Draft o con dudas bloqueantes no autoriza implementación dependiente.
AC-005: Documentación y commits cumplen validaciones del repo.
## Cambios
Los requisitos del usuario gobiernan; contratos compartidos requieren revisión de ambos. Errores del producto actualizan primero spec/plan y luego código.
La documentación previa se registra como contexto recuperado, sin afirmar que fue creada con SDD desde el inicio.
