# Seguridad aplicada a agentes
Estado: controles especificados, no implementados.
| Riesgo | Control MVP | Evidencia |
|---|---|---|
| Prompt injection en traza | Tratar traza como datos, delimitar contenido y validar acciones | Caso adversarial + tool calls |
| Tool misuse | Allowlist, argumentos tipados y política | Acción bloqueada |
| PII leakage | Datos sintéticos/anonimizados, redacción en logs | Assertion de no exposición |
| Patch inseguro | Diff solo prompt/config, baseline inmutable y gate | Evaluación/rechazo |
| Secretos | Entorno backend, .env ignorado, revisión previa a push | Sin credenciales en repo |
| Bucles/costos | Timeouts, máximo de intentos y presupuesto por job/día | Estado terminal y consumo |
| Ejecución duplicada | IDs e idempotencia de etapas | Un efecto por job |
| Acceso web | Localhost primero; CORS explícito | Orígenes y endpoints auditados |

No conectar datos privados a repositorio público. Sanitizar mensajes que salgan a Slack.
Cliente Grok solo backend. No ejecutar código generado; MVP limita cambios a candidatos declarativos.
Control de acceso multiusuario, despliegue público y autenticación de producto se diseñarán antes de exposición externa de la API.
Una alerta de seguridad puede bloquear aceptación; el diagnóstico LLM no elimina un fallo objetivo.
No entrenamiento de modelo en MVP; prompts/reglas/evals especializados y validación determinista.
