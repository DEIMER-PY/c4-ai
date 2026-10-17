import io
import json
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock, patch

from rich.console import Console
from typer.testing import CliRunner

from c4.cli import app, interactive
from c4.services.storage import Store
from c4.terminal import Harness, header, summaries, show_runs
from c4.terminal_art import neuron


class TerminalTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.store=Store(Path(self.tmp.name)/'runs')
        self.env=Path(self.tmp.name)/'.env'
        self.env.write_text('C4_GROK_BASE_URL=https://grok.example/v1\nC4_GROK_MODEL=grok-test\nC4_GROK_API_KEY=grok-secret\nGROQ_API_KEY=groq-secret\nC4_GROQ_MODEL=qwen-test\n',encoding='utf-8')
        self.output=io.StringIO()
        self.console=Console(file=self.output,width=132,force_terminal=False)
        self.dispatch=Mock(return_value=0)
        self.harness=Harness(self.console,self.store,str(self.env),'grok',self.dispatch)

    def seed(self):
        sid='c4_'+'b'*32
        self.store.save({'id':sid,'provider':{'base_url':'https://grok.example/v1','model':'grok-test'},
            'job':{'status':'succeeded','stage':'report'},'report':{'decision':'accepted'},'calls':[{}]})
        return sid

    def test_header_supports_wide_and_narrow_without_keys_or_network(self):
        with patch.dict('os.environ',{},clear=True):
            for width in (132,60):
                output=io.StringIO()
                header(Console(file=output,width=width),self.store,str(self.env),'groq')
                text=output.getvalue()
                self.assertIn('C4 AI',text)
                self.assertIn('qwen-test',text)
                self.assertNotIn('grok-secret',text)
                self.assertNotIn('groq-secret',text)

    def test_selected_target_is_used_for_next_command(self):
        self.harness.handle('/target groq')
        self.harness.handle('/demo')
        self.dispatch.assert_called_once_with(['demo'],'groq')
        self.assertFalse(self.harness.handle('/quit'))

    def test_header_layout_stays_inside_terminal_and_preserves_roles(self):
        with patch.dict('os.environ',{},clear=True):
            for width in (40,60,115,116,132,160):
                with self.subTest(width=width):
                    output=io.StringIO()
                    header(Console(file=output,width=width,legacy_windows=False),self.store,str(self.env),'groq')
                    lines=output.getvalue().splitlines()
                    self.assertLessEqual(max(map(len,lines)),width)
                    self.assertIn('grok-test',output.getvalue())
                    self.assertIn('qwen-test',output.getvalue())
                    self.assertIn('/doctor --probe',output.getvalue())
                    self.assertNotIn('CONNECTED',output.getvalue())

    def test_neuron_falls_back_for_ascii_only_terminal(self):
        class AsciiOutput(io.StringIO):
            @property
            def encoding(self):return 'ascii'
        output=AsciiOutput()
        with patch.dict('os.environ',{},clear=True):
            header(Console(file=output,width=132,legacy_windows=False),self.store,str(self.env),'groq')
        self.assertFalse(any(0x2800<=ord(c)<=0x28ff for c in output.getvalue()))
        self.assertIn('( C4 )',output.getvalue())
        neuron(unicode=False).plain.encode('ascii')

    def test_invalid_target_and_shell_input_do_not_dispatch(self):
        self.harness.handle('/target unknown')
        self.harness.handle('python -c "print(1)"')
        self.harness.handle('gsk_'+'a'*32)
        self.dispatch.assert_not_called()
        self.assertNotIn('a'*32,self.output.getvalue())

    def test_last_reads_existing_session_and_runs_list_is_local(self):
        sid=self.seed()
        self.harness.handle('/report last')
        self.dispatch.assert_called_once_with(['report',sid],'grok')
        self.harness.handle('/runs')
        self.assertIn(sid,self.output.getvalue())
        self.assertEqual(summaries(self.store)[0]['calls'],1)

    def test_empty_last_does_not_launch_demo(self):
        self.harness.handle('/compare last')
        self.dispatch.assert_not_called()
        self.assertIn('No hay una sesión',self.output.getvalue())

    def test_narrow_runs_keeps_full_session_id_copyable(self):
        sid=self.seed()
        output=io.StringIO()
        show_runs(Console(file=output,width=60,legacy_windows=False),self.store)
        self.assertIn(sid,output.getvalue())

    def test_failure_keeps_console_alive_and_eof_exits(self):
        self.dispatch.return_value=2
        session=Mock()
        session.prompt.side_effect=['/demo','/help',KeyboardInterrupt(),EOFError()]
        self.harness.run(session)
        self.assertEqual(session.prompt.call_count,4)
        self.assertIn('Código 2',self.output.getvalue())
        self.assertIn('Entrada cancelada',self.output.getvalue())
        self.assertIn('Sesión local cerrada',self.output.getvalue())

    def test_noninteractive_default_shows_help_and_json_tui_rejects(self):
        runner=CliRunner()
        result=runner.invoke(app,[])
        self.assertEqual(result.exit_code,0,result.output)
        self.assertIn('Commands',result.output)
        result=runner.invoke(app,['--json','tui'])
        self.assertEqual(result.exit_code,1)
        self.assertEqual(json.loads(result.output)['error']['code'],'interactive_required')

    def test_interactive_routes_to_same_typer_app_without_network(self):
        class Input(io.StringIO):
            def isatty(self):return True
        context=SimpleNamespace(obj={'store':self.store,'env_file':str(self.env),'json':False,'target_provider':'grok'})
        def run_once(harness):
            harness.handle('/target groq')
            harness.handle('/doctor')
            harness.handle('/help')
        with patch('sys.stdin',Input()),patch('c4.cli.console',self.console), \
             patch('c4.terminal.Harness.run',run_once),patch.dict('os.environ',{},clear=True):
            interactive(context)
        text=self.output.getvalue()
        self.assertIn('qwen-test',text)
        self.assertIn('Comando',text)
        self.assertNotIn('grok-secret',text)
        self.assertNotIn('groq-secret',text)


if __name__=='__main__':unittest.main()
