# Marco de Cumplimiento Normativo y Legalidad SaaS — C4 AI

## 1. Declaración Institucional y Filosofía
C4 AI está diseñado bajo el principio de **confiabilidad con evidencia demostrable**, adoptando los estándares de seguridad, privacidad y gobernanza aplicados por los principales proveedores de infraestructura de IA empresarial (OpenAI, Anthropic, Google Cloud). 

Este marco establece las garantías jurídicas, operativas y técnicas para el despliegue de C4 AI como solución SaaS o híbrida de misión crítica.

---

## 2. Modelo de Responsabilidad Compartida (Shared Responsibility Model)

| Capa de Servicio | Responsabilidad de C4 AI | Responsabilidad del Cliente / Operador |
| :--- | :--- | :--- |
| **Infraestructura y Aislamiento** | Aislamiento de sesiones en entornos segregados; encriptación en tránsito (TLS 1.3) y en reposo (AES-256). | Gestión y rotación de claves API maestras (`GROK_API_KEY`, etc.) y control de acceso local. |
| **Pipeline de Evaluación** | Inmutabilidad de datasets de referencia, cálculo de regresiones y ejecución determinista del Gate. | Definición de políticas de negocio, datasets representativos y umbrales de aceptación. |
| **Tratamiento de Datos** | Política estricta de **cero reentrenamiento** (*Zero Data Retention for Training*); sanitización perimetral de trazas. | Anonimización previa de datos altamente sensibles antes de la ingestión si aplica por ley sectorial. |
| **Acciones en Producción** | Bloqueo por diseño de mutaciones no autorizadas en producción; emisión de reportes forenses sellados. | Decisión humana final de despliegue en entornos productivos. |

---

## 3. Conformidad con la Ley de Inteligencia Artificial de la Unión Europea (EU AI Act)

C4 AI implementa controles exhaustivos alineados con los requerimientos obligatorios para sistemas de IA de alto riesgo (Capítulo III, Artículos 9 al 15 del Reglamento (UE) 2024/1689):

### Artículo 9 — Sistema de Gestión de Riesgos
- **Monitoreo Continuo**: Evaluación sistemática de riesgos emergentes en el comportamiento del agente evaluado, incluyendo fallos de política, alucinaciones y vulnerabilidades ante inyecciones.
- **Pruebas de Esfuerzo**: El harness evalúa de forma paralela escenarios límite (*boundary cases*) y ataques simulados antes de permitir la emisión de veredictos.

### Artículo 10 — Gobernanza y Calidad de Datos
- **Inmutabilidad y Versionado**: Los datasets de prueba (e.g., [`datasets/sample/refunds_v2.json`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/datasets/sample/refunds_v2.json)) se versionan con hash criptográfico SHA-256.
- **Representatividad**: Casos sintéticos balanceados que cubren operaciones válidas, casos de borde y escenarios adversarios sin sesgos discriminatorios.

### Artículo 11 — Documentación Técnica
- **Metodología SDD**: Cada funcionalidad cuenta con especificación (`spec.md`), plan de arquitectura (`plan.md`) y desglose de tareas (`tasks.md`) auditables en el directorio `docs/specs/`.

### Artículo 12 — Registro Automático de Eventos (Logging)
- **Trazabilidad Completa**: Registro cronológico de cada llamada, latencia, consumo de tokens, diffs y decisiones del gate mediante el esquema [`c4/schemas/audit.py`](file:///C:/Users/Usuario/OneDrive/Documentos/PROYECTO_AGENTS_C4_AI/c4/schemas/audit.py).

### Artículo 13 — Transparencia e Interpretabilidad
- **Reportes Explicables**: Cada diagnóstico identifica la causa raíz en lenguaje natural y emite las diferencias exactas de prompt antes de cualquier modificación.

### Artículo 14 — Supervisión Humana (Human-in-the-Loop)
- **El Gate Determinista**: Un prompt candidato **nunca** se promueve automáticamente si genera regresiones o no mejora el caso objetivo. Ante ambigüedades, el sistema emite el veredicto `needs_human_review`, impidiendo la autonomía descontrolada.

### Artículo 15 — Precisión, Robustez y Ciberseguridad
- **Resiliencia Determinista**: Pruebas automáticas contra perturbaciones y blindaje frente a inyecciones directas o indirectas de prompt.

---

## 4. Criterios de Confianza SOC 2 Tipo II

C4 AI se alinea con los cinco Criterios de Servicios de Confianza (Trust Services Criteria) de AICPA:

1. **Seguridad (Security)**: Los secretos y credenciales residen exclusivamente en variables de entorno locales o gestores de secretos corporativos; nunca se guardan en el historial del CLI ni en los reportes de evidencia.
2. **Disponibilidad (Availability)**: Límites de tiempo de espera (`timeout`), gestión de cuotas de tokens y soporte multimodelo con degradación elegante ante caídas de proveedores.
3. **Integridad del Procesamiento (Processing Integrity)**: Garantía de que la evaluación del candidato utiliza exactamente los mismos casos de prueba que la evaluación de línea base.
4. **Confidencialidad (Confidentiality)**: Ningún dato de cliente es compartido entre organizaciones o utilizado para entrenar modelos base.
5. **Privacidad (Privacy)**: Cumplimiento de GDPR / Leyes de Protección de Datos Personales; soporte nativo para detección y enmascaramiento de PII.

---

## 5. Acuerdos de Procesamiento de Datos (DPA) y Cláusulas Estándar

- **No Retención para Entrenamiento**: Los proveedores de LLM subyacentes (xAI Grok, Groq, etc.) son configurados bajo contratos empresariales con directiva de no almacenamiento de inferencia para entrenamiento.
- **Soberanía y Residencia**: Los datos de sesiones y evidencia pueden ser persistidos localmente (`Store` local) o en nubes privadas según el requisito de soberanía del cliente.
