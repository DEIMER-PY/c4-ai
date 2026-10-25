# Hito S4: Escala de 1.000 Unidades, Resiliencia de 12 Horas y Batch Runner
ID: C4-CORE-035. Estado: Draft. Responsable: DEIMER-PY. Revisores: Santiago/Claude.

## Problema y Contexto
El Reto Agente 2026 estipula en su hito final (Semana S4) que los agentes no solo deben funcionar en micro-sesiones interactivas, sino demostrar capacidad operativa industrial:
1. **Escala de 1.000 Unidades**: Procesamiento masivo de lotes (batch processing) de evaluaciones de agentes con control estricto de concurrencia, métricas de percentiles de latencia (p50, p95, p99), rendimiento (throughput en unidades/segundo) y contabilidad de costos acumulados.
2. **Resiliencia Operativa Prolongada (12 Horas)**: Resistencia contra fluctuaciones de red, límites de tasa de proveedores (HTTP 429 Too Many Requests con backoff exponencial con jitter), disyuntores de circuito (circuit breakers) ante degradación de APIs y salvaguarda de presupuesto para evitar desbordamiento financiero.

C4 AI contaba con ejecución unitaria mediante el CLI (`c4 r` / `c4 run`), pero requería un motor de lotes de alto rendimiento (`c4/services/batch.py`), el comando CLI `c4 batch`, la auditoría de S4 y la bitácora de escala documentada.

## Alcance
- **Incluido**:
  - Implementación del servicio de procesamiento en lote `c4/services/batch.py`:
    - Ejecución concurrente con semáforos/pools de hilos configurables.
    - Mecanismo de reintento exponencial con jitter ante errores 429 y timeouts.
    - Medición estadística de percentiles de latencia (p50, p95, p99) y tasa de éxito (SLA).
    - Disyuntor (Circuit Breaker) que suspende llamadas cuando la tasa de error del proveedor supera el 50%.
    - Techo de presupuesto monetario y de tokens (`budget_ceiling_usd`).
  - Integración del comando CLI `c4 batch` en `c4/cli.py`:
    - Argumentos: `--dataset`, `--units`, `--concurrency`, `--mock-providers`, `--output`.
    - Resumen enriquecido con Rich (tabla de percentiles, costos y estados).
  - Documentación de entrega Semana S4:
    - `docs/entregas/S4_CRITERIOS.md`: Matriz de auditoría de criterios oficiales S4.
    - `docs/entregas/S4_REPORTE_TECNICO.md`: Reporte técnico exhaustivo con benchmark de 1.000 unidades, percentiles de latencia, arquitectura de resiliencia y prueba prolongada.
    - `docs/entregas/S4_FORMULARIO.md`: Plantilla de postulación y notas operativas listas para envío.
  - Pruebas unitarias automatizadas en `tests/unit/test_batch_resilience.py`.
  - Actualización de `docs/specs/README.md`.
- **Excluido**:
  - Peticiones externas no autorizadas a producción sin claves válidas configuradas.

## Requisitos
- **FR-001 (Motor de Lotes)**: `c4/services/batch.py` implementa `BatchRunner` con concurrencia controlada, backoff ante 429 y cálculo de percentiles (p50, p95, p99).
- **FR-002 (Comando CLI `batch`)**: `c4 batch` ejecuta lotes parametrizables y muestra telemetría formateada en terminal.
- **FR-003 (Entregables Semana S4)**: Creación de `S4_CRITERIOS.md`, `S4_REPORTE_TECNICO.md` y `S4_FORMULARIO.md` en `docs/entregas/`.
- **FR-004 (Pruebas de Resiliencia)**: `tests/unit/test_batch_resilience.py` verifica el comportamiento del backoff, circuit breaker y percentiles.
- **FR-005 (Verificación Documental)**: 100% de los enlaces y formatos deben validar con `python scripts/verify_docs.py`.

## Criterios de Aceptación
- **AC-001**: `BatchRunner` procesa 1.000 unidades simuladas con tasa de éxito >99% y calcula p50/p95/p99 con precisión.
- **AC-002**: El disyuntor se dispara y detiene ejecuciones si el proveedor excede el umbral de fallos consecutivos.
- **AC-003**: `tests/unit/test_batch_resilience.py` aprueba al 100%.
- **AC-004**: Los reportes técnicos S4 cumplen con todos los requerimientos oficiales del Reto Agente.

## Dudas Bloqueantes
- Ninguna.
