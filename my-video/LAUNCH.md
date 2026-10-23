# C4 AI — Product launch showcase

Composición `C4Launch`: 15 segundos, 900 fotogramas, 60 FPS y 1920 × 1080. Toda la interfaz se dibuja con React, Tailwind y SVG; las imágenes promocionales se obtienen del render, sin capturas del escritorio.

## Reproducir y exportar

Desde esta carpeta:

```powershell
npm ci
npx tsc --noEmit
npx remotion studio src/launch-index.tsx
npx remotion render src/launch-index.tsx C4Launch ../artifacts/c4-ai-launch-15s.mp4 --codec=h264 --crf=18 --concurrency=2 --audio-codec=aac --audio-bitrate=192k --gl=angle
```

El render necesita Chromium. En este equipo se utiliza el Chromium local de Playwright con `--browser-executable`; Remotion puede gestionar su navegador en otros equipos. ANGLE acelera la composición en Windows. Los glows usan gradientes suaves y transformaciones para reducir el coste de filtros grandes.

## Dirección y montaje

| Fotogramas | Escena | Coreografía |
| --- | --- | --- |
| 0–209 | El desafío | Terminal, comando real, escritura progresiva, cursor y cambio a THINKING |
| 210–629 | Evidencia | Grafo, partículas, llamadas a herramientas, registros y contadores |
| 630–899 | Resolución | Check SVG, comparación y comando de demostración |

`src/C4Launch.tsx` contiene `CameraRig`, `TerminalWindow`, `WorkflowGraph`, `MetricsPill` y `AudioLayer`. Las animaciones dependen del fotograma; no utilizan temporizadores ni animaciones CSS. El cursor es una animación de la pieza audiovisual, no una interfaz interactiva del archivo MP4.

## Audio

`scripts/narrate-launch.ps1` genera tres frases con Windows SAPI. `scripts/build_launch_audio.py` produce música y efectos originales y los codifica a MP3 usando el FFmpeg local de Remotion. La procedencia y ventanas de voz están en `public/launch/audio-provenance.json`.

La voz incluida es **Helena de Windows, provisional**. No es ElevenLabs. Para una locución de estudio, sustituir `public/launch/voiceover.mp3` y ajustar `voiceWindows` en los props: la música baja de 0.18 a 0.10 durante esas ventanas. Los efectos de escritura, transición y confirmación se sincronizan mediante `Sequence`.

## Veracidad de la demostración

El video reproduce de forma acelerada evidencia ya registrada: seis casos sintéticos, baseline 5/6, candidato 6/6, cero regresiones, 14 llamadas y 20.720 tokens reportados. Los contadores animados representan esa reproducción, no nuevas mediciones ni rendimiento por segundo. No se afirman latencias, costos o precisión poblacional no medidos.

El comando mostrado es `uv run --locked c4 demo`; requiere clonar e instalar el proyecto según el README. No existe un instalador público `npx create-ai-agent`. Solo se evalúan versiones de prueba y no se aplican cambios en producción.

Este teaser complementa la demostración técnica S1; no sustituye la evidencia end-to-end ni publica automáticamente el repositorio o el video en YouTube.

