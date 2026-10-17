# CLI de C4 AI
Estado: en desarrollo. Spec [007](../specs/007-cli-end-to-end/spec.md). Adaptador en c4/cli.py; servicios en c4/services/reliability.py y herramientas en c4/tools. Los contratos HTTP v1 siguen planificados: estos comandos operan sobre sesiones locales, no sobre un servidor API.

## Instalar y ejecutar
Desde la raíz del repositorio, con Python 3.12 y uv:

```powershell
uv sync --locked
# Solo si todavía no existe .env:
Copy-Item .env.example .env
# Editar .env local: clave del panel y modelo habilitado.
uv run --locked c4 doctor
uv run --locked c4 doctor --probe
uv run --locked c4 demo
```

doctor valida configuración sin red. --probe hace una solicitud real y consume créditos. demo realiza hasta 14 solicitudes con el dataset de seis casos: baseline inicial, diagnóstico/propuesta y seis pares baseline/candidato. Los límites predeterminados son 16 llamadas, 1024 tokens de salida por llamada y 600 segundos de sesión. No se implementa un límite monetario: las tarifas del gateway no están verificadas y cost_usd permanece null. El usuario debe comprobar sus créditos.

La terminal usa violeta/cian con Rich. La imagen de referencia compartida es una dirección visual; no representa la versión, métricas ni funciones implementadas. C4 AI conserva su nombre; la variante C4 CODE CLI no constituye un cambio de identidad aprobado.

## Ciclo por etapas
```powershell
uv run --locked c4 start
# Copiar el ID c4_<32 hex> mostrado:
uv run --locked c4 patch ID
uv run --locked c4 eval ID
uv run --locked c4 compare ID
uv run --locked c4 report ID
```

start crea la sesión, ejecuta baseline e investiga el incidente. analyze ID repite la inspección de una sesión existente solo si falta el diagnóstico. patch materializa el candidato propuesto. eval compara y decide. compare/report leen disco, funcionan sin clave y no consumen llamadas. Las operaciones completadas no se repiten al volver a consultar la misma sesión.

Opciones globales se escriben **antes** del comando:

```powershell
uv run --locked c4 --json demo
uv run --locked c4 --store artifacts/runs --json report ID
uv run --locked c4 --env-file .env demo --dataset datasets/sample/refunds.json --target refund_expired
```

JSON es un documento sin banners. Códigos: 0 operación completada/aceptación; 1 fallo técnico o evidencia incompleta por fallo; 2 candidato rechazado; 3 revisión humana sin fallo técnico. Los comandos de lectura reflejan el estado guardado. ID se refiere a una sesión CLI y agrupa run_id, incident_id y job_id, no sustituye esos identificadores en los contratos API.

## Evidencia
artifacts/runs/ID/evidence.json guarda snapshot/checksum del dataset, prompts, versiones, run, incidente, diff, evaluación por caso, reporte, solicitudes y límites. El almacén hace reemplazo atómico y bloqueo exclusivo por sesión. Una sesión fallida se conserva; para repetir deliberadamente la demo se crea otra sesión. No hay recuperación automática de workers ni sincronización entre equipos. Si se interrumpe el proceso durante una solicitud, evidence.lock queda como indicio: verificar que no sigue activo antes de retirarlo. Una solicitud que alcanzó el proveedor antes de una interrupción puede consumir créditos sin checkpoint; no se promete exactly-once.

Las herramientas reales son trace_reader (inspección), patch_writer (propuesta declarativa) y eval_runner (ejecución comparativa dentro del servicio). Las acciones del agente objetivo son **predicciones en un entorno de prueba**: no existe refund real, exportación ni ejecución de código. El dataset es sintético; las respuestas y tokens de Grok se consideran reales únicamente en las ejecuciones documentadas.

Baseline y candidato se evalúan sobre el mismo snapshot. El gate exige objetivo mejorado, mejora total, cero regresiones y aprobación de todos los casos de seguridad. Las validaciones no afirman seguridad general fuera del dataset. Los fallos de conexión/HTTP/JSON/límites preservan lo completado y requieren revisión.

## Fronteras pendientes
PostgreSQL/Alembic, FastAPI, Redis/RQ, API de evidencia para Santiago, TUI interactiva, instaladores y aplicación de escritorio se desarrollan en features posteriores. La CLI se instala desde el clon privado; no hay paquete público de instalación todavía.
