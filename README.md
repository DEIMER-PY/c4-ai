# C4 AI

C4 AI es un agente que **repara a otro agente y demuestra que la reparación no rompe nada**. Cuando un agente de soporte toma una decisión incorrecta, C4 reproduce el fallo, pide a Grok un diagnóstico y un prompt candidato, evalúa baseline y candidato sobre un dataset completo y acepta el cambio solo si mejora el caso fallido sin regresiones ni fallas de seguridad. Cada paso queda en un checkpoint auditable con tokens, costo y latencia reales.

Proyecto del [Reto Agente 2026](https://reto.pltk.mx/), Track 1. Licencia [MIT](LICENSE).

![c4 report de una sesión real aceptada](docs/assets/cli/report-accepted.svg)

*Salida real de `c4 report` sobre la sesión `c4_86950a5b73454cc4b2c4e0a7b4460ac2` (Grok `grok-4.7`, 14 llamadas, USD 0,0453).*

## Problema

Cuando un agente con LLM falla en producción, lo habitual es editar el prompt a mano y esperar que nada más se rompa. C4 convierte esa corrección en un procedimiento verificable:

| Pregunta | Cómo responde C4 |
|---|---|
| ¿Qué falló? | `trace_reader` compara la acción observada con la esperada (determinista). |
| ¿Por qué falló y cómo se corrige? | `patch_writer` envía a Grok la traza, la política y el prompt, y recibe la causa raíz, el prompt candidato y la justificación. |
| ¿La corrección rompe algo? | `eval_runner` ejecuta baseline y candidato en todos los casos y `decide()` aplica el gate. |
| ¿Y si el gate rechaza? | C4 vuelve a llamar a `patch_writer` con los casos que fallaron y las regresiones, y evalúa el nuevo candidato (hasta `C4_MAX_FIX_ATTEMPTS`). |
| ¿Cuánto costó? | Cada llamada registra los tokens que reporta el proveedor, `cost_usd` y la latencia. |

## Cómo funciona

```mermaid
sequenceDiagram
    actor Op as Operador
    participant C4 as C4 (CLI + servicio)
    participant G as Grok
    participant S as Store (checkpoints)
    Op->>C4: c4 demo --target caso_fallido
    C4->>G: agente evaluado (baseline) sobre el caso
    C4->>C4: trace_reader: ¿falla?
    C4->>G: patch_writer: diagnóstico y prompt candidato
    loop cada caso del dataset
        C4->>G: baseline(caso)
        C4->>G: candidato(caso)
        C4->>S: checkpoint
    end
    C4->>C4: decide(): accepted / rejected / needs_human_review
    C4-->>Op: tabla PASS/FAIL, costo y código de salida
```

| Regla del gate | Si no se cumple |
|---|---|
| El caso objetivo pasa de FAIL a PASS | rejected |
| 0 regresiones | rejected |
| Todos los casos de seguridad obligatorios en PASS | rejected |
| Evaluación completa sobre todos los casos | needs_human_review |

El diseño completo (componentes, secuencia, estados, errores y contratos) está en [docs/arquitectura/AGENTE.md](docs/arquitectura/AGENTE.md).

## Estado frente a los hitos del reto

| Hito | Requisito | Estado | Evidencia |
|---|---|---|---|
| S1 | Agente de punta a punta contra Grok, repo público, README | Cumple | `c4 demo`, este README |
| S2 | 3 herramientas, manejo de errores, 10 ejecuciones, video de 2 min | Cumple | [criterios S2](docs/entregas/S2_CRITERIOS.md), [ejecuciones reales](docs/evidencia/2026-11-07-ejecuciones-reales.json), [video](https://www.youtube.com/watch?v=DqAuvL8im9M) |
| S3 | Set propio de 30 o más casos y costo por tarea | Cumple con casos sintéticos | [dataset de 32 casos](datasets/sample/refunds_v2.json), [reporte de costos](docs/entregas/S3_REPORTE_COSTOS.md) |
| S4 | 1.000 unidades, 12 h desatendidas, bitácora | **Pendiente** | `c4 batch` existe, pero hoy corre en modo simulado |

Los resultados reales (aceptadas, rechazadas y fallidas, con costo por sesión) se generan con `scripts/export_run_evidence.py` y no se escriben a mano.

## Instalación

Requisitos: Python 3.12 y [uv](https://docs.astral.sh/uv/).

```powershell
git clone https://github.com/DEIMER-PY/c4-ai.git
cd c4-ai
uv sync --locked
copy .env.example .env   # agrega C4_GROK_BASE_URL, C4_GROK_MODEL y C4_GROK_API_KEY
uv run --locked c4 doctor --probe
```

La llave de Grok vive solo en `.env`, que está en `.gitignore`. El gateway nunca la persiste: si el proveedor la devuelve en una respuesta, se reemplaza por `[REDACTED]`.

## Uso

| Comando | Qué hace | ¿Llama a Grok? |
|---|---|---|
| `c4 doctor [--probe]` | Valida la configuración; `--probe` hace 1 llamada | Solo con `--probe` |
| `c4 demo --dataset <json> --target <caso>` | Ciclo completo | Sí |
| `c4 start` / `analyze` / `patch` / `eval <id>` | El mismo ciclo, paso a paso y reanudable por ID | Sí |
| `c4 report <id>` / `c4 compare <id>` | Lee la evidencia persistida | No |
| `c4` o `c4 tui` | Consola interactiva | Al ejecutar comandos |

Códigos de salida: `0` accepted, `2` rejected, `3` needs_human_review, `1` fallo, con la evidencia conservada.

Límites configurables en `.env`: `C4_MAX_MODEL_CALLS` (hasta 100), `C4_MAX_JOB_SECONDS` (hasta 3600), `C4_MODEL_TIMEOUT_SECONDS` y `C4_MAX_PROVIDER_RETRIES` (por defecto 2).

Para correr varias sesiones reales con un tope de gasto:

```powershell
uv run --locked python scripts/run_milestone_suite.py --budget-usd 2
uv run --locked python scripts/export_run_evidence.py --out docs/evidencia/<fecha>-ejecuciones-reales.json --markdown docs/entregas/S3_REPORTE_COSTOS.md
uv run --locked python scripts/export_run_evidence.py --check docs/evidencia/<fecha>-ejecuciones-reales.json
```

## Pruebas

```powershell
uv run --locked python -m unittest discover -s tests/unit -p "test_*.py"
uv run --locked python -m unittest discover -s tests/integration -p "test_*.py"   # E2E: CLI -> store -> API -> exportación
uv run --locked python -m unittest discover -s tests/evals -p "test_*.py"         # contrato del dataset
python scripts/verify_docs.py
```

Las pruebas E2E simulan Grok en la capa HTTP y usan el gateway, el CLI y la API reales. Para incluir una llamada real: `C4_LIVE_E2E=1`. El CI (`.github/workflows/quality.yml`) ejecuta las tres suites, más el dashboard y el website.

## Estructura

```text
c4/
  cli.py                 adaptador CLI (Typer + Rich)
  api.py                 API local de solo lectura (FastAPI)
  services/reliability.py  ciclo inspect → diagnose → patch → evaluate → decide
  services/run_evidence.py evidencia publicable y verificable
  tools/grok.py          gateway: presupuesto, reintentos, costo
  tools/refunds.py       agente evaluado, trace_reader, patch_writer, gate
datasets/sample/         refunds.json (6 casos), refunds_v2.json (32 casos)
docs/arquitectura/       diseño (AGENTE.md, API.md, CLI.md, ...)
docs/entregas/           criterios y reportes por hito
docs/evidencia/          evidencia exportada desde sesiones reales
docs/specs/              especificaciones SDD por feature
apps/                    dashboard, website, desktop (Next.js / Tauri)
tests/                   unit, integration (E2E), evals
```

## Límites conocidos

- Los casos del dataset son sintéticos. Las llamadas, tokens y latencias son reales.
- La reparación iterativa está limitada a `C4_MAX_FIX_ATTEMPTS` intentos y 100 llamadas por sesión (2 intentos con 32 casos).
- S4 (escala real y 12 h) está pendiente.
- La API local no tiene autenticación y no debe exponerse.

## Equipo

| Persona | Rol |
|---|---|
| Deimer (`DEIMER-PY`) | Backend, evaluación, seguridad |
| Santiago (`santiagosanabria-1`) | Frontend, dashboard, website |

El trabajo sigue SDD: [docs/equipo/SDD.md](docs/equipo/SDD.md).

## Licencia

[MIT](LICENSE). Platica recibe una licencia no exclusiva según las bases del reto, y los autores conservan la titularidad.
