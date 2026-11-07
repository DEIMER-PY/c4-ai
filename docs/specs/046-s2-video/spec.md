# Feature: Video S2 con ejecución en vivo y recuperación de errores
ID: C4-DOC-046. Estado: Done. Responsable: DEIMER-PY (con Claude).

## Problema
El hito S2 pide un video de 2 minutos que muestre el agente corriendo, decidiendo solo y recuperándose de un error. El video publicado era el de S1: una narración sobre evidencia de octubre que decía que los 30 casos y los costos estaban pendientes.

## Alcance
- Grabación de pantalla real de `c4 demo` contra Grok. Las esperas se aceleran y la velocidad se indica en pantalla.
- `c4 report` muestra una tabla de errores del proveedor con su reintento y resultado (`c4/cli.py`), a partir de los registros `status`, `attempt` y `http_status` que ya guarda el gateway.
- Composición Remotion `C4S2` (`my-video/src/s2-index.tsx`) y narración de ElevenLabs con la voz Brian (`my-video/scripts/narrate_s2.py`).

## Aceptación
- AC-001: Toda cifra del video sale de una sesión guardada o de la evidencia exportada (`--check` sin discrepancias).
- AC-002: El video muestra un error real del proveedor y la recuperación (sesión `c4_4015ff603efc40ddbbdfd9f86d46015e`).
- AC-003: Pruebas unitarias e integración en verde.

## Reproducir
```powershell
uv run python my-video/scripts/narrate_s2.py      # reutiliza los clips existentes
cd my-video; npx remotion render src/s2-index.tsx C4S2 ../artifacts/c4-ai-s2-herramientas.mp4
```
