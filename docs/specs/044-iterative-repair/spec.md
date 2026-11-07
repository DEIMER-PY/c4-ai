# Feature: Reparación iterativa con retroalimentación de la evaluación
ID: C4-CORE-044. Estado: Implementing. Responsable: DEIMER-PY (con Claude). Revisores: Santiago/Claude, Codex.

## Problema y usuario
Antes había un solo intento de reparación por sesión. Las sesiones reales del 2026-11-07 sobre `refunds_v2` 2.1.0 (`c4_cc08566280fe48549132a5a8e1e3540a` y siguientes) llegaron a 31/32 sin fallas de seguridad, pero con 1 regresión. El gate rechaza correctamente, y aun así `patch_writer` nunca se enteraba de qué casos fallaron. `/goal` en la TUI repetía sesiones completas desde cero, sin esa información. Para la autonomía (25 pts) el agente tiene que aprender del rechazo dentro de la misma sesión.

## Alcance
Incluido: un bucle dentro de `eval_runner` que funciona así:
- Si el gate devuelve `rejected` y queda presupuesto, llama otra vez a `patch_writer`. Le pasa el candidato anterior, los casos que fallaron (entrada, esperado, observado), las regresiones y el estado de seguridad.
- Evalúa el nuevo candidato reutilizando los resultados del baseline.
- El historial queda en `repair_attempts` y la exportación de evidencia lo incluye.

Excluido: cambiar contratos o etapas compartidos con el dashboard, y fallback automático a otro modelo.

## Requisitos
- FR-001: `C4_MAX_FIX_ATTEMPTS` (1..5, por defecto 2) limita los intentos. Con 1 se mantiene la conducta anterior.
- FR-002: Solo se reintenta cuando la decisión es `rejected`. Con `needs_human_review` o con un fallo no se reintenta.
- FR-003: Un nuevo intento solo empieza si quedan al menos `1 + casos` llamadas. Si no, se registra `repair_stopped: insufficient_call_budget`.
- FR-004: Los intentos 2 y siguientes no vuelven a ejecutar el baseline. Su costo es 1 llamada de diagnóstico más 1 por caso.
- FR-005: La retroalimentación se trata como dato no confiable. El diff de cada intento siempre se calcula contra el baseline inmutable.
- FR-006: `repair_attempts[]` guarda por intento el SHA del candidato, diff, score, regresiones, seguridad, casos fallidos y decisión.

## Aceptación
- AC-001: Dado un candidato con 1 regresión y un reparador que la corrige, `c4 demo` termina en `accepted` tras 2 intentos con 99 llamadas sobre 32 casos.
- AC-002: Con `max_calls=80` no se inicia el segundo intento y el resultado es `rejected` con `repair_stopped`.
- AC-003: Con `max_fix_attempts=1` el resultado y el número de llamadas son iguales a los de la versión anterior.

## Casos de error
Si un fallo del proveedor ocurre durante la reparación, la sesión queda `failed` con la evidencia de todos los intentos previos. Una propuesta inválida produce `invalid_patch`.

## Dudas bloqueantes
Ninguna. Lo pidió Deimer el 2026-11-07.
