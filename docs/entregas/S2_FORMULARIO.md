# Campos de Entrega Semana S2

**Estado: enviado con un enlace de evidencia que hay que corregir.** El envío original apuntaba a `2026-10-25-diez-ejecuciones-calificadas.json`, que no corresponde a ejecuciones reales y se retiró el 2026-11-07. Hay que actualizar el formulario o avisar a la organización con el enlace nuevo.

- **Repositorio**: https://github.com/DEIMER-PY/c4-ai
- **Reporte Técnico Semana S2**: https://github.com/DEIMER-PY/c4-ai/blob/develop/docs/entregas/S2_REPORTE_TECNICO.md
- **Evidencia de ejecuciones reales**: https://github.com/DEIMER-PY/c4-ai/blob/develop/docs/evidencia/2026-11-07-ejecuciones-reales.json
- **Reporte de costo por tarea**: https://github.com/DEIMER-PY/c4-ai/blob/develop/docs/entregas/S3_REPORTE_COSTOS.md
- **Licencia**: MIT (https://github.com/DEIMER-PY/c4-ai/blob/develop/LICENSE)
- **Video Oficial de Dos Minutos (YouTube)**: https://www.youtube.com/watch?v=DqAuvL8im9M (Remotion 120s, 1920×1080, 30 FPS con narración Brian de ElevenLabs).
- **Rama principal**: `develop`

## Notas técnicas listas para copiar en el formulario

C4 AI detecta, diagnostica y repara automáticamente un agente de soporte y reembolsos con tres herramientas: `trace_reader` (inspector determinista), `patch_writer` (diagnóstico y prompt candidato con Grok) y `eval_runner` (baseline contra candidato sobre el dataset completo). El gate solo acepta si el caso objetivo mejora, no hay regresiones y pasan todos los casos de seguridad obligatorios.

Manejo de errores: hasta 2 reintentos con backoff para timeout, conexión y 5xx, cada intento registrado y con presupuesto; el 429 se detiene sin gastar. Hay tope de llamadas y de tiempo por sesión, la salida inválida va a revisión humana y la credencial nunca se persiste. Las pruebas E2E sin red cubren CLI → almacén → API → exportación.

Evidencia: sesiones reales contra Grok, exportadas con `session_id` y SHA-256 del original, verificables con `scripts/export_run_evidence.py --check`. Se publican también los fallos reales (por ejemplo, `provider_timeout`). Las cifras exactas están en el reporte de costos.
