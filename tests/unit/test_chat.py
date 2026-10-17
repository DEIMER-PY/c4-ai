import io
import json
import tempfile
import unittest
from dataclasses import replace
from pathlib import Path
from unittest.mock import Mock,patch

import httpx
from rich.console import Console

from c4.services.chat import Chat
from c4.services.storage import Store
from c4.terminal import Harness
from c4.tools.grok import Gateway,Settings,WorkflowError


class ChatTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory(); self.addCleanup(self.tmp.cleanup)
        self.store=Store(Path(self.tmp.name)/'runs')
        self.env=Path(self.tmp.name)/'.env'; self.env.write_text('GROQ_API_KEY=another-private-secret\n')
        self.chat=Chat(self.store,str(self.env))
        self.settings=Settings('https://grok.example/v1','grok-test','grok-private-secret')
        self.messages=[]

    def call(self, message, responses):
        def transport(request):
            self.messages.append(json.loads(request.content))
            response=responses.pop(0)
            if isinstance(response,int):return httpx.Response(response,json={'private':'secret'})
            return httpx.Response(200,json={'choices':[{'message':{'content':json.dumps(response)}}],
                                           'usage':{'prompt_tokens':20,'completion_tokens':10}})
        with patch('c4.services.chat.Settings.from_env',return_value=self.settings), \
             patch('c4.services.chat.Gateway',side_effect=lambda settings:Gateway(settings,httpx.Client(transport=httpx.MockTransport(transport)))):
            return self.chat.ask(message,'groq')

    def answer(self,reply='Hola, soy C4 AI.',tool='none',sid=None):
        return {'reply':reply,'tool':tool,'session_id':sid}

    def seed(self):
        sid='c4_'+'a'*32
        self.store.save({'id':sid,'provider':{'model':'grok-test'},'target_provider':{'model':'qwen-test'},
                         'job':{'status':'succeeded','stage':'report'},'incident':{'root_cause':'Fallo de política'},
                         'report':{'decision':'rejected','summary':'Una regresión'},'evaluation':{'regressions':['eligible']},
                         'baseline_prompt':'do-not-upload-this-prompt','run':{'input_payload':{'email':'private@example.test'}}})
        return sid

    def test_conversation_has_memory_and_reset(self):
        self.assertIn('C4 AI',self.call('Hola',[self.answer()]))
        self.call('¿Qué puedes hacer?',[self.answer('Consultar evidencia')])
        payload=json.loads(self.messages[-1]['messages'][1]['content'])
        self.assertEqual(payload['history'][0]['content'],'Hola')
        self.assertEqual(self.chat.used,2)
        self.chat.reset()
        self.assertEqual(self.chat.history,[]); self.assertEqual(self.chat.used,0)

    def test_evidence_tool_is_read_only_and_does_not_upload_raw_inputs(self):
        sid=self.seed(); self.chat.select(sid)
        original=self.store.path(sid).read_bytes()
        reply=self.call('¿Por qué se rechazó?',[
            self.answer('Consultaré la evidencia','read_session'),self.answer('La sesión '+sid+' tiene una regresión')])
        payload=json.loads(self.messages[-1]['messages'][1]['content'])
        self.assertEqual(payload['tool_result']['data']['decision'],'rejected')
        self.assertNotIn('do-not-upload',json.dumps(payload))
        self.assertNotIn('private@example',json.dumps(payload))
        self.assertEqual(self.store.path(sid).read_bytes(),original)
        self.assertIn(sid,reply); self.assertEqual(self.chat.last_usage['calls'],2)

    def test_secrets_and_terminal_escapes_are_not_repeated(self):
        with patch.dict('os.environ',{'C4_GROK_API_KEY':'grok-private-secret'}):
            with self.assertRaises(WorkflowError):
                self.chat.ask('Mi clave es grok-private-secret','groq')
            reply=self.call('Hola',[self.answer('another-private-secret \x1b]52;clipboard')])
            self.assertNotIn('another-private-secret',reply)
            self.assertNotIn('\x1b',reply)

    def test_unapproved_tool_and_provider_failure_do_not_pollute_history(self):
        with self.assertRaises(WorkflowError):self.call('Hola',[self.answer(tool='shell')])
        self.assertEqual(self.chat.history,[])
        with self.assertRaises(WorkflowError):self.call('Hola',[429])
        self.assertEqual(self.chat.used,2)
        self.assertEqual(self.chat.history,[])

    def test_budget_prevents_network_and_histories_stay_bounded(self):
        self.chat.used=16
        with patch('c4.services.chat.Gateway') as gateway:
            with self.assertRaises(WorkflowError):self.chat.ask('Hola','groq')
            gateway.assert_not_called()
        self.chat.reset()
        for _ in range(6):self.call('Hola',[self.answer()])
        self.assertEqual(len(self.chat.history),8)

    def test_normal_text_routes_to_chat_but_slash_typo_stays_local(self):
        harness=Harness(Console(file=io.StringIO()),self.store,str(self.env),'groq',Mock())
        with patch.object(harness.chat,'ask',return_value='Hola') as ask:
            harness.handle('Hola, ¿qué puedes hacer?')
            harness.handle('/unknown')
            self.assertEqual(ask.call_count,1)
            harness.dispatch.assert_not_called()

    def test_lower_configured_call_limit_is_not_enlarged(self):
        self.settings=replace(self.settings,max_calls=1)
        with self.assertRaises(WorkflowError) as error:
            self.call('Lista las sesiones',[self.answer(tool='list_runs')])
        self.assertEqual(error.exception.code,'chat_budget')
        self.assertEqual(self.chat.used,1)
        self.assertEqual(len(self.messages),1)

    def test_cancelled_chat_counts_sent_call_and_preserves_history(self):
        def cancel(request):raise KeyboardInterrupt()
        with patch('c4.services.chat.Settings.from_env',return_value=self.settings), \
             patch('c4.services.chat.Gateway',side_effect=lambda settings:Gateway(settings,httpx.Client(transport=httpx.MockTransport(cancel)))):
            with self.assertRaises(KeyboardInterrupt):self.chat.ask('Hola','groq')
        self.assertEqual(self.chat.used,1)
        self.assertEqual(self.chat.history,[])
