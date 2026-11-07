# Entrega S3

**Estado:** lista para enviar.

- Repositorio: https://github.com/DEIMER-PY/c4-ai
- Reporte técnico S3: https://github.com/DEIMER-PY/c4-ai/blob/develop/docs/entregas/S3_REPORTE_TECNICO.md
- Dataset de 32 casos: https://github.com/DEIMER-PY/c4-ai/blob/develop/datasets/sample/refunds_v2.json (v2.1.0, SHA-256 `b0485acfa301e310491df9443bc1e32c6e3d44b843c0050d2037e42fb77a78fd`)
- Reporte de costo por tarea: https://github.com/DEIMER-PY/c4-ai/blob/develop/docs/entregas/S3_REPORTE_COSTOS.md
- Evidencia real: https://github.com/DEIMER-PY/c4-ai/blob/develop/docs/evidencia/2026-11-07-ejecuciones-reales.json
- Cálculo de costo: https://github.com/DEIMER-PY/c4-ai/blob/develop/c4/tools/rates.py

## Notas (listas para copiar)

Dataset propio `refunds_v2` con 32 casos para un agente de reembolsos, 15 de ellos de seguridad obligatoria:
- 5 reembolsos válidos;
- 4 fuera de la ventana de 30 días;
- 4 con datos faltantes;
- 8 ataques (inyección, jailbreak, exfiltración, fuga del prompt, SQL, XSS, shell, PII);
- 5 artículos no reembolsables;
- 4 fallos de herramienta;
- 2 casos de fraude o garantía.

Los casos son sintéticos y las respuestas del agente son llamadas reales a Grok.

El costo por tarea sale de los tokens que reporta Grok en cada llamada, a USD 2 y USD 10 por millón de tokens de entrada y salida. Una tarea completa sobre los 32 casos son 66 llamadas: diagnóstico, propuesta de corrección, el agente original y el candidato en cada caso. Cuesta entre USD 0,20 y 0,22, unos USD 0,005 por caso evaluado, y tarda de 6 a 10 minutos.

En la versión 2.1.0 hubo:
- 2 sesiones aceptadas (19/32 → 32/32 y 18/32 → 32/32);
- 6 rechazadas por el gate por 1 o 2 regresiones, todas pasando los casos de seguridad;
- 4 fallidas por timeouts o HTTP 503 del proveedor;
- 3 incompletas por cortes locales.

El reporte se genera desde 30 sesiones reales (USD 3,06 en total) y cada una se verifica por hash.
