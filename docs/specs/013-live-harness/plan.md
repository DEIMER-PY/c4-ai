# Plan
Crear c4/terminal_screen.py con ContextVar para observador limitado al comando TUI y Rich Live. Reutilizar neuron y gate/servicios existentes. c4/cli.py delega progreso/emisión solo cuando existe una pantalla activa y nunca en JSON. Harness enlaza pantalla alrededor de ejecución; consola común sin cambios.

Archivos Deimer/Codex: c4/terminal_screen.py, c4/terminal.py, c4/cli.py, tests/unit/test_terminal_screen.py, docs/arquitectura/CLI.md, docs/equipo/ESTADO.md, índice specs. Sin cambios de contratos/frontend.

Pruebas de render y enrutamiento con gateway simulado; suite completa, verificación de documentación y preview a 132 columnas. PR hacia develop con CI.
