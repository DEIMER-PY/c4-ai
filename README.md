# C4 AI
**Autonomous Reliability Engineer for AI Agents**

C4 AI detecta fallos en agentes, diagnostica su causa, propone correcciones y prueba si mejoran su comportamiento. Cada decisión debe conservar evidencia reproducible.

> Estado: preparación documental. API, CLI, dashboard y agentes de ejecución están **planificados**, no implementados. Los ejemplos son sintéticos.

## Empezar
- [Índice de documentación](docs/README.md)
- [Estado actual](docs/equipo/ESTADO.md)
- [Onboarding de Santiago y Claude](docs/equipo/ONBOARDING_SANTIAGO.md)
- [Backlog y responsables](docs/equipo/BACKLOG.md)
- [Contratos API y ejemplos](docs/arquitectura/API.md)
- [Reglas para agentes de desarrollo](AGENTS.md)

## Producto
Detectar → diagnosticar → proponer parche → evaluar baseline/candidato → aceptar, rechazar o escalar.
Primer caso: soporte y reembolsos, con política y herramientas controladas. Los parches afectan prompts/configuración de agentes de prueba; producción queda fuera del MVP.

## Stack acordado
Python 3.12, FastAPI, Pydantic, SQLAlchemy/Alembic, httpx, Typer/Rich, uv.
Next.js/TypeScript, Tailwind, shadcn/ui, Recharts, pnpm.
PostgreSQL/JSONB, Redis/RQ, Docker Compose y gateway Grok del reto configurable.

## Equipo
| Responsable | Área |
|---|---|
| Deimer / DEIMER-PY + Codex | Backend, agentes, CLI, persistencia, evals, seguridad |
| Santiago / santiagosanabria-1 + Claude | Dashboard, UX, integración, evidencia visual y demo |
| Ambos | Arquitectura, contratos, dataset y aceptación |

## Validar esta entrega
`python scripts/verify_docs.py` verifica enlaces locales, JSON, relaciones entre fixtures y reglas de aceptación. No inicia servicios ni llama al proveedor.
Consulta [instalación prevista](docs/arquitectura/INSTALACION.md): los comandos de la aplicación se definirán cuando exista implementación.

## Flujo Git
Rama predeterminada **develop**. Cada feature tiene rama y PR hacia develop.
Commits convencionales con emoji: `docs(workflow): 📝 definir reglas`.
[Reglas y validación](docs/equipo/GIT_WORKFLOW.md).

## Colaboración
GitHub mantiene tareas/PR/decisiones; Slack coordina; Obsidian abre los mismos Markdown de `docs/` compartidos con Git.
[Protocolo del equipo](docs/equipo/COLABORACION.md) · [Contribuir](CONTRIBUTING.md) · [Seguridad](SECURITY.md)

## Roadmap
[Preparación y S1–S4](docs/producto/ROADMAP.md). Los requisitos del reto provienen del chat y están pendientes de contraste oficial.
No se incluyen credenciales, conversaciones privadas ni datos personales de prueba reales.
