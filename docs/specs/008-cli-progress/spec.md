# Progreso visible del CLI
Estado: Verified localmente; pendiente integración por PR y CI. Responsable: Deimer/Codex. Tarea C4-003/#3. Fecha: 2026-10-17.

## Problema
Deimer ejecuta c4 demo y parece que no ocurre nada: la CLI espera todas las solicitudes antes de emitir el primer resultado. Se observó una ejecución real completada y otra en evaluate con checkpoints recientes. No volver a consumir Grok para reproducir este problema de presentación.

## Requisitos
FR-001: En modo humano emitir inicio, ID de sesión y ruta de evidencia antes de la primera solicitud del modelo.
FR-002: Mostrar etapa y número real de respuestas de evaluación guardadas; indicador con tiempo transcurrido mientras se espera. No inventar porcentaje, ETA ni actividad.
FR-003: Mantener --json como documento final único, sin banners/progreso. Lecturas report/compare continúan sin llamadas.
FR-004: Ctrl+C conserva evidencia y marca la sesión como fallida/cancelada, con revisión humana; no deja un candidato aceptado por interrupción. No terminar procesos del usuario ni modificar sus sesiones existentes durante la corrección.

## Aceptación
AC-001: Prueba de transporte controlado verifica que el usuario recibe sesión/etapa antes de la primera solicitud, y progreso real entre respuestas.
AC-002: Pruebas confirman JSON limpio y salida de error sin secretos; no cambian decisiones ni cantidad de llamadas.
AC-003: Interrupción controlada guarda cancellation y parcial; suite, enlaces y CI aprobados, PR hacia develop.

## Alcance
Presentación, notificaciones de checkpoint e interrupción local. No cambiar contratos v1, dataset, prompts, backend HTTP, dashboard ni presupuesto. Una sesión antigua sin bloqueo no se repara automáticamente.
