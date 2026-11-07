# El agente C4: diseño y funcionamiento

Este documento describe el agente tal como está implementado en `c4/`. Los diagramas son UML y no usan estilos. Las capturas son salida real del CLI sobre sesiones reales contra Grok, generadas con `scripts/capture_cli_evidence.py`.

## 1. Problema

Un agente de soporte (el *agente evaluado*) toma decisiones de reembolso. Cuando falla un caso, C4:
1. reproduce el fallo;
2. pide a Grok un diagnóstico y un prompt candidato;
3. evalúa baseline y candidato sobre **todo** el dataset;
4. acepta el candidato solo si cumple las reglas del gate (sección 5).

C4 nunca ejecuta reembolsos. El agente evaluado solo predice una acción.

## 2. Componentes

```mermaid
flowchart LR
    subgraph Adaptadores
        CLI[c4/cli.py]
        API[c4/api.py<br/>solo lectura]
        MCP[c4/mcp_server.py<br/>solo lectura]
    end
    subgraph Servicio
        RS[ReliabilityService<br/>c4/services/reliability.py]
        RE[run_evidence<br/>c4/services/run_evidence.py]
        ER[EvidenceReader<br/>c4/services/evidence.py]
    end
    subgraph Herramientas
        TR[trace_reader]
        PW[patch_writer]
        EV[eval_runner]
        GW[Gateway<br/>c4/tools/grok.py]
    end
    ST[(Store<br/>artifacts/runs/c4_id/evidence.json)]
    GROK[[Grok API]]

    CLI --> RS
    RS --> TR
    RS --> PW
    RS --> EV
    PW --> GW
    EV --> GW
    GW --> GROK
    RS --> ST
    API --> ER
    API --> RE
    MCP --> ER
    ER --> ST
    RE --> ST
```

| Componente | Archivo | Responsabilidad | Llama al modelo |
|---|---|---|---|
| `trace_reader` | `c4/tools/refunds.py` | Compara la salida observada con la esperada. Es determinista. | No |
| `patch_writer` | `c4/tools/refunds.py` | Pide a Grok la causa raíz, el prompt candidato y la justificación, y valida la forma de la respuesta. | Sí |
| `eval_runner` | `c4/services/reliability.py` | Ejecuta baseline y candidato caso por caso y guarda un checkpoint por respuesta. | Sí, 2 llamadas por caso |
| `decide` | `c4/tools/refunds.py` | Gate determinista que devuelve accepted, rejected o needs_human_review. | No |
| `Gateway` | `c4/tools/grok.py` | Cliente HTTP con solo JSON, presupuesto de llamadas y tiempo, reintentos acotados y costo por llamada. | — |
| `Store` | `c4/services/storage.py` | Checkpoint atómico por sesión con un lock exclusivo por escritor. | — |
| `run_evidence` | `c4/services/run_evidence.py` | Proyección publicable y verificable de las sesiones reales. | No |

## 3. Secuencia de una sesión (`c4 demo`)

```mermaid
sequenceDiagram
    actor Op as Operador
    participant CLI as c4 CLI
    participant RS as ReliabilityService
    participant ST as Store
    participant GW as Gateway
    participant G as Grok

    Op->>CLI: c4 demo --dataset refunds_v2.json --target X
    CLI->>RS: create(dataset, target)
    RS->>ST: save(estado inicial)
    RS->>GW: run_agent(baseline, caso X)
    GW->>G: POST /chat/completions
    G-->>GW: {"action": ...}
    RS->>RS: trace_reader (¿falla X?)
    alt el baseline ya cumple X
        RS->>ST: failed: no_incident
    else hay incidente
        RS->>GW: patch_writer(traza, política, baseline)
        GW->>G: POST /chat/completions
        G-->>GW: root_cause, candidate_prompt, rationale
        RS->>ST: save(patch + diff)
        loop cada caso del dataset
            RS->>GW: baseline(caso)
            RS->>GW: candidato(caso)
            RS->>ST: checkpoint
        end
        RS->>RS: decide()
        RS->>ST: save(report)
    end
    CLI-->>Op: tabla PASS/FAIL, llamadas, tokens y costo. Código de salida: 0, 2 o 3
```

Una sesión sobre `refunds_v2` hace `1 + 1 + 2 × 32 = 66` llamadas, sin contar los reintentos.

## 4. Estados

```mermaid
stateDiagram-v2
    [*] --> queued
    queued --> running: execute()
    running --> succeeded: report guardado
    running --> failed: WorkflowError
    failed --> [*]
    succeeded --> [*]

    state running {
        [*] --> inspect
        inspect --> diagnose
        diagnose --> patch
        patch --> evaluate
        evaluate --> decide
        decide --> report
    }
```

| Código de error | Causa | ¿Reintento automático? | Resultado |
|---|---|---|---|
| `provider_timeout` | Sin respuesta dentro de `C4_MODEL_TIMEOUT_SECONDS` | Sí, hasta 2 veces con backoff de 1 s y 2 s | `failed` si se agotan |
| `provider_connection` | Error de red | Sí | `failed` si se agotan |
| `provider_http` 5xx | Error del proveedor (por ejemplo 503) | Sí | `failed` si se agotan |
| `provider_http` 429 | Límite de tasa | No: se detiene sin gastar más | `failed`, `retryable=true` |
| `provider_auth` | 401/403 | No | `failed` |
| `invalid_model_output` / `invalid_action` | JSON inválido o acción fuera del contrato | No | `failed` → revisión humana |
| `budget_exceeded` | Se alcanzó `C4_MAX_MODEL_CALLS` o `C4_MAX_JOB_SECONDS` | No | `failed`, con la evidencia parcial conservada |
| `no_incident` | El baseline ya cumple el caso objetivo | No | `failed`: no se fabrica una mejora |

Cada intento, incluidos los fallidos, queda en `calls[]` con `attempt`, `http_status`, tokens, `cost_usd` y `latency_ms`.

## 5. Reglas del gate

`decide()` acepta solo si se cumplen **todas** estas condiciones:

| Regla | Si no se cumple |
|---|---|
| La evaluación está completa y cubre todos los casos del dataset, en orden | needs_human_review |
| El caso objetivo falla en baseline y pasa en candidato | rejected |
| Hay 0 regresiones (casos que pasaban y ahora fallan) | rejected |
| Todos los casos con `mandatory_security` pasan | rejected |
| El total del candidato es estrictamente mayor que el del baseline | rejected |

## 6. Contratos persistidos

```mermaid
classDiagram
    class Incident {
      id
      run_id
      category
      severity
      status
      root_cause
    }
    class Run {
      id
      agent_id
      input_payload
      output_payload
      usage
    }
    class Patch {
      id
      incident_id
      diff
      rationale
      approval_status
    }
    class Evaluation {
      id
      patch_id
      dataset_id
      before: Score
      after: Score
      regressions[]
      security_passed
    }
    class Report {
      id
      decision
      summary
      evidence_refs[]
    }
    Incident "1" --> "1" Run
    Incident "1" --> "0..1" Patch
    Patch "1" --> "0..1" Evaluation
    Incident "1" --> "0..1" Report
```

Los esquemas están en `c4/schemas/contracts.py`. La API los expone en `/api/v1/*` (ver [API.md](API.md)).

## 7. Ejecuciones reales (capturas del CLI)

Las tres capturas son salida de `c4 report <id>` sobre sesiones reales. No llaman al modelo; leen el checkpoint. La única edición es reemplazar la ruta absoluta local por `.`.

**Aceptada.** `refunds_demo` 1.0.0, 6 casos: de 5/6 a 6/6, 0 regresiones, 14 llamadas, USD 0,0453, 70 s de latencia acumulada.

![c4 report de una sesión aceptada](../assets/cli/report-accepted.svg)

**Rechazada por el gate.** `refunds_v2` 2.0.0, 32 casos: de 20/32 a 26/32 con 0 regresiones, pero fallaron casos de seguridad obligatorios (tarjeta regalo, bloqueo por fraude) que la política de esa versión no declaraba. Fueron 66 llamadas, USD 0,2075 y 602 s. Este hallazgo motivó el dataset v2.1.0.

![c4 report de una sesión rechazada](../assets/cli/report-rejected-v2.svg)

**Fallida por el proveedor.** Grok respondió HTTP 503 tres veces seguidas (intento inicial más 2 reintentos). La sesión se detuvo con la evidencia parcial: 29 llamadas, USD 0,0820.

![c4 report de una sesión fallida por 503](../assets/cli/report-failed-503.svg)

Todas las sesiones, con su costo, están en el [reporte de costos](../entregas/S3_REPORTE_COSTOS.md).

## 8. Límites actuales

- Los casos son sintéticos y las llamadas reales.
- Hay un solo intento de reparación por sesión: `patch_writer` no recibe los casos que fallaron en la evaluación. `/goal` en la TUI repite sesiones completas, pero sin pasarles esa retroalimentación.
- `c4 batch` corre en modo simulado por defecto, así que S4 (1.000 unidades, 12 h) sigue pendiente.
- La API es local, de solo lectura y sin autenticación. No debe exponerse a internet.
