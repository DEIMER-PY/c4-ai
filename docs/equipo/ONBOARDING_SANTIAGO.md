# Santiago + Claude — retomar el proyecto

Actualizado 2026-10-17. C4-004 está terminada y la integración de lectura API de PR29 ya existe; no rehacerlas.

1. Actualizar el clon privado en develop sin sobrescribir cambios. Leer [AGENTS](../../AGENTS.md), [CLAUDE](../../CLAUDE.md), [estado](ESTADO.md), [backlog](BACKLOG.md) y [API](../arquitectura/API.md).
2. Leer [plan actual](PLAN_SANTIAGO.md), [prompt Claude](PROMPT_CLAUDE.md), specs016–019 y [reporte S1](../entregas/S1_REPORTE_TECNICO.md).
3. Continuar #6 con la spec de capacidades pendientes; coordinar contratos jobs/métricas/candidatos antes de implementarlos. Mantener ownership de apps/dashboard y cambios compartidos con revisión.
4. Probar API/dashboard con [guía ordenada](PRUEBAS_INTEGRACIONES.md). Los checkpoints artifacts/runs no viajan por Git: ejecutar demo propio o usar modo Demo explícito. Sin claves en frontend.
5. Revisar #8: fuente de video y render local de120s preparados; presentación/ensayo/alojamiento pendientes. No publicar sin acuerdo.

Ramas santiago/feat-<id>-<tema> desde develop, commits convencionales con emoji y PR→develop. Cada feature con spec/plan/tasks, FR/AC, archivos, validación y bloqueos. Ejecutar pnpm test/typecheck/lint/build. No push directo a develop/main.

## Confirmaciones humanas pendientes
En #12 confirmar Slack, acceso al clon y bóveda Obsidian. Ejecutar `python scripts/setup_obsidian.py` y abrir la **raíz del clon** como bóveda; leer docs/README.md. [Guía Obsidian](OBSIDIAN.md). Git es fuente de verdad; no copiar specs a Drive ni compartir claves. Claude utiliza sus conexiones y el contexto versionado, no la memoria privada de Codex.
