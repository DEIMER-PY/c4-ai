# Plan
1. Crear c4/services/evidence.py como servicio de consulta de checkpoints; validar tipos existentes, relaciones y gate de reportes aceptados. Buscar por ID con prefijo de sesión validado, sin interpolar rutas arbitrarias.
2. Adaptador c4/api.py con factory de app FastAPI, errores públicos saneados, modelos de respuesta y paginación. apps/api/README.md indica comando uvicorn y frontera de localhost.
3. Tests con TestClient y archivos temporales; smoke HTTP local contra evidencia existente. Fuente: [pruebas FastAPI](https://fastapi.tiangolo.com/tutorial/testing/) y [errores](https://fastapi.tiangolo.com/tutorial/handling-errors/).
4. Actualizar README, API.md, estado/backlog/rúbricas y onboarding técnico Santiago. PR hacia develop; no cambiar contratos incompatiblemente.

Ownership Deimer/Codex: c4/api.py, c4/services/evidence.py, tests/unit/test_api.py, pyproject.toml, uv.lock, apps/api/README.md y docs citadas. No editar apps/dashboard.
