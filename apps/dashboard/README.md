# apps/dashboard
Dashboard Next.js de C4 AI. Responsable: Santiago. Spec: [006-dashboard-mocks](../../docs/specs/006-dashboard-mocks/spec.md).

Leer [README principal](../../README.md) y reglas antes de implementar.
Guía visual vigente: [aplicación de la skill frontend de Deimer](../../docs/equipo/FRONTEND_DESIGN.md), [referencia original](../../docs/referencias/FRONTEND_SKILL.md) y [Figma inspeccionado](../../docs/referencias/FIGMA_DASHBOARD.md).
## Stack
Next.js 16.4.2 (App Router, `src/`), React 19.3.0, TypeScript 5.9.3, Tailwind CSS 4.3.3, shadcn/ui, ESLint 9 y Vitest 5. Versiones exactas en package.json y pnpm-lock.yaml.
Los primitives actuales usan Base UI y los iconos Lucide. No se ha instalado Motion/GSAP ni se ha migrado a otro framework al adoptar la skill.
## Requisitos
Node.js 24 y pnpm 10.34.7 (campo packageManager).
## Comandos
Ejecutar desde apps/dashboard:

| Comando | Uso |
|---|---|
| `pnpm install --frozen-lockfile` | Instalar dependencias del lockfile |
| `pnpm dev` | Servidor local en http://localhost:3000 |
| `pnpm build` | Build de producción |
| `pnpm typecheck` | Generar tipos de rutas y comprobar TypeScript |
| `pnpm lint` | ESLint |
| `pnpm test` | Pruebas Vitest de contratos, adaptador y formatters |
## Datos
Por defecto consulta la API local de evidencia en http://127.0.0.1:8000. Iniciar antes el backend con `uv run --locked c4-api --port 8000` desde la raíz; este launcher configura el event loop compatible con Windows. C4_API_URL permite otro backend administrado desde el servidor Next.js; nunca se envían claves de modelos al navegador. C4_DATA_MODE=demo activa fixtures explícitos. No hay fallback silencioso si la API falla.
## Estructura
- src/types/contracts.ts: tipos de los contratos v1 (fuente: examples/contracts/schemas.json).
- src/lib/contracts/parse.ts: validación en tiempo de ejecución; un fixture inválido rompe el build.
- src/lib/data-source.ts: interfaz de las vistas; src/lib/http-data-source.ts implementa lectura del API y src/lib/fixtures.ts el modo Demo explícito. La selección está en src/lib/data.ts.
- src/lib/format.ts: costo null como Desconocido y pass rate sin datos con total 0.

next.config.ts fija turbopack.root en la raíz del repositorio para importar los fixtures canónicos sin copiarlos.

## Integración verificada (spec016)
Páginas responsive con paleta violeta/cian: overview, incidentes y comparación desde evidencia CLI. No hay endpoint global de jobs/métricas; el UI lo indica. Los tokens del overview son los del baseline inicial con cobertura visible, no los de todo el workflow. Parches se consultan por referencias del reporte; candidatos todavía sin reporte no se enumeran. No aplicar a producción.

## Personalización local (spec023)

En la barra superior, Colores permite elegir C4, Kit claro, Kit oscuro u Océano, modificar acento/fondo/tarjetas y restablecer valores. Se guarda en localStorage del navegador. `/delivery` incluye un laboratorio de conteos explícitamente simulado; no edita datos reales del API. Implementación local; revisión visual y publicación pendientes.
