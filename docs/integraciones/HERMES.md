# Hermes y C4 AI

Estado: conexión MCP local verificada el 2026-10-17 con Hermes v0.22.2. [Evidencia stdio](../evidencia/2026-10-17-hermes-mcp.json). Telegram configurado por Deimer; conversación Telegram→herramienta C4 pendiente de prueba humana.

Hermes es la interfaz y orquestador externo. C4 conserva el análisis de confiabilidad, evaluaciones y decisión determinista. La instalación de Hermes no convierte automáticamente a C4 en un controlador de escritorio.

## Herramientas disponibles

| Herramienta | Uso |
|---|---|
| list_incidents | Hasta 100 incidentes por página, cursor explícito |
| get_incident | Estado y referencias de un incidente |
| get_report | Decisión almacenada, sin inferir aceptación |
| get_evaluation | Comparación baseline/candidato y regresiones |

Todas son de lectura. Reutilizan EvidenceReader y contratos v1; sin shell, acceso arbitrario a archivos, claves de proveedores o ejecución de modelos. Errores y evidencia incoherente se rechazan. No ofrecen aplicar parches en producción. Las herramientas nativas de máquina de Hermes dependen de la configuración y permisos que gestione su usuario.

## Configuración reproducible

Desde el clon, ejecutar `uv sync --locked`. Registrar en el Hermes local con rutas absolutas de **ese equipo**:

```powershell
hermes mcp add c4-ai --command "C:/ruta/c4-ai/.venv/Scripts/python.exe" --env "C4_STORE=C:/ruta/c4-ai/artifacts/runs" --args -m c4.mcp_server
hermes mcp test c4-ai
hermes mcp list
```

Aceptar únicamente las cuatro herramientas listadas. En este equipo Hermes está instalado fuera de PATH; se utilizó su ejecutable de instalación. La configuración permanece local, fuera de Git. No se modificaron proveedor, Telegram, permisos nativos o credenciales. No requiere servir HTTP ni exponer puertos.

En una sesión existente de Hermes, ejecutar `/reload-mcp` si la versión/canal admite este comando, o abrir una nueva sesión. Pregunta de prueba: «Usa c4-ai para listar incidentes y mostrar la evaluación del último reporte, sin ejecutar cambios». Verifica que aparezcan llamadas a las herramientas, no solo una respuesta de texto. Para el caso comprobado: `c4_63fb290ce5244c248f0b929120f14df2_incident`.

La prueba local confirmó descubrimiento en Hermes y consulta por un cliente MCP real: accepted. No se enviaron mensajes por Telegram, ni se reinició su gateway. Si Telegram no descubre herramientas tras recargar, revisar el gateway con el usuario antes de modificarlo.

## Próxima fase

Ejecución de evaluaciones desde Hermes requiere una spec independiente: presupuesto, confirmaciones, trabajos/cancelación y evidencia. Control de escritorio y Tauri siguen planificados. Mantener evaluación sobre versiones de prueba; ningún acceso a máquina sustituye el gate de seguridad de C4.

Fuentes: [MCP en Hermes](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp), [SDK oficial MCP 1.x](https://github.com/modelcontextprotocol/python-sdk/tree/v1.x).
