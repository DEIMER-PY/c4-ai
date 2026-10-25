// Comandos de instalación universal y ejecución rápida de C4 AI
export const REPO_URL = "https://github.com/DEIMER-PY/c4-ai.git";

export const INSTALL_COMMANDS = {
  powershell: `git clone ${REPO_URL}\ncd c4-ai; .\\scripts\\install.ps1`,
  unix: `git clone ${REPO_URL}\ncd c4-ai && bash ./scripts/install.sh`,
} as const;

export const FIRST_RUN = [
  "c4 d  # Valida configuración y proveedores (c4 doctor)",
  "c4 r  # Ejecuta el ciclo determinista completo (c4 demo)",
] as const;
