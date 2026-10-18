# C4 AI — ampliación del video de Santiago

Continuación vigente elegida por Deimer. Se conserva el montaje visual del MP4 de71s y se insertan49s antes del cierre: **120 segundos,3600frames,30FPS,1920×1080**. La composición de `FILM.md` se conserva como variante anterior.

## Montaje y voz

La pausa de61.169–61.698s permite insertar los nuevos capítulos en61.4s sin cortar una frase. Se conservan los61.4s iniciales y se retoman los9.6s finales originales, con transición blanca al cierre. La fuente `public/reference/santiago-original.mp4` es una copia de trabajo inmutable del archivo aportado, no se modifica el original de Downloads.

La primera revisión conservó la voz original y añadió49s subtitulados. Nueva elección de Deimer: **Brian de ElevenLabs para todo el video**, incluidos los capítulos añadidos. Se sustituye la pista original completa en una nueva copia, sin clonar ni mezclar narradores. El MP4 original y la revisión con su voz se conservan. El editor y la voz originales siguen sin identificar.

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

## Validación de la variante con voz original

120.000s,3600frames,1080p30; fotogramas revisados en61.2,62.4,86,111.2 y115s. Relojes de video normalizados a1/15360 antes de concatenar para evitar congelamientos. Audio48kHz, pico−4.44dBFS, cero muestras saturadas. [Evidencia versionada](../docs/evidencia/2026-10-17-santiago-video-extension.json). Revisión creativa y publicación YouTube pendientes.

## Nueva narración completa — Brian

Muestra premade generada con HTTP200; voz `nPczCjzI2devNBz1zQrb`, modelo `eleven_multilingual_v2`, idioma español. Guion temporizado: `src/extension/brian-narration.json`. Los clips se cachean por hash de texto/voz/modelo/ajustes. Se acortó la redacción de impacto/ecosistema para evitar acelerar demasiado o cortar palabras. Mezcla con música ambiente local y ducking; la pista original no se mantiene debajo de la nueva voz.

```powershell
# Desde raíz: usa clips versionados, sin llamar al proveedor
uv run --locked python my-video/scripts/narrate_extension.py
# Solo si faltan clips y se autoriza generación en cuenta
uv run --locked python my-video/scripts/narrate_extension.py --generate
# Desde my-video, preview de la edición narrada
npx remotion studio src/extension-index.tsx C4SantiagoBrian
```

Salida nueva: `artifacts/c4-ai-santiago-brian-120s.mp4`. La mezcla se aplica por stream copy de video: conserva todos los fotogramas y sus transiciones. `public/extension-voice/` conserva audios; `src/extension/brian-manifest.json` registra voz, duraciones, tempo, consumo y hash, sin credenciales. La composición C4SantiagoBrian silencia el montaje previo y usa la misma mezcla completa.

Crédito de narración: **ElevenLabs — Brian**. Cuenta Free comprobada durante la generación; no se compraron planes. La publicación comercial requiere los derechos correspondientes; el video no se ha subido ni publicado automáticamente.

Validación de Brian:13 segmentos narrados,120.000s,3600frames y flujo H264 idéntico al montaje previo. Audio final AAC48kHz, pico−4.84dBFS, cero muestras saturadas. [Evidencia de narración](../docs/evidencia/2026-10-17-brian-narration.json). El contador de cuenta terminó en2241 caracteres; el delta del manifest corresponde solo a la última invocación, no a todos los clips cacheados. Costo USD desconocido.
