# apps/website
Sitio de producto y documentación de C4 AI. Responsable: Santiago. Spec: [024-website](../../docs/specs/024-website/spec.md).

Sitio estático (`output: "export"`): no tiene servidor, no lee evidencia local ni usa claves. La publicación y el hosting están pendientes de la decisión de privacidad del proyecto.
## Stack
Next.js 16.4.2 (App Router, `src/`), React 19.3.0, TypeScript 5.9.3, Tailwind CSS 4.3.3, MDX (`@next/mdx` 3.1.1) y Vitest 5 con Testing Library. Versiones exactas en package.json y pnpm-lock.yaml.
## Comandos
Ejecutar desde apps/website con Node.js 24 y pnpm 10.34.7:

| Comando | Uso |
|---|---|
| `pnpm install --frozen-lockfile` | Instalar dependencias del lockfile |
| `pnpm dev` | Servidor de desarrollo en http://localhost:3000 |
| `pnpm build` | Exportar el sitio estático a `out/` |
| `pnpm typecheck` | Generar tipos de rutas y comprobar TypeScript |
| `pnpm lint` | ESLint |
| `pnpm test` | Pruebas de componentes y contenido |
## Contenido
- src/content/evidence.ts: única fuente de cifras y estados; cada valor cita su evidencia en el repo.
- src/content/install.ts: comandos de instalación vigentes (CL-W01).
- src/content/docs: páginas de documentación en MDX.
- public/showcase: capturas reales copiadas de docs/assets.
- public/brand: logos C4 AI Harness y CLI recortados con fondo transparente del arte entregado por el equipo.

Movimiento: entrada escalonada del hero, vitrina ligada al scroll (CSS scroll-driven, con respaldo estático) y revelado único de secciones con IntersectionObserver. Todo respeta prefers-reduced-motion y sin JavaScript el contenido queda visible.
