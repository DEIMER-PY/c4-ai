# Campos de Entrega Semana S3

**Estado: listo para enviar tras regenerar el reporte de costos.** El repositorio es público con licencia MIT; el tablero sigue privado.

- **Repositorio**: https://github.com/DEIMER-PY/c4-ai
- **Reporte Técnico Semana S3**: https://github.com/DEIMER-PY/c4-ai/blob/develop/docs/entregas/S3_REPORTE_TECNICO.md
- **Dataset de 32 Casos (`refunds_v2.json`)**: https://github.com/DEIMER-PY/c4-ai/blob/develop/datasets/sample/refunds_v2.json
  - **Checksum SHA-256**: `b0485acfa301e310491df9443bc1e32c6e3d44b843c0050d2037e42fb77a78fd`
- **Reporte de costo por tarea (generado desde sesiones reales)**: https://github.com/DEIMER-PY/c4-ai/blob/develop/docs/entregas/S3_REPORTE_COSTOS.md
- **Evidencia real**: https://github.com/DEIMER-PY/c4-ai/blob/develop/docs/evidencia/2026-11-07-ejecuciones-reales.json
- **Módulo de Tarifas y Costo**: https://github.com/DEIMER-PY/c4-ai/blob/develop/c4/tools/rates.py
- **Rama principal**: `develop`

## Notas Técnicas Listas para Copiar en el Formulario

C4 AI formaliza la entrega de la Semana S3 resolviendo la escala de evaluación estadística y la cuantificación económica exacta de las intervenciones del agente:

1. **Dataset Propio de 32 Casos (`refunds_v2.json`)**: Evolución completa respecto al set sintético inicial de 6 casos. El nuevo benchmark de 32 casos (versión 2.1.0, SHA-256 del archivo en el checkout local: `b0485acfa301e310491df9443bc1e32c6e3d44b843c0050d2037e42fb77a78fd`) tipifica 12 políticas estándar de reembolso, 8 casos de borde temporales, 6 casos adversariales de inyección y elusión de controles (OWASP LLM Top 10) y 6 cálculos complejos de paquetes y devoluciones fraccionarias. Procedencia sintética estructurada que salvaguarda la privacidad de datos reales (RGPD / CCPA).

2. **Atribución Determinista de Costo Monetario (`cost_usd`)**: Eliminamos la incertidumbre de tarifas. Nuestro motor calcula en microdólares el gasto real por tarea basándose en tokens de entrada y salida medidos. Se dispone de un catálogo de precios para xAI Grok ($2/$10), Groq Llama y Qwen ($0,59/$0,79), DeepSeek ($0,14/$0,28) e inferencia local con Ollama a costo $0,00 garantizado.

3. **Costo real medido**: el costo por sesión completa sobre los 32 casos y por caso evaluado sale de tokens reales reportados por Grok. Ver `S3_REPORTE_COSTOS.md`, que se genera automáticamente y no se edita a mano.

Procedencia: casos sintéticos, llamadas reales. Contrato del dataset en `tests/evals/test_dataset_contract.py`.
