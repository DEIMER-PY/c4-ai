# Plan
Conservar Typer para automatización y Rich para render; prompt-toolkit añade entrada/autocompletado. Implementar c4/terminal.py con renderer responsive y router limitado de comandos; c4/cli.py adapta cada comando a la misma aplicación. Arranque sin solicitudes ni generación oculta.

Listados leen checkpoints del Store; no ejecutar ni reparar sesiones antiguas. Exportar preview desde los mismos objetos Rich con datos locales reales, solo en artifacts ignorados. Validación por CliRunner/transportes controlados y ensayo PTY de /help, /runs y /quit.

Auditoría documental por issue: objetivo original, responsable, criterios separados, evidencia y siguiente acción. GitHub permanece fuente de estado; docs/equipo/RUBRICAS.md conserva matriz revisable. Jev se registra como próximo experimento opcional con API TypeSafe y validación de probabilidades/latencia; sin credencial no se hacen llamadas.

Archivos: c4/terminal.py, c4/cli.py, tests/unit/test_terminal.py, pyproject.toml, uv.lock, README.md, apps/cli/README.md, docs/arquitectura/CLI.md, docs/equipo/{ESTADO,BACKLOG,RUBRICAS,PLAN_SANTIAGO,PROMPT_CLAUDE}.md, docs/producto/JEV.md, docs/README.md, docs/specs/README.md y esta carpeta. Ediciones de issues/tablero conforme auditoría. No cambiar código frontend ni memoria privada.
