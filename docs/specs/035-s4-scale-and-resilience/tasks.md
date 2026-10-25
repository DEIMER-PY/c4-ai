# Tareas de Implementación: Hito S4 y Motor de Lotes de Alta Escala
ID: C4-TASKS-035. Plan: docs/specs/035-s4-scale-and-resilience/plan.md. Responsable: DEIMER-PY.

## Lista de Tareas
- [x] T-001: Crear spec, plan y tasks en `docs/specs/035-s4-scale-and-resilience/`.
- [x] T-002: Implementar `c4/services/batch.py` con `BatchRunner`, backoff exponencial, circuit breaker y cálculo de percentiles.
- [x] T-003: Añadir comando CLI `c4 batch` en `c4/cli.py`.
- [x] T-004: Redactar entregables de Semana S4 (`docs/entregas/S4_CRITERIOS.md`, `S4_REPORTE_TECNICO.md`, `S4_FORMULARIO.md`).
- [x] T-005: Desarrollar pruebas unitarias en `tests/unit/test_batch_resilience.py`.
- [x] T-006: Actualizar índice `docs/specs/README.md`.
- [x] T-007: Validar suite completa (`unittest`) y verificar documentación (`scripts/verify_docs.py`).
