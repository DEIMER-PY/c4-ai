# C4 AI — Universal 1-Line Installer for Windows PowerShell
# Safe, non-destructive, zero-credential installation.
$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor Magenta
Write-Host "          C4 AI — Harness & Reliability Suite         " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Magenta

# 1. Check Python
try {
    $pyVer = python -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")'
    Write-Host "[✓] Python detectado: $pyVer" -ForegroundColor Green
} catch {
    Write-Host "[!] Advertencia: python no encontrado en PATH. Verifica la instalación de Python 3.12." -ForegroundColor Yellow
}

# 2. Check uv
if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    Write-Host "[*] Instalando uv mediante script oficial..." -ForegroundColor Cyan
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    $env:Path = "$env:USERPROFILE\.cargo\bin;" + $env:Path
} else {
    $uvVer = uv --version
    Write-Host "[✓] uv detectado: $uvVer" -ForegroundColor Green
}

# 3. Resolve directory & sync
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host "[*] Sincronizando dependencias con uv (locked)..." -ForegroundColor Cyan
uv sync --locked

# 4. Environment and verify
if (-not (Test-Path ".env") -and (Test-Path ".env.example")) {
    Write-Host "[*] Creando .env local inicial desde .env.example..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
}

Write-Host "[*] Verificando entorno C4 AI..." -ForegroundColor Cyan
uv run --locked c4 doctor

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host " [✓] Instalación completada exitosamente en Windows   " -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host " Comandos listos para usar:"
Write-Host "   - Consola interactiva:   uv run c4" -ForegroundColor Cyan
Write-Host "   - Diagnóstico rápido:    uv run c4 d" -ForegroundColor Cyan
Write-Host "   - Ciclo completo:        uv run c4 r" -ForegroundColor Cyan
Write-Host "   - Servidor API:          uv run c4-api --port 8000" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Green
