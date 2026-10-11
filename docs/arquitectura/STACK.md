# Stack acordado
Estado: decisiones tomadas; dependencias de app aún no instaladas.
| Capa | Selección | Motivo |
|---|---|---|
| Backend/runtime | Python 3.12, FastAPI, Pydantic | Contratos tipados y evaluación |
| Dependencias Python | uv | Un flujo de instalación/lockfile |
| DB | PostgreSQL + JSONB, SQLAlchemy, Alembic | Entidades, evidencia y migraciones |
| HTTP | httpx | Timeouts y cliente aislado |
| CLI | Typer + Rich | Mismos servicios del backend |
| Trabajos | Redis + RQ | Trabajos aislados y workers |
| Dashboard | Next.js + TypeScript | Interfaz propia del producto |
| UI | Tailwind + shadcn/ui + Recharts | Componentes y comparaciones |
| Dependencias JS | pnpm | Lockfile reproducible |
| Entorno | Docker Compose | API, DB, Redis y workers locales |
| Proveedor | Gateway Grok del reto | Integración configurable |

Fijar versiones exactas compatibles al implementar y guardar lockfiles. No usar versiones latest sin validación.
No se requiere Hermes/eve/LangGraph en el MVP: el equipo confirmó el orquestador propio.
No se promete hosting gratuito permanente: validar términos actuales antes de elegir hosting. Primera entrega local.
Python 3.12 es objetivo del proyecto; el intérprete usado para revisar Markdown puede ser una versión distinta.
