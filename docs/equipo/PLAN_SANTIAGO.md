# Plan de trabajo de Santiago
Responsable: santiagosanabria-1. Agente: Claude. Propiedad: apps/dashboard; contratos y decisiones globales compartidos.
## Orden y entregables
| Tarea | Cuándo | Entrega verificable |
|---|---|---|
| [C4-011 / #12](https://github.com/DEIMER-PY/c4-ai/issues/12) | Primero | Clon/bóveda abiertos, reglas leídas, comentario de onboarding y conexión Slack pendiente o confirmada |
| [C4-004 / #4](https://github.com/DEIMER-PY/c4-ai/issues/4) | En paralelo con backend | Dashboard con mocks tipados, incidentes, detalle, comparación y errores |
| [C4-006 / #6](https://github.com/DEIMER-PY/c4-ai/issues/6) | Tras API y #4 | Mismas pantallas conectadas a API, sin secretos en navegador |
| [C4-008 / #8](https://github.com/DEIMER-PY/c4-ai/issues/8) | Tras flujo real/evals | Demo y presentación con evidencia real validada por Deimer |

No esperar al gateway para empezar #4. No marcar En curso hasta que Santiago o Claude comience realmente.
## Primer arranque con Claude
Seguir [onboarding](ONBOARDING_SANTIAGO.md) y copiar [prompt inicial](PROMPT_CLAUDE.md).
La especificación inicial es [dashboard con mocks](../specs/006-dashboard-mocks/spec.md); Santiago revisa Ready antes de implementar.
Rama: santiago/feat-c4-004-dashboard-mocks. Un PR hacia develop para esta feature; merge tras checks y revisión de Deimer.
## Límites de edición
Puede editar apps/dashboard y archivos de la propia spec. Cambios a examples/contracts, schemas, dependencias raíz Python o backend requieren coordinación previa.
No copiar claves ni hacer llamadas Grok desde frontend. No añadir login/hosting/otra plataforma al primer dashboard.
## Calidad
Fixture synthetic siempre muestra Demo. Costos null = Desconocido; queued/running no = éxito.
Probar lista vacía, loading, error, aceptación, rechazo y evidencia incompleta.
Build y typecheck; navegación por teclado; capturas de desktop/móvil. Registrar evidencia en PR.
## Handoff
Issue, spec, rama/PR, archivos, comandos/resultados de validación, bloqueos y siguiente acción.
Claude no necesita el historial privado de Codex. Leer estado/contratos/specs al inicio de cada sesión.
## Revisión de estados
Pendiente: preparado. En curso: agente trabajando. En revisión: PR/evidencia listos. Bloqueado: causa/siguiente acción. Hecho: criterios verificados y merge a develop.
GitHub Projects es el tablero operativo; el resumen Markdown no cambia ese estado automáticamente.
