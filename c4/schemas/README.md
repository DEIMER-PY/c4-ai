# c4/schemas
Contratos Pydantic implementados en contracts.py contra examples/contracts/schemas.json, sin cambiar el formato v1 del frontend.
Validan tipos, IDs, timestamps, conteos/regresiones y referencias. Agent es inmutable y cost_usd null sigue desconocido.
Pruebas: uv run --locked python -m unittest discover -s tests/unit -p 'test_*.py' -v.
Esto no implementa API, persistencia ni el gate completo del workflow.

Leer [README principal](../../README.md) y reglas antes de implementar.
