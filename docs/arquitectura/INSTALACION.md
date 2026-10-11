# Preparación local e instalación prevista
Existe el paquete inicial de contratos backend con pyproject.toml y uv.lock. No existe todavía API, dashboard ni Docker Compose ejecutable.
## Ahora
git clone https://github.com/DEIMER-PY/c4-ai.git
Repositorio privado: autenticarse con cuenta colaboradora. Ejecutar python scripts/setup_obsidian.py para preparar ajustes locales; luego abrir la carpeta en Obsidian una vez.
Abrir la carpeta del repositorio como bóveda Obsidian para navegar README, AGENTS, CLAUDE y docs; docs sola permite lectura de documentos internos.
Validar con Python 3: python scripts/verify_docs.py (solo biblioteca estándar).
## Al implementar
Backend actual: Python 3.12 y uv; ejecutar uv sync --locked y uv run --locked python -m unittest discover -s tests/unit -p 'test_*.py' -v. Santiago añadirá package.json/pnpm-lock.yaml al dashboard.
Docker Compose tendrá PostgreSQL, Redis, API y worker; dashboard podrá correr local con pnpm.
.env.example describe configuración prevista. Copiar a .env y completar fuera del repo; no publicar valores reales.
## Gateway del reto
Obtener documentación vigente del equipo organizador, base URL, modelo permitido y credencial. Probar solicitud mínima controlada desde backend y documentar compatibilidad/usage/error.
Sin endpoint/modelo/clave verificados, mantener mocks y no declarar conectividad real.
## Windows
Docker Desktop/WSL y runtimes se verificarán antes de instalar. No requieren instalarse para leer esta entrega.
Si trabajas en OneDrive, evita editar el mismo checkout desde dos equipos. Cada persona usa su clon; Git integra cambios.
