# Plan
1. Crear http-data-source.ts validando respuestas con parsers existentes; componer report/patch desde referencias v1. Listas paginadas y caché limitada al render servidor; no snapshots globales persistentes.
2. data.ts selecciona api/demo con variables solo servidor. Overview tolera trabajos no soportados y entidades aún pendientes sin inventar resultados.
3. Rediseñar shell, overview, estilos y comparación responsive con paleta propia. Revisar checklist React al finalizar cambios TSX.
4. Tests Vitest, build/typecheck/lint, verify_docs y navegador local con API real; guardar capturas y evidencia saneada.

Ownership de esta feature autorizado por Deimer: apps/dashboard/src/lib/http-data-source.ts y tests, data.ts, overview.ts/tests, componentes shell/badge/nav, app pages/layout/globals.css y documentación SDD/equipo. Sin cambios de contratos ni frontend concurrente; revisión de Santiago recomendada sobre PR.

Hallazgo WinError64: añadir c4/server.py, entrada c4-api en pyproject/lock, tests/unit/test_server.py y documentación de arranque. SelectorEventLoop evita el fallo IOCP reproducido; verificar con HTTP concurrente local. No alterar c4/services/reliability.py ni el gate.
