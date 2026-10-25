# Video S1 de C4 AI

Composición `C4S1Delivery`: 120 segundos, 1920×1080, 30fps. Siete escenas editables, SVG animados, capturas reales y narración española local. La plantilla original `MyComposition` se conserva.

## Abrir y exportar

Desde la raíz del repositorio, en PowerShell de Windows:

```powershell
./my-video/render-delivery.ps1 -Studio
# Tras revisar las escenas y cerrar Studio:
./my-video/render-delivery.ps1
```

Requiere Node, `npm ci` en esta carpeta y la voz española Helena. El script usa Chromium ya instalado en este computador; ajustar la ruta para otro equipo. No requiere tokens de proveedores ni hace una nueva evaluación. Resultado previsto: `artifacts/c4-ai-s1-entrega.mp4`, ignorado por Git. Revisar audio, textos y recortes antes de subirlo a YouTube. Abrir `visor.html` y seleccionar el archivo para recorrer capítulos; el MP4 por sí solo no contiene botones.

## Estado de validación

Fuente nueva en desarrollo. TypeScript debe pasar antes de exportar. La sesión del agente tiene bloqueadas conexiones a Studio/Chromium y la voz local devolvió `0x80045039`; la revisión automática de permisos está indisponible por cuota. **No se ha generado ni verificado el nuevo MP4**. Hay un video anterior renderizado de120s en `artifacts/c4-ai-s1-demo.mp4`; no confundirlo con esta versión, que actualiza Telegram.

Los casos son sintéticos y las respuestas de proveedor son reales. Las escenas de arquitectura y Telegram son representaciones, no grabaciones continuas ni capturas del chat privado. No se publica información del usuario ni se inventan costos.

## Capítulos para YouTube

```text
00:00 El problema y C4 AI
00:14 Arquitectura y ciclo de confiabilidad
00:30 CLI y conversación por streaming
00:48 Dashboard conectado a evidencia
01:06 Candidato aceptado
01:25 Regresión y rechazo
01:43 Hermes, Telegram y siguientes pasos
```

Destino elegido: YouTube. URL pendiente de exportación, revisión y subida desde la cuenta del propietario. No se ha publicado ni enviado el formulario.
