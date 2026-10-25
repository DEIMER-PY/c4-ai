# Empaquetado Multiplataforma Desktop (Tauri v2) y Automatización Visual Playwright
ID: C4-CORE-033. Estado: Draft. Responsable: DEIMER-PY. Revisores: Santiago/Claude.

## Problema y Usuario
Los operadores de confiabilidad y evaluadores del Reto Agente requieren acceder a C4 AI como una aplicación nativa de escritorio sin fricciones de navegadores ni terminales abiertas continuamente, así como un pipeline determinista de capturas visuales para documentar el comportamiento del sistema sin intervención manual:
1. **Acceso de Escritorio Autónomo**: Desplegar C4 AI en Windows, macOS y Linux mediante un binario nativo ligero (Tauri v2) con aceleración por hardware, bandeja del sistema (System Tray), notificaciones de incidentes críticos y consumo mínimo de memoria (<40 MB RAM frente a >300 MB de Electron).
2. **Automatización de Evidencia Visual con Playwright**: Generar capturas de pantalla de alta fidelidad de la terminal, el dashboard y el simulador interactivo de forma desatendida mediante Playwright CLI, asegurando que toda evidencia gráfica citada en la documentación cuente con verificación determinista y sellado de integridad.

Público objetivo: Ingenieros de confiabilidad de IA (SREs), equipos de auditoría y jurados del Reto Agente.

## Alcance
- **Incluido**:
  - Estructura y configuración de Tauri v2 en `apps/desktop/`:
    - `apps/desktop/src-tauri/tauri.conf.json`: Configuración de ventana (1280x860), identificación de aplicación `com.c4ai.desktop`, menú nativo, aceleración gráfica y permisos de seguridad (CSP estricto).
    - `apps/desktop/src-tauri/Cargo.toml`: Dependencias del ecosistema Tauri v2 en Rust.
    - `apps/desktop/src-tauri/src/main.rs`: Punto de entrada nativo que inicializa la ventana del runtime y el enlace a la API local de C4 AI.
    - `apps/desktop/package.json`: Scripts de empaquetado `pnpm desktop:dev` y `pnpm desktop:build`.
    - `apps/desktop/README.md`: Guía de compilación nativa para Windows (`.msi`, `.exe`), macOS (`.dmg`) y Linux (`.deb`, AppImage).
  - Pipeline de automatización visual con Playwright CLI en `scripts/capture_visual_evidence.py`:
    - Script ejecutable en modo headless con Playwright para capturar vistas responsive (Desktop 1920x1080, Tablet 768x1024, Mobile 375x812).
    - Almacenamiento estructurado en `docs/assets/showcase/` con metadatos JSON de resolución, timestamp y hash SHA-256.
  - Documentación de arquitectura de escritorio en `docs/arquitectura/DESKTOP.md`.
  - Pruebas unitarias de validación en `tests/unit/test_desktop_packaging.py`.
  - Registro de spec en `docs/specs/README.md` y validación con `scripts/verify_docs.py`.
- **Excluido**:
  - Compilación cruzada en la máquina local si Rust o herramientas de plataforma no están instaladas (se provee el andamiaje completo para compilación en CI).

## Requisitos
- **FR-001 (Configuración Tauri v2)**: `apps/desktop/src-tauri/tauri.conf.json` debe definir una ventana principal segura de 1280x860, título oficial y soporte multiplataforma.
- **FR-002 (Scripts de Empaquetado)**: `apps/desktop/package.json` expone comandos estándar de desarrollo y empaquetado.
- **FR-003 (Capturador Visual Playwright)**: `scripts/capture_visual_evidence.py` valida la presencia de Playwright, soporta parámetros CLI (`--url`, `--output`, `--viewport`) y genera metadatos de fidelidad.
- **FR-004 (Documentación de Arquitectura Desktop)**: `docs/arquitectura/DESKTOP.md` explica la arquitectura híbrida (WebView2 / WebKit / WebKitGTK), comunicación IPC y almacenamiento seguro de tokens.
- **FR-005 (Pruebas Automatizadas)**: `tests/unit/test_desktop_packaging.py` valida la sintaxis de los archivos JSON/TOML y la CLI de Playwright.

## Aceptación
- **AC-001**: Los archivos `tauri.conf.json`, `Cargo.toml` y `package.json` son sintácticamente válidos.
- **AC-002**: El script `scripts/capture_visual_evidence.py` se ejecuta con `--help` y emite el contrato esperado sin fallos de importación.
- **AC-003**: `python scripts/verify_docs.py` confirma 100% de enlaces y esquemas válidos.
- **AC-004**: 100% de la suite de pruebas aprobada sin regresiones.

## Dudas Bloqueantes
- Ninguna.
