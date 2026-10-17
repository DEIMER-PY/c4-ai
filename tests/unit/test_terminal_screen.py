import io
import json
import unittest
from pathlib import Path
from unittest.mock import patch

from rich.console import Console
from typer.testing import CliRunner

from c4.cli import app
from c4.terminal_screen import ACTIVE_SCREEN, ExecutionScreen, bind_screen


class ExecutionScreenTests(unittest.TestCase):
    def state(self):
        fixture=json.loads(Path('examples/contracts/scenario.json').read_text(encoding='utf-8'))
        return {'id':'c4_'+'a'*32,'provider':{'model':'grok-test'},
                'target_provider':{'provider':'groq','model':'qwen-test'},
                'job':fixture['job'], 'report':fixture['report'], 'evaluation':fixture['evaluation'],
                'dataset':{'data':{'cases':[{},{}]}},'evaluation_outputs':[{},{}],
                'calls':[{'input_tokens':10,'output_tokens':5,'latency_ms':250}]}

    def test_renderer_uses_checkpoint_metrics_and_fits_both_layouts(self):
        for width in (60,132):
            output=io.StringIO()
            console=Console(file=output,width=width,height=40,legacy_windows=False)
            screen=ExecutionScreen(console)
            state=self.state()
            screen.checkpoint(state)
            console.print(screen)
            text=output.getvalue()
            self.assertIn('qwen-test',text)
            self.assertIn('Tokens: 15 (1/1)',text)
            self.assertIn('0.25s',text)
            self.assertIn('accepted',text)
            self.assertLessEqual(max(map(len,text.splitlines())),width)

    def test_cancelled_checkpoint_never_displays_acceptance(self):
        state=self.state()
        state.pop('report'); state.pop('evaluation')
        state['job']={**state['job'],'status':'failed','error':{'code':'cancelled'}}
        output=io.StringIO(); console=Console(file=output,width=132)
        screen=ExecutionScreen(console); screen.finish(state)
        self.assertIn('cancelled',output.getvalue())
        self.assertNotIn('Decisión: accepted',output.getvalue())

    def test_scope_resets_after_error_and_json_bypasses_screen(self):
        screen=ExecutionScreen(Console(file=io.StringIO()))
        with self.assertRaises(RuntimeError):
            with bind_screen(screen):
                self.assertIs(ACTIVE_SCREEN.get(),screen)
                raise RuntimeError()
        self.assertIsNone(ACTIVE_SCREEN.get())
        with bind_screen(screen),patch.object(screen,'finish') as finish:
            result=CliRunner().invoke(app,['--json','--store','does-not-exist','report','c4_'+'a'*32])
            self.assertEqual(json.loads(result.output)['error']['code'],'not_found')
            finish.assert_not_called()
