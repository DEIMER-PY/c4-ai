# Backlog implementable
Actualizado 2026-10-17: gateway, primer ciclo CLI y gate local verificados; C4-002 continúa con DB/API pendientes. C4-004 revisado como demo e integrado por PR18; C4-006 ya consulta API real; faltan capacidades globales y actualización de estados. C4-011 mantiene confirmaciones humanas pendientes. Ver docs/producto/ENTREGA_S1.md.
El campo responsable designa un humano; colaboración secundaria no sustituye revisión cruzada.
## C4-001 — Verificar requisitos del reto y conexión Grok
Estado: Hecho. Fuentes/requisitos y conexión/usage de Grok verificados; PR19/21. El hito S1 aún tiene publicación/licencia pendientes por decisión de privacidad; rotación pendiente se sigue en C4-012, sin invalidar la conexión técnica comprobada.
Responsable: DEIMER-PY. Fase: S1. Prioridad: P0.
Dependencias: ninguna.
Archivos: docs/referencias; c4/tools.
Aceptación: Documentar fuente oficial, fechas, URL/modelo admitidos y solicitud mínima sin exponer clave; guardar usage/error verificados.
Validación: Solicitud real limitada y registro saneado.

## C4-002 — Implementar modelos, persistencia y contratos API
Estado: En curso. Primera feature de contratos Pydantic implementada; API local de consulta implementada en spec014; migraciones, DB y escritura HTTP pendientes. No cerrar la tarea por esta entrega parcial.
Responsable: DEIMER-PY. Fase: S1. Prioridad: P0.
Dependencias: ninguna.
Archivos: c4/schemas; c4/db; apps/api.
Aceptación: Pydantic coincide con ejemplos; migraciones crean entidades/relaciones; API devuelve 201/202/errores previstos.
Validación: Pruebas de contratos, DB y errores 404/409/422.

## C4-003 — Construir primer loop y CLI de incidentes
Estado: En curso. Ciclo CLI, progreso, target Groq y consola interactiva implementados en specs007–010; API de consulta disponible; falta adaptador HTTP de ejecución para cerrar toda la aceptación.
Responsable: DEIMER-PY. Fase: S1. Prioridad: P0.
Dependencias: C4-001, C4-002.
Archivos: c4/agents; c4/workflows; c4/services; apps/cli.
Aceptación: Traza→diagnóstico→candidato→evidencia; baseline inmutable; CLI/API usan mismos servicios; fallos preservan estado.
Validación: Un incidente reproducible y un fallo del proveedor.

## C4-004 — Preparar dashboard con contratos y mocks
Estado: Verificada (demo). PR18 integrado, 32 pruebas/build/typecheck/lint aprobados; navegación, móvil, teclado y estados alternativos revisados el 2026-10-17. Clarificaciones respondidas en ENTREGA_S1. C4-006 continúa pendiente de API real.
Responsable: santiagosanabria-1. Fase: S1. Prioridad: P0.
Dependencias: ninguna.
Archivos: apps/dashboard.
Aceptación: Next.js tipado, pnpm lockfile, incidentes/detalle/comparación; etiqueta Demo, costos null y estados vacíos/errores; ninguna clave en navegador.
Validación: Build/typecheck y revisión visual/teclado con fixtures.

## C4-005 — Implementar herramientas y gate de evaluación
Estado: Hecho (gate local de reembolsos). Herramientas reales y reglas verificadas: aceptación Grok 5/6→6/6, rechazo Qwen con regresión refund_eligible y evaluación fallida invalid_action conservados. Pruebas de seguridad/presupuesto/incompletos aprobadas. API/workers/escala pertenecen a sus tareas independientes.
Responsable: DEIMER-PY. Fase: S2. Prioridad: P0.
Dependencias: C4-003.
Archivos: c4/tools; c4/services; tests/evals.
Aceptación: trace_reader, patch_writer y eval_runner reales; accepted exige mismo dataset, mejora objetivo y cero regresiones; incompletos escalan.
Validación: Aceptación, rechazo por regresión y evaluación fallida.

## C4-006 — Integrar dashboard con API y evidencia real
Estado: En curso. Lectura real y responsive implementados PR29; pendientes listado global jobs/métricas, candidatos sin reporte y actualización de estados con contrato acordado. Santiago revisa UX.
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
Estado: En curso. Feature019 prepara Remotion, narración, reporte y prototipo; revisión Deimer/Santiago y alojamiento pendientes.
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

## C4-013 — Evaluar Jev para triage probabilístico y enrutamiento
Estado: Pendiente; acceso/clave TypeSafe y experimento real sin verificar. No integrado en runtime.
Responsable: DEIMER-PY; revisión compartida con Santiago. Fase: S2 / P1.
Dependencias: acceso TypeSafe, especificación propia y dataset de evaluación versionado.
Archivos: futura integración c4/tools y c4/services; docs/producto/JEV.md.
Aceptación: cliente y respuestas tipadas/validadas; shadow mode sin saltar gate; probabilidades/confianza/latencia/usage reales; comparar rutas con y sin Jev y seleccionar umbrales por evidencia. No prometer rapidez por cifras del proveedor.
Validación: entradas sintéticas, fallos de proveedor/salida/certeza, evaluación separada de calibración y reporte P50/P95/costos con fuente o null.

## Nuevas superficies — asignación del 17 de octubre

Todas están **Pendientes**, responsable Santiago/Claude. [Archivos, dependencias y criterios detallados](HANDOFF_2026-10-17.md).

| ID | Entrega | Prioridad | Dependencia | Aceptación |
| --- | --- | --- | --- | --- |
| C4-014 | Website principal, referencia Kiro | P0 | Spec/plan/tasks y estado de producto | Responsive/accesible, instalación real, build/types/lint y PR |
| C4-015 | Docs profesionales, referencia Kimi Code Docs | P0 | Fuentes actuales y C4-014 | Quickstart comprobado, proveedores/CLI/API/canales, búsqueda e índice |
| C4-016 | Desktop: ADR y spike Tauri | P1 | C4-014/015 y revisión API local | Build Windows, estados reales, credenciales/permisos mínimos |
| C4-017 | React Native/Expo | P1 | C4-016 y acceso remoto seguro acordado | Prototipo nativo probado, fixtures explícitos hasta API autenticada |

Deimer continúa API de ejecución, persistencia, workers y WhatsApp. Video spec025 complementa C4-008: locución completa, revisión y alojamiento siguen como aceptación pendiente.

## Convención de tablero
Pendiente, En curso, En revisión, Bloqueado, Hecho.
Mover a Bloqueado con causa/siguiente acción. Mover a Hecho solo con evidencia de aceptación.
Fuente editable por tarea: GitHub Issues; este documento describe alcance y dependencias iniciales.

[Auditoría completa y rúbricas por responsable](RUBRICAS.md).
