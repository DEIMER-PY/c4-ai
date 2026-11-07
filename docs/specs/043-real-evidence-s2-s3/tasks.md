# Tareas 043
Plan: [plan](plan.md). Responsable: DEIMER-PY con Claude.

- [x] T-001: `LICENSE` MIT y metadatos en `pyproject.toml` y README (FR-007).
- [x] T-002: `c4/services/run_evidence.py` y `scripts/export_run_evidence.py`, con `--check` (FR-001, FR-002, FR-003).
- [x] T-003: `scripts/run_milestone_suite.py` con tope de USD (FR-004).
- [x] T-004: API `/metrics` y `/api/v1/metrics/overview` en vivo desde el almacén (FR-001).
- [x] T-005: Archivar la evidencia ilustrativa y corregir S2/S3/S4, ESTADO y la nota de CLAUDE.md.
- [ ] T-006: Corridas reales sobre `refunds_v2`, exportación y reporte de costos (AC-001, AC-002).
- [x] T-007: `tests/integration/test_agent_e2e.py`, `tests/evals/test_dataset_contract.py` y unit tests de `run_evidence` (FR-005).
- [x] T-008: Agregar `tests/integration` y `tests/evals` al job `quality` (FR-006).
- [x] T-009: Reintentos acotados en `Gateway` (timeout, conexión y 5xx; el 429 no) y `tests/unit/test_gateway_retries.py`.
- [x] T-010: Dataset v2.1.0 con la política explícita (FR-009).
- [x] T-011: README sobrio, `docs/arquitectura/AGENTE.md` con UML y capturas reales del CLI (FR-008).
