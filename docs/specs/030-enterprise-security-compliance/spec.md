# Ciberseguridad, Integridad de Datos, Cumplimiento Legal y Auditoría SaaS
ID: C4-CORE-030. Estado: Draft. Responsable: DEIMER-PY. Revisores: Santiago/Claude.

## Problema y Usuario
Para que C4 AI opere como una plataforma SaaS enterprise de confiabilidad de agentes (en línea con los estándares de OpenAI, Anthropic y Google Cloud Vertex AI), requiere una arquitectura de seguridad y gobernanza legal con rigor institucional:
1. **Riesgos de Modelos de Lenguaje**: Ataques de inyección de prompt (directos e indirectos), exfiltración de credenciales y agencia excesiva según el catálogo OWASP LLM Top 10.
2. **Integridad y Cadena de Custodia de Datos**: Los veredictos de confiabilidad no pueden ser alterados ni repudiados. Cada dataset evaluado, prompt candidato y decisión del gate requiere sellado criptográfico mediante SHA-256 y HMAC.
3. **Marco Regulatorio y Cumplimiento Legal (SaaS Readiness)**: Cumplimiento de la Ley de Inteligencia Artificial de la Unión Europea (EU AI Act - Sistemas de Alto Riesgo, Artículos 9 a 15 sobre gestión de riesgos, gobernanza de datos y supervisión humana), criterios de confianza SOC 2 Tipo II (Seguridad, Confidencialidad e Integridad de Procesamiento) y GDPR/Tratamiento de Datos Personales (PII sanitization).

Público objetivo: Oficiales de Seguridad de la Información (CISO), Equipos Legales y de Cumplimiento (Compliance Officers), Auditores de Sistemas y Líderes Técnicos de Plataformas de Agentes.

## Alcance
- **Incluido**:
  - Modelos declarativos Pydantic en `c4/schemas/audit.py`:
    - `AuditLogEntry`: Estructura inmutable con `timestamp`, `session_id`, `actor`, `action`, `resource_hash`, `hmac_signature` y `metadata`.
    - `IntegrityProof`: Verificación de integridad de ejecuciones mediante Merkle/SHA-256.
  - Modelos declarativos Pydantic en `c4/schemas/compliance.py`:
    - `OwaspCheck`: Verificación de controles LLM-01 a LLM-10 con estado (`passed`, `mitigated`, `not_applicable`).
    - `EuAiActAssessment`: Evaluación de gobernanza y mitigación de riesgos para agentes autónomos.
    - `Soc2Control`: Registro de controles de seguridad perimetral y trazabilidad.
  - Documentos normativos y directrices de seguridad:
    - `docs/seguridad/COMPLIANCE_SAAS.md`: Marco legal, acuerdos de procesamiento de datos (DPA), responsabilidades del cliente vs proveedor (Shared Responsibility Model), y clasificación bajo el EU AI Act.
    - `docs/seguridad/OWASP_LLM_TOP10.md`: Mapeo exhaustivo de las 10 vulnerabilidades críticas de OWASP LLM y mitigaciones deterministas de C4 AI.
    - `docs/seguridad/DATA_INTEGRITY.md`: Cadena de custodia criptográfica, hashing de datasets y anonimización de PII.
  - Diagramas arquitectónicos vectoriales SVG:
    - `docs/assets/security-architecture.svg`: Mapa visual de 1200x940 con los 4 anillos concéntricos de defensa en profundidad de C4 AI.
    - `docs/assets/compliance-pyramid.svg`: Diagrama piramidal con las capas de cumplimiento normativo (OWASP, SOC 2, ISO/IEC 42001, EU AI Act).
  - Actualización de `scripts/verify_docs.py` y `docs/specs/README.md`.
- **Excluido**:
  - Integración con proveedores externos de HSM (Hardware Security Module) en el MVP.
  - Envío de telemetría a servidores no declarados en `.env`.

## Requisitos
- **FR-001 (Esquema de Auditoría Criptográfica)**: `c4/schemas/audit.py` debe modelar entradas inmutables con sello hash SHA-256 del contenido y validación de tipos Pydantic.
- **FR-002 (Esquema de Cumplimiento Normativo)**: `c4/schemas/compliance.py` debe estructurar auditorías automáticas de controles OWASP LLM Top 10 y requerimientos de supervisión del EU AI Act.
- **FR-003 (Documentación de Cumplimiento y Legalidad SaaS)**: Tres documentos exhaustivos en `docs/seguridad/` con directrices formales, términos de uso de modelos, soberanía de datos y no entrenamiento con datos de clientes.
- **FR-004 (Mapas de Arquitectura SVG)**: Generar `docs/assets/security-architecture.svg` y `docs/assets/compliance-pyramid.svg` con el estilo visual consistente del repositorio (paleta `#0B1425`, contrastes accesibles y etiquetas semánticas).
- **FR-005 (Pruebas Unitarias de Esquemas)**: `tests/unit/test_compliance_schemas.py` con 100% de cobertura en serialización, validación y verificación de integridad.

## Aceptación
- **AC-001**: Modelos `AuditLogEntry`, `IntegrityProof`, `OwaspCheck` y `EuAiActAssessment` validan datos correctos y rechazan hashes truncados o formatos inválidos.
- **AC-002**: Los archivos SVG son sintácticamente válidos, renderizan sin dependencias externas y pasan `scripts/verify_docs.py`.
- **AC-003**: Toda la documentación enlaza correctamente con los esquemas y las especificaciones existentes.
- **AC-004**: La suite de pruebas de Python se ejecuta sin advertencias ni regresiones (100% PASS).

## Dudas Bloqueantes
- Ninguna. Los esquemas y documentación son complementarios al ciclo de confiabilidad y no alteran la API pública v1 existente.
