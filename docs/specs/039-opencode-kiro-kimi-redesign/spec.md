# Rediseño Visual Ultra-HD (OpenCode), Landing Futurista (Kiro) y Documentación Integral (Kimi Code)
ID: C4-CORE-039. Estado: Draft. Responsable: DEIMER-PY. Revisores: Santiago/Claude.

## Problema y Contexto
Para posicionar a C4 AI en el nivel visual y documental de los referentes de IA más respetados del mundo, se requiere una actualización estética y estructural de tres componentes clave:
1. **Calidad Visual y Hero Mockup (Referencia: OpenCode `anomalyco/opencode`)**: Reemplazar los elementos retro pixelados por gráficos vectoriales SVG ultra-definidos (HiDPI / Retina), incorporando un mockup moderno de terminal/IDE con controles de ventana macOS (`🔴 🟡 🟢`), gradientes de neón cian/púrpura, sombras difusas y tipografía limpia.
2. **Landing Page y Experiencia Web (Referencia: Kiro `kiro.dev`)**: Actualizar la web de C4 AI (`apps/website`) con una estética futurista de alto contraste, superficies oscuras translúcidas (glassmorphism), mallas de gradientes cian/magenta y tarjetas de producto multi-superficie (CLI, Desktop, Cloud API, Mobile).
3. **Estructura y Profundidad Documental (Referencia: Kimi Code Docs `kimi.com/code/docs/en/`)**: Reestructurar la documentación técnica en una jerarquía integral de 8 módulos: Guía de Inicio Rápido, Arquitectura y Gate Determinista, Proveedores Multi-Modelo, Guía del CLI/TUI, Benchmark de Lotes de Escala S4, Observabilidad y Streaming SSE, Ciberseguridad y Red Teaming OWASP, y Referencia de API/SDK.

## Alcance
- **Incluido**:
  - Creación de assets vectoriales Ultra-HD en `docs/assets/`:
    - `docs/assets/c4-logo-modern.svg`: Logotipo vectorial moderno de alta resolución con núcleo neural cian/púrpura.
    - `docs/assets/c4-hero-mockup.svg`: Mockup interactivo estilo OpenCode con ventana macOS, terminal de ejecución en vivo, diff de prompt y telemetría de tokens.
  - Actualización del `README.md` principal:
    - Sustitución de gráficos pixelados por los nuevos assets vectoriales cristalinos.
    - Diseño de tarjetas de características estilo OpenCode/Kiro con enlaces directos a la documentación.
  - Actualización de la documentación en `apps/website/src/content/docs/`:
    - Creación de `arquitectura.mdx`, `modelos.mdx`, `batch.mdx`, `observabilidad.mdx`.
    - Enriquecimiento de `primer-ciclo.mdx`, `cli.mdx`, `seguridad.mdx`, `api.mdx`.
    - Actualización del índice de navegación en `apps/website/src/content/docs/index.ts`.
  - Verificación de pruebas automatizadas y validación documental con `python scripts/verify_docs.py`.
- **Excluido**:
  - Modificación de contratos de ejecución del backend o alteración de datos de evaluación ya verificados.

## Requisitos
- **FR-001 (Assets Ultra-HD)**: Crear `c4-logo-modern.svg` y `c4-hero-mockup.svg` sin elementos pixelados en `docs/assets/`.
- **FR-002 (README Enterprise)**: Integrar los nuevos assets en el `README.md` con enlaces directos a la documentación y video de YouTube.
- **FR-003 (Documentación Kimi Code)**: Proveer 8 guías MDX completas y estructuradas en `apps/website/src/content/docs/`.
- **FR-004 (Verificación Total)**: 100% de pruebas y enlaces validados.

## Criterios de Aceptación
- **AC-001**: Los nuevos SVGs renderizan limpiamente en pantallas Retina/4K sin distorsión de píxeles.
- **AC-002**: La documentación en `apps/website` cubre los 8 módulos con ejemplos ejecutables y navegación coherente.
- **AC-003**: `python scripts/verify_docs.py` pasa con cero errores.
