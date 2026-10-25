# C4 AI — Desktop App (Tauri v2)

Aplicación de escritorio nativa multiplataforma para C4 AI construida con **Tauri v2** y Rust, ofreciendo un consumo de memoria mínimo (<40 MB RAM) y rendimiento acelerado por GPU.

## Características

- **Rendimiento Nativo**: Empaquetado ligero sin la sobrecarga de Chromium/Electron.
- **Multiplataforma**:
  - Windows: Instalador MSI y binario portable ejecutable (`.exe`).
  - macOS: Paquete universal `.dmg` y `.app` (Apple Silicon & Intel).
  - Linux: Paquetes `.deb` y `.AppImage`.
- **Aislamiento Seguro**: Content Security Policy (CSP) estricto con acceso restringido a la API local (`127.0.0.1:8000`).
- **Bandeja del Sistema (System Tray)**: Monitoreo en segundo plano de incidentes de confiabilidad con notificaciones del sistema operativo.

## Requisitos de Compilación

1. **Rust y Cargo**: `rustc >= 1.77.0`.
2. **Node / pnpm**: Para gestionar las dependencias de la CLI de Tauri.
3. **Dependencias del Sistema Operativo**:
   - Windows: Microsoft Visual Studio C++ Build Tools y WebView2 Runtime (incluido en Windows 10/11).
   - Linux: `libwebkit2gtk-4.1-dev`, `build-essential`, `curl`, `libssl-dev`.
   - macOS: Xcode Command Line Tools.

## Comandos

```bash
# Modo de desarrollo (conecta con el dashboard en vivo en localhost:3000)
pnpm --filter c4-desktop desktop:dev

# Compilar binarios de producción optimizados
pnpm --filter c4-desktop desktop:build
```

Los artefactos compilados se generan en `apps/desktop/src-tauri/target/release/bundle/`.
