# Hermes y C4 AI

Estado: MCP y recorrido Telegram→Hermes→C4→Telegram **verificados** el2026-10-17 con Hermes v0.22.2. [Evidencia stdio](../evidencia/2026-10-17-hermes-mcp.json) y [prueba Telegram saneada](../evidencia/2026-10-17-telegram.json).

Actualización spec020: se corrigieron usuario autorizado y chat privado, verificados contra la identidad confirmada por el humano. Telegram confirmó entrega y Deimer confirmó recepción. Entrada de prueba recibida por Hermes; el primer intento falló por ruta de inferencia xai/Codex incompatible con el gateway del reto. Se configuró `custom:c4-reto` con `chat_completions`, manteniendo host/modelo del proyecto y credencial específica local; prueba real del protocolo devuelve HTTP200, SSE terminado y llamada de herramienta en2375ms (una solicitud adicional; usage no reportado). La prueba final llamó get_report y get_evaluation, recibió accepted,5/6→6/6 y cero regresiones; la respuesta quedó entregada en Telegram19,110s después de la entrada. El modelo no ejecutó nuevas evaluaciones C4 ni cambios de máquina. [Evidencia saneada](../evidencia/2026-10-17-telegram.json).

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

La prueba inicial de spec018 confirmó descubrimiento en Hermes y consulta por un cliente MCP real: accepted; en esa primera fase no se enviaron mensajes Telegram ni se reinició el gateway.

En spec020 el usuario solicitó expresamente configurar y validar Telegram: se enviaron mensajes de prueba únicamente a su chat privado y se reinició el gateway. Copias de `.env` y `config.yaml` permanecen en backups locales de Hermes, fuera de Git. No se usó el teléfono como identificador ni se habilitó acceso global.

## Ruta de modelos del gateway del reto

El proveedor nativo xai utiliza su origen/autenticación y puede seleccionar Codex Responses. No configurar la URL del reto como override de OAuth de xAI ni desactivar la protección de origen. Para una API compatible del reto se usa un proveedor nombrado:

```yaml
model:
  provider: custom:c4-reto
  default: grok-4.7
  base_url: https://api.reto.pltk.mx/v1
  api_mode: chat_completions
providers:
  c4-reto:
    base_url: https://api.reto.pltk.mx/v1
    key_env: C4_GROK_API_KEY
    api_mode: chat_completions
    default_model: grok-4.7
```

Guardar C4_GROK_API_KEY solo en el entorno local de Hermes; no incluir su valor en YAML, chat o Git. Host/modelo anteriores corresponden a la configuración del reto verificada para este proyecto; no extrapolar a otros proveedores. El resolver de Hermes comprobó que provider=custom, api_mode=chat_completions y URL/clave coinciden con el gateway, sin reutilizar OAuth. Las demás credenciales guardadas permanecen intactas. La primera prueba colgada fue interrumpida mediante reinicio oficial y conserva sus mensajes/evidencia; no se presenta como éxito.

## Próxima fase

Ejecución de evaluaciones desde Hermes requiere una spec independiente: presupuesto, confirmaciones, trabajos/cancelación y evidencia. Control de escritorio y Tauri siguen planificados. Mantener evaluación sobre versiones de prueba; ningún acceso a máquina sustituye el gate de seguridad de C4.

Fuentes: [MCP en Hermes](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp), [SDK oficial MCP 1.x](https://github.com/modelcontextprotocol/python-sdk/tree/v1.x).
