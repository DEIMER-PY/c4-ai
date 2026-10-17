# Campos de entrega — borrador revisable

**No enviado.** Repo y tablero siguen privados. Las URLs GitHub solo funcionan para personas con acceso; aún falta resolver el requisito oficial de repositorio público. No compartir automáticamente por correo, Drive o Slack.

Repositorio: https://github.com/DEIMER-PY/c4-ai

Rama snapshot creada: codex/release-s1-end-to-end, desde develop integrado (primer snapshot ad1438e). Las features se integran por PR en develop; la rama de entrega fija una versión revisable, no sustituye el flujo de trabajo.

Reporte técnico: https://github.com/DEIMER-PY/c4-ai/blob/codex/release-s1-end-to-end/docs/entregas/S1_REPORTE_TECNICO.md

Video: archivo local `artifacts/c4-ai-s1-demo.mp4`; URL por definir tras revisar y elegir alojamiento. No colocar una ruta de disco en el campo URL del formulario.

## Notas propuestas

C4 AI completa detectar→diagnosticar→corregir→evaluar→decidir, con Grok como analista y evidencia por ejecución. Demo de soporte/reembolsos sobre seis casos sintéticos: baseline5/6→candidato6/6, cero regresiones y controles obligatorios aprobados, 14 llamadas y20.720 tokens reportados. Costo monetario desconocido. Otra prueba con Groq como target se rechazó por regresión; no se aplica nada a producción. CLI conversacional por streaming, dashboard conectado a API local y cuatro herramientas de consulta MCP para Hermes verificados. Telegram→C4 pendiente de prueba humana. Repo privado por decisión del equipo; publicación/licencia, rotación de credencial histórica, dataset30+, workers y escala pendientes. Video: montaje narrado con capturas de ejecuciones reales guardadas, no una ejecución continua en vivo.
