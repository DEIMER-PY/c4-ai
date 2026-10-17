# Groq como proveedor del agente evaluado
Revisión: 2026-10-17. Groq y Grok son servicios distintos. C4 mantiene diagnóstico/propuesta sobre Grok; el target puede usar Groq.

[Compatibilidad oficial](https://console.groq.com/docs/openai) publica la base https://api.groq.com/openai/v1. La consulta autenticada GET /models devolvió HTTP200 y el ID qwen/qwen3.8-27b en esta cuenta; no se imprimió la credencial.

[Límites](https://console.groq.com/docs/rate-limits): dependen de la organización/modelo y deben consultarse en el panel. El nivel gratuito tiene cuotas; no se registra costo cero por defecto. HTTP429 termina el trabajo con evidencia y error reintentable, sin repetir solicitudes automáticamente.

## Configuración local
En .env ignorado: GROQ_API_KEY, C4_GROQ_MODEL=qwen/qwen3.8-27b y C4_GROQ_BASE_URL=https://api.groq.com/openai/v1. La plantilla versionada deja clave/modelo sin rellenar; cada colaborador confirma su modelo habilitado.

```powershell
uv run --locked c4 --target-provider groq doctor
uv run --locked c4 --target-provider groq doctor --probe
uv run --locked c4 --target-provider groq demo
```

doctor sin probe no hace red. Con probe comprueba ambos proveedores y puede consumir dos solicitudes. La demo de seis casos usa una llamada Grok para diagnóstico/propuesta y trece del target (una inicial y doce comparativas), salvo fallo temprano.

## Integridad
Cada registro conserva proveedor y modelo; la sesión congela ambos roles. Baseline/candidato usan el mismo target y dataset; no comparar un baseline Grok contra un candidato Qwen para afirmar que mejoró un prompt. Los límites de llamadas/tiempo se comparten entre roles. Claves quedan fuera de prompts, registros y Git. Sesiones Grok anteriores continúan legibles.

Validación automatizada: rutas por rol, presupuesto total, 429 sin reintento, cambio de modelo bloqueado, ausencia de configuración y compatibilidad legacy. Ver spec009 para la evidencia real y su resultado, que no se deduce de los mocks.

## Evidencia real
Primera sesión c4_cdd0bc9c37394f9b98052ed2fa33862b: diez solicitudes, salida del target fuera de Action, trabajo failed y reporte needs_human_review. [JSON original saneado](../evidencia/2026-10-17-groq-invalid-action.json).

Segunda sesión c4_7f6c59daed604961a2e43b4b633f2ebe: catorce solicitudes (una Grok, trece Groq), evaluación completa 5/6 → 5/6; corrige refund_expired pero rompe refund_eligible. Decisión **rejected** con una regresión. [JSON original saneado](../evidencia/2026-10-17-groq-rejected.json). Una ejecución completada no obliga a aceptar el candidato.

La segunda usa [Structured Outputs estricto documentado](https://console.groq.com/docs/structured-outputs) para Qwen; ambas versiones reciben el mismo esquema de acción. Es una sesión nueva con output_mode registrado, sin alterar la evidencia de la primera. La velocidad y el costo de una API no sustituyen estos criterios de aceptación.
