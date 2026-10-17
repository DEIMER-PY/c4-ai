# apps/cli
CLI Typer/Rich implementada en c4/cli.py, con servicio reutilizable en c4/services/reliability.py. Responsable: Deimer.

Leer [README principal](../../README.md) y reglas antes de implementar.

Instalar: `uv sync --locked`. Ejecutar desde la raíz: `uv run --locked c4 --help`, `uv run --locked c4 doctor`, `uv run --locked c4 demo`.

[Comandos, configuración, límites y evidencia](../../docs/arquitectura/CLI.md). [Especificación](../../docs/specs/007-cli-end-to-end/spec.md).

Grok se consulta realmente; casos de reembolsos sintéticos y acciones de prueba sin efectos externos. El modo JSON se activa antes del subcomando: `c4 --json demo`.

Consola interactiva: `uv run --locked c4 tui`; para Qwen `uv run --locked c4 --target-provider groq tui`. `/help` muestra comandos, `/runs` y `/report last` leen evidencia sin generar solicitudes. No se ejecutan comandos del sistema ni se guardan claves en el historial.
