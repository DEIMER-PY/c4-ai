# Entrega S1

**Estado:** reenviada el 2026-11-07 a las 13:22 (hora local) en el panel del reto, con el reporte apuntando a `develop` y la respuesta al comentario del 2026-11-03. En revisión.

El 2026-11-07 se comprobó sin sesión iniciada que el repositorio y el reporte responden HTTP 200. El reporte enviado apuntaba a una rama de feature; ahora se usa `develop`, que es la rama por defecto.

## Enlaces para la re-revisión
- Repositorio: https://github.com/DEIMER-PY/c4-ai
- Reporte S1: https://github.com/DEIMER-PY/c4-ai/blob/develop/docs/entregas/S1_REPORTE_TECNICO.md
- README (problema y cómo correrlo): https://github.com/DEIMER-PY/c4-ai/blob/develop/README.md
- Video de 2 minutos: https://www.youtube.com/watch?v=DqAuvL8im9M
- Licencia MIT: https://github.com/DEIMER-PY/c4-ai/blob/develop/LICENSE

## Respuesta al comentario (lista para copiar)

> Gracias por la retroalimentación. El repositorio ya es público, con licencia MIT, y lo verificamos sin sesión iniciada: https://github.com/DEIMER-PY/c4-ai. El reporte S1 está en https://github.com/DEIMER-PY/c4-ai/blob/develop/docs/entregas/S1_REPORTE_TECNICO.md. El README explica el problema (un agente de reembolsos que falla y cómo C4 AI lo diagnostica, propone una corrección y la evalúa contra el original antes de aceptarla) y cómo correrlo de punta a punta contra Grok con `uv sync` y `uv run c4 demo`. La llave no está en el repositorio: se lee de `.env`, que está ignorado. ¿Podrían revisarlo de nuevo?

## Qué cumple S1

| Requisito | Dónde se ve |
|---|---|
| Repositorio público | https://github.com/DEIMER-PY/c4-ai |
| Corre de punta a punta contra Grok | `uv run c4 demo`; sesión real `c4_43b81508dd4a47ba93b27db27b6e74c7` (17-oct, 5/6 → 6/6, 14 llamadas, USD 0,045) en el [reporte de costos](S3_REPORTE_COSTOS.md) |
| README con el problema y cómo correrlo | [README](../../README.md) |
| La llave no está en el repo | `.env` en `.gitignore`; se revisó el historial de git el 2026-11-07 |

## Video y crédito
Título: C4 AI: cuando tu agente falla, demuestra la corrección | Demo end-to-end

Narración generada con ElevenLabs (voz Brian, cuenta gratuita): https://elevenlabs.io/
