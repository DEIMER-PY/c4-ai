# Tareas: Escalado de Evaluación Multimodelo y Datasets
Fuente: [`docs/specs/028-multimodel-scaling/spec.md`](file:///home/camper/Entorno-Aislado/c4-ai/docs/specs/028-multimodel-scaling/spec.md) y [`docs/specs/028-multimodel-scaling/plan.md`](file:///home/camper/Entorno-Aislado/c4-ai/docs/specs/028-multimodel-scaling/plan.md).  
Responsable de integración: Deimer/Codex.  
Rama: `codex/feat-028-multimodel-scaling`.

## Fase 1 — Dataset y Tarifas (Listo para arrancar esta tarde)
- [ ] **T001**: Deimer/Codex — Redactar dataset ampliado de 32 casos [`datasets/sample/refunds_v2.json`](file:///home/camper/Entorno-Aislado/c4-ai/datasets/sample/refunds.json); requisito FR-004; archivos `datasets/sample/refunds_v2.json`; dependencias ninguna; aceptación AC-003; validación: validador JSON Schema y hash SHA-256.
- [ ] **T002**: Deimer/Codex — Crear módulo de tarifas de proveedores `c4/tools/rates.py`; requisito FR-006; archivos `c4/tools/rates.py`; dependencias ninguna; aceptación AC-005; validación: prueba unitaria de cálculo de costos para Grok, Groq, DeepSeek y Ollama.
- [ ] **T003**: Deimer/Codex — Conectar cálculo de costo monetario en [`c4/services/reliability.py`](file:///home/camper/Entorno-Aislado/c4-ai/c4/services/reliability.py); requisito FR-006; archivos `c4/services/reliability.py`, `c4/tools/refunds.py`; dependencias T002; aceptación AC-005; validación: reportes emiten `cost_usd > 0`.

## Fase 2 — Adaptadores de Nuevos Modelos Target
- [ ] **T004**: Deimer/Codex — Implementar configuración y cliente para DeepSeek (`deepseek-chat` y endpoint compatible); requisito FR-001, FR-002; archivos `c4/tools/grok.py`, `c4/cli.py`; dependencias T001; aceptación AC-001; validación: `c4 --target-provider deepseek doctor` exitoso.
- [ ] **T005**: Deimer/Codex — Implementar adaptador local Ollama (`http://localhost:11434/v1`); requisito FR-003; archivos `c4/tools/grok.py`, `c4/cli.py`; dependencias T001; aceptación AC-002; validación: prueba con mock de Ollama offline devolviendo $0.00 USD.
- [ ] **T006**: Deimer/Codex — Soporte explícito para Llama 3.3 70B en Groq (`llama-3.3-70b-versatile`); requisito FR-002; archivos `c4/tools/grok.py`, `c4/cli.py`; dependencias T004; aceptación AC-001; validación: test unitario de tool calling en formato Llama.

## Fase 3 — Gate y Ejecución a Escala
- [ ] **T007**: Deimer/Codex — Adaptar ejecutor del gate determinista para 32 casos concurrentes controlados; requisito FR-005; archivos `c4/tools/refunds.py`, `c4/services/reliability.py`; dependencias T001, T003; aceptación AC-004; validación: simulación de regresión en el caso 17 rechaza el candidato.
- [ ] **T008**: Deimer/Codex — Actualizar documentación, `.env.example` y scripts de verificación; requisito FR-007, FR-008; archivos `.env.example`, `docs/referencias/`, `docs/specs/README.md`; dependencias T004, T005; aceptación AC-006; validación: `python3 scripts/verify_docs.py` aprobado al 100%.

---

## Handoff para el Trabajo de la Tarde
1. Iniciar con **T001** (`refunds_v2.json`) y **T002** (`rates.py`) sin llamadas de red.
2. Continuar con **T004** o **T005** configurando el modelo elegido en el `.env` local.
3. Ejecutar `c4 --target-provider <nuevo-modelo> doctor` para comprobar variables sin consumo.
4. Ejecutar la primera corrida de evaluación comparativa guardando la evidencia en `artifacts/runs/`.
