# API local de evidencia
Estado: consulta de checkpoints CLI implementada; escritura, PostgreSQL/Alembic y workers pendientes. Adaptador c4/api.py y servicio c4/services/evidence.py. [Spec014](../../docs/specs/014-evidence-api/spec.md).

Desde la raíz del repositorio:

```powershell
uv sync --locked
uv run --locked uvicorn c4.api:app --host 127.0.0.1 --port 8000
```

Abrir [OpenAPI interactivo local](http://127.0.0.1:8000/docs). En otra terminal:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
Invoke-RestMethod http://127.0.0.1:8000/api/v1/incidents
```

Lee artifacts/runs, el mismo almacén del CLI. Para otra carpeta definir `$env:C4_STORE = 'ruta'` antes de iniciar el proceso; esa selección no se lee desde .env. No requiere claves, realiza llamadas al proveedor ni modifica archivos. Un almacén nuevo devuelve listas vacías; ejecutar CLI por separado para generar evidencia. Evidencia inválida responde 503, no se oculta como lista vacía.

Implementado: GET /api/v1/agents, /incidents, /incidents/{id}, /runs/{id}, /jobs/{id}, /patches/{id}, /evaluations/{id} y /incidents/{id}/report. Listas: limit 1–100 (20 por defecto), cursor del next_cursor anterior y orden por ID. Los IDs de recursos se toman de las respuestas; no son intercambiables con la sesión CLI. Un reporte todavía no creado responde 404.

Errores code/message/retryable/details según [API v1](../../docs/arquitectura/API.md): 422 parámetros, 404 ausente y 503 evidencia incoherente (requiere revisión local, sin reintentos automáticos). Cache-Control: no-store. Se validan contratos, relaciones y gate de accepted sin modificar decisiones.

Solo desarrollo en localhost: sin autenticación de producción ni CORS habilitado. No exponer en 0.0.0.0 o túneles. Santiago ejecuta su propio clon/servidor; Next.js puede consultar desde el servidor. Los resultados CLI contienen predicciones reales sobre casos sintéticos, no trazas de producción. El dashboard sigue con fixtures hasta C4-006.

Pendientes: POST, jobs asíncronos, DB/migraciones, métricas y listados extra de parches/jobs requeridos por el overview; acordar estos últimos entre ambos responsables. C4-002/003 permanecen abiertas.
