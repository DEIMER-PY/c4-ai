# Video S1 con Remotion

Composición explicativa de 120 segundos, 1280×720, 24fps. Capturas de la aplicación y CLI con evidencia guardada, no grabación continua en vivo. Narración española local SAPI Helena; sin música ni servicios de voz externos. Fuente reproducible, sin depender de un conector MCP.

```powershell
cd apps/demo-video
pnpm install --frozen-lockfile
pnpm typecheck
pnpm studio
pnpm render --browser-executable="C:/ruta/chrome-headless-shell.exe"
```

Sin ejecutable explícito Remotion puede descargar un navegador; elegir uno compatible instalado. El render genera `artifacts/c4-ai-s1-demo.mp4` en la raíz (ignorado por Git). Las pistas WAV ya están incluidas. Para regenerarlas en Windows con Helena: `./generate-narration.ps1`; revisar que cada audio quepa en su escena. Texto en [narration.json](narration.json), tiempos en [composición](src/index.tsx).

Escenas: problema0–14s, arquitectura14–30, CLI30–48, dashboard48–66, aceptación66–85, rechazo85–103, Hermes/alcance103–120. Los tokens de la ejecución se leen de la evidencia saneada enlazada en el [reporte](../../docs/entregas/S1_REPORTE_TECNICO.md); no son animaciones de métricas inventadas. Los audios y capturas son assets del video; no copiar trazas privadas o claves.

La generación del MP4 no lo publica. Revisión de Deimer/Santiago y URL de alojamiento pendientes. El video conserva costos desconocidos, seis casos sintéticos y limitaciones de publicación/Telegram/escala.

Render verificado:120,000s, H.264/AAC,1280×720/24fps,6.761.336 bytes; audio decodificado no silencioso (RMS PCM16:1941,48) y frames35/72/92s inspeccionados. [Metadatos/hash](../../docs/evidencia/2026-10-17-video.json). El reproductor muestra cada narración dentro de su escena; los WAV duran11,54–15,26s. Los archivos de capturas con extensión .png pueden contener JPEG del proveedor de capturas; no se alteraron los datos de la interfaz.
