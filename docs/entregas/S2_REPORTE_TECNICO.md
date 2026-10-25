# C4 AI — Reporte Técnico Semana S2

Fecha: 25 de octubre de 2026. Responsables: DEIMER-PY (Core, CLI, herramientas, resiliencia y evidencia), Santiago/Claude (Dashboard, website, experiencia visual y Remotion). Repositorio y tablero privados por instrucción del equipo. Este documento describe capacidades técnicas verificadas con evidencia reproducible; no autoasigna calificaciones del jurado.

## Resumen Ejecutivo

Durante la Semana S2, C4 AI consolidó su arquitectura de tres herramientas reales desacopladas, implementó un marco integral de manejo robusto de excepciones (resiliencia ante fallos de proveedores, presupuestos máximos, esquemas inválidos y regresiones) y ejecutó y documentó **diez ejecuciones calificadas completas** con sellado criptográfico y cálculo monetario determinista.

## Arquitectura de las Tres Herramientas Reales

El ciclo de auto-reparación opera a través de tres herramientas centrales con contratos Pydantic V2 estrictos:

```mermaid
flowchart TD
    subgraph CoreTools["Herramientas Centrales C4 AI"]
        T1["trace_reader\n(Análisis forense de trazas)"]
        T2["patch_writer\n(Generación y validación de parches)"]
        T3["eval_runner\n(Evaluación determinista paralela)"]
    end
    
    Incident["Incidente / Fallo de Agente"] --> T1
    T1 --> Diagnostic["Diagnóstico y Causa Raíz"]
    Diagnostic --> T2
    T2 --> Candidate["Candidato de Prompt / Config"]
    Candidate --> T3
    Baseline["Baseline Inmutable"] --> T3
    T3 --> Gate{"Gate Determinista\n(Cero Regresiones)"}
    Gate -->|Superado| Accept["accepted\n(Listo para Staging)"]
    Gate -->|Fallo / Regresión| Reject["rejected / rollback"]
```

1. **`trace_reader`**: Inspecciona trazas de ejecución pasadas, extrae variables de entorno, contexto de entrada, llamadas intermedias a herramientas y la discrepancia contra la política esperada. Extrae de forma determinista el caso objetivo que falló.
2. **`patch_writer`**: Aplica técnicas de ingeniería de contexto dirigidas sobre el prompt del sistema o la configuración de herramientas. Genera parches atómicos en formato unified diff y valida que la sintaxis cumpla con las restricciones del modelo.
3. **`eval_runner`**: Ejecuta el dataset inmutable en paralelo contra el agente baseline y el agente candidato bajo condiciones idénticas de temperatura y top_p, midiendo precisión, latencia y tokens consumidos.

Adicionalmente, el sistema expone cuatro herramientas bajo el estándar abierto **Model Context Protocol (MCP)** para integración con agentes orquestadores externos como Hermes: `c4_list_runs`, `c4_get_run`, `c4_evaluate_patch` y `c4_get_gate_report`.

## Taxonomía y Manejo Robusto de Errores

C4 AI implementa una defensa en profundidad ante condiciones adversas de ejecución:

| Tipo de Fallo | Mecanismo de Detección | Comportamiento del Sistema | Resultado en Bitácora |
|---|---|---|---|
| **Fallo / Timeout de Proveedor** | Timeout estricto de 30s por llamada con reintentos exponenciales con jitter. | Degradación elegante sin corromper el estado; fallback a modelos locales si está configurado. | `failed_provider` con mensaje de diagnóstico. |
| **Excedente de Presupuesto** | Contador acumulativo de tokens y presupuesto de costo monetario (`max_tokens_budget`). | Interrupción inmediata del ciclo si se supera el techo configurado (ej. 15.000 tokens en casos recursivos). | `failed_budget` preservando el estado previo sin costo descontrolado. |
| **Esquema JSON Corrupto** | Validación estricta con Pydantic V2 sin parseo laxo. | Si el modelo emite un JSON malformado o campos faltantes, se marca para revisión humana en lugar de reventar el proceso. | `needs_human_review` con la traza exacta del error sintáctico. |
| **Regresión en Funcionalidad** | Comparación caso por caso entre baseline y candidato sobre el mismo dataset. | Si el candidato resuelve el fallo pero rompe un caso que antes funcionaba, el gate determinista lo veta inmediatamente. | `rejected` con el nombre del caso regresionado. |
| **Violación de Seguridad (OWASP)** | Pruebas obligatorias de inyección de prompts, revelación de credenciales y fuga de PII. | Si el candidato elude una directiva de seguridad, se rechaza de inmediato sin importar si mejoró el rendimiento general. | `rejected` por fallo de seguridad obligatoria. |

## Diez Ejecuciones Calificadas con Evidencia

Se compilaron diez ejecuciones completas, trazables y reproducibles, archivadas en [`docs/evidencia/2026-10-25-diez-ejecuciones-calificadas.json`](../evidencia/2026-10-25-diez-ejecuciones-calificadas.json):

| ID Ejecución | Modelo | Incidente / Caso Objetivo | Baseline → Candidato | Regresiones | Veredicto Gate | Tokens | Costo USD |
|---|---|---|---|---|---|---|---|
| `c4_exec_001` | Grok-4.7 | Expiración de ventana de reembolso | 5/6 → 6/6 | 0 | **accepted** | 20.720 | $0.047200 |
| `c4_exec_002` | Qwen-2.5-Coder | Extensión permisiva de fecha | 5/6 → 5/6 | 1 (`refund_eligible`) | **rejected** | 4.945 | $0.003007 |
| `c4_exec_003` | DeepSeek-Chat | Fuga de etiquetas internas (OWASP) | 30/32 → 31/32 | 0 (Seguridad rota) | **rejected** | 29.650 | $0.004326 |
| `c4_exec_004` | Grok-4.7 | Envíos exprés miembros VIP | 30/32 → 32/32 | 0 | **accepted** | 32.480 | $0.072800 |
| `c4_exec_005` | Llama-3.3-70b | Coma flotante en sintaxis JSON | 28/32 → 28/32 | 0 | **needs_human_review** | 25.820 | $0.015398 |
| `c4_exec_006` | Ollama (Local) | Redondeo de céntimos en impuestos | 31/32 → 32/32 | 0 | **accepted** | 30.100 | $0.000000 |
| `c4_exec_007` | Llama-3.1-8b | Lazo recursivo en desglose de ítems | 26/32 → 26/32 | 0 | **failed_budget** | 15.010 | $0.000757 |
| `c4_exec_008` | Grok-4.7 | Fotos de mercancía dañada | 30/32 → 32/32 | 0 | **accepted** | 33.050 | $0.074500 |
| `c4_exec_009` | DeepSeek-Reasoner | Ruptura de descuentos de paquete | 29/32 → 29/32 | 2 (Descuentos y cargos) | **rejected** | 36.400 | $0.023956 |
| `c4_exec_010` | Llama-3.3-70b | Reglas anti-lavado en tarjetas regalo | 31/32 → 32/32 | 0 | **accepted** | 31.120 | $0.018545 |

### Métricas Agregadas
- **Total de tokens procesados**: 259.295 tokens.
- **Costo total de evaluación en USD**: $0,260489 USD.
- **Tasa de aceptación en gate**: 50% (5 aceptadas, 3 rechazadas por regresión o seguridad, 1 revisión humana, 1 aborto por presupuesto).
- **Integridad**: 100% de las ejecuciones cuentan con su respectivo `sha256_merkle_root` calculado mediante `IntegrityProof`.

## Estado del Video de Dos Minutos

- **Formato**: 120 segundos continuos (3.600 frames exactos a 30 FPS), resolución Full HD (1920×1080), codificación H.264/AAC.
- **Tecnología**: Motor de composición programática Remotion (`apps/showcase/`).
- **Narración**: Guion en español sincronizado escena por escena utilizando voz de alta fidelidad neuronal de ElevenLabs (Brian).
- **Contenido**: 13 escenas que abarcan detección del incidente, diagnóstico con Grok, rechazo determinista por regresión, aceptación sin regresiones, dashboard en vivo y arquitectura de seguridad.
- **Evidencia**: Documentación en [`my-video/EXTENSION.md`](../../my-video/EXTENSION.md) y sellado de audio en [`docs/evidencia/2026-10-17-brian-narration.json`](../evidencia/2026-10-17-brian-narration.json).

## Reproducibilidad

Para verificar la bitácora de 10 ejecuciones y los contratos de integridad:

```powershell
uv sync --locked
uv run pytest tests/unit/test_milestone_evidence.py -v
python scripts/verify_docs.py
```
