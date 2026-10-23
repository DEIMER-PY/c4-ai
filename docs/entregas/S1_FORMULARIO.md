# Campos de entrega S1

**No enviado.** Repo/tablero siguen privados por instrucción de Deimer. Los enlaces GitHub requieren acceso; no se ha cambiado visibilidad ni afirmado aceptación del reto.

- Repositorio: https://github.com/DEIMER-PY/c4-ai
- Reporte técnico actualizado de la feature: https://github.com/DEIMER-PY/c4-ai/blob/codex/feat-025-cinematic-film/docs/entregas/S1_REPORTE_TECNICO.md
- Cambios para revisión: https://github.com/DEIMER-PY/c4-ai/pull/42 (borrador hacia develop).
- Portada: [PNG listo para subir](../assets/c4-ai-youtube-cover.png),1672×941,1.87MB decimal.
- Video: URL YouTube pendiente. Subir `artifacts/c4-ai-santiago-brian-120s.mp4` desde la cuenta del propietario y pegar la URL compartible; una ruta de disco no sirve en el formulario.

La rama histórica codex/release-s1-end-to-end conserva un snapshot anterior; no usar su reporte como si incluyera esta revisión sin integrarla. La feature actual conserva SDD y PR→develop.

## Notas listas para copiar

C4 AI ejecuta detectar→diagnosticar→proponer corrección→evaluar→decidir con evidencia. Grok analiza y propone; evaluación de baseline/candidato sobre seis casos sintéticos con respuestas reales. Resultado:5/6→6/6, cero regresiones y controles obligatorios aprobados;14 llamadas y20.720 tokens reportados. Otra prueba con Groq fue rechazada por regresión. CLI conversacional, dashboard/API local y consultas de evidencia Hermes/Telegram verificados. Costo monetario por tarea desconocido. Solo versiones de prueba; sin aplicación en producción. WhatsApp, JEV, runner unitario general, persistencia/escala, desktop y móvil siguen pendientes. Video de120s: montaje narrado de evidencia guardada y roadmap explícito, no ejecución continua en vivo. Repositorio privado; acceso de evaluación por resolver.

## Video y crédito

Título sugerido: C4 AI: cuando tu agente falla, demuestra la corrección | Demo end-to-end

Descripción breve: C4 AI investiga fallos de agentes, propone cambios de prompt/configuración y compara contra el baseline antes de aceptar. Demo con respuestas reales sobre seis casos sintéticos. Incluye aceptación y rechazo por regresión. JEV y pruebas unitarias generales son roadmap. Narración generada con ElevenLabs — Brian: https://elevenlabs.io/ . Voz generada en cuenta Free; revisar derechos aplicables antes de publicación comercial.

No se ha subido el video ni enviado S1 automáticamente. [Source y validación](../../my-video/EXTENSION.md).
