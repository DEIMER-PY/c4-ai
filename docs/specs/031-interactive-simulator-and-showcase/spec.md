# Simulador Interactivo de Confiabilidad (Estilo Kimi/Claude) y Documentación Enterprise
ID: C4-CORE-031. Estado: Draft. Responsable: DEIMER-PY. Revisores: Santiago/Claude.

## Problema y Usuario
Los evaluadores del reto y los usuarios corporativos necesitan experimentar el poder de C4 AI de forma inmediata, visual e interactiva sin tener que instalar localmente la terminal o configurar claves API:
1. **Fricción de Demostración**: Ver capturas estáticas limita la comprensión del ciclo reflexivo (Detección → Diagnóstico → Parche → Evaluación determinista → Veredicto con sellado criptográfico).
2. **Presentación de Alto Impacto (Estilo Kimi Code / Claude Artifacts / ChatGPT Canvas)**: Se requiere un simulador interactivo reactivo donde el usuario pueda cambiar de incidente, inspeccionar la traza, ver el diff de prompts con sintaxis coloreada, observar la evaluación de casos en paralelo y auditar el Merkle root y los ahorros de tokens en tiempo real.
3. **Documentación de Seguridad y Ergonomía en la Web**: La documentación de `apps/website` debe reflejar los nuevos instaladores universales (`install.ps1`, `install.sh`, `Dockerfile`), los atajos rápidos (`c4 r`, `c4 d`, etc.) y el marco de gobernanza enterprise (OWASP LLM Top 10, EU AI Act, SOC 2).

Público objetivo: Jueces del Reto Agente, directores de ingeniería de IA, arquitectos de software y desarrolladores de agentes autónomos.

## Alcance
- **Incluido**:
  - Componente reactivo `apps/website/src/components/interactive-simulator.tsx` con soporte para:
    - Selector de incidentes: `refund_expired` (caso límite 31 días), `prompt_injection` (OWASP LLM-01), `tool_hallucination` (falla de formato de moneda).
    - Pipeline de 5 etapas con selector visual de fase (Detección, Diagnóstico Grok 4.7, Parche Diff, Evaluación en Harness, Sello de Integridad).
    - Métricas en vivo: tokens consumidos, latencia, costo estimado en USD y Merkle root SHA-256.
  - Integración en `apps/website/src/components/product-showcase.tsx` como pestaña principal "Simulador en vivo".
  - Actualización de `apps/website/src/content/install.ts` con los instaladores universales de 1 línea y atajos de 1 letra (`c4 r`, `c4 d`).
  - Nuevas páginas de documentación MDX en `apps/website/src/content/docs/`:
    - `seguridad.mdx`: Marco de ciberseguridad, mitigación OWASP LLM Top 10 y conformidad con EU AI Act.
    - `atajos.mdx`: Atajos de 1 letra y comandos slash de alta productividad (`/diff`, `/cost`, `/plan`, `/goal`).
  - Registro de nuevas páginas en `apps/website/src/content/docs/index.ts`.
  - Pruebas unitarias en `apps/website/src/components/interactive-simulator.test.tsx` y validación de la suite Vitest.
- **Excluido**:
  - Llamadas a APIs externas desde el navegador del cliente (la simulación utiliza las trazas de evidencia verificadas del repositorio).

## Requisitos
- **FR-001 (Simulador Reactivo en Website)**: El simulador interactivo permite cambiar de incidente y explorar interactivamente las 5 fases del ciclo con diffs coloreados y matriz de casos.
- **FR-002 (Métricas Forenses en Pantalla)**: Exposición de tokens, tiempo de respuesta, estimación de costo y verificación de integridad Merkle root.
- **FR-003 (Documentación MDX Ampliada)**: Incorporación de `seguridad.mdx` y `atajos.mdx` con navegación cruzada fluida.
- **FR-004 (Comandos de Instalación Actualizados)**: Presentación de scripts universales `install.ps1` e `install.sh` en la landing page.
- **FR-005 (Pruebas Vitest 100% Verificadas)**: Tests de renderizado, interacción y cambio de estado del simulador.

## Aceptación
- **AC-001**: El simulador interactivo permite alternar entre incidentes y renderiza correctamente en dispositivos móviles y de escritorio.
- **AC-002**: Las nuevas páginas de documentación cargan sin errores y pasan `content.test.ts`.
- **AC-003**: `pnpm test` en `apps/website` completa exitosamente con todas las pruebas aprobadas.
- **AC-004**: `python scripts/verify_docs.py` confirma 100% de coherencia en enlaces y fixtures.

## Dudas Bloqueantes
- Ninguna. No se alteran contratos compartidos existentes.
