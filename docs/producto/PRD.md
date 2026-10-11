# PRD — C4 AI
Estado: planificado. Marca pública C4 AI; ProofLoop fue el concepto previo.
## Problema y público
Equipos que construyen agentes deben investigar trazas, ajustar prompts y repetir pruebas manualmente cuando fallan. Público: desarrolladores y equipos de producto/operaciones que ya operan agentes.
## Propuesta
Ingeniero autónomo de confiabilidad que investiga un objetivo, usa herramientas y deja evidencia de si una corrección mejora al agente.
## MVP
Entrada: ejecución trazada, versión del agente, política y dataset de evaluación.
Salida: incidente clasificado, diagnóstico, candidato versionado, comparación reproducible, decisión y reporte.
Primer agente objetivo: soporte/reembolsos con catálogo de herramientas permitido y política explícita.
Cubrir errores de herramientas, contexto, recuperación, alucinación e incumplimiento de políticas.
## Límites
Sin cambios automáticos en producción, ejecución arbitraria de código generado, entrenamiento de modelos, SOC completo o integraciones empresariales generalistas.
La seguridad se implementa mediante instrucciones, reglas, herramientas y evals; no mediante fine-tuning inicial.
## Éxito
Cerrar el ciclo con al menos un caso que mejore y otro candidato rechazado por regresión.
Cada resultado identifica versión/dataset, casos fallidos, costo conocido o desconocido y evidencia.
Métricas nunca se presentan como reales si proceden de fixtures.
## Capacidad / estado
| Capacidad | Estado |
|---|---|
| API y CLI | Planificada |
| Seis módulos especializados | Planificada |
| Evaluaciones y decisión | Planificada |
| Dashboard | Planificada |
| Contratos sintéticos para frontend | Preparados, sujetos a validación documental |
| Monitoreo y recuperación | Planificada |
Usar [roadmap](ROADMAP.md) para secuenciar; no confundir planificación con producto ejecutable.
