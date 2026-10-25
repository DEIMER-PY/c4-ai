# Tareas: Empaquetado Multiplataforma Desktop (Tauri v2) y Automatización Visual Playwright
Fuente: [`docs/specs/033-desktop-tauri-playwright/spec.md`](spec.md) y [`docs/specs/033-desktop-tauri-playwright/plan.md`](plan.md).  
Responsable de integración: DEIMER-PY.  
Rama: `codex/feat-033-desktop-tauri-playwright`.

## Fase 1 — Andamiaje de Escritorio Nativo (Tauri v2)
- [x] **T001**: Crear [`apps/desktop/package.json`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/apps/desktop/package.json) y [`apps/desktop/README.md`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/apps/desktop/README.md); requisito FR-001, FR-002; archivos `apps/desktop/*`; aceptación AC-001; validación: validación sintáctica JSON.
- [x] **T002**: Crear la configuración Tauri en [`apps/desktop/src-tauri/tauri.conf.json`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/apps/desktop/src-tauri/tauri.conf.json), [`apps/desktop/src-tauri/Cargo.toml`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/apps/desktop/src-tauri/Cargo.toml) y [`apps/desktop/src-tauri/src/main.rs`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/apps/desktop/src-tauri/src/main.rs); requisito FR-001; archivos `apps/desktop/src-tauri/*`; aceptación AC-001; validación: tests unitarios.

## Fase 2 — Pipeline de Automatización Visual Playwright
- [x] **T003**: Implementar [`scripts/capture_visual_evidence.py`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/scripts/capture_visual_evidence.py) con soporte para resoluciones desktop/tablet/mobile y generación de metadatos SHA-256; requisito FR-003; archivos `scripts/capture_visual_evidence.py`; aceptación AC-002; validación: invocación `--help`.

## Fase 3 — Documentación de Arquitectura de Escritorio
- [x] **T004**: Redactar la arquitectura de escritorio en [`docs/arquitectura/DESKTOP.md`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/docs/arquitectura/DESKTOP.md); requisito FR-004; archivos `docs/arquitectura/DESKTOP.md`; aceptación AC-003; validación: verify_docs.

## Fase 4 — Pruebas, Registro y Verificación
- [x] **T005**: Crear [`tests/unit/test_desktop_packaging.py`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/tests/unit/test_desktop_packaging.py); requisito FR-005; archivos `tests/unit/test_desktop_packaging.py`; aceptación AC-004; validación: unittest.
- [x] **T006**: Registrar spec en [`docs/specs/README.md`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/docs/specs/README.md) y validar coherencia global; requisito FR-005; archivos `docs/specs/README.md`; aceptación AC-003; validación: `python scripts/verify_docs.py`.
