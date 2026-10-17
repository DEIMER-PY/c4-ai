# Preparación local e instalación prevista
Existen contratos, CLI y dashboard de demostración. [Guía del CLI ejecutable](CLI.md). API, PostgreSQL y Docker Compose siguen pendientes.
## Ahora
git clone https://github.com/DEIMER-PY/c4-ai.git
Repositorio privado: autenticarse con cuenta colaboradora. Ejecutar python scripts/setup_obsidian.py para preparar ajustes locales; luego abrir la carpeta en Obsidian una vez.
Abrir la carpeta del repositorio como bóveda Obsidian para navegar README, AGENTS, CLAUDE y docs; docs sola permite lectura de documentos internos.
Validar con Python 3: python scripts/verify_docs.py (solo biblioteca estándar).
## Al implementar
Backend actual: Python 3.12 y uv; ejecutar uv sync --locked y uv run --locked python -m unittest discover -s tests/unit -p 'test_*.py' -v. Dashboard: Node 24/pnpm 10.34.7; desde apps/dashboard ejecutar pnpm install --frozen-lockfile, pnpm build y pnpm start.
Docker Compose tendrá PostgreSQL, Redis, API y worker; dashboard podrá correr local con pnpm.
.env.example describe configuración del CLI y variables reservadas futuras. Copiar a .env solo si no existe y completar localmente; no publicar valores reales. Ejecutar uv run --locked c4 doctor y después c4 demo.
## Gateway del reto
Obtener documentación vigente del equipo organizador, base URL, modelo permitido y credencial. Probar solicitud mínima controlada desde backend y documentar compatibilidad/usage/error.
La sesión del 2026-10-17 verificó Grok; [evidencia y límites](../producto/ENTREGA_S1.md). Cada colaborador necesita su propia configuración local; ningún secreto se comparte mediante Git.
## Windows
Docker Desktop/WSL y runtimes se verificarán antes de instalar. No requieren instalarse para leer esta entrega.
Si trabajas en OneDrive, evita editar el mismo checkout desde dos equipos. Cada persona usa su clon; Git integra cambios.
