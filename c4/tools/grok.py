"""Bounded JSON-only gateway. Provider content is untrusted data."""
import json
import os
from dataclasses import dataclass
from time import monotonic
from typing import Any
from urllib.parse import urlparse

import httpx
from dotenv import load_dotenv


class WorkflowError(Exception):
    def __init__(self, code: str, message: str, retryable: bool = False):
        super().__init__(message)
        self.code, self.retryable = code, retryable


@dataclass(frozen=True)
class Settings:
    base_url: str
    model: str
    api_key: str
    timeout: float = 60
    max_calls: int = 16
    max_tokens: int = 1024
    max_seconds: float = 600

    @classmethod
    def from_env(cls, env_file: str = '.env') -> 'Settings':
        load_dotenv(env_file, override=False)
        try:
            settings = cls(
                base_url=os.environ.get('C4_GROK_BASE_URL', '').rstrip('/'),
                model=os.environ.get('C4_GROK_MODEL', ''),
                api_key=os.environ.get('C4_GROK_API_KEY', ''),
                timeout=float(os.environ.get('C4_MODEL_TIMEOUT_SECONDS', '60')),
                max_calls=int(os.environ.get('C4_MAX_MODEL_CALLS', '16')),
                max_tokens=int(os.environ.get('C4_MAX_OUTPUT_TOKENS', '1024')),
                max_seconds=float(os.environ.get('C4_MAX_JOB_SECONDS', '600')),
            )
        except ValueError:
            raise WorkflowError('invalid_config', 'Los límites de entorno deben ser numéricos.') from None
        settings.validate()
        return settings

    def validate(self) -> None:
        parsed = urlparse(self.base_url)
        if (parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password
                or parsed.query or parsed.fragment):
            raise WorkflowError('invalid_config', 'Configura una URL HTTPS sin credenciales, query ni fragmento.')
        if not self.api_key.strip() or not self.model.strip():
            raise WorkflowError('missing_credentials', 'Configura clave y modelo localmente en .env.')
        if not (0 < self.timeout <= 120 and 0 < self.max_seconds <= 3600
                and 1 <= self.max_calls <= 100 and 64 <= self.max_tokens <= 4096):
            raise WorkflowError('invalid_config', 'Límites fuera de rango: timeout≤120, job≤3600, llamadas≤100, tokens 64..4096.')


class Gateway:
    def __init__(self, settings: Settings, client: httpx.Client | None = None):
        settings.validate()
        self.settings = settings
        self.client = client or httpx.Client(follow_redirects=False)
        self.started = monotonic()
        self.calls = 0
        self.records: list[dict[str, Any]] = []

    def close(self) -> None:
        self.client.close()

    def complete(self, system: str, payload: dict, purpose: str) -> dict:
        remaining = self.settings.max_seconds - (monotonic() - self.started)
        if self.calls >= self.settings.max_calls or remaining <= 0:
            raise WorkflowError('budget_exceeded', 'Se alcanzó el límite de llamadas o tiempo; revisar evidencia.')
        self.calls += 1
        start = monotonic()
        record = {'call': self.calls, 'purpose': purpose, 'model': self.settings.model,
                  'status': 'failed', 'input_tokens': None, 'output_tokens': None,
                  'cost_usd': None}
        self.records.append(record)
        try:
            response = self.client.post(
                self.settings.base_url + '/chat/completions',
                headers={'Authorization': 'Bearer ' + self.settings.api_key},
                json={'model': self.settings.model, 'messages': [
                    {'role': 'system', 'content': system + '\nReturn exactly one JSON object. No Markdown.'},
                    {'role': 'user', 'content': json.dumps(payload, ensure_ascii=False)}],
                    'max_tokens': self.settings.max_tokens},
                timeout=min(self.settings.timeout, remaining),
            )
            record['http_status'] = response.status_code
            if response.status_code != 200:
                code = 'provider_auth' if response.status_code in (401, 403) else 'provider_http'
                raise WorkflowError(code, f'El gateway devolvió HTTP {response.status_code}.',
                                    response.status_code == 429 or response.status_code >= 500)
            if monotonic() - self.started > self.settings.max_seconds:
                raise WorkflowError('budget_exceeded', 'El proveedor excedió el tiempo total de la sesión.')
            body = response.json()
            usage = body.get('usage') or {}
            for source, dest in [('prompt_tokens', 'input_tokens'), ('completion_tokens', 'output_tokens')]:
                value = usage.get(source)
                record[dest] = value if type(value) is int and value >= 0 else None
            content = body['choices'][0]['message']['content']
            if not isinstance(content, str) or len(content) > 100_000:
                raise ValueError('invalid content')
            # Never persist the credential even if a malicious server echoes it.
            content = content.replace(self.settings.api_key, '[REDACTED]')
            def reject_nonfinite(value):
                raise ValueError('Non-finite model JSON')
            result = json.loads(content, parse_constant=reject_nonfinite)
            if not isinstance(result, dict):
                raise ValueError('expected object')
            record['status'] = 'succeeded'
            record['response'] = result
            return result
        except httpx.TimeoutException:
            raise WorkflowError('provider_timeout', 'Tiempo agotado al consultar el gateway.', True) from None
        except httpx.RequestError:
            raise WorkflowError('provider_connection', 'No se pudo conectar al gateway.', True) from None
        except (ValueError, KeyError, IndexError, TypeError):
            raise WorkflowError('invalid_model_output', 'Respuesta del proveedor inválida; no se acepta el candidato.') from None
        finally:
            record['latency_ms'] = round((monotonic() - start) * 1000)
