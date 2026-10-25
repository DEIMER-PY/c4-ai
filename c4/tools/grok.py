"""Bounded JSON-only gateway. Provider content is untrusted data."""
import json
import os
from dataclasses import dataclass, field
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
    api_key: str = field(repr=False)
    timeout: float = 60
    max_calls: int = 16
    max_tokens: int = 1024
    max_seconds: float = 600
    provider: str = 'grok'

    @classmethod
    def from_env(cls, env_file: str = '.env', provider: str = 'grok') -> 'Settings':
        load_dotenv(env_file, override=False)
        if provider not in {'grok', 'groq', 'deepseek', 'ollama'}:
            raise WorkflowError('invalid_provider', 'Proveedor permitido: grok, groq, deepseek u ollama.')
        if provider == 'grok':
            base = os.environ.get('C4_GROK_BASE_URL', '')
            key = os.environ.get('C4_GROK_API_KEY', '')
            model = os.environ.get('C4_GROK_MODEL', '')
        elif provider == 'groq':
            base = os.environ.get('C4_GROQ_BASE_URL', 'https://api.groq.com/openai/v1')
            key = os.environ.get('GROQ_API_KEY', '')
            model = os.environ.get('C4_GROQ_MODEL', '')
        elif provider == 'deepseek':
            base = os.environ.get('C4_DEEPSEEK_BASE_URL', 'https://api.deepseek.com/v1')
            key = os.environ.get('DEEPSEEK_API_KEY', '')
            model = os.environ.get('C4_DEEPSEEK_MODEL', 'deepseek-chat')
        else:
            base = os.environ.get('C4_OLLAMA_BASE_URL', 'http://127.0.0.1:11434/v1')
            key = os.environ.get('OLLAMA_API_KEY', 'ollama') or 'ollama'
            model = os.environ.get('C4_OLLAMA_MODEL', 'qwen2.5:7b')




        try:
            settings = cls(
                base_url=base.rstrip('/'), model=model, api_key=key, provider=provider,
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
        if self.provider not in {'grok', 'groq', 'deepseek', 'ollama'}:
            raise WorkflowError('invalid_provider', 'Proveedor permitido: grok, groq, deepseek u ollama.')

        parsed = urlparse(self.base_url)
        if self.provider == 'ollama':
            allowed_hosts = {'localhost', '127.0.0.1', 'host.docker.internal'}
            if (parsed.scheme not in {'http', 'https'} or parsed.hostname not in allowed_hosts
                    or parsed.username or parsed.password or parsed.query or parsed.fragment):
                raise WorkflowError('invalid_config', 'Configura una URL HTTP/HTTPS local (localhost o 127.0.0.1) sin credenciales.')
        else:
            if (parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password
                or parsed.query or parsed.fragment):
                raise WorkflowError('invalid_config', 'Configura una URL HTTPS sin credenciales, query ni fragmento.')
        if not self.api_key.strip() or not self.model.strip():
            raise WorkflowError('missing_credentials', 'Configura clave y modelo localmente en .env.')
        if not (0 < self.timeout <= 120 and 0 < self.max_seconds <= 3600
                and 1 <= self.max_calls <= 100 and 64 <= self.max_tokens <= 4096):
            raise WorkflowError('invalid_config', 'Límites fuera de rango: timeout≤120, job≤3600, llamadas≤100, tokens 64..4096.')


@dataclass
class CallBudget:
    max_calls: int
    max_seconds: float
    started: float = field(default_factory=monotonic)
    calls: int = 0
    records: list[dict[str, Any]] = field(default_factory=list)


class Gateway:
    def __init__(self, settings: Settings, client: httpx.Client | None = None):
        settings.validate()
        self.settings = settings
        self.client = client or httpx.Client(follow_redirects=False)
        self.budget = CallBudget(settings.max_calls, settings.max_seconds)

    @property
    def started(self):
        return self.budget.started

    @started.setter
    def started(self, value):
        self.budget.started = value

    @property
    def calls(self):
        return self.budget.calls

    @calls.setter
    def calls(self, value):
        self.budget.calls = value

    @property
    def records(self):
        return self.budget.records

    def share_budget(self, other: 'Gateway'):
        self.budget = other.budget
        self.budget.max_calls = min(self.budget.max_calls, self.settings.max_calls)
        self.budget.max_seconds = min(self.budget.max_seconds, self.settings.max_seconds)

    def close(self) -> None:
        self.client.close()

    def output_mode(self, schema: bool = False) -> str:
        # Official Groq supported-model list verified 2026-10-17; unknown models retain local validation.
        strict_models = {'qwen/qwen3.8-27b', 'openai/gpt-oss-20b', 'openai/gpt-oss-120b', 'meta-models/muse-spark-open', 'llama-3.3-70b-versatile'}
        if self.settings.provider in {'groq', 'deepseek', 'ollama'}:
            return 'json_schema' if schema and self.settings.model in strict_models else 'json_object'
        return 'prompt_json'

    def complete(self, system: str, payload: dict, purpose: str, schema: dict | None = None) -> dict:
        remaining = self.budget.max_seconds - (monotonic() - self.started)
        if self.calls >= self.budget.max_calls or remaining <= 0:
            raise WorkflowError('budget_exceeded', 'Se alcanzó el límite de llamadas o tiempo; revisar evidencia.')
        self.calls += 1
        start = monotonic()
        record = {'call': self.calls, 'purpose': purpose, 'model': self.settings.model, 'provider': self.settings.provider,
                  'output_mode': self.output_mode(schema is not None),
                  'status': 'failed', 'input_tokens': None, 'output_tokens': None,
                  'cost_usd': None}
        self.records.append(record)
        try:
            request_body = {'model': self.settings.model, 'messages': [
                {'role': 'system', 'content': system + '\nReturn exactly one JSON object. No Markdown.'},
                {'role': 'user', 'content': json.dumps(payload, ensure_ascii=False)}],
                'max_tokens': self.settings.max_tokens}
            if record['output_mode'] == 'json_schema':
                request_body['response_format'] = {'type':'json_schema', 'json_schema': {
                    'name':'c4_test_action', 'strict':True, 'schema':schema}}
            elif record['output_mode'] == 'json_object':
                request_body['response_format'] = {'type':'json_object'}
            response = self.client.post(
                self.settings.base_url + '/chat/completions',
                headers={'Authorization': 'Bearer ' + self.settings.api_key},
                json=request_body,
                timeout=min(self.settings.timeout, remaining),
            )
            record['http_status'] = response.status_code
            if response.status_code != 200:
                code = 'provider_auth' if response.status_code in (401, 403) else 'provider_http'
                raise WorkflowError(code, f'El gateway devolvió HTTP {response.status_code}.',
                                    response.status_code == 429 or response.status_code >= 500)
            if monotonic() - self.started > self.budget.max_seconds:
                raise WorkflowError('budget_exceeded', 'El proveedor excedió el tiempo total de la sesión.')
            body = response.json()
            usage = body.get('usage') or {}
            for source, dest in [('prompt_tokens', 'input_tokens'), ('completion_tokens', 'output_tokens')]:
                value = usage.get(source)
                record[dest] = value if type(value) is int and value >= 0 else None
            from c4.tools.rates import calculate_cost_usd
            record['cost_usd'] = calculate_cost_usd(self.settings.model, record['input_tokens'], record['output_tokens'], self.settings.provider)
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
