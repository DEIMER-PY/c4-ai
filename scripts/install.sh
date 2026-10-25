#!/usr/bin/env bash
# C4 AI — Universal 1-Line Installer for Linux and macOS
# Safe, non-destructive, zero-credential installation.
set -euo pipefail

echo "======================================================"
echo "          C4 AI — Harness & Reliability Suite         "
echo "======================================================"

# 1. Check Python version (>= 3.12)
if command -v python3 >/dev/null 2>&1; then
    PY_VER=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
    echo "[✓] Python detectado: $PY_VER"
else
    echo "[!] Error: Python 3 no está instalado. Instala Python >= 3.12."
    exit 1
fi

# 2. Check or install uv
if command -v uv >/dev/null 2>&1; then
    echo "[✓] uv detectado: $(uv --version)"
else
    echo "[*] Instalando uv (gestor ultrarrápido de paquetes)..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.cargo/bin:$PATH"
fi

# 3. Clone or sync workspace
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$SCRIPT_DIR"

echo "[*] Sincronizando dependencias con uv (locked)..."
uv sync --locked

# 4. Verify configuration
echo "[*] Verificando entorno C4 AI..."
if [ ! -f .env ] && [ -f .env.example ]; then
    echo "[*] Creando .env inicial desde .env.example..."
    cp .env.example .env
fi

uv run --locked c4 doctor

echo ""
echo "======================================================"
echo " [✓] Instalación completada exitosamente              "
echo "======================================================"
echo " Comandos listos para usar:"
echo "   - Consola interactiva:   uv run c4"
echo "   - Diagnóstico rápido:    uv run c4 d"
echo "   - Ciclo completo:        uv run c4 r"
echo "   - Servidor API:          uv run c4-api --port 8000"
echo "======================================================"
