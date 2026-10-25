# 026 — C4 AI Launch Showcase

Estado: Implementing. Rama codex/feat-024-launch-showcase desde develop. Deimer/Codex; revisión creativa Deimer.

FR001/AC001: nueva composición TSX completa C4Launch,1920×1080,60fps,900frames/15s; conservar composiciones existentes. Tres escenas:0–209 trigger,210–629 workflow,630–899 resultado/CTA. CameraRig, TerminalWindow, WorkflowGraph, MetricsPill y AudioLayer exportados; SVG inline y Tailwind oficial, animación determinista Remotion con spring/interpolate/Sequence.

FR002/AC002: estética zinc950, tarjetas glass, grid sutil, glows cian/violeta, perspectiva y cursor con trayectoria suave/click. Texto legible y jerarquía de lanzamiento, sin captura estática como protagonista.

FR003/AC003: sonido sincronizado: voiceover, ambient drone con ducking, keystroke/whoosh/ping. Recursos locales completos para render. ElevenLabs si se dispone de conexión/voz/credencial; si falta, conservar narración provisional claramente identificada y arquitectura intercambiable, sin atribuirla a ElevenLabs.

FR004/AC004: contenido fiel a C4: uv run --locked c4 demo y uv sync --locked desde clon; no instalar un paquete inexistente ni inventar soporte GPT/Claude o métricas142tokens/s/180ms/99.7%. Mostrar reproducción acelerada de evidencia registrada, seis casos sintéticos,5/6→6/6,0regresiones; ningún resultado animado es una nueva ejecución en vivo.

FR005/AC005: compilar TSX, abrir Studio, inspeccionar frames de las tres escenas y exportar MP4 H264/AAC de15s. Verificar duración, resolución, fps, audio y ausencia de clipping. Documentar comandos y estado de fuentes/voz. El clip corto no reemplaza automáticamente el reporte o video técnico S1.

Archivos: my-video/src/C4Launch.tsx, launch.css, Root.tsx, remotion.config.ts, package/lock, public/launch/**, scripts de audio/export y docs de esta feature. No modificar dashboard/backend ni publicar recursos privados externamente.

Renumerada a026 porque Santiago integró024-website en PR41. Se conserva el teaser aprobado y su evidencia; no hay dos features con el mismo número.
