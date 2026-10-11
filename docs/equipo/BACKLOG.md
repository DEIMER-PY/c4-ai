# Backlog implementable
La preparación documental está verificada. C4-001 depende de la clave local y habilitación del panel; C4-002 y C4-004 pueden avanzar independientemente con contratos y mocks. C4-011 confirma el onboarding de Santiago.
El campo responsable designa un humano; colaboración secundaria no sustituye revisión cruzada.
## C4-001 — Verificar requisitos del reto y conexión Grok
Estado: Bloqueado para la prueba real; URL del reto/base publicadas confirmadas. Próxima acción Deimer: guardar clave en .env y confirmar modelo del panel.
Responsable: DEIMER-PY. Fase: S1. Prioridad: P0.
Dependencias: ninguna.
Archivos: docs/referencias; c4/tools.
Aceptación: Documentar fuente oficial, fechas, URL/modelo admitidos y solicitud mínima sin exponer clave; guardar usage/error verificados.
Validación: Solicitud real limitada y registro saneado.

## C4-002 — Implementar modelos, persistencia y contratos API
Estado: En curso. Primera feature de contratos Pydantic implementada; migraciones y API pendientes. No cerrar la tarea por esta entrega parcial.
Responsable: DEIMER-PY. Fase: S1. Prioridad: P0.
Dependencias: ninguna.
Archivos: c4/schemas; c4/db; apps/api.
Aceptación: Pydantic coincide con ejemplos; migraciones crean entidades/relaciones; API devuelve 201/202/errores previstos.
Validación: Pruebas de contratos, DB y errores 404/409/422.

## C4-003 — Construir primer loop y CLI de incidentes
Responsable: DEIMER-PY. Fase: S1. Prioridad: P0.
Dependencias: C4-001, C4-002.
Archivos: c4/agents; c4/workflows; c4/services; apps/cli.
Aceptación: Traza→diagnóstico→candidato→evidencia; baseline inmutable; CLI/API usan mismos servicios; fallos preservan estado.
Validación: Un incidente reproducible y un fallo del proveedor.

## C4-004 — Preparar dashboard con contratos y mocks
Estado: Pendiente, listo para Santiago. Spec inicial: docs/specs/006-dashboard-mocks; ver PLAN_SANTIAGO y PROMPT_CLAUDE.
Responsable: santiagosanabria-1. Fase: S1. Prioridad: P0.
Dependencias: ninguna.
Archivos: apps/dashboard.
Aceptación: Next.js tipado, pnpm lockfile, incidentes/detalle/comparación; etiqueta Demo, costos null y estados vacíos/errores; ninguna clave en navegador.
Validación: Build/typecheck y revisión visual/teclado con fixtures.

## C4-005 — Implementar herramientas y gate de evaluación
Responsable: DEIMER-PY. Fase: S2. Prioridad: P0.
Dependencias: C4-003.
Archivos: c4/tools; c4/services; tests/evals.
Aceptación: trace_reader, patch_writer y eval_runner reales; accepted exige mismo dataset, mejora objetivo y cero regresiones; incompletos escalan.
Validación: Aceptación, rechazo por regresión y evaluación fallida.

## C4-006 — Integrar dashboard con API y evidencia real
Responsable: santiagosanabria-1. Fase: S2. Prioridad: P1.
Dependencias: C4-002, C4-004.
Archivos: apps/dashboard.
Aceptación: Consumir API documentada; distinguir pendiente/fallido/éxito; navegar evidencia/candidatos/evals; mocks explícitos solo modo demo.
Validación: Flujo UI→API y escenarios 404/503/costo desconocido.

## C4-007 — Ampliar dataset a 30+ casos y medir métricas
Responsable: DEIMER-PY. Fase: S3. Prioridad: P0.
Dependencias: C4-005.
Archivos: datasets; tests/evals; docs/arquitectura.
Aceptación: 30+ casos versionados/procedencia; baseline/candidato por caso; costo con fuente/cobertura; distinguir sintéticos de reales.
Validación: Reporte reproducible con IDs/regresiones y checksum dataset.

## C4-008 — Preparar visualización, pitch y video de demo
Responsable: santiagosanabria-1. Fase: S3. Prioridad: P1.
Dependencias: C4-005, C4-006.
Archivos: apps/dashboard; docs/producto.
Aceptación: Mostrar loop, mejora y rechazo verificables; video objetivo 2 min; sin métricas inventadas.
Validación: Deimer valida evidencias; ensayo completo de demo.

## C4-009 — Implementar workers, idempotencia y recuperación
Responsable: DEIMER-PY. Fase: S4. Prioridad: P0.
Dependencias: C4-005.
Archivos: c4/workflows; c4/services; infraestructura futura.
Aceptación: Redis/RQ, etapas persistidas, timeouts/budget; duplicados no repiten efectos; recuperación conserva historial.
Validación: Reinicio de worker, duplicado y proveedor transitorio.

## C4-010 — Ejecutar escala y prueba de 12 horas
Responsable: DEIMER-PY. Fase: S4. Prioridad: P1.
Dependencias: C4-007, C4-009.
Archivos: tests/integration; evidencia saneada; docs/bitacora.
Aceptación: 1.000 jobs únicos y 12 h reales con trazabilidad/costos/fallos; resultados no simulados.
Validación: Log timestamps, totales conciliados y reporte de incidencias.

## C4-011 — Revisar contratos y completar onboarding del equipo
Estado: Pendiente de confirmación de Santiago. Accesos GitHub write/Projects WRITER concedidos; apertura del clon/Obsidian y membresía Slack aún sin confirmar.
Responsable: santiagosanabria-1. Fase: S0. Prioridad: P0.
Dependencias: ninguna.
Archivos: docs/equipo; examples/contracts.
Aceptación: Revisar AGENTS/CLAUDE y API; aceptar invitación GitHub si corresponde; entrar a Slack; confirmar acceso de Claude y comenzar C4-004.
Validación: Comentario en issue con comprensión de contratos/acceso/bloqueos.

## C4-012 — Validar seguridad y aceptación final cruzada
Responsable: DEIMER-PY. Fase: S4. Prioridad: P0.
Dependencias: C4-006, C4-008, C4-010.
Archivos: tests; docs/producto; docs/arquitectura.
Aceptación: Revisión conjunta de política/inyección/PII, gate, demo, costo y estados; evidencias finales saneadas.
Validación: Checklist conjunto y versión etiquetada tras revisión.

## Convención de tablero
Pendiente, En curso, En revisión, Bloqueado, Hecho.
Mover a Bloqueado con causa/siguiente acción. Mover a Hecho solo con evidencia de aceptación.
Fuente editable por tarea: GitHub Issues; este documento describe alcance y dependencias iniciales.
