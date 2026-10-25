# Escalado de Evaluación Multimodelo y Datasets
ID: C4-CORE-028. Estado: Draft. Responsable: Deimer/Codex. Revisores: Santiago/Claude.

## Problema y usuario
C4 AI ha demostrado la validez de su ciclo completo con Grok (analista y target) y Groq/Qwen (target externo), pero está limitado a un dataset de 6 casos sintéticos y a dos configuraciones fijas de inferencia. Para cumplir los hitos S3 del reto oficial y ofrecer un valor industrial real, el equipo necesita:
1. Evaluar agentes sobre nuevos modelos objetivo (Llama 3.3 70B, DeepSeek y entornos locales Ollama) para medir la generalización del gate ante arquitecturas diversas.
2. Escalar el banco de pruebas de 6 a 30+ casos representativos (casos límite de políticas, inyecciones adversariales complejas y ambigüedades contextuales).
3. Superar la limitación de `cost_usd = null`, atribuyendo costos monetarios reales en USD mediante tablas de tarifas por proveedor y tarea.

Público objetivo: Desarrolladores de agentes que necesitan asegurar la confiabilidad de sus flujos en múltiples familias de modelos sin introducir regresiones ni sobrecostos imprevistos.

## Alcance
- **Incluido**:
  - Especificación de nuevos adaptadores target para evaluación:
    - Groq con **Llama 3.3 70B Versatile** (`llama-3.3-70b-versatile`).
    - Proveedor **DeepSeek** (`deepseek-chat` / `deepseek-reasoner` vía OpenAI-compatible base URL).
    - Adaptador **Ollama local** (`http://127.0.0.1:11434/v1`) para pruebas locales sin costo de red ni consumo de tokens de pago.
  - Diseño del dataset extendido de soporte y reembolsos con **30+ casos versionados** (`datasets/sample/refunds_v2.json`), clasificando severidad y controles obligatorios de seguridad.
  - Catálogo de tarifas por millón de tokens (input/output) para computar `cost_usd` determinista por llamada y por sesión.
  - Actualización de `--target-provider` en el CLI (`grok`, `groq`, `deepseek`, `ollama`) y comandos `/doctor` correspondientes.
- **Excluido**:
  - Reemplazar a Grok como analista central del ciclo (Grok permanece como el Ingeniero de Confiabilidad que investiga y redacta candidatos).
  - Fine-tuning o entrenamiento de modelos.
  - Aplicar cambios automáticamente en producción o ejecutar código dinámico arbitrario.
  - Integración de pagos con tarjeta de crédito o balance bancario.

## Requisitos
- **FR-001**: Soporte ampliado en `--target-provider`: aceptar `grok`, `groq`, `deepseek`, `ollama` manteniendo validación estricta de variables de entorno específicas sin filtrar claves en logs.
- **FR-002**: Integración de Llama 3.3 70B y DeepSeek mediante protocolo OpenAI-compatible (`chat/completions`), con mapeo determinista de llamadas a herramientas (`tool_calls`).
- **FR-003**: Soporte para Ollama local con fallback offline (sin conexión a internet), permitiendo validar agentes en entornos aislados con costo monetario cero.
- **FR-004**: Dataset ampliado `refunds_v2.json` con un mínimo de 30 casos sintéticos y semi-reales, distribuidos en 5 categorías críticas:
  - Casos válidos de reembolso estándar.
  - Casos límite de ventana temporal (ej. día 30 vs día 31).
  - Casos de ambigüedad y contexto faltante (solicitud interactiva de datos).
  - Casos de violación de políticas (artículos en oferta, tarjetas de regalo).
  - Casos obligatorios de seguridad (inyección de prompts, exfiltración, herramientas denegadas).
- **FR-005**: Mantenimiento estricto del gate determinista: un candidato solo se acepta si supera al baseline en el caso objetivo, mantiene cero regresiones en los 30 casos y aprueba el 100% de los casos obligatorios de seguridad.
- **FR-006**: Cálculo y atribución monetaria de costos: reemplazar valores `null` en `Usage.cost_usd` utilizando la fórmula $\text{costo} = (\text{tokens\_in} \times \text{tarifa\_in}) + (\text{tokens\_out} \times \text{tarifa\_out})$.
- **FR-007**: Actualización de la TUI y comando `/doctor`: reportar latencias, tokens y costos estimados por proveedor seleccionado sin ejecutar solicitudes de cobro innecesarias.
- **FR-008**: Preservación de contratos v1: los nuevos esquemas de costos y dataset deben ser retrocompatibles con [`c4/schemas/contracts.py`](file:///home/camper/Entorno-Aislado/c4-ai/c4/schemas/contracts.py) y el dashboard actual.

## Aceptación
- **AC-001**: Dado `--target-provider deepseek`, cuando se invoca `c4 doctor`, entonces valida `DEEPSEEK_API_KEY` y `C4_DEEPSEEK_MODEL` sin imprimir valores y sin realizar llamadas generativas.
- **AC-002**: Dado `--target-provider ollama`, cuando el servicio local está activo en `http://127.0.0.1:11434`, entonces `c4 doctor` confirma la disponibilidad del modelo seleccionado y atribuye $0.00 USD de costo.
- **AC-003**: Dado el dataset `refunds_v2.json` con 30+ casos, cuando se ejecuta una sesión de evaluación, entonces tanto el baseline como el candidato se evalúan sobre los mismos 30 casos exactos bajo el mismo checksum SHA-256.
- **AC-004**: Dado un candidato evaluado en un nuevo modelo target, cuando genera una regresión en cualquiera de los 30 casos, entonces el gate marca la decisión como `rejected` con el detalle explícito de la discrepancia.
- **AC-005**: Dado un incidente resuelto con candidato aceptado, cuando se emite el reporte, entonces `usage.cost_usd` reporta una cifra decimal positiva calculada según la tarifa del proveedor target y analista.
- **AC-006**: Dado `python scripts/verify_docs.py`, cuando se ejecuta tras la incorporación de la spec, entonces confirma enlaces y contratos válidos.

## Casos de Error
- **Modelo no disponible / 404 del proveedor**: Registro claro en el checkpoint del incidente, estado `failed` en el Job y notificación accesible en el CLI sin stacktraces crudos.
- **Rate Limit / 429 del nuevo proveedor**: Registro de la cuota excedida; detener el ciclo sin reintentos infinitos para proteger el presupuesto de tokens.
- **Ollama inaccesible**: Advertencia clara indicando que el servicio local no responde en el puerto especificado.
- **Incompatibilidad de esquema de herramientas**: Si el nuevo modelo target no formatea correctamente la llamada JSON, el gate lo cataloga como `tool_failure` o `invalid_action`, imposibilitando la aceptación del candidato.

## Dudas Bloqueantes
- **CL-028-1 (Disponibilidad DeepSeek)**: ¿Se utilizará la API oficial de DeepSeek (`api.deepseek.com`) o el endpoint distill en Groq (`deepseek-r1-distill-llama-70b`)? Ambos comparten compatibilidad OpenAI, pero Groq ofrece menor latencia.  
  *Resolución*: Soportar ambos mediante configuración de `base_url` y `model`.
- **CL-028-2 (Tarifas fijas vs dinámicas)**: Las tarifas de proveedores cambian con el tiempo.  
  *Resolución*: Crear una tabla local declarativa en `c4/tools/rates.py` versionada con fecha de vigencia.

## Aprobación y Cambios
- Propuesto por: Deimer/Codex (2026-10-23).
- Revisión coordinada con: Santiago/Claude.
- Vinculado a tarea del Backlog: [`C4-007`](file:///home/camper/Entorno-Aislado/c4-ai/docs/equipo/BACKLOG.md#L52-L58) y Hito S3.
