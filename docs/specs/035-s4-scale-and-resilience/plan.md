# Plan de Implementación: Hito S4 y Motor de Lotes de Alta Escala
ID: C4-PLAN-035. Spec: docs/specs/035-s4-scale-and-resilience/spec.md. Responsable: DEIMER-PY.

## Fases de Implementación

### Fase 1: Servicio `c4/services/batch.py`
1. Diseñar las clases `BatchConfig`, `BatchResult`, `BatchMetrics` y `BatchRunner`.
2. Implementar pool de workers con `concurrent.futures.ThreadPoolExecutor`.
3. Implementar backoff exponencial con jitter para rate limiting (429).
4. Implementar circuit breaker con estados `CLOSED`, `OPEN`, `HALF_OPEN`.
5. Implementar cálculo estadístico determinista de percentiles p50, p95, p99.

### Fase 2: Integración en CLI (`c4 batch`)
1. Añadir el subcomando `batch` en `c4/cli.py` con opciones de dataset, unidades, concurrencia, mock y timeout.
2. Renderizar tabla resumen en Rich con métricas de rendimiento y telemetría de fallos.

### Fase 3: Documentación de Entrega Semana S4
1. Redactar `docs/entregas/S4_CRITERIOS.md` mapeando la rúbrica oficial de S4 (1.000 unidades, doce horas desatendido, bitácora de resiliencia).
2. Redactar `docs/entregas/S4_REPORTE_TECNICO.md` detallando la arquitectura de procesamiento en lote, gráficos de latencia p50/p95/p99, tolerancia a fallos y economía a escala de 1.000 unidades.
3. Redactar `docs/entregas/S4_FORMULARIO.md` con campos listos para postulación y notas operativas.

### Fase 4: Pruebas y Validación Integral
1. Desarrollar `tests/unit/test_batch_resilience.py`.
2. Actualizar índice `docs/specs/README.md`.
3. Validar suite de pruebas (`unittest`) y verificar documentación (`python scripts/verify_docs.py`).
