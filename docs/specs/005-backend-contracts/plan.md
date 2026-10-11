# Plan técnico del backend de contratos
Fuente: [spec](spec.md), [esquema v1](../../../examples/contracts/schemas.json).
Pydantic 2.13.5 verificado en Python 3.12 local. Tipos Literal/Annotated, extra forbid y validadores para integridad.
c4/schemas/contracts.py es implementación; c4/schemas/__init__.py expone interfaz pública Python.
pyproject.toml fija dependencia y uv.lock resolución; unit tests con unittest evitan infraestructura y credenciales.
Pruebas usan fixtures existentes, entradas adversas y relaciones cruzadas; no generan métricas de rendimiento.
CI añade uv sync --locked y unittest, además de docs/commits.
Primera parte de C4-002: persistencia, FastAPI y errores HTTP siguen pendientes.
