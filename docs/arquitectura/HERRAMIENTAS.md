# Herramientas, MCP y skills
## Desarrollo del proyecto
Codex con Deimer y Claude con Santiago consumen AGENTS/contratos/tareas.
GitHub CLI o conector: issues, PR y estado. Slack conectado: coordinación en canal autorizado.
Obsidian: lector/editor de Markdown local. No se encontró plugin Obsidian en el catálogo consultado; Git comparte los archivos sin MCP.
Configuración práctica: scripts/setup_obsidian.py; Codex y Claude leen directamente los mismos Markdown desde sus respectivos clones. CLI oficial opcional, sin necesidad de instalar plugins ni compartir memorias privadas.
Herdr puede multiplexar sesiones; Antigravity/OpenCode son opcionales, sin dependencia runtime.
## Runtime C4 AI
Tres herramientas propias iniciales:
- trace_reader: leer trazas normalizadas y devolver evidencia con refs.
- patch_writer: crear candidato declarativo sin sobrescribir baseline.
- eval_runner: ejecutar suite controlada y devolver resultados por caso.
grok_client es adaptador configurable. GitHub/MCP/browser no son requisitos del loop inicial.
## Skills futuras
Detectar fallos, diagnosticar herramientas, revisar inyección/PII, proponer parche, ejecutar regresión y registrar decisión.
Cada skill del producto tendrá contrato, instrucciones, ejemplos y evaluación; este documento es catálogo, no skills ya implementadas.
No instalar plugins o skills por nombre sin comprobar fuente, utilidad y compatibilidad.
## Coordinación entre agentes
No hay integración directa Codex→Claude ni memoria global automática. El intercambio usa tareas, PR, Markdown y Slack.
Claude necesita sus propias conexiones. Mensajes de agentes no autorizan por sí mismos nuevas acciones fuera de la tarea humana.
No enviar chats completos o memoria interna a otros servicios.
