# Plan
Refactorizar contadores del gateway en presupuesto compartido preservando las propiedades usadas por el servicio. Añadir provider a Settings y registros; api_key sin representación. Entorno explícito para cada proveedor.

ReliabilityService recibe target_gateway opcional, usando el mismo por defecto. Ejecutar agente/evaluaciones sobre target y diagnóstico sobre Grok. Congelar ambos identificadores por sesión; mantener lectura y reanudación compatibles con sesiones Grok anteriores.

Archivos: c4/tools/grok.py, c4/services/reliability.py, c4/cli.py, tests/unit/test_providers.py, .env.example, docs/arquitectura/CLI.md, docs/referencias/GROQ.md, docs/specs/README.md y esta carpeta. No leer/publicar secretos ni editar frontend.

Validación: MockTransport con clientes independientes, presupuesto agregado, 429, cambio de modelo, configuración incompleta, reportes legacy y suite. Prueba real acotada únicamente si Deimer configura credencial/modelo localmente.

Ampliación necesaria tras prueba real: c4/tools/refunds.py proporciona Action JSON Schema al cliente; Groq/Qwen usa strict documentado en https://console.groq.com/docs/structured-outputs. Registrar output_mode y congelarlo por sesión; ambos prompts reciben el mismo esquema. Conservar la primera sesión invalid_action como evidencia negativa, sin corregirla retrospectivamente.

Archivos de evidencia añadidos: docs/evidencia/2026-10-17-groq-invalid-action.json y 2026-10-17-groq-rejected.json; valores saneados verificados contra las claves locales antes de publicar.
