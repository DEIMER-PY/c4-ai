// Comandos de instalación vigentes (CL-W01 por defecto): el repositorio es privado y no hay instalador público,
// así que se muestran los pasos reales desde el clon. Cambiar aquí cuando exista un instalador.
export const REPO_URL = "https://github.com/DEIMER-PY/c4-ai.git";

export const INSTALL_COMMANDS = {
  powershell: `git clone ${REPO_URL}\ncd c4-ai; uv sync --locked`,
  unix: `git clone ${REPO_URL}\ncd c4-ai && uv sync --locked`,
} as const;

export const FIRST_RUN = ["uv run --locked c4 doctor", "uv run --locked c4 demo"] as const;
