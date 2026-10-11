# Evaluaciones y aceptación de candidatos
Estado: planificado; fixtures validan contratos, no rendimiento real.
## Protocolo
1. Congelar baseline, candidato, política y dataset/version/hash.
2. Ejecutar los mismos casos con mismas herramientas y entorno; registrar modelo/config y diferencias de ejecución.
3. Guardar input, output, llamadas, assertion y resultado por caso.
4. Comparar antes/después; repetir casos no deterministas y documentar variación.
5. Gate determinista: accepted solo si el caso objetivo mejora, after.passed >= before.passed, no hay regresiones en casos que pasaban y todos los casos obligatorios de seguridad pasan.
6. Fallo de evaluación o evidencia faltante → needs_human_review; candidato que viola controles → rejected.

Comparar conteos con igual total > 0; evaluar casos por IDs. Un LLM juez puede apoyar clasificación, no sustituir assertions objetivas.
## Dataset inicial
[Soporte/reembolsos](../../datasets/sample/refunds.json): casos sintéticos de elegibilidad, plazo, contexto ausente, herramienta no permitida, rechazo de inyección y recuperación.
Expandir a 30+ casos con provenance synthetic/real_anonymized. No afirmar que los sintéticos son datos empresariales reales.
## Métricas
Pass rate = passed/total; tasa de correcciones autónomas sobre incidentes elegibles; regresiones por IDs; latencia p50/p95 y costo por trabajo.
Costo nulo indica desconocido. Reportar cobertura de medición y fuente de precios; no mezclar tokens con USD.
## Pruebas al implementar
Corrección efectiva; candidato que mejora total pero rompe un caso previo; bypass de política; PII leakage; herramienta fallida; timeout/429; budget agotado; restart del worker; ejecución duplicada; dataset distinto bloquea comparación.
## Escala
1.000 unidades = 1.000 jobs únicos con resultado auditable, no 1.000 llamadas repetidas a un modelo.
12 horas = prueba real con timestamps/uptime/fallos y reinicios. Nunca sustituir evidencia real por mocks.
