"""Local read-only HTTP adapter. Never constructs a model gateway."""
import os
from pathlib import Path
from typing import Annotated, Generic, TypeVar

from fastapi import FastAPI, Query
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
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
