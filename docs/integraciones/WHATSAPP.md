# WhatsApp Business y Hermes

Estado: **planificada; no conectada ni verificada**. Deimer confirmó que dispone únicamente de la app móvil WhatsApp Business. La app no proporciona las credenciales necesarias para configurar la Cloud API. Telegram ya cubre la demostración de Hermes→MCP→C4.

## Ruta elegida por Deimer

Confirmado: **Meta Cloud API con número de prueba**. Inspección local2026-10-17: Hermes contiene el adaptador y el asistente Cloud API, pero no tiene configurados Phone Number ID, Access Token, App Secret, Verify Token ni Allowed Users. `ALLOW_ALL_USERS` está deshabilitado. [Evidencia de presencia, sin valores](../evidencia/2026-10-17-whatsapp-readiness.json).

Usar la integración oficial de Hermes con Meta Cloud API, sobre un número de prueba dedicado. Preparar una aplicación Meta con WhatsApp, WABA, Phone Number ID, token, App Secret y Verify Token; mantenerlos en el entorno local de Hermes. El Phone Number ID no es el número de teléfono. Configurar una URL HTTPS pública **solo para el webhook de WhatsApp**; no exponer el API de evidencia de C4.

La [guía oficial de Hermes](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/whatsapp-cloud) describe `hermes whatsapp-cloud`, firma del webhook, verificación y allowlist. Fuera de la ventana de atención de24h se requieren plantillas aprobadas. Verificar requisitos vigentes de Meta al configurar la cuenta. No se afirma compatibilidad de coexistencia con el número móvil actual ni se modifica su registro.

```text
Usuario autorizado
        ↓
Meta Cloud API → webhook HTTPS firmado → Hermes
                                           ↓
                                    MCP stdio C4
                                           ↓
                             reporte/evaluación de lectura
```

## Configuración pendiente

### MCP de Meta para desarrollo

Deimer solicitó usar [Meta Social Technologies MCP](https://developers.facebook.com/documentation/mcp/devtools-mcp), anteriormente DevTools MCP. Endpoint oficial: `https://mcp.facebook.com/devtools`, Streamable HTTP con OAuth. La documentación fue leída en el navegador el2026-10-17 (actualización de página:7oct2026).

Se registró en Codex mediante `codex mcp add meta_social_technologies --url https://mcp.facebook.com/devtools`. Deimer completó el consentimiento y la CLI confirmó **Successfully logged in**. Configuración HTTP enabled confirmada. Tras recargar, **las11 herramientas básicas están expuestas** y `devtools_app_list` responde autenticado con `apps=[]`, sin siguiente página. La búsqueda oficial de documentación también funciona. No aparece `devtools_app_create`; cero apps en esta respuesta significa cero concedidas al MCP y no prueba que no existan apps en la cuenta. Deimer confirmó que creará la app de prueba. No se han generado tokens de WhatsApp, creado apps ni conectado el canal por registrar/autenticar este MCP.

La documentación presenta once herramientas básicas de consulta/webhooks y marca las seis de ciclo de vida, incluida `devtools_app_create`, como **próximamente**. Su disponibilidad real debe comprobarse tras autenticar; no se promete creación por MCP antes de esa comprobación. Si no aparece, se usará el dashboard de Meta para crear la app. El MCP sirve a Codex durante desarrollo; Hermes conservará el adaptador oficial WhatsApp Cloud API y las consultas MCP de C4, sin recibir administración de apps Meta.

### Diagnóstico y asistente local implementados

Desde la raíz del proyecto:

```powershell
uv run --locked python scripts/whatsapp_hermes.py
# Cuando estén disponibles la app y sus credenciales, en tu terminal interactiva:
uv run --locked python scripts/whatsapp_hermes.py --setup
```

El primer comando no usa red, no escribe configuración ni muestra IDs, teléfonos o secretos. Devuelve código2 mientras faltan requisitos y0 si pasan las comprobaciones locales de presencia/formato. **Ninguno de esos resultados demuestra autenticación, webhook o respuesta real**. Solo inspecciona el .env de la instalación nativa esperada, sin resolver overrides YAML; `--hermes-home` permite indicar otra instalación.

`--setup` requiere una terminal humana interactiva y abre únicamente `hermes whatsapp-cloud`, el asistente oficial ya instalado; no recibe credenciales por argumentos ni activa automáticamente un túnel. Los5 tests cubren configuración ausente, no divulgación/no escritura, formatos inválidos, acceso abierto y rechazo de ejecución no interactiva. [Diagnóstico local](../evidencia/2026-10-17-whatsapp-readiness.json).

La instalación MCP ya fue autorizada y ejecutada mediante revisión de permisos. No confundir el bloqueo anterior de publicación Git con este registro exitoso. El usuario debe iniciar sesión y seleccionar recursos de prueba en el consentimiento; no enviar claves ni códigos por el chat.

La documentación oficial también ofrece [WhatsApp Business Tools MCP](https://developers.facebook.com/documentation/mcp/whatsapp-business-tools-mcp), endpoint `https://mcp.facebook.com/whatsapp_business_tools`. Se inspeccionó, pero **no se registró ni autorizó** ese segundo servidor. Requiere negocio administrado, app con WhatsApp habilitado y condiciones Cloud API aceptadas; no reemplaza el paso de crear la app. Puede ayudar después con descubrimiento de WABA/números y configuración del webhook. No autoriza usar números de producción ni pagos. Su OAuth es distinto y sus herramientas no se afirman disponibles.

### Credenciales y número de prueba

Introducir los valores mediante el asistente de Hermes, sin publicarlos en Git, chat, capturas o video:

1. Abrir [Meta for Developers](https://developers.facebook.com/apps/), crear/configurar una aplicación con WhatsApp y obtener el número de prueba y las credenciales en API Setup.
2. Añadir y verificar en Meta el destinatario de prueba del propietario. Este destinatario y el número emisor de prueba son distintos.
3. En PowerShell local ejecutar `& "$env:LOCALAPPDATA/hermes/bin/hermes.exe" whatsapp-cloud`. Introducir credenciales en ese asistente, nunca en el chat. [Ejemplo sin secretos](../../examples/hermes-whatsapp/.env.example): no copiarlo encima del entorno existente.
4. Configurar el webhook HTTPS firmado y suscribir `messages`, siguiendo la guía oficial. Limitar remitentes al propietario; conservar Telegram y las herramientas C4 de lectura.
5. Comprobar entrada→Hermes→get_report/get_evaluation→respuesta entregada. Solo entonces marcar el canal verificado.

La instalación de Hermes fue detectada; el asistente no se ha ejecutado con credenciales ni se ha abierto un túnel. No hay cargos ni cuenta/número creados por el agente.

| Variable | Uso |
|---|---|
| WHATSAPP_CLOUD_PHONE_NUMBER_ID | ID del número de prueba en Meta |
| WHATSAPP_CLOUD_ACCESS_TOKEN | Credencial de Meta |
| WHATSAPP_CLOUD_APP_SECRET | Validar firma de solicitudes entrantes |
| WHATSAPP_CLOUD_VERIFY_TOKEN | Verificación inicial del webhook |
| WHATSAPP_CLOUD_ALLOWED_USERS | Identificadores de remitentes autorizados |
| WHATSAPP_CLOUD_ALLOW_ALL_USERS | Mantener false |
| WHATSAPP_CLOUD_WEBHOOK_PORT | Puerto local del webhook; predeterminado8090 |

Aceptar un mensaje del propietario, invocar `get_report`/`get_evaluation` y comprobar respuesta entregada con decisión, antes/después y regresiones. Guardar evidencia anonimizada, sin teléfonos ni tokens. Una configuración o un healthcheck no demuestran el ciclo completo. Revertir deshabilitando únicamente este canal y su túnel si falla; conservar Telegram.

## Alternativa con QR

Hermes también documenta un [puente Baileys](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/whatsapp), que es **no oficial y puede ocasionar bloqueo de la cuenta**. No se ha activado ni vinculado el número de negocio. No es requisito de S1. Para la entrega de hoy se conserva Telegram verificado y WhatsApp como pendiente.

Responsable: Deimer/Codex. [Spec022](../specs/022-whatsapp-business/spec.md). Consulta de fuentes:2026-10-17.
