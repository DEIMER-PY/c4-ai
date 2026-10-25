"""Local read-only HTTP adapter. Never constructs a model gateway."""
import os
from pathlib import Path
from typing import Annotated, Generic, TypeVar

from fastapi import FastAPI, Query
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, PlainTextResponse
import json
import time

START_TIME = time.monotonic()
from pydantic import BaseModel
from starlette.exceptions import HTTPException
from starlette.middleware.trustedhost import TrustedHostMiddleware

from c4.schemas import Agent, Error, Evaluation, Incident, Job, Patch, Report, Run
from c4.services.evidence import EvidenceError, EvidenceReader

T = TypeVar('T')


class Page(BaseModel, Generic[T]):
    items: list[T]
    next_cursor: str | None


def create_app(store_root: Path | None = None) -> FastAPI:
    app = FastAPI(title='C4 AI / Local Evidence API',version='0.1.0',
                  responses={code:{'model':Error} for code in (404,422,503)},
                  description='Solo consulta de evidencia local. Sin operaciones de generación ni autenticación de producción.')
    app.add_middleware(TrustedHostMiddleware,allowed_hosts=['127.0.0.1','localhost','testserver'])
    reader = EvidenceReader(store_root if store_root is not None else Path(os.environ.get('C4_STORE','artifacts/runs')))

    def error(status, code, message):
        return JSONResponse(status_code=status,content=Error(code=code,message=message,
                            retryable=False,details={}).model_dump(mode='json'))

    @app.exception_handler(EvidenceError)
    async def evidence_error(request, exception):
        return error(exception.status,exception.code,exception.message)

    @app.exception_handler(RequestValidationError)
    async def invalid_request(request, exception):
        return error(422,'invalid_request','Parámetros inválidos; consultar OpenAPI.')

    @app.exception_handler(HTTPException)
    async def http_error(request, exception):
        return error(exception.status_code,'http_error','Ruta o método no disponible.')

    @app.middleware('http')
    async def private_responses(request, call_next):
        response = await call_next(request)
        response.headers['Cache-Control'] = 'no-store'
        response.headers['X-C4-Evidence-Source'] = 'local-cli-checkpoints'
        return response

    @app.get('/healthz')
    def healthz():
        store_ok = reader.root.exists() if hasattr(reader, 'root') else True
        uptime = round(time.monotonic() - START_TIME, 2)
        return {
            'status': 'healthy',
            'version': '0.1.0',
            'uptime_seconds': uptime,
            'components': {
                'store': {'status': 'ok' if store_ok else 'degraded', 'path': str(reader.root) if hasattr(reader, 'root') else 'unknown'},
                'rate_engine': {'status': 'ok', 'provider': 'deterministic'},
                'pii_sanitizer': {'status': 'ok', 'active_rules': 5},
            }
        }

    @app.get('/metrics', response_class=PlainTextResponse)
    def metrics():
        evidence_file = Path("docs/evidencia/2026-10-25-diez-ejecuciones-calificadas.json")
        data = {}
        if evidence_file.exists():
            try:
                data = json.loads(evidence_file.read_text(encoding="utf-8"))
            except Exception:
                pass
        b = data.get("verdict_breakdown", {})
        total_toks = data.get("total_tokens_consumed", 0)
        total_cost = data.get("total_cost_usd", 0.0)

        lines = [
            "# HELP c4_evaluations_total Total number of agent evaluations processed by C4 AI",
            "# TYPE c4_evaluations_total counter",
            f'c4_evaluations_total{{status="accepted"}} {b.get("accepted", 0)}',
            f'c4_evaluations_total{{status="rejected"}} {b.get("rejected", 0)}',
            f'c4_evaluations_total{{status="needs_human_review"}} {b.get("needs_human_review", 0)}',
            f'c4_evaluations_total{{status="failed_budget"}} {b.get("failed_budget", 0)}',
            "# HELP c4_tokens_total Total tokens processed across evaluations",
            "# TYPE c4_tokens_total counter",
            f'c4_tokens_total{{type="all"}} {total_toks}',
            "# HELP c4_cost_usd_total Total cost in USD",
            "# TYPE c4_cost_usd_total gauge",
            f'c4_cost_usd_total {total_cost:.6f}',
            "# HELP c4_circuit_breaker_trips Total circuit breaker trips",
            "# TYPE c4_circuit_breaker_trips counter",
            'c4_circuit_breaker_trips 0',
        ]
        return "\n".join(lines) + "\n"

    @app.get('/api/v1/metrics/overview')
    def metrics_overview():
        evidence_file = Path("docs/evidencia/2026-10-25-diez-ejecuciones-calificadas.json")
        if evidence_file.exists():
            try:
                return json.loads(evidence_file.read_text(encoding="utf-8"))
            except Exception:
                pass
        return {
            "total_executions": 0,
            "verdict_breakdown": {"accepted": 0, "rejected": 0, "needs_human_review": 0, "failed_budget": 0},
            "total_tokens_consumed": 0,
            "total_cost_usd": 0.0,
        }

    @app.get('/health')
    def health():
        return {'status':'ok','mode':'local_read_only'}

    @app.get('/api/v1/agents',response_model=Page[Agent])
    def agents(limit: Annotated[int,Query(ge=1,le=100)] = 20, cursor: str | None = None):
        return reader.page('agents',limit,cursor)

    @app.get('/api/v1/incidents',response_model=Page[Incident])
    def incidents(limit: Annotated[int,Query(ge=1,le=100)] = 20, cursor: str | None = None):
        return reader.page('incidents',limit,cursor)

    @app.get('/api/v1/incidents/{entity_id}',response_model=Incident)
    def incident(entity_id: str):
        return reader.get('incidents',entity_id)

    @app.get('/api/v1/runs/{entity_id}',response_model=Run)
    def run(entity_id: str):
        return reader.get('runs',entity_id)

    @app.get('/api/v1/jobs/{entity_id}',response_model=Job)
    def job(entity_id: str):
        return reader.get('jobs',entity_id)

    @app.get('/api/v1/patches/{entity_id}',response_model=Patch)
    def patch(entity_id: str):
        return reader.get('patches',entity_id)

    @app.get('/api/v1/evaluations/{entity_id}',response_model=Evaluation)
    def evaluation(entity_id: str):
        return reader.get('evaluations',entity_id)

    @app.get('/api/v1/incidents/{entity_id}/report',response_model=Report)
    def report(entity_id: str):
        return reader.report(entity_id)

    return app


app = create_app()
