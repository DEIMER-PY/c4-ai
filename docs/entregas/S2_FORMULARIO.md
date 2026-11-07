# Campos de Entrega Semana S2

**Estado:** pendiente de enviar en el panel (el panel la muestra como "Pendiente" el 2026-11-07; nunca se envió con la evidencia retirada).

- **Repositorio**: https://github.com/DEIMER-PY/c4-ai
- **Reporte Técnico Semana S2**: https://github.com/DEIMER-PY/c4-ai/blob/develop/docs/entregas/S2_REPORTE_TECNICO.md
- **Evidencia de ejecuciones reales**: https://github.com/DEIMER-PY/c4-ai/blob/develop/docs/evidencia/2026-11-07-ejecuciones-reales.json
- **Reporte de costo por tarea**: https://github.com/DEIMER-PY/c4-ai/blob/develop/docs/entregas/S3_REPORTE_COSTOS.md
- **Licencia**: MIT (https://github.com/DEIMER-PY/c4-ai/blob/develop/LICENSE)
- **Video de 2 minutos**: https://youtu.be/F17pAO6cEm8 (1:54, ejecución en vivo contra Grok, error y recuperación).
- **Rama principal**: `develop`

## Notas técnicas listas para copiar en el formulario

C4 AI detecta, diagnostica y repara automáticamente un agente de soporte y reembolsos con tres herramientas: `trace_reader` (inspector determinista), `patch_writer` (diagnóstico y prompt candidato con Grok) y `eval_runner` (baseline contra candidato sobre el dataset completo). El gate solo acepta si el caso objetivo mejora, no hay regresiones y pasan todos los casos de seguridad obligatorios.

Manejo de errores: hasta 2 reintentos con backoff para timeout, conexión y 5xx, cada intento registrado y con presupuesto; el 429 se detiene sin gastar. Hay tope de llamadas y de tiempo por sesión, la salida inválida va a revisión humana y la credencial nunca se persiste. Las pruebas E2E sin red cubren CLI → almacén → API → exportación.

Evidencia: 31 sesiones reales contra Grok (`grok-4.7`) entre el 17-oct y el 7-nov. Cada una se exporta con su `session_id` y el SHA-256 del original, y se verifica con `scripts/export_run_evidence.py --check`. Resultados: 11 aceptadas, 9 rechazadas por el gate, 7 fallidas por el proveedor y 4 incompletas. Se publican también los fallos. Costo total registrado: USD 3,11. Una sesión completa sobre 32 casos cuesta USD 0,20–0,22.
