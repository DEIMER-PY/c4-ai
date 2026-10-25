# Experiencia Cyberpunk en CLI, Logotipos Pixel-Art y README Visual Enterprise
ID: C4-CORE-032. Estado: Draft. Responsable: DEIMER-PY. Revisores: Santiago/Claude.

## Problema y Usuario
Para posicionar a C4 AI como un referente de ingeniería de IA de primer nivel (al nivel de Claude, Codex, Kimi, AGY o Qwen), se requiere una identidad visual cohesiva, estética y memorable tanto en la consola interactiva (CLI) como en la carta de presentación principal del repositorio (`README.md`):
1. **Estética de la Neurona en Terminal**: La representación visual del CLI debe proyectar una identidad futurista y cyber-neuronal inspirada en AGY y Claude, con gradientes cromáticos vibrantes (magenta neón, cian cuántico, ámbar), indicadores de telemetría de alta densidad y un fallback pixel-art nítido para entornos ASCII.
2. **README.md de Clase Mundial**: El archivo `README.md` actual tiene bloques de texto denso y carece de un despliegue visual impactante. Se requiere integrar el logotipo en pixel-art de C4, insignias estilizadas para cada plataforma (CLI, Desktop, Website, Mobile), galerías de capturas y diagramas de arquitectura.
3. **Claridad Multiplataforma**: Presentar con transparencia el soporte en terminales Linux/macOS/Windows, interfaz web responsive, aplicación de escritorio y canales conversacionales (Telegram/WhatsApp).

Público objetivo: Jueces del Reto Agente, ingenieros de confiabilidad de IA, líderes técnicos y la comunidad open source.

## Alcance
- **Incluido**:
  - Rediseño de la neurona y arte visual en `c4/terminal_art.py`:
    - Núcleo neuronal de alta densidad con gradiente multicapa (magenta `#F43F5E` a cian `#06B6D4` con núcleo ámbar `#FCD34D`).
    - Arte ASCII pixel-cyber para compatibilidad total con terminales estándar sin soporte Unicode.
    - Cabecera en `c4/terminal.py` con telemetría visual, badges de estado (`[ONLINE]`, `[GATE: DETERMINISTA]`, `[PII: SANITIZADO]`) y separadores de energía.
  - Creación de activos visuales vectoriales pixel-art en `docs/assets/`:
    - `docs/assets/pixel-c4-logo.svg`: Logotipo C4 en estética pixel-art cyber-retro.
    - `docs/assets/badges/c4-cli-badge.svg`: Insignia para C4 CLI.
    - `docs/assets/badges/c4-desktop-badge.svg`: Insignia para C4 Desktop.
    - `docs/assets/badges/c4-website-badge.svg`: Insignia para C4 Website.
    - `docs/assets/badges/mobile-responsive-badge.svg`: Insignia de compatibilidad móvil / responsive.
  - Reestructuración completa de `README.md`:
    - Cabecera con banner, logotipo pixel-art e insignias de plataformas.
    - Matriz de soporte multiplataforma (CLI, Web, Desktop, Mobile, Canales).
    - Métodos de instalación universal de 1 línea (PowerShell, Bash, Docker).
    - Guía de inicio rápido con atajos de 1 letra (`c4 r`, `c4 d`, etc.) y comandos AGY.
    - Galería visual de arquitectura, ciberseguridad, pirámide de cumplimiento y simulador interactivo.
    - Tabla de estado de métricas y pruebas (172 pruebas automatizadas, 100% PASS).
  - Pruebas y validaciones con `scripts/verify_docs.py` y `test_terminal.py`.
- **Excluido**:
  - Modificación de la lógica interna del gate determinista.

## Requisitos
- **FR-001 (Neurona Cyberpunk en TUI)**: `c4/terminal_art.py` debe renderizar tanto el modo Unicode Braille de alta densidad como el modo ASCII retro-pixel preservando la anatomía del soma, dendritas y axón.
- **FR-002 (Cabecera de Telemetría TUI)**: `c4/terminal.py` muestra badges estilizados de seguridad, modelo en uso y estado del gate sin sobrecargar terminales estrechas (>=60 columnas).
- **FR-003 (Logotipo Pixel-Art e Insignias)**: Creación de los archivos SVG en `docs/assets/` y `docs/assets/badges/` conformes con las restricciones XML (sin scripts ni doctype).
- **FR-004 (README Visual Enterprise)**: `README.md` estructurado profesionalmente, enlazando todos los diagramas locales y documentaciones correspondientes.
- **FR-005 (Validación 100% Docs y Commits)**: `verify_docs.py` debe pasar sin advertencias en todos los enlaces y SVGs.

## Aceptación
- **AC-001**: `c4 tui` o `c4` en consola muestra la neurona estilizada con colores vibrantes y telemetría limpia.
- **AC-002**: El renderizado con `unicode=False` produce un arte ASCII pixel-sharp legible.
- **AC-003**: Todos los archivos SVG son válidos y `python scripts/verify_docs.py` aprueba al 100%.
- **AC-004**: La suite de tests unitarios pasa sin regresiones.

## Dudas Bloqueantes
- Ninguna.
