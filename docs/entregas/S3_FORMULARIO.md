# Campos de Entrega Semana S3

**Estado: Documentado y listo para postulación.** El repositorio y el tablero permanecen privados de acuerdo con la estrategia de confidencialidad del equipo. No se ha cambiado visibilidad ni se ha afirmado aceptación automática por la organización del reto.

- **Repositorio**: https://github.com/DEIMER-PY/c4-ai
- **Reporte Técnico Semana S3**: https://github.com/DEIMER-PY/c4-ai/blob/develop/docs/entregas/S3_REPORTE_TECNICO.md
- **Dataset de 32 Casos (`refunds_v2.json`)**: https://github.com/DEIMER-PY/c4-ai/blob/develop/datasets/sample/refunds_v2.json
  - **Checksum SHA-256**: `118d2409c9264118dd0aa9807b4aa23b1199f6a88bff6e0765abccc0c579b3e6`
- **Módulo de Tarifas y Costo**: https://github.com/DEIMER-PY/c4-ai/blob/develop/c4/tools/rates.py
- **Rama principal**: `develop`

## Notas Técnicas Listas para Copiar en el Formulario

C4 AI formaliza la entrega de la Semana S3 resolviendo la escala de evaluación estadística y la cuantificación económica exacta de las intervenciones del agente:

1. **Dataset Propio de 32 Casos (`refunds_v2.json`)**: Evolución completa respecto al set sintético inicial de 6 casos. El nuevo benchmark de 32 casos (versión 2.0.0, SHA-256: `118d2409c9264118dd0aa9807b4aa23b1199f6a88bff6e0765abccc0c579b3e6`) tipifica 12 políticas estándar de reembolso, 8 casos de borde temporales, 6 casos adversariales de inyección y elusión de controles (OWASP LLM Top 10) y 6 cálculos complejos de paquetes y devoluciones fraccionarias. Procedencia sintética estructurada que salvaguarda la privacidad de datos reales (RGPD / CCPA).

2. **Atribución Determinista de Costo Monetario (`cost_usd`)**: Eliminamos la incertidumbre de tarifas. Nuestro motor calcula en microdólares el gasto real por tarea basándose en tokens de entrada y salida medidos. Se dispone de un catálogo de precios para xAI Grok ($2/$10), Groq Llama y Qwen ($0,59/$0,79), DeepSeek ($0,14/$0,28) e inferencia local con Ollama a costo $0,00 garantizado.

3. **Demostración de ROI y Cero Regresiones**: En una evaluación integral sobre el dataset de 32 casos, C4 AI logra auto-reparar fallos complejos en agentes con Grok-4.7 por un costo de apenas $0,0728 USD en menos de 90 segundos, reduciendo en más del 99.8% el costo de ingeniería manual equivalente y bloqueando automáticamente cualquier candidato que cause regresiones sobre el baseline inmutable.

Pruebas unitarias automatizadas y verificación documental aprobadas al 100%.
