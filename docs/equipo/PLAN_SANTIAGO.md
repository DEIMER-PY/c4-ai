# Plan actual de Santiago
Responsable: santiagosanabria-1 + Claude. Actualizado: 2026-10-17. Ownership: apps/dashboard; contratos/decisiones compartidos.

C4-004 está terminada: PR18 integrado y revisado con 32 pruebas, build/typecheck/lint, desktop/móvil/teclado y estados alternativos. No repetir el bootstrap. [Rúbricas del equipo](RUBRICAS.md).

## Continuar C4-006 / issue #6
1. Actualizar develop sin sobrescribir cambios locales y leer AGENTS/CLAUDE, ESTADO, API y specs016–019. PR29 ya implementó adaptador HTTP y diseño responsive; no repetir bootstrap ni adaptador.
2. Revisar UX y estados reales de lista/detalle/comparación. Servidor Next.js consulta API loopback; sin claves ni lectura de archivos en navegador. Cada clon conserva evidencia propia.
3. Preparar spec/plan/tasks para capacidades pendientes: jobs/métricas globales, candidatos sin reporte y actualización de estados. Coordinar contratos con Deimer antes de cambiar API o fixtures; no inventar endpoints ni habilitar CORS universal.
4. Validar IDs, pendientes/fallidos, evidencia incompleta,404/503 y costo desconocido. Si se implementa polling, acotar solicitudes y limpiar al salir; sin simular progreso.
5. Pruebas/typecheck/lint/build y capturas; PR pequeño→develop, revisión Deimer. No cerrar #6 por la lectura parcial ya entregada.

## C4-008 / issue #8
Remotion, narración española y render local de120s ya están preparados por Deimer/Codex en feature019. [Fuente y reproducción](../../apps/demo-video/README.md). Santiago revisa presentación/pitch y caso incompleto, y ensaya junto con Deimer. No publicar el MP4 ni cambiar visibilidad sin decisión del equipo. Conservar accepted/rejected, procedencia sintética y costo desconocido.

## Onboarding C4-011 / issue #12
La entrega GitHub/Claude y acceso al repositorio están verificados. Confirmar personalmente Slack, apertura del clon como bóveda Obsidian y lectura/acceso de las reglas en #12. No inferir esos pasos de un commit.

## Entrega y límites
Ramas santiago/feat-<id>-<tema>, Conventional Commits con emoji y PR→develop. Declarar archivos, criterio, validación y bloqueo. No editar backend/root Python ni contratos sin coordinación; Groq/Grok/Jev son integraciones del backend. Claude recibe el contexto desde Git, no del chat privado de Codex. [Prompt actualizado](PROMPT_CLAUDE.md).

## API disponible para integración parcial
[Arranque local y rutas de spec014](../../apps/api/README.md). Actualizar develop, uv sync --locked y ejecutar c4-api --port 8000 (loopback). Conectar inicialmente lista/detalle de incidentes y recursos individuales. No asumir listados de patches/jobs ni métricas: siguen pendientes de acuerdo compartido. Consultar desde servidor Next.js; no habilitar CORS universal ni introducir claves de modelos. Cada clon conserva su propia evidencia: Git no descarga artifacts privados. Distinguir predicciones reales sobre casos sintéticos de fixtures del modo Demo.
