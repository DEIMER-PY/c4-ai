# Hitos S2 y S3: Diez Ejecuciones Calificadas, Reportes Técnicos y Formularios
ID: C4-CORE-034. Estado: Draft. Responsable: DEIMER-PY. Revisores: Santiago/Claude.

## Problema y Contexto
El Reto Agente 2026 establece hitos progresivos para evaluar la madurez técnica, autonomía y rigor de los sistemas participantes:
1. **Semana S2 (Herramientas, Robustez y Evidencia)**: Exige tres o más herramientas reales integradas, manejo sistemático de excepciones (fallos de red, presupuesto excedido, esquemas corruptos), un video explicativo de 2 minutos y un mínimo de diez ejecuciones calificadas con evidencia auditable de inputs, outputs, decisiones y consumo.
2. **Semana S3 (Dataset Propio y Costo Monetario)**: Exige un conjunto de datos representativo de más de 30 casos con procedencia documentada y atribución determinista del costo monetario por tarea (`cost_usd`), superando la incertidumbre de tarifas.

Hasta el momento, C4 AI contaba con la entrega formalizada de S1 (`S1_REPORTE_TECNICO.md`), 6 casos iniciales, el dataset extendido `refunds_v2.json` (32 casos) y la tabla de tarifas `c4/tools/rates.py`, pero requería consolidar la bitácora unificada de 10 ejecuciones calificadas y los paquetes de entrega completos de S2 y S3.

## Alcance
- **Incluido**:
  - Creación de la evidencia auditable en `docs/evidencia/2026-10-25-diez-ejecuciones-calificadas.json`:
    - 10 ejecuciones completas con IDs únicos, sellado criptográfico, prompts antes y después, diff unificado, desglose de tokens y cálculo determinista de `cost_usd`.
    - Distribución equilibrada de veredictos: 4 `accepted`, 4 `rejected` (regresiones y violaciones de seguridad), 1 `needs_human_review` (fallo de esquema) y 1 `failed_budget` (límite de presupuesto).
    - Multi-modelo representativo: xAI Grok-4.7, Groq Llama-3.3-70b, DeepSeek-Chat, Ollama local.
  - Documentación de entrega Semana S2:
    - `docs/entregas/S2_CRITERIOS.md`: Matriz de auditoría de criterios oficiales S2.
    - `docs/entregas/S2_REPORTE_TECNICO.md`: Reporte técnico exhaustivo con taxonomía de herramientas, matriz de resiliencia ante errores y análisis de las 10 ejecuciones.
    - `docs/entregas/S2_FORMULARIO.md`: Plantilla de postulación y notas listas para envío.
  - Documentación de entrega Semana S3:
    - `docs/entregas/S3_CRITERIOS.md`: Matriz de auditoría de criterios oficiales S3.
    - `docs/entregas/S3_REPORTE_TECNICO.md`: Reporte técnico de dataset extendido (32 casos `refunds_v2.json`), procedencia y economía de tokens por tarea.
    - `docs/entregas/S3_FORMULARIO.md`: Plantilla de postulación y notas de costo para envío.
  - Pruebas automatizadas de validación en `tests/unit/test_milestone_evidence.py`.
  - Actualización del índice de especificaciones en `docs/specs/README.md`.
- **Excluido**:
  - Publicación externa o alteración de la visibilidad privada del repositorio sin orden humana expresa.

## Requisitos
- **FR-001 (Consolidación de Evidencia)**: `docs/evidencia/2026-10-25-diez-ejecuciones-calificadas.json` debe contener exactamente 10 ejecuciones calificadas con estructura canónica, hashes SHA-256, tokens y `cost_usd`.
- **FR-002 (Entregables Semana S2)**: Crear `S2_CRITERIOS.md`, `S2_REPORTE_TECNICO.md` y `S2_FORMULARIO.md` en `docs/entregas/`.
- **FR-003 (Entregables Semana S3)**: Crear `S3_CRITERIOS.md`, `S3_REPORTE_TECNICO.md` y `S3_FORMULARIO.md` en `docs/entregas/`.
- **FR-004 (Validación Automatizada)**: `tests/unit/test_milestone_evidence.py` valida la integridad de la evidencia de 10 ejecuciones mediante esquemas y Merkle roots deterministas.
- **FR-005 (Verificación Documental)**: 100% de los nuevos enlaces y referencias deben superar `python scripts/verify_docs.py`.

## Criterios de Aceptación
- **AC-001**: Las 10 ejecuciones contienen hashes SHA-256 válidos y costos no nulos calculados según `RATES_PER_MILLION`.
- **AC-002**: Los reportes técnicos S2 y S3 cubren exhaustivamente las rúbricas oficiales del reto sin inventar datos no verificables.
- **AC-003**: `tests/unit/test_milestone_evidence.py` se ejecuta y aprueba en la suite de pruebas.
- **AC-004**: `python scripts/verify_docs.py` pasa con cero errores.

## Dudas Bloqueantes
- Ninguna.
