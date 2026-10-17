# apps/dashboard
Dashboard Next.js de C4 AI. Responsable: Santiago. Spec: [006-dashboard-mocks](../../docs/specs/006-dashboard-mocks/spec.md).

Leer [README principal](../../README.md) y reglas antes de implementar.
## Stack
Next.js 16.4.2 (App Router, `src/`), React 19.3.0, TypeScript 5.9.3, Tailwind CSS 4.3.3, shadcn/ui, ESLint 9 y Vitest 5. Versiones exactas en package.json y pnpm-lock.yaml.
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
Por defecto consulta la API local de evidencia en http://127.0.0.1:8000. Iniciar antes el backend con uv run --locked uvicorn c4.api:app --host 127.0.0.1 --port 8000 desde la raíz. C4_API_URL permite otro backend administrado desde el servidor Next.js; nunca se envían claves de modelos al navegador. C4_DATA_MODE=demo activa fixtures explícitos. No hay fallback silencioso si la API falla.
## Estructura
- src/types/contracts.ts: tipos de los contratos v1 (fuente: examples/contracts/schemas.json).
- src/lib/contracts/parse.ts: validación en tiempo de ejecución; un fixture inválido rompe el build.
- src/lib/data-source.ts: interfaz que consumen las vistas; hoy la implementa src/lib/fixtures.ts y en C4-006 la implementará el cliente de /api/v1.
- src/lib/format.ts: costo null como Desconocido y pass rate sin datos con total 0.

next.config.ts fija turbopack.root en la raíz del repositorio para importar los fixtures canónicos sin copiarlos.

## Integración verificada (spec016)
Páginas responsive con paleta violeta/cian: overview, incidentes y comparación desde evidencia CLI. No hay endpoint global de jobs/métricas; el UI lo indica. Los tokens del overview son los del baseline inicial con cobertura visible, no los de todo el workflow. Parches se consultan por referencias del reporte; candidatos todavía sin reporte no se enumeran. No aplicar a producción.
