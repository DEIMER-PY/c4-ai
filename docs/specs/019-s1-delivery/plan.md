# Plan
Crear composición Remotion 1280×720 a 24fps, 2880 frames, usando capturas ya verificadas y resultados saneados. Narración local SAPI Helena; sin música ni servicios de voz externos. Conservar fuente, lockfile, subtítulos/guion y WAV; MP4 generado en artifacts ignorado. Usar Chromium instalado para evitar descargas redundantes. Inspeccionar frames y duración con FFmpeg.

Separar reporte actual de la primera ejecución histórica. Matriz oficial con publicación pendiente, seis inputs sintéticos, uso real de modelos y costo desconocido. Crear HTML responsive con selectores de dispositivo y capturas, compatible sin dependencias. Actualizar documentos contradictorios con estado consolidado y enlaces. Push/PR/CI y snapshot codex/release-s1-end-to-end desde develop tras integrar.

El montaje SVG incorpora únicamente PNG/JPEG en base64. Adaptar verify_docs para aceptar datos PNG/JPEG con firma válida y límite6MB por imagen, conservando prohibición de URLs externas, scripts y foreignObject. scripts/create_responsive_preview.py reproduce la composición sin modificar capturas.
