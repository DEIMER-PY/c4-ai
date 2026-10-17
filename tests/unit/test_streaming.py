import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import httpx

from c4.services.chat import Chat
from c4.services.storage import Store
from c4.tools.grok import Settings, WorkflowError
from c4.tools.streaming import StreamingGateway


def sse(parts, done=True):
    chunks = ['data: '+json.dumps({'choices':[{'delta':{'content':part}}]})+'\n\n' for part in parts]
    chunks.append('data: '+json.dumps({'choices':[],'usage':{'prompt_tokens':30,'completion_tokens':8}})+'\n\n')
    if done:chunks.append('data: [DONE]\n\n')
    return ''.join(chunks).encode()


class StreamingTests(unittest.TestCase):
    def settings(self):return Settings('https://groq.example/v1','qwen/qwen3.8-27b','fake-stream-key',provider='groq')

    def test_stream_records_usage_and_supported_reasoning_option(self):
        requests=[]
        def transport(request):
            requests.append(json.loads(request.content))
            return httpx.Response(200,content=sse(['Hola ','mundo']))
        gateway=StreamingGateway(self.settings(),httpx.Client(transport=httpx.MockTransport(transport)))
        self.addCleanup(gateway.close)
        chunks=[]
        self.assertEqual(gateway.text('system',{},chunks.append),'Hola mundo')
        self.assertEqual(gateway.calls,1)
        self.assertEqual(gateway.records[0]['input_tokens'],30)
        self.assertIsNotNone(gateway.records[0]['ttft_ms'])
        self.assertEqual(requests[0]['reasoning_effort'],'none')
        self.assertTrue(requests[0]['stream'])

    def test_broken_stream_and_http_error_never_become_success(self):
        for response in [httpx.Response(429),httpx.Response(200,content=sse(['partial'],False)),httpx.Response(200,content=b'data: invalid\n\n')]:
            gateway=StreamingGateway(self.settings(),httpx.Client(transport=httpx.MockTransport(lambda request:response)))
            with self.assertRaises(WorkflowError):gateway.text('system',{},lambda text:None)
            self.assertEqual(gateway.calls,1)
            self.assertEqual(gateway.records[0]['status'],'failed')
            gateway.close()

    def test_chat_preloads_evidence_and_redacts_split_secrets(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory)
            key='gsk_'+'a'*36
            env=root/'.env'; env.write_text('GROQ_API_KEY='+key)
            store=Store(root/'runs')
            chat=Chat(store,str(env)); chat.provider='groq'
            sid='c4_'+'b'*32
            store.save({'id':sid,'job':{'status':'succeeded','stage':'report'},'provider':{'model':'grok'},'incident':{'root_cause':'policy'},
                        'report':{'decision':'rejected','summary':'regression'},'baseline_prompt':'PRIVATE PROMPT','calls':[]})
            chat.select(sid)
            payloads=[]
            def transport(request):
                payloads.append(json.loads(request.content))
                return httpx.Response(200,content=sse(['x'*200+key[:10],key[10:]+' final']))
            seen=[]
            with patch('c4.services.chat.Settings.from_env',return_value=self.settings()),patch('c4.tools.streaming.StreamingGateway',side_effect=lambda settings:StreamingGateway(settings,httpx.Client(transport=httpx.MockTransport(transport)))):
                reply=chat.stream('Explícame esta ejecución','groq',seen.append)
            self.assertEqual(chat.used,1)
            self.assertEqual(len(payloads),1)
            self.assertNotIn('PRIVATE PROMPT',json.dumps(payloads))
            self.assertNotIn(key,reply)
            self.assertTrue(all(key[:10] not in text for text in seen))
            self.assertIn('[REDACTED]',reply)
            self.assertIn(sid,payloads[0]['messages'][1]['content'])

    def test_cancelled_stream_counts_request(self):
        def transport(request):raise KeyboardInterrupt()
        gateway=StreamingGateway(self.settings(),httpx.Client(transport=httpx.MockTransport(transport)))
        with self.assertRaises(KeyboardInterrupt):gateway.text('system',{},lambda text:None)
        self.assertEqual(gateway.calls,1)
        self.assertEqual(gateway.records[0]['status'],'failed')
        gateway.close()

    def test_context_separates_baseline_cause_and_candidate_actions(self):
        with tempfile.TemporaryDirectory() as directory:
            store=Store(Path(directory)/'runs')
            sid='c4_'+'c'*32
            store.save({'id':sid,'job':{'status':'succeeded','stage':'report'},'provider':{'model':'grok'},
                'incident':{'root_cause':'baseline diagnosis'},'target_case_id':'expired',
                'evaluation':{'regressions':['eligible']},'evaluation_outputs':[
                    {'case_id':'eligible','stage':'after','output':{'action':'request_order_details','private':'do not send'},'expected':{'action':'refund_order'}},
                    {'case_id':'other','stage':'after','output':{'action':'refuse'},'expected':{'action':'refuse'}}]})
            context=Chat(store,str(Path(directory)/'.env')).evidence(sid)
            self.assertIn('baseline_root_cause',context)
            self.assertNotIn('root_cause',context)
            self.assertEqual(len(context['action_evidence']),1)
            self.assertEqual(context['action_evidence'][0]['observed_action'],'request_order_details')
            self.assertNotIn('do not send',json.dumps(context))
