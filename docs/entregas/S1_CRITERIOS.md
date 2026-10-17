# Auditoría de criterios oficiales

Fuente: [Reto Agente 2026](https://reto.pltk.mx/), consultada 2026-10-17. El formulario adjunto pide repositorio, video, reporte técnico y notas; prepararlo no equivale a enviarlo. No se autoasignan puntos ni se afirma aprobación del jurado.

| Hito / criterio | Estado | Evidencia / falta |
|---|---|---|
| S1: agente end-to-end contra Grok | Verificado técnicamente | Sesión c4_63fb290ce5244c248f0b929120f14df2: accepted, 5/6→6/6, cero regresiones |
| S1: README del problema | Verificado | README con arquitectura, stack, instalación y evidencia |
| S1: repositorio público | Pendiente por decisión del equipo | Repositorio/tablero privados. No cambiar visibilidad; antes revisar licencia y rotación de credencial histórica |
| S2: tres herramientas reales | Verificado para MVP | trace_reader, patch_writer y eval_runner; MCP añade cuatro consultas, no reemplaza esas herramientas |
| S2: manejo de errores | Verificado localmente | Proveedor/contrato/budget/cancelación, checkpoints y errores HTTP; recuperación distribuida pendiente |
| S2: diez ejecuciones | Pendiente de completar/conciliar | 11 carpetas locales: 8 succeeded, 2 failed, 1 running histórico; no equivalen automáticamente a diez ejecuciones calificadas |
| S2: video dos minutos | Render local verificado | 120s, H.264/AAC,1280×720,24fps; voz española y frames revisados. Revisión humana y URL compartible pendientes |
| S3: 30+ casos propios | Pendiente | 6 casos sintéticos versionados; no datos reales de clientes |
| S3: costo por tarea | Parcial | Tokens/latencia/llamadas reales; tarifas y USD desconocidos |
| S4: 1.000 unidades y 12 horas reales | Pendiente | Sin ejecución de escala ni supervisión desatendida configurada |
| Formulario: reporte técnico | Preparado | [Reporte](S1_REPORTE_TECNICO.md), acceso privado |

Las 14 llamadas de una sesión no son 14 ejecuciones. Los 11 incidentes del dashboard no demuestran el cumplimiento del mínimo de S2. No convertir antiguos estados running en éxito sin recuperar/verificar evidencia.

## Track 1

Impacto25, autonomía25, ingeniería Grok20, datos reales15, viabilidad10, comunicación5. Brechas: validar problema con usuarios, ampliar incidentes/dataset propio, cobertura de costos y evidencia de operación prolongada. Las respuestas de modelos son reales; los inputs del demo son sintéticos. El puntaje lo asigna la organización.

## Orden de trabajo

1. Deimer: validar video/reporte y resolver rotación/acceso de evaluadores sin cambiar privacidad por iniciativa del agente.
2. Santiago: revisar UX y presentación; completar C4-006 (jobs/métricas/candidatos y actualización de estados) con contratos acordados.
3. Deimer: API de ejecución, PostgreSQL/migraciones y dataset30+; ambos revisan contratos.
4. Ambos: tarifas/costos, ejecuciones calificadas y revisión de seguridad; después workers/escala/Jev/Tauri.
