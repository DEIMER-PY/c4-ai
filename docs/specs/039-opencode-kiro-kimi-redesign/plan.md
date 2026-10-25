# Plan de Implementación: Rediseño Visual OpenCode, Web Kiro y Docs Kimi
ID: C4-PLAN-039. Spec: docs/specs/039-opencode-kiro-kimi-redesign/spec.md. Responsable: DEIMER-PY.

## Fases de Implementación

### Fase 1: Creación de Assets Vectoriales Ultra-HD
1. Diseñar `docs/assets/c4-logo-modern.svg` con estética minimalista de alta precisión y gradientes cian/púrpura.
2. Diseñar `docs/assets/c4-hero-mockup.svg` estilo OpenCode: marco macOS (`🔴 🟡 🟢`), terminal cyberpunk con diff en vivo y badge de veredicto.

### Fase 2: Modernización del README Principal
1. Actualizar el encabezado y hero del `README.md` incorporando `c4-hero-mockup.svg`.
2. Reemplazar insignias y diagramas con la nueva identidad de ultra alta definición.

### Fase 3: Estructuración Documental Estilo Kimi Code
1. Crear y enriquecer los 8 módulos MDX en `apps/website/src/content/docs/`:
   - `primer-ciclo.mdx`: Inicio rápido e instalación universal.
   - `arquitectura.mdx`: Ciclo de 5 fases y gate determinista.
   - `modelos.mdx`: Pasarela multi-modelo y economía de tokens.
   - `cli.mdx`: Guía del CLI, atajos de 1 letra y comandos slash.
   - `batch.mdx`: Benchmark de escala S4 (1.000 unidades y circuit breakers).
   - `observabilidad.mdx`: Métricas Prometheus, Healthz y streaming SSE.
   - `seguridad.mdx`: Escaneo OWASP LLM Top 10 y sanitización PII.
   - `api.mdx`: Especificación OpenAPI y contratos tipados.
2. Actualizar `apps/website/src/content/docs/index.ts`.

### Fase 4: Validación y Pruebas
1. Ejecutar pruebas unitarias de TypeScript/Vitest en `apps/website`.
2. Ejecutar suite de pruebas Python (146 tests).
3. Validar consistencia documental con `python scripts/verify_docs.py`.
