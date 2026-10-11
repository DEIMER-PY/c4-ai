# Colaboración privada y onboarding
ID: C4-TEAM-004. Estado: Ready. Responsable: Deimer/Codex.
Fuente: instrucciones de Deimer del 2026-10-11.
## Requisitos
FR-001: Repositorio y tablero privados, Santiago conserva write en repo y recibe WRITER en tablero con autorización explícita.
FR-002: Definir tareas de Santiago, orden, dependencias, criterios y prompt inicial de Claude.
FR-003: Obsidian abre el clon como bóveda; los Markdown se comparten mediante Git, no como copias de Drive.
FR-004: Preparar configuración local idempotente, sin instalar plugins ni publicar .obsidian.
FR-005: Revisar estados reales y distinguir listo, en curso y bloqueado por gateway.
FR-006: Cada feature usa SDD y merge mediante PR hacia develop; no hacer push directo.
## Aceptación
AC-001: APIs confirman privacidad; acceso de repo validado y concesión de tablero confirmada.
AC-002: Santiago puede seguir onboarding/prompt sin leer conversaciones privadas.
AC-003: Script prepara .obsidian/app.json y Git lo ignora.
AC-004: Guías explican compartir, acceso de los agentes y papel opcional de Drive/Slack/Sync.
AC-005: Enlaces, configuración, commits y CI válidos.
## Límites
No suscripciones, envío de email ni duplicación del dossier en Drive. No cambios globales de Obsidian.
No afirmar que Santiago se unió a Slack ni que leyó el onboarding si no se ha verificado.
