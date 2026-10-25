# Plan de Implementación: Observabilidad Enterprise y Hardening
ID: C4-PLAN-036. Spec: docs/specs/036-enterprise-observability-and-hardening/spec.md. Responsable: DEIMER-PY.

## Fases de Implementación

### Fase 1: Motor de Sanitización PII (`c4/tools/sanitizer.py`)
1. Implementar patrones RegEx para correos electrónicos, números de tarjetas de crédito/débito (con validación de longitud), tokens Bearer/API keys y números telefónicos.
2. Crear la clase `PiiSanitizer` con métodos `sanitize_text(text: str) -> tuple[str, list[dict]]` y `sanitize_payload(payload: dict) -> dict`.

### Fase 2: Red Teaming y Fuzzing de Seguridad (`c4/tools/red_team.py`)
1. Definir el catálogo de 10 vectores adversariales basados en OWASP LLM Top 10 (jailbreaks directos, delimitadores, PII extraction, code injection, token smuggling).
2. Implementar `RedTeamScanner` para verificar prompts de candidatos antes de su ejecución y generar `RedTeamReport`.

### Fase 3: Observabilidad y Métricas Prometheus en FastAPI (`c4/api.py`)
1. Implementar endpoint `/healthz` con diagnóstico de componentes (almacenamiento, configuración).
2. Implementar endpoint `/metrics` en formato texto plano Prometheus.
3. Implementar endpoint `/api/v1/metrics/overview` con métricas JSON consolidadas.

### Fase 4: Hardening de Infraestructura (`docker-compose.yml`)
1. Crear `docker-compose.yml` para orquestar `api`, `dashboard`, `website` y opcionalmente `prometheus`.
2. Añadir healthchecks y políticas de aislamiento de red.

### Fase 5: Documentación y Pruebas
1. Crear `docs/arquitectura/OBSERVABILIDAD.md`.
2. Implementar pruebas unitarias:
   - `tests/unit/test_pii_sanitizer.py`
   - `tests/unit/test_red_team_security.py`
   - `tests/unit/test_telemetry_metrics.py`
3. Actualizar `docs/specs/README.md`.
4. Validar suite completa con `unittest` y `verify_docs.py`.
