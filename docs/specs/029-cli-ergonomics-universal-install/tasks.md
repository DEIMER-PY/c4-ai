# Tareas: Ergonomía de CLI e Instalación Universal
Fuente: [`docs/specs/029-cli-ergonomics-universal-install/spec.md`](spec.md) y [`docs/specs/029-cli-ergonomics-universal-install/plan.md`](plan.md).  
Responsable de integración: DEIMER-PY.  
Rama: `codex/feat-029-cli-ergonomics-universal-install`.

## Fase 1 — Atajos de 1 Letra y Lanzador Intuitivo
- [x] **T001**: Implementar alias de 1 letra (`r`, `d`, `s`, `i`) en [`c4/cli.py`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/c4/cli.py); requisito FR-001; archivos `c4/cli.py`; dependencias ninguna; aceptación AC-001, AC-002; validación: invocación en línea de comandos.
- [x] **T002**: Asegurar lanzamiento predeterminado del TUI interactivo al invocar `c4` sin argumentos en TTY; requisito FR-003; archivos `c4/cli.py`; dependencias T001; aceptación AC-001; validación: test de CliRunner sin argumentos.

## Fase 2 — Nuevos Comandos Slash Inspirados en AGY
- [x] **T003**: Implementar comandos `/diff` y `/cost` en [`c4/terminal.py`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/c4/terminal.py); requisito FR-002; archivos `c4/terminal.py`; dependencias ninguna; aceptación AC-003, AC-004; validación: tests de comandos en TUI.
- [x] **T004**: Implementar comandos `/plan` y `/goal` con bucle reflexivo de reintentos; requisito FR-002; archivos `c4/terminal.py`, `c4/services/reliability.py`; dependencias T003; aceptación AC-003; validación: simulación de bucle reflexivo.

## Fase 3 — Instaladores Universales y Docker
- [x] **T005**: Crear script universal para Linux y macOS [`scripts/install.sh`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/scripts/install.sh); requisito FR-004; archivos `scripts/install.sh`; dependencias ninguna; aceptación AC-005; validación: prueba sintáctica bash.
- [x] **T006**: Crear script universal para Windows PowerShell [`scripts/install.ps1`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/scripts/install.ps1); requisito FR-005; archivos `scripts/install.ps1`; dependencias ninguna; aceptación AC-005; validación: prueba en PowerShell local.
- [x] **T007**: Crear `Dockerfile` multicapa con Python 3.12 y uv; requisito FR-006; archivos `Dockerfile`; dependencias ninguna; aceptación AC-005; validación: lint del Dockerfile.
- [x] **T008**: Actualizar suite de tests, documentación y verificación de enlaces; requisito FR-006; archivos `tests/unit/test_terminal.py`, `docs/specs/README.md`; dependencias T001-T007; aceptación AC-006; validación: `python scripts/verify_docs.py` y suite de tests 100% aprobada.
