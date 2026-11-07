# Plan 044
Spec: [044](spec.md).
- `c4/tools/grok.py`: `Settings.max_fix_attempts` desde `C4_MAX_FIX_ATTEMPTS`, validado entre 1 y 5.
- `c4/tools/refunds.py`: `patch_writer(..., feedback)` agrega `previous_attempt` al payload y usa el propósito `repair_patch:N`.
- `c4/services/reliability.py`: `apply_proposal`, `evaluate_candidate` y el bucle en `eval_runner`. `limits.max_fix_attempts` se fija al crear la sesión.
- `c4/services/run_evidence.py`: exporta `repair_attempts` y `repair_stopped`, y agrega la columna "Intentos" al reporte.
- Pruebas: `tests/integration/test_agent_e2e.py` cubre AC-001 a AC-003.
- Riesgo: más gasto por sesión. Se mitiga con el tope de llamadas y el umbral de presupuesto previo a cada intento.
