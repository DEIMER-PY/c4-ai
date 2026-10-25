# Plan: Ciberseguridad, Integridad de Datos, Cumplimiento Legal y Auditoría SaaS
Fuente: [`spec.md`](spec.md). Responsable: DEIMER-PY.

## Arquitectura y Módulos
```mermaid
graph TD
    subgraph "Seguridad Perimetral y Controles"
        A["Entrada de Trazas / Datasets"] --> B["Sanitización de PII y Anti-Inyección (OWASP LLM-01)"]
    end
    subgraph "Procesamiento y Razonamiento"
        B --> C["Aislamiento de Gateway (Grok / Hermes / Ollama Loopback)"]
        C --> D["Gate Determinista Inmutable (0 Regresiones)"]
    end
    subgraph "Gobernanza y Evidencia Sellada"
        D --> E["c4/schemas/audit.py (SHA-256 + HMAC)"]
        D --> F["c4/schemas/compliance.py (EU AI Act & SOC 2)"]
        E --> G["Registro Forense Inmutable (.json)"]
    end
```

## Fases de Implementación
1. **Fase 1: Esquemas Pydantic de Auditoría y Cumplimiento**:
   - Crear `c4/schemas/audit.py`.
   - Crear `c4/schemas/compliance.py`.
   - Desarrollar pruebas unitarias en `tests/unit/test_compliance_schemas.py`.
2. **Fase 2: Documentación de Seguridad, Tratamiento de Datos y Marco SaaS**:
   - Redactar `docs/seguridad/COMPLIANCE_SAAS.md`.
   - Redactar `docs/seguridad/OWASP_LLM_TOP10.md`.
   - Redactar `docs/seguridad/DATA_INTEGRITY.md`.
3. **Fase 3: Artefactos Visuales SVG de Arquitectura de Seguridad**:
   - Diseñar `docs/assets/security-architecture.svg`.
   - Diseñar `docs/assets/compliance-pyramid.svg`.
4. **Fase 4: Validación y Verificación Global**:
   - Registrar la especificación en `docs/specs/README.md`.
   - Actualizar `scripts/verify_docs.py` para validar 22 SVGs y nuevos documentos.
   - Ejecutar suite de pruebas completa y verificar cero regresiones.
