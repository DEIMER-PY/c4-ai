"""Text-only SSE transport for chat; the evaluation JSON gateway is unchanged."""
import json
from time import monotonic

import httpx

from c4.tools.grok import Gateway, WorkflowError


class StreamingGateway(Gateway):
    def text(self, system, payload, on_update):
        if self.calls >= self.budget.max_calls:
            raise WorkflowError('budget_exceeded','Presupuesto de chat agotado.')
        start = monotonic()
        self.calls += 1
        record = {'purpose':'chat_stream','provider':self.settings.provider,'model':self.settings.model,
                  'status':'failed','input_tokens':None,'output_tokens':None,'cost_usd':None,'ttft_ms':None}
        self.records.append(record)
        body = {'model':self.settings.model,'messages':[{'role':'system','content':system},
                {'role':'user','content':json.dumps(payload,ensure_ascii=False)}],
                'stream':True,'max_tokens':min(512,self.settings.max_tokens)}
        if self.settings.provider == 'groq':
            body['stream_options'] = {'include_usage':True}
            if self.settings.model == 'qwen/qwen3.8-27b':
                body.update(reasoning_effort='none',include_reasoning=False)
        text, done, finish = '', False, None
        try:
            with self.client.stream('POST',self.settings.base_url+'/chat/completions',
                    headers={'Authorization':'Bearer '+self.settings.api_key},json=body,
                    timeout=min(self.settings.timeout,self.budget.max_seconds)) as response:
                if response.status_code != 200:
                    raise WorkflowError('provider_http',f'El proveedor devolvió HTTP {response.status_code}.',response.status_code==429 or response.status_code>=500)
                for line in response.iter_lines():
                    if monotonic()-start > self.budget.max_seconds:
                        raise WorkflowError('budget_exceeded','Tiempo máximo del turno de chat agotado.')
                    if not line.startswith('data:'):
                        continue
                    data = line[5:].strip()
                    if data == '[DONE]':
                        done = True
                        break
                    if len(data)>100000:
                        raise ValueError('event too large')
                    chunk = json.loads(data)
                    usage = chunk.get('usage') or (chunk.get('x_groq') or {}).get('usage') or {}
                    for source,dest in [('prompt_tokens','input_tokens'),('completion_tokens','output_tokens')]:
                        value = usage.get(source)
                        if type(value) is int and value>=0:record[dest] = value
                    choices = chunk.get('choices') or []
                    if choices:
                        finish = choices[0].get('finish_reason') or finish
                        content = (choices[0].get('delta') or {}).get('content')
                        if content is not None:
                            if not isinstance(content,str):raise ValueError('invalid content')
                            if content and record['ttft_ms'] is None:
                                record['ttft_ms'] = round((monotonic()-start)*1000)
                            text += content
                            if len(text)>24000:raise ValueError('output too large')
                            on_update(text)
                if not done or not text.strip() or finish == 'length':
                    raise WorkflowError('incomplete_chat','Respuesta de chat incompleta; no se conserva en el historial.')
                record['status'] = 'succeeded'
                return text
        except httpx.TimeoutException:
            raise WorkflowError('provider_timeout','Tiempo agotado al esperar el chat.',True) from None
        except httpx.RequestError:
            raise WorkflowError('provider_connection','No se pudo conectar al proveedor de chat.',True) from None
        except (ValueError,KeyError,TypeError,IndexError,AttributeError):
            raise WorkflowError('invalid_chat_stream','Flujo del proveedor inválido; no se ejecutó ninguna acción.') from None
        finally:
            record['latency_ms'] = round((monotonic()-start)*1000)
