# Ergonomía de CLI (Capacidades AGY, Atajos Rápidos) e Instalación Universal
ID: C4-CORE-029. Estado: Draft. Responsable: DEIMER-PY. Revisores: Santiago/Claude.

## Problema y Usuario
Los usuarios y evaluadores del reto necesitan interactuar con C4 AI de forma ágil, intuitiva y sin fricciones de configuración:
1. **Comandos largos y repetitivos**: Escribir `c4 demo --target refund_expired --dataset ...` introduce sobrecarga mental frente a comandos ágiles como `c4 r` o abrir el TUI directamente con `c4`.
2. **Capacidades reflexivas estilo AGY**: Los ingenieros necesitan inspeccionar el diff visual de parches (`/diff`), el desglose monetario en vivo (`/cost`) y permitir un bucle de autocorrección reflexivo (`/goal`) si un candidato genera regresiones.
3. **Instalación multiplataforma en 1 línea**: Los evaluadores en Linux, macOS y Windows requieren instalar y verificar el entorno en 10 segundos con un solo comando `curl` / `irm` o Docker.

Público objetivo: Ingenieros de confiabilidad de IA (SREs), evaluadores del Reto Agente y desarrolladores de agentes autónomos.

## Alcance
- **Incluido**:
  - Atajos de 1 letra en el CLI: `c4 r` (`run`), `c4 d` (`doctor`), `c4 s` (`status`), `c4 i` (`inspect`).
  - Nuevos comandos en el TUI interactivo:
    - `/diff [ID|last]`: Visor coloreado de diferencias de prompts con sintaxis unificada de Rich.
    - `/cost [ID|last]`: Desglose detallado de tokens, latencia y costos en USD según `c4/tools/rates.py`.
    - `/plan`: Resumen anticipado del caso objetivo, baseline e hipótesis de diagnóstico.
    - `/goal`: Bucle reflexivo autónomo que ejecuta diagnósticos iterativos (hasta 3 intentos) si un candidato es rechazado por regresión.
  - Comportamiento sin argumentos: `c4` en terminal interactiva inicia inmediatamente el TUI con la neurona.
  - Script universal para Linux y macOS: `scripts/install.sh`.
  - Script universal para Windows PowerShell: `scripts/install.ps1`.
  - `Dockerfile` multicapa de despliegue y pruebas.
- **Excluido**:
  - Modificar los contratos HTTP de la API v1.
  - Reemplazar a Grok 4.7 como razonador del ciclo.
  - Aplicar cambios en producción sin pasar por el gate determinista.

## Requisitos
- **FR-001 (Atajos de 1 letra)**: Soporte para `c4 r`, `c4 d`, `c4 s`, `c4 i` como alias deterministas de sus respectivos comandos en Typer.
- **FR-002 (Comandos Slash AGY en TUI)**:
  - `/diff`: Renderizar paneles de comparación con texto verde para adiciones y rojo para eliminaciones.
  - `/cost`: Mostrar tabla Rich con llamadas, proveedor, modelo, tokens in/out y costo USD individual y acumulado.
  - `/plan`: Presentar caso objetivo, política aplicable y reglas de seguridad antes de llamadas generativas.
  - `/goal`: Bucle reflexivo que reintenta la propuesta con Grok alimentando la regresión observada si el gate devolvió `rejected`.
- **FR-003 (Lanzador Intuitivo por Defecto)**: Si se invoca `c4` en TTY interactivo sin subcomandos ni flags, lanzar el Harness TUI directamente.
- **FR-004 (Instalador Linux/macOS)**: `scripts/install.sh` verifica Python 3.12 y `uv`, ejecuta `uv sync --locked` y valida con `c4 doctor`.
- **FR-005 (Instalador Windows)**: `scripts/install.ps1` realiza la misma verificación nativa en PowerShell.
- **FR-006 (Contenedor Docker)**: `Dockerfile` con Python 3.12, dependencias bloqueadas y entrada predeterminada a `c4`.

## Aceptación
- **AC-001**: `c4 r --help` o `c4 r` ejecuta el comando de ciclo completo.
- **AC-002**: `c4 d` ejecuta el comando `doctor` reportando estado de proveedores y tarifas.
- **AC-003**: En consola interactiva, `/diff last` muestra el diff del candidato en color sin realizar llamadas de red.
- **AC-004**: En consola interactiva, `/cost last` muestra la tabla de costos monetarios en USD.
- **AC-005**: Scripts `install.sh` e `install.ps1` no contienen credenciales y manejan errores de dependencias faltantes con mensajes claros.
- **AC-006**: `python scripts/verify_docs.py` confirma 100% de enlaces y esquemas válidos.

## Dudas Bloqueantes
- Ninguna. No se alteran esquemas de contratos v1 ni la inmutabilidad de la línea base.
