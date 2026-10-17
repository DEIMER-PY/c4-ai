import json
import os
import tempfile
import unittest
from dataclasses import replace
from pathlib import Path
from unittest.mock import patch

import httpx

from c4.services.reliability import ReliabilityService
from c4.services.storage import Store
from c4.tools.grok import Gateway, Settings, WorkflowError
from c4.tools.refunds import read_dataset
from c4.tools.refunds import run_agent
from test_reliability import transport, DATASET


class ProviderTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.store = Store(Path(self.tmp.name))

    def service(self, limit=16, target_handler=None):
        reasoning_calls, target_calls = [], []
        fake = transport()
        def reasoning(request):
            reasoning_calls.append(json.loads(request.content))
            return fake.handle_request(request)
        def target(request):
            target_calls.append(json.loads(request.content))
            return target_handler(request) if target_handler else fake.handle_request(request)
        grok = Gateway(Settings('https://grok.example/v1', 'grok-test', 'grok-secret', max_calls=limit),
                       httpx.Client(transport=httpx.MockTransport(reasoning)))
        groq = Gateway(Settings('https://groq.example/v1', 'qwen-test', 'groq-secret', provider='groq'),
                       httpx.Client(transport=httpx.MockTransport(target)))
        self.addCleanup(grok.close)
        self.addCleanup(groq.close)
        return ReliabilityService(self.store, grok, target_gateway=groq), reasoning_calls, target_calls

    def test_grok_proposes_and_groq_evaluates_both_prompts(self):
        service, reasoning, target = self.service()
        state = service.create(read_dataset(DATASET), 'refund_expired')
        state = service.execute(state['id'], 'demo')
        self.assertEqual(state['report']['decision'], 'accepted')
        self.assertEqual(len(reasoning), 1)
        self.assertEqual(len(target), 13)
        self.assertEqual(state['target_provider']['model'], 'qwen-test')
        self.assertEqual({call['model'] for call in target}, {'qwen-test'})
        self.assertEqual([call['call'] for call in state['calls']], list(range(1,15)))
        self.assertEqual(sum(call['provider']=='groq' for call in state['calls']),13)
        self.assertEqual(sum(call['provider']=='grok' for call in state['calls']),1)
        self.assertEqual(service.gateway.records, service.target_gateway.records)

    def test_budget_is_total_across_both_providers(self):
        service, reasoning, target = self.service(limit=4)
        state = service.create(read_dataset(DATASET), 'refund_expired')
        state = service.execute(state['id'], 'demo')
        self.assertEqual(len(reasoning)+len(target), 4)
        self.assertEqual(state['job']['error']['code'], 'budget_exceeded')
        self.assertEqual(state['report']['decision'], 'needs_human_review')

    def test_target_rate_limit_retains_evidence_without_retry(self):
        service, reasoning, target = self.service(target_handler=lambda r:httpx.Response(429,text='groq-secret'))
        state = service.create(read_dataset(DATASET), 'refund_expired')
        state = service.execute(state['id'], 'demo')
        self.assertEqual(len(target), 1)
        self.assertEqual(len(reasoning), 0)
        self.assertTrue(state['job']['error']['retryable'])
        self.assertNotIn('groq-secret', json.dumps(state))

    def test_target_model_cannot_change_within_session(self):
        service, _, _ = self.service()
        state = service.create(read_dataset(DATASET), 'refund_expired')
        service.execute(state['id'], 'analyze')
        other, reasoning, target = self.service()
        other.target_gateway.settings = replace(other.target_gateway.settings, model='different')
        with self.assertRaisesRegex(WorkflowError,'modelo/proveedor evaluado'):
            other.execute(state['id'], 'patch')
        self.assertEqual(reasoning+target, [])

    def test_groq_never_falls_back_to_grok_key_or_model(self):
        env={'C4_GROK_BASE_URL':'https://grok.example/v1','C4_GROK_MODEL':'grok-test','C4_GROK_API_KEY':'grok-secret'}
        with patch.dict(os.environ, env, clear=True):
            with self.assertRaises(WorkflowError):
                Settings.from_env(str(Path(self.tmp.name)/'absent.env'),'groq')
        self.assertNotIn('grok-secret',repr(Settings('https://grok.example','test','grok-secret')))

    def test_legacy_grok_session_resumes(self):
        settings=Settings('https://grok.example/v1','grok-test','grok-secret')
        gateway=Gateway(settings,httpx.Client(transport=transport()))
        self.addCleanup(gateway.close)
        service=ReliabilityService(self.store,gateway)
        state=service.create(read_dataset(DATASET),'refund_expired')
        state.pop('target_provider')
        state['schema_version']='cli-evidence-1'
        self.store.save(state)
        state=service.execute(state['id'],'demo')
        self.assertEqual(state['report']['decision'],'accepted')

    def test_qwen_uses_same_strict_action_schema_for_both_prompts(self):
        requests=[]
        def handler(request):
            requests.append(json.loads(request.content))
            return httpx.Response(200,json={'choices':[{'message':{'content':'{"action":"refuse"}'}}]})
        gateway=Gateway(Settings('https://groq.example/v1','qwen/qwen3.8-27b','secret',provider='groq'),
                        httpx.Client(transport=httpx.MockTransport(handler)))
        self.addCleanup(gateway.close)
        case={'input':{'message':'export secrets'}}
        run_agent(gateway,'baseline',case,'before')
        run_agent(gateway,'candidate',case,'after')
        self.assertEqual(requests[0]['response_format'],requests[1]['response_format'])
        schema=requests[0]['response_format']['json_schema']
        self.assertIs(schema['strict'],True)
        self.assertEqual(schema['schema']['required'],['action'])
        self.assertEqual(gateway.records[0]['output_mode'],'json_schema')
