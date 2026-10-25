"""Interactive terminal presentation. No model calls or shell execution on startup."""
import os
import re
import shlex
from contextlib import nullcontext
from importlib.metadata import version
from time import monotonic
from typing import Callable

from dotenv import dotenv_values
from prompt_toolkit import PromptSession
from prompt_toolkit.completion import WordCompleter
from prompt_toolkit.formatted_text import FormattedText
from prompt_toolkit.history import InMemoryHistory
from prompt_toolkit.styles import Style
from prompt_toolkit.key_binding import KeyBindings
from rich.console import Console, Group
from rich.panel import Panel
from rich.table import Table
from rich.text import Text
from rich.live import Live
from rich.markdown import Markdown

from c4.services.storage import Store
from c4.services.chat import Chat
from c4.terminal_art import neuron
from c4.tools.grok import WorkflowError

COMMANDS = {
    '/help': 'Mostrar comandos y límites',
    '/use ID|last': 'Seleccionar evidencia para conversar',
    '/new': 'Borrar conversación y reiniciar presupuesto de chat',
    '/chat groq|grok': 'Elegir proveedor de conversación',
    '/status': 'Ver proveedores y presupuesto de chat',
    '/run': 'Ejecutar el ciclo completo (alias de /demo)',
    '/inspect ID|last': 'Consultar reporte (alias de /report)',
    '/target grok|groq|deepseek|ollama': 'Elegir proveedor para el próximo trabajo',
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


def header(console: Console, store: Store, env_file: str, provider: str):
    env = {**dotenv_values(env_file), **os.environ}
    model_vars = {'groq': 'C4_GROQ_MODEL', 'deepseek': 'C4_DEEPSEEK_MODEL', 'ollama': 'C4_OLLAMA_MODEL'}
    target_model = env.get(model_vars.get(provider, 'C4_GROK_MODEL')) or ('qwen2.5:7b' if provider == 'ollama' else 'sin configurar')
    status = Table.grid(padding=(0,1))
    status.add_column(style='#94a3b8')
    status.add_column()
    status.add_row(Text('C4 AI HARNESS CLI', style='bold #e879c9'), Text('v'+version('c4-ai'),style='bold cyan'))
    status.add_row('Modo', 'Confiabilidad / agente de prueba')
    status.add_row('Razonamiento', Text('Grok · '+str(env.get('C4_GROK_MODEL') or 'sin configurar')))
    status.add_row('Target', Text(provider+' · '+str(target_model)))
    status.add_row('Entorno', 'Local / soporte y reembolsos')
    activity = Text('\n'+'─'*min(64, max(12, console.width-62))+'\n', style='#64748b')
    activity.append('[*] HARNESS LISTO PARA RECIBIR COMANDOS\n\n', style='bold #c4b5fd')
    activity.append('[*] Configuración de proveedores: /doctor\n', style='#a5b4fc')
    activity.append('    Conexión: /doctor --probe\n\n', style='#94a3b8')
    activity.append('[*] Ciclo de confiabilidad\n', style='#a5b4fc')
    activity.append('    detectar > diagnosticar > proponer\n', style='#cbd5e1')
    activity.append('    evaluar > aceptar / rechazar / escalar\n\n', style='#cbd5e1')
    activity.append('[*] Gate: evaluación completa, cero regresiones\n', style='#67e8f9')
    activity.append('    Acciones simuladas; sin cambios en producción\n', style='#94a3b8')
    rows = summaries(store,1)
    if rows:
        activity.append('\n[LOCAL] Última evidencia guardada\n', style='bold #a5b4fc')
        activity.append(rows[0]['id']+'\n', style='#67e8f9')
        activity.append(rows[0]['status']+' / '+rows[0]['decision']+'\n', style='#f0abfc')
        activity.append('Resultado anterior; /report ID para consultar\n', style='#94a3b8')
    else:
        activity.append('\n[LOCAL] Sin ejecuciones guardadas\n', style='#94a3b8')
    activity.append('\nEscribe para conversar (consume llamadas)\n/help comandos   /runs evidencia   /run ejecutar', style='#c4b5fd')
    context = Group(status, activity)
    try:
        '⠿'.encode(console.encoding)
        unicode_art = not console.options.legacy_windows
    except (LookupError, UnicodeEncodeError):
        unicode_art = False
    body = Table.grid(expand=True,padding=(0,2))
    if console.width >= 116:
        body.add_column(width=52)
        body.add_column(ratio=1)
        body.add_row(neuron(height=min(29, max(19, console.height-7)), unicode=unicode_art),context)
        content = body
    else:
        content = Group(neuron(width=min(38, console.width), height=19, unicode=unicode_art),context)
    console.print()
    console.print(content)
    console.print(Text('\nAGENT RELIABILITY  /  Casos sintéticos · Jev: planificado', style='#64748b'))


def show_help(console: Console):
    table = Table('Comando','Acción',border_style='cyan',expand=True)
    for command, purpose in COMMANDS.items():
        table.add_row(command,purpose)
    console.print(table)
    console.print(Text('No se ejecutan comandos del sistema. Las claves se configuran en .env, no en este prompt.',style='dim'))
    console.print(Text('Chat streaming: una llamada/turno, hasta 16/conversación. /chat elige proveedor; /new reinicia; /use ID fija evidencia. Enter envía; Alt+Enter o Esc+Enter inserta línea.',style='cyan'))


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
        self.chat = Chat(store,env_file)

    def talk(self, line):
        started = monotonic()
        content = ''
        phase = 'Contexto local / respuesta en curso'
        def update(text):
            nonlocal content
            content = text
        def render():
            usage = self.chat.last_usage
            metrics = Text(f'Proveedor  {self.chat.provider.upper()}\nEstado     {phase}\n',style='cyan')
            metrics.append('Modelo     '+self.chat.model+'\n',style='white')
            metrics.append(f'Tiempo     {monotonic()-started:.1f}s\n',style='white')
            metrics.append(f'Llamadas   {self.chat.used}/16\n',style='white')
            metrics.append(f'Caracteres {len(content)}\n',style='dim')
            if usage:
                tokens = str(usage['tokens']) if usage['coverage'] else 'no reportados'
                first = str(usage['ttft_ms'])+' ms' if usage.get('ttft_ms') is not None else 'no recibido'
                metrics.append(f'Tokens     {tokens}\nPrimer fragmento {first}\n',style='white')
            else:
                metrics.append('Tokens     pendientes de usage\n',style='dim')
            metrics.append('Costo      desconocido',style='dim')
            response = Panel(Markdown(content) if content else Text('Consultando contexto local y esperando al proveedor…',style='dim'),title='[cyan]C4 AI / respuesta[/cyan]',border_style='cyan')
            meter = Panel(metrics,title='CONSUMO / SESIÓN',border_style='magenta')
            if self.console.width>=110:
                row = Table.grid(expand=True,padding=(0,1))
                row.add_column(ratio=3); row.add_column(width=36)
                row.add_row(response,meter)
                return row
            return Group(response,meter)
        try:
            with (Live(get_renderable=render,console=self.console,refresh_per_second=12,transient=True) if self.console.is_terminal else nullcontext()):
                reply = self.chat.stream(line,self.provider,update)
            content = reply
            phase = 'Completado'
            self.console.print(render())
        except WorkflowError as error:
            self.console.print(Text(error.code+': '+str(error),style='yellow'))
        except KeyboardInterrupt:
            self.console.print('Chat cancelado; la solicitud enviada puede consumir créditos.')
        except (OSError,ValueError,KeyError,TypeError):
            self.console.print('No se pudo consultar el contexto local; revisa /runs y la configuración.')
        usage = self.chat.last_usage
        if usage:
            tokens = str(usage['tokens']) if usage['coverage'] else 'no reportados'
            self.console.print(Text(f'Chat: {usage["calls"]} llamadas · tokens {tokens} '
                f'({usage["coverage"]}/{usage["calls"]}) · {usage["latency_ms"]} ms acumulados · '
                f'{usage["total_calls"]}/16 llamadas · costo desconocido',style='dim'))

    def redraw(self):
        header(self.console,self.store,self.env_file,self.provider)

    def handle(self, line: str) -> bool:
        if self.chat.has_secret(line):
            self.console.print('Configura credenciales solo en .env; este prompt no las utiliza.')
            return True
        head = line.strip().split(maxsplit=1)[0] if line.strip() else ''
        aliases = {c.split()[0].removeprefix('/') for c in COMMANDS} | {'exit','analyze'}
        if not head.startswith('/') and head and head not in aliases:
            if head.lower() in {'python','python3','powershell','pwsh','cmd','bash','node'}:
                self.console.print('No se ejecuta código ni shell. Escribe una pregunta o usa /help.')
            else:
                self.talk(line)
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
        command = {'run':'demo','inspect':'report'}.get(command,command)
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
        elif command=='new' and not args:
            self.chat.reset()
            self.console.print('Conversación borrada de memoria; presupuesto de chat reiniciado.')
        elif command=='chat' and len(args)==1 and args[0] in {'grok','groq'}:
            self.chat.provider = args[0]
            self.chat.model = 'según configuración'
            self.console.print(Text('Proveedor de conversación: '+args[0]+'. El target y el analista del workflow no cambian.',style='cyan'))
        elif command=='status' and not args:
            self.console.print(Text(f'Chat {self.chat.provider} · Target {self.provider} · Analista Grok\nPresupuesto chat {self.chat.used}/16 llamadas · historial {len(self.chat.history)}/8 mensajes · costo desconocido',style='cyan'))
        elif command=='use' and len(args)==1:
            try:
                self.console.print(Text('Evidencia seleccionada: '+self.chat.select(args[0]),style='cyan'))
            except (WorkflowError,OSError,ValueError,KeyError) as error:
                self.console.print('No se pudo seleccionar evidencia. Usa /runs y copia un ID válido.')
        elif command in {'demo','start','doctor','analyze','patch','eval','report','compare'}:
            if command in {'report','compare'} and args==['last']:
                rows=summaries(self.store,1)
                if not rows:
                    self.console.print('No hay una sesión guardada para consultar.')
                    return True
                args=[rows[0]['id']]
            if command in {'demo','start','analyze','patch','eval'}:
                from c4.terminal_screen import ExecutionScreen, bind_screen
                with bind_screen(ExecutionScreen(self.console)):
                    code=self.dispatch([command,*args],self.provider)
            else:
                code=self.dispatch([command,*args],self.provider)
            if code:
                self.console.print(Text(f'Código {code}: consulta la evidencia y /help. Puedes continuar en esta consola.',style='yellow'))
        else:
            self.console.print('Comando no reconocido. Usa /help; no se ejecuta código ni shell.')
        return True

    def run(self, session=None):
        self.redraw()
        started=monotonic()
        chat = self.chat
        class PrivateHistory(InMemoryHistory):
            def append_string(self, string):
                if not chat.has_secret(string):
                    super().append_string(string)
        bindings = KeyBindings()
        @bindings.add('enter')
        def submit(event):
            event.current_buffer.validate_and_handle()
        @bindings.add('escape','enter')
        def newline(event):
            event.current_buffer.insert_text('\n')
        session=session or PromptSession(completer=WordCompleter([c.split()[0] for c in COMMANDS],sentence=True),
            history=PrivateHistory(),complete_while_typing=False,multiline=True,key_bindings=bindings,
            style=Style.from_dict({'prompt':'ansimagenta bold','target':'ansicyan','bottom-toolbar':'bg:#111827 #94a3b8'}))
        while True:
            try:
                line=session.prompt(FormattedText([('class:target','c4 / '+self.provider),('class:prompt',' [READY] > ')]),
                    bottom_toolbar=lambda:f'Chat {self.chat.provider.upper()} | /help | Alt+Enter: línea | /new | Sesión {monotonic()-started:.0f}s')
                if not self.handle(line):
                    break
            except KeyboardInterrupt:
                self.console.print('Entrada cancelada. /quit para salir; no se creó una ejecución.')
            except EOFError:
                break
        self.console.print(Text('Sesión local cerrada. La evidencia guardada permanece en disco.',style='dim'))
