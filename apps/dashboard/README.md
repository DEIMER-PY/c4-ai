# apps/dashboard
Dashboard Next.js de C4 AI. Responsable: Santiago. Spec: [006-dashboard-mocks](../../docs/specs/006-dashboard-mocks/spec.md).

Leer [README principal](../../README.md) y reglas antes de implementar.
## Stack
Next.js 16.4.2 (App Router, `src/`), React 19.3.0, TypeScript 5.9.3, Tailwind CSS 4.3.3, ESLint 9. Versiones exactas en package.json y pnpm-lock.yaml.
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
## Datos
Primera versión solo lee fixtures sintéticos de examples/contracts; muestra la etiqueta Demo. Sin claves, llamadas al gateway ni acciones sobre producción.
