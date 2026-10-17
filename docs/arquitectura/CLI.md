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

demo no abre el navegador ni el dashboard. En modo humano muestra inmediatamente sesión/ruta, las etapas y el número real de respuestas de evaluación guardadas (0/12 a 12/12). Una terminal interactiva también muestra un indicador con tiempo transcurrido durante las esperas de Grok. Puede transcurrir tiempo sin una nueva respuesta; no volver a lanzar la demo para comprobarlo, porque cada ejecución crea una sesión y consume créditos. La ejecución de referencia tomó aproximadamente 105 segundos, sin garantizar ese tiempo para otras solicitudes.

Ctrl+C marca la sesión nueva como failed con error cancelled, conserva evidencia parcial y termina con código 130. El proveedor puede haber consumido la solicitud ya enviada. Este manejo no modifica retroactivamente sesiones antiguas que quedaron running: consultar su reporte no prueba que exista un proceso activo.

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

JSON es un documento sin banners ni progreso; se imprime al terminar. Códigos: 0 operación completada/aceptación; 1 fallo técnico o evidencia incompleta por fallo; 2 candidato rechazado; 3 revisión humana sin fallo técnico; 130 cancelación con Ctrl+C. Los comandos de lectura reflejan el estado guardado. ID se refiere a una sesión CLI y agrupa run_id, incident_id y job_id, no sustituye esos identificadores en los contratos API.

## Evidencia
artifacts/runs/ID/evidence.json guarda snapshot/checksum del dataset, prompts, versiones, run, incidente, diff, evaluación por caso, reporte, solicitudes y límites. El almacén hace reemplazo atómico y bloqueo exclusivo por sesión. Una sesión fallida se conserva; para repetir deliberadamente la demo se crea otra sesión. No hay recuperación automática de workers ni sincronización entre equipos. Si se interrumpe el proceso durante una solicitud, evidence.lock queda como indicio: verificar que no sigue activo antes de retirarlo. Una solicitud que alcanzó el proveedor antes de una interrupción puede consumir créditos sin checkpoint; no se promete exactly-once.

Las herramientas reales son trace_reader (inspección), patch_writer (propuesta declarativa) y eval_runner (ejecución comparativa dentro del servicio). Las acciones del agente objetivo son **predicciones en un entorno de prueba**: no existe refund real, exportación ni ejecución de código. El dataset es sintético; las respuestas y tokens de Grok se consideran reales únicamente en las ejecuciones documentadas.

Baseline y candidato se evalúan sobre el mismo snapshot. El gate exige objetivo mejorado, mejora total, cero regresiones y aprobación de todos los casos de seguridad. Las validaciones no afirman seguridad general fuera del dataset. Los fallos de conexión/HTTP/JSON/límites preservan lo completado y requieren revisión.

## Fronteras pendientes
PostgreSQL/Alembic, FastAPI, Redis/RQ, API de evidencia para Santiago, instaladores y aplicación de escritorio se desarrollan en features posteriores. La CLI se instala desde el clon privado; no hay paquete público de instalación todavía.

## Modelo evaluado independiente
C4 diagnostica/proporciona candidatos con Grok. Para evaluar Qwen en Groq, configurar GROQ_API_KEY y C4_GROQ_MODEL en .env; ejecutar `uv run --locked c4 --target-provider groq doctor` y `uv run --locked c4 --target-provider groq demo`. El proveedor elegido se aplica por igual al baseline y al candidato. --target-provider va antes del comando. Sin opción se conserva Grok; C4_TARGET_PROVIDER permite elegir el valor por defecto como variable del proceso PowerShell (`$env:C4_TARGET_PROVIDER = "groq"`); escribirla solo en .env no selecciona el target al parsear los argumentos. Para este flujo usar siempre --target-provider groq.

Los límites se comparten entre proveedores. doctor --probe consume una solicitud por gateway distinto (dos al seleccionar Groq). JSON/evidencia registran target_provider y proveedor/modelo por llamada. Qwen usa el mismo esquema estricto de acciones en ambas versiones; modelos Groq no documentados con strict usan JSON object con validación local. Una respuesta inválida sigue siendo fallo, nunca aprobación.

[Fuente, configuración y validación Groq](../referencias/GROQ.md).

## Consola interactiva
Ejecutar `uv run --locked c4 tui` o `uv run --locked c4 --target-provider groq tui`. En una terminal interactiva `c4` sin argumentos abre la misma consola; en una redirección muestra ayuda. --json requiere un subcomando y nunca abre la UI.

La cabecera usa una neurona original de alta densidad en caracteres Braille Unicode: dendritas, núcleo luminoso y axón segmentado con gradiente magenta/violeta/cian. No requiere imágenes inline ni conexión. En codificaciones incompatibles o terminales legacy usa ASCII. Desde 116 columnas, composición lateral con contexto/actividad a la derecha; en estrechas, neurona compacta apilada. La altura del arte lateral se adapta al terminal. Versión/modelos y última evidencia son reales; la conexión se comprueba con /doctor --probe, nunca se simula. Colores dependen del soporte del terminal y sus preferencias. Prompt con Tab para comandos e historial privado en memoria, sin persistencia en Git.

- /help: comandos y límites; /clear: redibujar; /quit o Ctrl+D: salir.
- /target grok o /target groq: elegir target del próximo comando, sin alterar sesiones guardadas.
- /doctor: configuración; con --probe consulta realmente ambos gateways distintos.
- /demo: ciclo completo; /start, /patch ID y /eval ID permiten etapas. /analyze ID también usa el servicio existente.
- /runs: hasta ocho sesiones locales recientes, con estado/decisión y llamadas; running sin bloqueo se señala sin afirmar actividad.
- /report ID o /compare ID: lectura; last selecciona la sesión más reciente. Estas lecturas no requieren credenciales ni generan nuevas solicitudes.

Los comandos de la consola se enrutan a la misma app Typer, sin shell ni evaluación de código. Rechazo, error o cancelación devuelve control al prompt. Una sesión es de trabajo local; un resultado de modelo solo se considera real si tiene evidencia de proveedor. Jev se muestra como planificado, no como servicio conectado. [Spec010](../specs/010-interactive-console/spec.md).

[Orden de pruebas Groq/Grok y límites actuales](../equipo/PRUEBAS_INTEGRACIONES.md).

Diseño de referencia, adaptación y validación: [spec012](../specs/012-neuron-console/spec.md). Para mayor semejanza usar Windows Terminal con UTF-8, fuente que soporte Braille, fondo oscuro y ventana de al menos 116 columnas; el tema de fondo lo controla el terminal.

## Actividad junto a la neurona
En la consola interactiva, /demo, /start, /analyze, /patch y /eval mantienen la neurona junto a una vista Live con etapas, respuestas guardadas, llamadas, tokens reportados y latencia acumulada de solicitudes registradas. El tiempo de comando se mide aparte; no es una promesa de rendimiento del modelo. Al finalizar se muestra la decisión guardada. Los subcomandos normales y JSON conservan su salida anterior. [Spec013](../specs/013-live-harness/spec.md).

## Conversación con el agente
Texto normal conversa con Grok; no requiere prefijo y consume solicitudes. Los slash siguen disponibles. Abrir consola no consume red. Ejemplo:

```text
Hola, ¿qué puedes hacer?
/use last
Consulta la evidencia y explícame por qué se rechazó el candidato.
¿En qué caso introdujo una regresión?
/new
```

/use ID o last selecciona evidencia sin llamadas. El agente puede usar list_runs/read_session, herramientas de solo lectura; no tiene shell, escritura, ejecución de evaluaciones ni aprobación de parches. Para generar una evaluación usa /demo o las etapas explícitas. Grok conversa; el target Groq/Grok seleccionado no cambia el modelo del chat.

Historial de chat limitado a ocho mensajes en RAM, sin persistir conversaciones. /new borra historial, selección y presupuesto. Máximo 16 llamadas por conversación y dos por turno (hasta una consulta local y una explicación), sujetos a límites menores del entorno. Gateway sin reintentos automáticos; tiempo/tokens se limitan por turno. Costo monetario desconocido. La salida muestra llamadas, tokens con cobertura y latencia reportados, no estimaciones inventadas.

No se adjuntan prompts, entradas/trazas completas, .env ni respuestas crudas del proveedor al contexto. Solo resumen acotado de estado/evaluación; las claves configuradas y patrones conocidos se bloquean o redactan. No pegar secretos ni datos privados en el prompt. El historial de entrada también evita conservar claves detectadas. La respuesta es explicación del modelo: la evidencia y el gate siguen siendo la autoridad para decisiones. Fallos y cancelación devuelven al prompt y pueden haber consumido la solicitud enviada. /clear solo redibuja, no borra conversación. [Spec015](../specs/015-conversational-cli/spec.md).
