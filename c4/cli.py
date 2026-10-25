"""C4 AI command-line adapter; business logic lives in the service."""
import json
import sys
from contextlib import contextmanager
from enum import Enum
from pathlib import Path
from time import monotonic
from typing import Annotated

import typer
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn, TimeElapsedColumn
from rich.table import Table
from rich.text import Text

from c4.services.reliability import ReliabilityService
from c4.services.storage import Store
from c4.tools.grok import Gateway, Settings, WorkflowError
from c4.tools.refunds import read_dataset

app = typer.Typer(name='c4', no_args_is_help=False, pretty_exceptions_show_locals=False,
                  help='Confiabilidad de agentes: detectar, corregir y evaluar con evidencia.')
console = Console()


class Provider(str, Enum):
    grok = 'grok'
    groq = 'groq'
    deepseek = 'deepseek'
    ollama = 'ollama'


@app.callback(invoke_without_command=True)
def configure(ctx: typer.Context,
              store: Annotated[Path, typer.Option(help='Directorio local de evidencia privada.')] = Path('artifacts/runs'),
              env_file: Annotated[str, typer.Option(help='Archivo de entorno local.')] = '.env',
              json_output: Annotated[bool, typer.Option('--json', help='JSON sin decoración.')] = False,
              target_provider: Annotated[Provider, typer.Option(envvar='C4_TARGET_PROVIDER', help='Proveedor del agente evaluado; C4 razona con Grok.')] = Provider.grok):
    # Windows redirected streams may use cp1252; model text can contain any Unicode.
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(errors='backslashreplace')
    ctx.obj = {'store': Store(store), 'env_file': env_file, 'json': json_output, 'target_provider': target_provider.value}
    if ctx.invoked_subcommand is None:
        if sys.stdin.isatty():
            interactive(ctx)
        elif json_output:
            fail(ctx,WorkflowError('command_required','Indica un comando, por ejemplo doctor o report.'))
        else:
            typer.echo(ctx.get_help())


def interactive(ctx: typer.Context):
    from c4.terminal import Harness
    if ctx.obj['json'] or not sys.stdin.isatty():
        fail(ctx,WorkflowError('interactive_required','La consola requiere terminal interactiva sin --json. Usa c4 --help para comandos.'))
    def dispatch(tokens: list[str], provider: str) -> int:
        prefix=['--store',str(ctx.obj['store'].root),'--env-file',ctx.obj['env_file'],'--target-provider',provider]
        try:
            result=app(args=prefix+tokens,standalone_mode=False)
            return result if isinstance(result,int) else 0
        except (typer.Exit,SystemExit) as error:
            return error.exit_code if hasattr(error,'exit_code') else int(error.code or 0)
        except Exception:
            console.print('No se pudo ejecutar el comando. Consulta c4 --help y revisa sus argumentos.')
            return 1
    Harness(console,ctx.obj['store'],ctx.obj['env_file'],ctx.obj['target_provider'],dispatch).run()


@app.command()
def tui(ctx: typer.Context):
    """Abrir consola interactiva con comandos y evidencia local."""
    interactive(ctx)


def emit(ctx: typer.Context, result: dict):
    if ctx.obj['json']:
        typer.echo(json.dumps(result, ensure_ascii=True, allow_nan=False))
        return
    from c4.terminal_screen import ACTIVE_SCREEN
    screen = ACTIVE_SCREEN.get()
    if screen is not None and 'job' in result:
        screen.finish(result)
        return
    title = Text('C4 ', style='bold magenta') + Text('AI', style='bold cyan')
    console.print(Panel(Text('Confiabilidad de agentes · CLI 0.1.0\nCasos sintéticos · llamadas reales al proveedor · sin acciones de producción'), title=title, border_style='magenta'))
    if 'job' not in result:
        console.print_json(data=result)
        return
    console.print(Text('Sesión: ' + result['id'], style='cyan'))
    target = result.get('target_provider', {'provider': 'grok', **result['provider']})
    console.print(Text('C4: Grok / ' + result['provider']['model'] + ' · Agente evaluado: ' + target['provider'] + ' / ' + target['model']))
    console.print(Text('Trabajo: ' + result['job']['status'] + ' · ' + result['job']['stage']))
    for section, field in [('incident', 'root_cause'), ('report', 'summary')]:
        if result.get(section, {}).get(field):
            console.print(Text(result[section][field]))
    if 'evaluation' in result:
        evaluation = result['evaluation']
        table = Table('Caso', 'Baseline', 'Candidato', border_style='cyan')
        for row in evaluation['case_results']:
            table.add_row(row['case_id'], 'PASS' if row['before_passed'] else 'FAIL', 'PASS' if row['after_passed'] else 'FAIL')
        console.print(table)
    calls = result['calls']
    tokens = sum(c['input_tokens'] + c['output_tokens'] for c in calls
                 if c['input_tokens'] is not None and c['output_tokens'] is not None)
    coverage = sum(c['input_tokens'] is not None and c['output_tokens'] is not None for c in calls)
    known_costs = [c['cost_usd'] for c in calls if c.get('cost_usd') is not None]
    cost_text = f"${sum(known_costs):.4f} USD" if known_costs else "desconocido"
    console.print(Text(f'Llamadas: {len(calls)} · tokens reportados: {tokens} (cobertura {coverage}/{len(calls)}) · costo: {cost_text}'))
    console.print(Text('Evidencia: ' + str(ctx.obj['store'].path(result['id']).resolve()), style='dim'))


def fail(ctx: typer.Context, error: WorkflowError):
    payload = {'error': {'code': error.code, 'message': str(error), 'retryable': error.retryable}}
    if ctx.obj['json']:
        typer.echo(json.dumps(payload, ensure_ascii=True))
    else:
        console.print(Text(f'{error.code}: {error}', style='red'))
    raise typer.Exit(1)


def status_code(state: dict) -> int:
    if (state['job'].get('error') or {}).get('code') == 'cancelled':
        return 130
    if state['job']['status'] == 'failed':
        return 1
    return {'rejected': 2, 'needs_human_review': 3}.get(state.get('report', {}).get('decision'), 0)


@contextmanager
def execution_progress(ctx: typer.Context):
    """Human progress comes from saved checkpoints; JSON stays a single document."""
    if ctx.obj['json']:
        yield None
        return
    from c4.terminal_screen import ACTIVE_SCREEN
    screen = ACTIVE_SCREEN.get()
    if screen is not None:
        with screen.progress() as checkpoint:
            yield checkpoint
        return
    started = monotonic()
    previous = None
    session = None
    labels = {
        'inspect': 'Inspección: ejecutando baseline e identificando el fallo',
        'diagnose': 'Diagnóstico: esperando propuesta de Grok',
        'patch': 'Candidato: guardando prompt y diferencias',
        'evaluate': 'Evaluación: comparando baseline y candidato',
        'decide': 'Decisión: comprobando mejora, regresiones y seguridad',
        'report': 'Reporte: guardando el resultado',
    }
    console.print(Text('Iniciando C4 AI. Las solicitudes al proveedor pueden tardar; Ctrl+C cancela la ejecución.'), style='cyan')
    console.file.flush()
    with Progress(SpinnerColumn(), TextColumn('{task.description}'), TimeElapsedColumn(),
                  console=console, transient=True, disable=not console.is_terminal) as progress:
        task = progress.add_task('Preparando configuración y evidencia...', total=None)

        def checkpoint(state: dict):
            nonlocal previous, session
            if session is None:
                session = state['id']
                console.print(Text('Sesión: ' + session, style='cyan'))
                console.print(Text('Evidencia: ' + str(ctx.obj['store'].path(session).resolve()), style='dim'))
            stage = state['job']['stage']
            received = len(state['evaluation_outputs'])
            total = len(state['dataset']['data']['cases']) * 2
            description = labels.get(stage, stage)
            if stage == 'evaluate':
                description += f' · {received}/{total} respuestas guardadas'
            if state['job']['status'] == 'failed':
                description = 'Trabajo detenido: ' + state['job']['error']['message']
            current = (stage, received, state['job']['status'])
            progress.update(task, description=description)
            if current != previous:
                console.print(Text(f'[{monotonic() - started:.0f}s] {description}'))
                console.file.flush()
                previous = current

        yield checkpoint


def execute(ctx: typer.Context, session_id: str | None, operation: str, dataset: Path | None = None, target: str = 'refund_expired'):
    gateway = target_gateway = None
    try:
        with execution_progress(ctx) as observer:
            gateway = Gateway(Settings.from_env(ctx.obj['env_file']))
            target_gateway = gateway if ctx.obj['target_provider'] == 'grok' else Gateway(Settings.from_env(ctx.obj['env_file'], ctx.obj['target_provider']))
            service = ReliabilityService(ctx.obj['store'], gateway, on_checkpoint=observer, target_gateway=target_gateway)
            if session_id is None:
                state = service.create(read_dataset(dataset), target)
                session_id = state['id']
            state = service.execute(session_id, operation)
        emit(ctx, state)
        raise typer.Exit(status_code(state))
    except WorkflowError as error:
        fail(ctx, error)
    except (OSError, ValueError):
        fail(ctx, WorkflowError('local_io_or_validation', 'No se pudo completar la validación o escritura local; revisar permisos y evidencia.'))
    finally:
        if target_gateway is not None and target_gateway is not gateway:
            target_gateway.close()
        if gateway:
            gateway.close()


@app.command()
def doctor(ctx: typer.Context, probe: Annotated[bool, typer.Option(help='Realiza una llamada mínima por proveedor distinto.')] = False):
    """Validar configuración sin mostrar claves. --probe consume llamadas reales."""
    gateway = target_gateway = None
    try:
        settings = Settings.from_env(ctx.obj['env_file'])
        target_settings = settings if ctx.obj['target_provider'] == 'grok' else Settings.from_env(ctx.obj['env_file'], ctx.obj['target_provider'])
        result = {'configured': True, 'model': settings.model, 'https': True, 'credential': 'present',
                  'reasoning': {'provider': 'grok', 'model': settings.model},
                  'target': {'provider': target_settings.provider, 'model': target_settings.model},
                  'max_calls': settings.max_calls, 'max_output_tokens': settings.max_tokens,
                  'max_job_seconds': settings.max_seconds, 'probe': 'not_requested', 'cost_usd': (0.0 if target_settings.provider == 'ollama' else None)}
        if probe:
            gateway = Gateway(settings)
            response = gateway.complete('Return {"connected":true}.', {}, 'doctor')
            if response != {'connected': True}:
                raise WorkflowError('invalid_probe', 'Respuesta inesperada del gateway.')
            result.update(probe='succeeded', calls=gateway.records)
            if ctx.obj['target_provider'] != 'grok':
                target_gateway = Gateway(target_settings)
                target_gateway.share_budget(gateway)
                response = target_gateway.complete('Return {"connected":true}.', {}, 'doctor_target')
                if response != {'connected': True}:
                    raise WorkflowError('invalid_probe', 'Respuesta inesperada del proveedor evaluado.')
        emit(ctx, result)
    except WorkflowError as error:
        fail(ctx, error)
    finally:
        if target_gateway:
            target_gateway.close()
        if gateway:
            gateway.close()


@app.command('run')
def run_cmd(ctx: typer.Context,
            dataset: Annotated[Path, typer.Option(help='Dataset versionado sintético.')] = Path('datasets/sample/refunds.json'),
            target: Annotated[str, typer.Option()] = 'refund_expired'):
    """Ejecutar ciclo completo (alias de demo)."""
    execute(ctx, None, 'demo', dataset, target)


@app.command('r', hidden=True)
def r_cmd(ctx: typer.Context,
          dataset: Annotated[Path, typer.Option(help='Dataset versionado sintético.')] = Path('datasets/sample/refunds.json'),
          target: Annotated[str, typer.Option()] = 'refund_expired'):
    """Atajo: ejecutar ciclo completo."""
    execute(ctx, None, 'demo', dataset, target)


@app.command('d', hidden=True)
def d_cmd(ctx: typer.Context, probe: Annotated[bool, typer.Option(help='Realiza una llamada mínima por proveedor distinto.')] = False):
    """Atajo: validar configuración."""
    doctor(ctx, probe)


@app.command('s', hidden=True)
def s_cmd(ctx: typer.Context):
    """Atajo: ver resumen de estado y evidencia."""
    from c4.terminal import summaries
    rows = summaries(ctx.obj['store'], 5)
    result = {'latest_sessions': rows, 'target_provider': ctx.obj['target_provider']}
    emit(ctx, result)


@app.command('i', hidden=True)
def i_cmd(ctx: typer.Context, session_id: Annotated[str, typer.Argument()] = 'last'):
    """Atajo: consultar reporte de sesión ('last' o ID)."""
    target_id = session_id
    if session_id == 'last':
        from c4.terminal import summaries
        rows = summaries(ctx.obj['store'], 1)
        if not rows:
            fail(ctx, WorkflowError('missing_session', 'No hay sesiones locales guardadas.'))
        target_id = rows[0]['id']
    read(ctx, target_id)


@app.command()
def demo(ctx: typer.Context,
         dataset: Annotated[Path, typer.Option(help='Dataset versionado sintético.')] = Path('datasets/sample/refunds.json'),
         target: Annotated[str, typer.Option()] = 'refund_expired'):
    """Ejecutar ciclo completo con Grok; guardar cada fase por ID."""
    execute(ctx, None, 'demo', dataset, target)


@app.command()
def start(ctx: typer.Context, dataset: Path = Path('datasets/sample/refunds.json'), target: str = 'refund_expired'):
    """Crear sesión, ejecutar baseline e investigar incidente; continuar con patch/eval."""
    execute(ctx, None, 'analyze', dataset, target)


@app.command()
def analyze(ctx: typer.Context, session_id: str):
    """Inspeccionar e investigar una sesión existente."""
    execute(ctx, session_id, 'analyze')


@app.command()
def patch(ctx: typer.Context, session_id: str):
    """Materializar candidato declarativo, sin aceptarlo."""
    execute(ctx, session_id, 'patch')


@app.command('eval')
def evaluate(ctx: typer.Context, session_id: str):
    """Evaluar baseline y candidato sobre el mismo dataset y decidir."""
    execute(ctx, session_id, 'eval')


def read(ctx: typer.Context, session_id: str, require_evaluation: bool = False):
    try:
        state = ctx.obj['store'].load(session_id)
        if require_evaluation and 'evaluation' not in state:
            raise WorkflowError('missing_evaluation', 'No existe evaluación en esta sesión.')
        emit(ctx, state)
        raise typer.Exit(status_code(state))
    except WorkflowError as error:
        fail(ctx, error)


@app.command()
def compare(ctx: typer.Context, session_id: str):
    """Consultar comparación persistida sin llamadas al proveedor."""
    read(ctx, session_id, True)


@app.command()
def report(ctx: typer.Context, session_id: str):
    """Consultar evidencia y reporte local, incluso de un trabajo fallido."""
    read(ctx, session_id)


@app.command('batch')
def batch(
    ctx: typer.Context,
    dataset: Annotated[Path, typer.Option(help='Ruta al dataset JSON.')] = Path('datasets/sample/refunds_v2.json'),
    units: Annotated[int, typer.Option(help='Número total de unidades a evaluar en lote.')] = 1000,
    concurrency: Annotated[int, typer.Option(help='Nivel de concurrencia de workers.')] = 10,
    mock: Annotated[bool, typer.Option(help='Modo simulación determinista para benchmark sin costo de red.')] = True,
    model: Annotated[str, typer.Option(help='Modelo objetivo.')] = 'grok-4.7',
    provider: Annotated[str, typer.Option(help='Proveedor de inferencia.')] = 'xai',
    budget_ceiling: Annotated[float, typer.Option(help='Límite de presupuesto en USD.')] = 100.0,
    output: Annotated[Path | None, typer.Option(help='Ruta para guardar bitácora JSON del lote.')] = None,
):
    """Ejecutar lote de alta escala (1.000 unidades) con telemetría de resiliencia y percentiles."""
    from c4.services.batch import BatchConfig, BatchRunner

    cfg = BatchConfig(
        dataset_path=str(dataset),
        total_units=units,
        concurrency=concurrency,
        mock_providers=mock,
        model=model,
        provider=provider,
        budget_ceiling_usd=budget_ceiling,
    )

    if not ctx.obj.get('json', False):
        console.print(Panel(
            f"[bold cyan]C4 AI BATCH RUNNER[/bold cyan]\n"
            f"[dim]Unidades:[/dim] {units} | [dim]Concurrencia:[/dim] {concurrency} | "
            f"[dim]Modelo:[/dim] {model} | [dim]Modo:[/dim] {'Mock Simulado' if mock else 'En Vivo'}",
            border_style="cyan",
            title="[bold yellow]Escala S4 Benchmark[/bold yellow]",
        ))

    runner = BatchRunner()
    metrics = runner.run(cfg)
    summary = metrics.to_dict()

    if output:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding='utf-8')

    if ctx.obj.get('json', False):
        typer.echo(json.dumps(summary, ensure_ascii=True))
        return

    table = Table(title="Resultados del Benchmark de Escala (S4)", border_style="cyan")
    table.add_column("Métrica", style="bold white")
    table.add_column("Valor Medido", style="green")

    table.add_row("Unidades Programadas", str(metrics.total_scheduled))
    table.add_row("Unidades Completadas", str(metrics.total_completed))
    table.add_row("Tasa de Éxito", f"{metrics.success_rate_percent:.2f}%")
    table.add_row("Rendimiento (Throughput)", f"{metrics.throughput_units_per_sec:.2f} unidades/seg")
    table.add_row("Tiempo de Pared (Pared)", f"{metrics.elapsed_seconds:.3f} s")
    table.add_row("Latencia p50", f"{metrics.latency_p50_ms:.2f} ms")
    table.add_row("Latencia p95", f"{metrics.latency_p95_ms:.2f} ms")
    table.add_row("Latencia p99", f"{metrics.latency_p99_ms:.2f} ms")
    table.add_row("Total de Tokens", f"{metrics.total_tokens:,}")
    table.add_row("Costo Total (USD)", f"${metrics.total_cost_usd:.6f}")
    table.add_row("Disyuntores Disparados", str(metrics.circuit_breaker_trips))

    console.print(table)


@app.command('b', hidden=True)
def b(ctx: typer.Context, units: int = 1000):
    """Atajo ultracorto para c4 batch."""
    batch(ctx, units=units)


if __name__ == '__main__':
    app()
