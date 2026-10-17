"""Checkpoint-driven harness view, scoped to a single interactive command."""
from contextlib import contextmanager
from contextvars import ContextVar
from time import monotonic

from rich.console import Console, Group
from rich.live import Live
from rich.table import Table
from rich.text import Text

from c4.terminal_art import neuron

ACTIVE_SCREEN = ContextVar('c4_terminal_screen', default=None)
STAGES = {'inspect':'Inspector / baseline', 'diagnose':'Diagnoser / Grok',
          'patch':'Patcher / candidato', 'evaluate':'Evaluator / comparación',
          'decide':'Security Sentinel / gate', 'report':'Reporter / evidencia'}


@contextmanager
def bind_screen(screen):
    token = ACTIVE_SCREEN.set(screen)
    try:
        yield
    finally:
        ACTIVE_SCREEN.reset(token)


class ExecutionScreen:
    def __init__(self, console: Console):
        self.console = console
        self.started = monotonic()
        self.state = None
        self.events = []
        self.last_event = None

    def checkpoint(self, state: dict):
        self.state = state
        event = (state['job']['stage'], len(state.get('evaluation_outputs', [])), state['job']['status'])
        if event != self.last_event:
            self.events.append((monotonic()-self.started, *event))
            self.events = self.events[-5:]
            self.last_event = event

    @contextmanager
    def progress(self):
        with Live(self, console=self.console, refresh_per_second=4,
                  transient=True, vertical_overflow='visible', redirect_stdout=False, redirect_stderr=False):
            yield self.checkpoint

    def __rich_console__(self, console, options):
        yield self.render(options.max_width)

    def render(self, width=None):
        width = width or self.console.width
        state = self.state
        right = Text('C4 AI HARNESS CLI  /  ACTIVE TESTBED\n', style='bold #e879c9')
        if state is None:
            right.append('Preparando configuración y evidencia local…\n', style='#c4b5fd')
        else:
            target = state.get('target_provider', {'provider':'grok', **state['provider']})
            right.append('Target: '+target['provider']+' / '+target['model']+'\n', style='#67e8f9')
            right.append('Analista: Grok / '+state['provider']['model']+'\n', style='#c4b5fd')
            right.append('Sesión: '+state['id']+'\n', style='#94a3b8')
            right.append('─'*max(10,min(64,width-55))+'\n', style='#64748b')
            for elapsed, stage, count, status in self.events:
                right.append(f'[*] {elapsed:5.0f}s  {STAGES.get(stage,stage)}\n', style='#c4b5fd')
            job = state['job']
            right.append('\nEstado: '+job['status']+' / '+job['stage']+'\n', style='bold cyan')
            total = len(state['dataset']['data']['cases'])*2
            right.append(f'Respuestas guardadas: {len(state.get("evaluation_outputs",[]))}/{total}\n')
            calls = state['calls']
            known = [c for c in calls if c.get('input_tokens') is not None and c.get('output_tokens') is not None]
            tokens = sum(c['input_tokens']+c['output_tokens'] for c in known)
            latency = sum(c.get('latency_ms',0) for c in calls)/1000
            right.append(f'Llamadas: {len(calls)}  Tokens: {tokens} ({len(known)}/{len(calls)})\n')
            right.append(f'Latencia acumulada registrada: {latency:.2f}s\n', style='#94a3b8')
            evaluation = state.get('evaluation',{})
            if evaluation.get('status') == 'completed':
                before, after = evaluation['before'], evaluation['after']
                right.append(f'Baseline {before["passed"]}/{before["total"]} > candidato {after["passed"]}/{after["total"]}\n')
                right.append(f'Regresiones: {len(evaluation["regressions"])}  Seguridad: {evaluation["security_passed"]}\n')
            report = state.get('report')
            if report:
                style = '#86efac' if report['decision']=='accepted' else '#fda4af'
                right.append('Decisión: '+report['decision']+'\n',style='bold '+style)
            if job.get('error'):
                right.append('Error: '+job['error']['code']+'\n',style='bold #fda4af')
        right.append(f'\nTiempo de este comando: {monotonic()-self.started:.0f}s · costo desconocido\n',style='#94a3b8')
        right.append('Casos sintéticos / acciones de prueba\nCtrl+C cancela y conserva evidencia',style='#94a3b8')
        try:
            '⠿'.encode(self.console.encoding)
            unicode = not self.console.options.legacy_windows
        except (LookupError,UnicodeEncodeError):
            unicode = False
        if width >= 116:
            grid = Table.grid(padding=(0,2),expand=True)
            grid.add_column(width=50)
            grid.add_column(ratio=1)
            grid.add_row(neuron(width=50,height=min(27,max(19,self.console.height-5)),unicode=unicode),right)
            return grid
        return Group(neuron(width=min(34,width),height=15,unicode=unicode),right)

    def finish(self, state):
        self.checkpoint(state)
        self.console.print(self)
        self.console.print(Text('Evidencia guardada; /report '+state['id']+' para consultar.',style='dim'))
