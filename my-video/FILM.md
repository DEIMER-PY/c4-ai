# C4 AI — Agent Reliability Engineer

Showcase profesional de **120 segundos: 3600 frames, 30 FPS, 1920×1080**. Amplía el teaser de 15 segundos aprobado, conservando la composición anterior.

## Estado de entrega

Montaje visual implementado con ocho escenas, mascota SVG Cortex, neurona animada, terminales, arquitectura, gate, canales y mockups. El video distingue funciones disponibles del roadmap: website/documentación, desktop y React Native todavía se desarrollarán.

Voz elegida: **Dylan, motor ElevenLabs**. Se generó el capítulo Hermes mediante Higgsfield; cinco solicitudes fueron rechazadas por falta de créditos. Deimer eligió continuar con su cuenta ElevenLabs. La clave no está configurada: el montaje no se presenta como locución Dylan completa hasta generar y validar las ocho pistas. Un render `visual-cut` es revisión de imagen/música, no entrega de audio final. No se usa Helena como sustitución de Dylan.

## Ejecutar y exportar

Desde esta carpeta:

```powershell
npm ci
node node_modules/typescript/bin/tsc --noEmit
npx remotion studio src/film-index.tsx
npx remotion render src/film-index.tsx C4AIVideo ../artifacts/c4-ai-film-120s-visual-cut.mp4 --codec=h264 --crf=18 --concurrency=2 --audio-codec=aac --audio-bitrate=192k --gl=angle
```

En Windows se usó Chromium local de Playwright mediante `--browser-executable`. En otros equipos Remotion gestiona su navegador; no copiar rutas de Deimer. `@remotion/transitions` y Remotion están fijados a 4.0.536.

## Completar Dylan con cuenta propia

Desde la raíz del repositorio, en una terminal humana:

```powershell
uv run --locked python my-video/scripts/elevenlabs_narrate.py --configure
uv run --locked python my-video/scripts/elevenlabs_narrate.py --list-voices
# Si hay varias voces Dylan, fijar ELEVENLABS_VOICE_ID en el .env local.
uv run --locked python my-video/scripts/elevenlabs_narrate.py --generate
```

`--configure` pide la clave oculta y la guarda en `.env` ignorado, sin mostrarla. Requiere clave creada por el titular en ElevenLabs, acceso de lectura a voces y generación TTS. Nunca enviar claves por Git/chat. El script no registra cuerpos de error ni reintenta solicitudes fallidas; conserva clips ya generados para no duplicar consumo. La selección Dylan de Higgsfield tiene un ID de ese servicio: no copiarlo como ID nativo ElevenLabs.

El guion está en `film-narration.json`. El ensamblador mide cada pista, aplica ajuste de tempo máximo 1.2 si hace falta y rechaza frases que no caben; no corta locución. Genera `src/film/audio-manifest.json` y procedencia. Las pistas faltantes mantienen `complete:false`; se puede revisar el capítulo Dylan existente por separado. Exportar de nuevo con nombre final solo tras completar narración y verificar el audio.

API oficial consultada: [buscar voces](https://elevenlabs.io/docs/api-reference/voices/search), [generar voz](https://elevenlabs.io/docs/api-reference/text-to-speech/convert).

## Timeline

| Tiempo | Capítulo | Enfoque |
| --- | --- | --- |
| 0–15 | Problema | Riesgo ilustrativo de ajuste sin pruebas |
| 15–30 | Harness CLI | Neurona, chat y comandos actuales |
| 30–45 | Hermes | MCP de cuatro consultas de lectura |
| 45–65 | Arquitectura | Seis responsabilidades y persistencia futura |
| 65–80 | Gate | Condiciones y ejemplos distintos Grok/Groq |
| 80–95 | Canales | Telegram verificado; Slack/WhatsApp con su estado |
| 95–110 | Producto | Dashboard actual, mockups y futuro nativo |
| 110–120 | Cierre | Website/docs → desktop → React Native |

Las escenas anteriores a una transición duran su bloque nominal +18 frames; siete solapamientos de18 frames conservan los inicios y duración total exacta. Animación determinista con spring/interpolate, wipe/slide/fade y cámara sutil. `Design.tsx` contiene Cortex con idle/alert/scanning/hermes-sync/gate-check/celebrate. SVG propios; sin capturas del escritorio ni librerías de iconos externas.

Las barras del mockup son ilustrativas y se etiquetan; las cifras 5/6→6/6 representan la evaluación Grok registrada, no una ejecución en vivo ni precisión general. La ejecución Groq de referencia fue rechazada por regresión. Costo desconocido sigue desconocido.

[Spec, FR/AC](../docs/specs/025-cinematic-film/spec.md) · [Handoff a Santiago/Claude](../docs/equipo/HANDOFF_2026-10-17.md).
