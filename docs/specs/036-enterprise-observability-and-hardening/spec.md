# Observabilidad Enterprise, Sanitización PII, Red Teaming y Hardening de Infraestructura
ID: C4-CORE-036. Estado: Draft. Responsable: DEIMER-PY. Revisores: Santiago/Claude.

## Problema y Contexto
Para alcanzar el nivel de madurez de plataformas de confiabilidad de IA líderes en la industria (como LangSmith, Langfuse, Arize Phoenix y DeepEval), C4 AI debe robustecer su infraestructura operativa, observabilidad en tiempo real y defensas activas de ciberseguridad:
1. **Observabilidad y Telemetría Industrial**: La API actual solo consulta checkpoints locales sin exponer métricas agregadas ni endpoints estándar para Prometheus u orquestadores (`/healthz`, `/metrics`). Los operadores requieren métricas de uso de tokens, costos acumulados, percentiles de latencia y estado de los disyuntores.
2. **Protección de Privacidad de Datos y Sanitización PII (RGPD / Habeas Data)**: Al procesar trazas e incidentes, los agentes pueden encontrar correos de clientes, tarjetas de crédito, números de teléfono o tokens de API. Es imperativo un motor determinista de enmascaramiento antes de almacenar o emitir evidencia.
3. **Red Teaming Automatizado y Fuzzing de Seguridad (OWASP LLM Top 10)**: Antes de validar un candidato de prompt, se requiere una batería de 10 vectores adversariales (jailbreak, inyecciones delimitadoras, escalado de privilegios, suplantación de identidad) para certificar que el parche no introduce vulnerabilidades críticas.
4. **Hardening de Despliegue y Orquestación**: Docker Compose enterprise que configure la API, Dashboard, Website y servicio de monitoreo con límites de recursos, usuarios no privilegiados y healthchecks activos.

## Alcance
- **Incluido**:
  - Motor de sanitización PII en `c4/tools/sanitizer.py`:
    - Enmascaramiento de emails, tarjetas de pago (Luhn / Regex), tokens de autenticación Bearer/API keys y números telefónicos.
    - Preservación de formato y auditoría de entidades redactadas.
  - Módulo de Red Teaming Automatizado en `c4/tools/red_team.py`:
    - Catálogo de 10 vectores adversariales OWASP LLM Top 10.
    - Motor de evaluación determinista de resistencia y reporte de vulnerabilidades (`RedTeamReport`).
  - Endpoints de observabilidad y métricas en `c4/api.py`:
    - `/healthz`: Verificación profunda de estado del almacenamiento, permisos y disponibilidad.
    - `/metrics`: Exportación estándar en formato Prometheus (`text/plain; version=0.0.4`) con conteo de tokens, evaluaciones por veredicto, costos y disyuntores.
    - `/api/v1/metrics/overview`: JSON consolidado para interfaces de monitoreo.
  - Orquestación con `docker-compose.yml` multi-servicio con healthchecks y seguridad.
  - Documentación de arquitectura de observabilidad en `docs/arquitectura/OBSERVABILIDAD.md`.
  - Pruebas unitarias completas:
    - `tests/unit/test_pii_sanitizer.py`
    - `tests/unit/test_red_team_security.py`
    - `tests/unit/test_telemetry_metrics.py`
  - Registro de la especificación en `docs/specs/README.md`.
- **Excluido**:
  - Modificación de agentes en producción o llamadas a endpoints externos no autenticados.

## Requisitos
- **FR-001 (Sanitización PII)**: `c4/tools/sanitizer.py` detecta y reemplaza PII sensible (`[EMAIL_REDACTED]`, `[CREDIT_CARD_REDACTED]`, etc.) sin alterar la semántica de la política.
- **FR-002 (Red Teaming OWASP)**: `c4/tools/red_team.py` evalúa prompts contra 10 vectores de inyección y emite score de resistencia determinista.
- **FR-003 (Observabilidad Prometheus)**: `c4/api.py` expone `/metrics` en formato Prometheus y `/healthz` con chequeo de dependencias locales.
- **FR-004 (Orquestación Segura)**: `docker-compose.yml` define los servicios de la plataforma con políticas de reinicio y healthchecks.
- **FR-005 (Pruebas Automatizadas)**: Todas las nuevas capacidades cuentan con 100% de cobertura en pruebas unitarias.

## Criterios de Aceptación
- **AC-001**: La sanitización reemplaza 100% de los patrones de correos, tarjetas y credenciales de prueba.
- **AC-002**: El módulo de red teaming clasifica adecuadamente vectores adversariales y genera métricas de seguridad.
- **AC-003**: `/metrics` responde HTTP 200 con formato compatible con Prometheus y métricas de tokens y decisiones.
- **AC-004**: `python scripts/verify_docs.py` y `python -m unittest` aprueban al 100%.

## Dudas Bloqueantes
- Ninguna.
