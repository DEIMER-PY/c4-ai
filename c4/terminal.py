"""Interactive terminal presentation. No model calls or shell execution on startup."""
import os
import re
import shlex
from importlib.metadata import version
from time import monotonic
from typing import Callable

from dotenv import dotenv_values
from prompt_toolkit import PromptSession
from prompt_toolkit.completion import WordCompleter
from prompt_toolkit.formatted_text import FormattedText
from prompt_toolkit.history import InMemoryHistory
from prompt_toolkit.styles import Style
from rich.console import Console, Group
from rich.panel import Panel
from rich.table import Table
from rich.text import Text

from c4.services.storage import Store
from c4.tools.grok import WorkflowError

NEURON = r'''
             .   |   .
        \ .  :   |   :  . /
    .    \:   \  |  /   :/    .
     `---.\    \ | /    /.---'
  .---.... \ .--\|/--. / ....---.
      `----. /   *   \ .----'
   --==----(   C4 AI   )----==--
      .----' \   *   / `----.
  `---.... / `--/|\--' \ ....---'
     .---'/    / | \    \`---.
    '    /:   /  |  \   :\    '
        / '  :   |   :  ' \
             '   |   '
                 `===.____
                          `====>
'''.strip('\n')

COMMANDS = {
    '/help': 'Mostrar comandos y límites',
    '/target grok|groq': 'Elegir proveedor para el próximo trabajo',
    '/doctor [--probe]': 'Validar configuración; --probe hace llamadas',
    '/demo': 'Ciclo completo: diagnóstico, candidato y evaluación',
    '/start': 'Crear sesión y diagnosticar; continuar con patch/eval',
    '/patch ID': 'Guardar candidato sin aceptarlo',
    '/eval ID': 'Comparar ambos prompts y decidir',
    '/runs': 'Listar sesiones locales guardadas',
    '/report ID|last': 'Leer evidencia sin consumir solicitudes',
    '/compare ID|last': 'Leer comparación sin consumir solicitudes',
    '/clear': 'Redibujar cabecera',
    '/quit': 'Salir; Ctrl+D también sale',
}


def summaries(store: Store, limit: int = 8) -> list[dict]:
    rows = []
    for path in sorted(store.root.glob('c4_*/evidence.json'), key=lambda p:p.stat().st_mtime, reverse=True):
        try:
            state = store.load(path.parent.name)
            target = state.get('target_provider', {'provider':'grok', **state['provider']})
            rows.append({'id':state['id'], 'status':state['job']['status'], 'stage':state['job']['stage'],
                         'decision':state.get('report',{}).get('decision','pendiente'),
                         'provider':target['provider'], 'model':target['model'], 'calls':len(state['calls']),
                         'locked':path.with_suffix('.lock').exists()})
            if len(rows) >= limit:
                break
        except (WorkflowError, KeyError, TypeError, ValueError):
            continue
    return rows


def neuron() -> Text:
    art = Text()
    colors = ['#d946ef','#c026d3','#a855f7','#818cf8','#38bdf8','#22d3ee']
    for line in NEURON.splitlines():
        for x, char in enumerate(line):
            art.append(char, style=colors[min(len(colors)-1,x*len(colors)//40)])
        art.append('\n')
    return art


def header(console: Console, store: Store, env_file: str, provider: str):
    env = {**dotenv_values(env_file), **os.environ}
    target_model = env.get('C4_GROQ_MODEL' if provider=='groq' else 'C4_GROK_MODEL') or 'sin configurar'
    status = Table.grid(padding=(0,1))
    status.add_column(style='dim')
    status.add_column()
    status.add_row('C4 AI HARNESS', Text('v'+version('c4-ai'),style='bold cyan'))
    status.add_row('Modo', 'Confiabilidad / agente de prueba')
    status.add_row('Razonamiento', Text('Grok · '+str(env.get('C4_GROK_MODEL') or 'sin configurar')))
    status.add_row('Target', Text(provider+' · '+str(target_model)))
    status.add_row('Cambios', 'Prompts y configuración de prueba')
    status.add_row('Seguridad', 'Evaluación completa y cero regresiones')
    status.add_row('Jev', 'Planificado · integración pendiente')
    status.add_row('Datos', 'Casos sintéticos · resultados del proveedor')
    status.add_row('Red', 'Sin solicitudes al abrir esta consola')
    rows = summaries(store,1)
    if rows:
        status.add_row('Última sesión',Text(rows[0]['id']))
        status.add_row('Último resultado',Text(rows[0]['status']+' / '+rows[0]['decision']))
    body = Table.grid(expand=True,padding=(0,2))
    if console.width >= 110:
        body.add_column(width=42)
        body.add_column(ratio=1)
        body.add_row(neuron(),status)
        content = body
    else:
        content = Group(neuron(),status)
    console.print(Panel(content,title='[bold magenta]C4 AI[/bold magenta] [cyan]/ AGENT RELIABILITY[/cyan]',
                        subtitle='[dim]/help comandos · /runs evidencia · /demo ejecuta[/dim]',border_style='magenta'))


def show_help(console: Console):
    table = Table('Comando','Acción',border_style='cyan',expand=True)
    for command, purpose in COMMANDS.items():
        table.add_row(command,purpose)
    console.print(table)
    console.print(Text('No se ejecutan comandos del sistema. Las claves se configuran en .env, no en este prompt.',style='dim'))


def show_runs(console: Console, store: Store):
    rows = summaries(store)
    if not rows:
        console.print('Aún no hay sesiones. /demo ejecuta una prueba real; /help explica las opciones.')
        return
    table = Table('Sesión','Target','Estado / decisión','Llamadas',border_style='cyan')
    for row in rows:
        state = row['status']+' / '+row['decision']
        if row['status']=='running' and not row['locked']:
            state += ' (sin bloqueo; verificar)'
        if console.width < 110:
            console.print(Panel(Group(Text(row['id'],style='cyan'),Text(row['provider']+' / '+row['model']),
                Text(state),Text(str(row['calls'])+' llamadas')),border_style='cyan'))
        else:
            table.add_row(Text(row['id']),Text(row['provider']+' / '+row['model']),Text(state),str(row['calls']))
    if console.width >= 110:
        console.print(table)
    console.print(Text('Costo: desconocido. /report ID muestra la evidencia completa.',style='dim'))


class Harness:
    def __init__(self, console: Console, store: Store, env_file: str, provider: str,
                 dispatch: Callable[[list[str], str], int]):
        self.console,self.store,self.env_file,self.provider,self.dispatch = console,store,env_file,provider,dispatch

    def redraw(self):
        header(self.console,self.store,self.env_file,self.provider)

    def handle(self, line: str) -> bool:
        if re.search(r'\b(?:gsk_|pk_|sk-)[A-Za-z0-9_-]{12,}',line):
            self.console.print('Configura credenciales solo en .env; este prompt no las utiliza.')
            return True
        try:
            tokens = shlex.split(line)
        except ValueError:
            self.console.print('Comillas sin cerrar. Usa /help.')
            return True
        if not tokens:
            return True
        command,*args = tokens
        command = command.removeprefix('/')
        if command in {'quit','exit'} and not args:
            return False
        if command=='help' and not args:
            show_help(self.console)
        elif command=='clear' and not args:
            self.console.clear()
            self.redraw()
        elif command=='target':
            if len(args)!=1 or args[0] not in {'grok','groq'}:
                self.console.print('Uso: /target grok o /target groq')
            else:
                self.provider=args[0]
                self.console.print(Text('Target elegido: '+self.provider+'. C4 sigue razonando con Grok; las sesiones conservan su modelo.',style='cyan'))
        elif command=='runs' and not args:
            show_runs(self.console,self.store)
        elif command in {'demo','start','doctor','analyze','patch','eval','report','compare'}:
            if command in {'report','compare'} and args==['last']:
                rows=summaries(self.store,1)
                if not rows:
                    self.console.print('No hay una sesión guardada para consultar.')
                    return True
                args=[rows[0]['id']]
            code=self.dispatch([command,*args],self.provider)
            if code:
                self.console.print(Text(f'Código {code}: consulta la evidencia y /help. Puedes continuar en esta consola.',style='yellow'))
        else:
            self.console.print('Comando no reconocido. Usa /help; no se ejecuta código ni shell.')
        return True

    def run(self, session=None):
        self.redraw()
        started=monotonic()
        session=session or PromptSession(completer=WordCompleter([c.split()[0] for c in COMMANDS],sentence=True),
            history=InMemoryHistory(),complete_while_typing=False,
            style=Style.from_dict({'prompt':'ansimagenta bold','target':'ansicyan','bottom-toolbar':'bg:#111827 #94a3b8'}))
        while True:
            try:
                line=session.prompt(FormattedText([('class:prompt','c4 '),('class:target',self.provider+' > ')]),
                    bottom_toolbar=lambda:f'Tab: comandos | /help | Ctrl+D: salir | Sesión local: {monotonic()-started:.0f}s')
                if not self.handle(line):
                    break
            except KeyboardInterrupt:
                self.console.print('Entrada cancelada. /quit para salir; no se creó una ejecución.')
            except EOFError:
                break
        self.console.print(Text('Sesión local cerrada. La evidencia guardada permanece en disco.',style='dim'))
