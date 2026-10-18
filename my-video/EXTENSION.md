# C4 AI — ampliación del video de Santiago

Continuación vigente elegida por Deimer. Se conserva el montaje y la narración originales del MP4 de71s y se insertan49s antes del cierre: **120 segundos,3600frames,30FPS,1920×1080**. La composición de `FILM.md` se conserva como variante anterior.

## Montaje y voz

La pausa de61.169–61.698s permite insertar los nuevos capítulos en61.4s sin cortar una frase. Se conservan los61.4s iniciales y se retoman los9.6s finales originales, con transición blanca al cierre. La fuente `public/reference/santiago-original.mp4` es una copia de trabajo inmutable del archivo aportado, no se modifica el original de Downloads.

Por indicación final de Deimer se usa **la voz del video original**. Las adiciones tienen subtítulos y música; no se presenta otra voz como si fuera la misma ni se clona al narrador. El MP4 no identifica voz ni editor, y el proyecto editable no está disponible. Para narrar también texto nuevo con la misma voz se necesitará su fuente/ID y autorización de uso correspondiente.

ElevenLabs aceptó la clave local, pero la cuenta Free rechazó Dylan de biblioteca con402 `payment_required`; no se generó audio. La importación de voz no se ejecutó. No se compraron planes ni se modificó la biblioteca. La clave permanece exclusivamente en `.env` ignorado y no es necesaria para reproducir esta edición.

## Contenido nuevo

| Tiempo final | Capítulo | Estado comunicado |
| --- | --- | --- |
| 0–61.4s | Video original de Santiago | Problema, ciclo, aceptación/rechazo e interfaces |
| 61.4–76.4s | Pruebas y decisiones | Evaluaciones controladas actuales; runner unitario futuro |
| 76.4–91.4s | JEV | Propuesta en shadow mode; no integrado, no omite gate |
| 91.4–102.4s | Impacto | Objetivos cualitativos para desarrollo, calidad y operaciones |
| 102.4–110.4s | Ecosistema | Website/docs implementados; desktop/móvil planificados |
| 110.4–120s | Cierre original | Voz y marca originales |

## Reproducir

Desde `my-video`:

```powershell
npm ci
node node_modules/typescript/bin/tsc --noEmit
npx remotion studio src/extension-index.tsx
```

Composiciones: `C4SantiagoExtended` (todo el montaje), `C4SantiagoAdditions` (49s nuevos) y `C4SantiagoClosing` (cierre con transición). Source: `src/extension/`. SVG, entradas y conectores dependen del frame; sin animaciones CSS o temporizadores. Fondo luminoso y paleta conservan el lenguaje de la referencia.

Desde la raíz del repo, render/ensamblado reproducible:

```powershell
uv run --locked python my-video/scripts/assemble_santiago.py --render
```

Si Chromium ya está instalado en una ruta específica, añadir `--browser RUTA`. El script usa FFmpeg/ffprobe instalados o los binarios locales de Remotion; no descarga herramientas adicionales. También se puede exportar toda la composición con `npx remotion render src/extension-index.tsx C4SantiagoExtended ../artifacts/c4-ai-santiago-full-render.mp4`.

El ensamblado eficiente renderiza adiciones/cierre y normaliza los fragmentos antes de unirlos; fuerza3600frames y120s. Salida: `artifacts/c4-ai-santiago-extended-120s.mp4`; hashes y metadatos en `artifacts/santiago-extension-probe.json`. Solo se sobrescriben archivos derivados en artifacts, nunca el MP4 original.

## Qué sabemos de la herramienta original

El MP4 contiene H264/AAC y etiquetas genéricas mp42/isom. No tiene tag encoder, editor o proyecto. El remoto revisado incorpora el website en Next.js/React/MDX (PR41); no contiene un proyecto editable que identifique este video de71s. Por tanto, **herramienta del video original desconocida**. Esta ampliación sí utiliza Remotion y FFmpeg, verificables en su source.

[Spec027](../docs/specs/027-santiago-video-extension/spec.md) · [Pruebas y decisiones](../docs/producto/PRUEBAS_Y_DECISIONES.md) · [Handoff actualizado](../docs/equipo/HANDOFF_2026-10-17.md).

## Validación final

120.000s,3600frames,1080p30; fotogramas revisados en61.2,62.4,86,111.2 y115s. Relojes de video normalizados a1/15360 antes de concatenar para evitar congelamientos. Audio48kHz, pico−4.44dBFS, cero muestras saturadas. [Evidencia versionada](../docs/evidencia/2026-10-17-santiago-video-extension.json). Revisión creativa y publicación YouTube pendientes.
