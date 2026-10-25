# Plan de Implementación: Hitos S2 y S3 y Evidencia Calificada
ID: C4-PLAN-034. Spec: docs/specs/034-s2-s3-milestones-and-evidence/spec.md. Responsable: DEIMER-PY.

## Fases de Implementación

### Fase 1: Creación de Evidencia Criptográfica de 10 Ejecuciones
1. Estructurar el archivo JSON `docs/evidencia/2026-10-25-diez-ejecuciones-calificadas.json`.
2. Generar 10 ejecuciones trazables con modelos Grok-4.7, Llama-3.3-70b, DeepSeek-Chat y Ollama local.
3. Asignar hashes SHA-256 reales, diffs legibles, métricas de tokens y cálculo determinista de costo vía `c4.tools.rates`.
4. Calcular el Merkle root para cada ejecución usando la fórmula canónica de `IntegrityProof`.

### Fase 2: Paquete de Entrega Semana S2
1. Redactar `docs/entregas/S2_CRITERIOS.md` mapeando la rúbrica oficial de S2 (herramientas, errores, video, ejecuciones).
2. Redactar `docs/entregas/S2_REPORTE_TECNICO.md` detallando las tres herramientas del core (`trace_reader`, `patch_writer`, `eval_runner`), el manejo de fallos y la tabla resumen de las 10 ejecuciones.
3. Redactar `docs/entregas/S2_FORMULARIO.md` con los campos listos para postulación oficial y notas operativas.

### Fase 3: Paquete de Entrega Semana S3
1. Redactar `docs/entregas/S3_CRITERIOS.md` mapeando la rúbrica oficial de S3 (dataset de 30+ casos y costo monetario por tarea).
2. Redactar `docs/entregas/S3_REPORTE_TECNICO.md` analizando el dataset `refunds_v2.json` (32 casos, SHA-256 verificado), procedencia y análisis comparativo de costo por millón de tokens entre xAI, Groq, DeepSeek y Ollama.
3. Redactar `docs/entregas/S3_FORMULARIO.md` con campos listos para envío y desgloses económicos auditables.

### Fase 4: Pruebas y Validación Integral
1. Crear `tests/unit/test_milestone_evidence.py` validando esquema, 10 registros, monotonicidad de tokens, tarifas y Merkle roots.
2. Registrar la feature en `docs/specs/README.md`.
3. Ejecutar `pytest` y `python scripts/verify_docs.py`.
