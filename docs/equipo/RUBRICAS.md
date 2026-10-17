# Rúbricas y auditoría de tareas
Revisión: 2026-10-17. Se leyeron las doce issues originales y sus criterios. Una capacidad parcial no cierra una tarea que exige API, DB, workers o evidencia adicional. GitHub Issues/Projects conserva el estado operativo.

| Tarea / responsable | Estado de aceptación | Evidencia y pendiente concreto |
|---|---|---|
| C4-001 / Deimer | Hecho: conexión/requisitos | Fuentes oficiales, modelo/base y usage reales; PR19/21. Publicación/licencia son pendientes del hito S1; rotación sigue en C4-012 |
| C4-002 / Deimer | En curso | Contratos y API de consulta probados (404/422/503); faltan PostgreSQL, Alembic y escritura/409 |
| C4-003 / Deimer | En curso | CLI end to end, progreso y consola interactiva; API de lectura disponible; falta adaptador HTTP de ejecución del mismo servicio |
| C4-004 / Santiago | Hecho: dashboard demo | PR18 integrado; 32 pruebas, build/typecheck/lint y revisión desktop/móvil/teclado. No equivale a integración real |
| C4-005 / Deimer | Hecho: gate local | trace_reader, patch_writer y eval_runner ejecutados; aceptación Grok, rechazo por regresión Qwen y fallo por contrato reales, más pruebas de seguridad/incompletos |
| C4-006 / Santiago | Pendiente | Integrar API real, distinguir modo demo, polling/errores/ID y evidencia; depende de C4-002 |
| C4-007 / Deimer | Pendiente | Hay seis casos sintéticos. Faltan 30+ propios con procedencia, métricas y tarifas verificadas |
| C4-008 / Santiago | Pendiente | Interfaz base disponible; faltan guion, pitch y video de dos minutos sobre evidencia real |
| C4-009 / Deimer | Pendiente | Checkpoints/lock locales disponibles; faltan Redis/RQ, idempotencia y recuperación/reinicio de worker |
| C4-010 / Deimer | Pendiente | Ninguna prueba de 1.000 unidades/doce horas realizada; requiere C4-007/009 |
| C4-011 / Santiago | Pendiente parcial | GitHub/entrega Claude verificados; falta confirmación humana de Slack, bóveda y onboarding en #12 |
| C4-012 / Ambos; Deimer responsable | Pendiente | Gate probado; faltan revisión cruzada final, rotación de clave, integración UI/seguridad/datos y aceptación conjunta |
| C4-013 / Deimer + revisión Santiago | Planificado | Experimento Jev/TypeSafe: acceso y especificación, shadow mode, probabilidades y latencia medidos; no integrado aún |

## Evidencia que permite cerrar C4-005
- Aceptación: [Grok 5/6 → 6/6 sin regresiones](../evidencia/2026-10-17-cli.json).
- Rechazo: [Qwen 5/6 → 5/6 con refund_eligible roto](../evidencia/2026-10-17-groq-rejected.json).
- Incompleto: [Qwen invalid_action, needs_human_review](../evidencia/2026-10-17-groq-invalid-action.json).
- Pruebas automatizadas: regresión, seguridad obligatoria, salida inválida, proveedor, presupuesto, Ctrl+C y baseline inmutable. El costo sigue desconocido y no se aplica nada a producción.

## Rúbrica operativa por entrega
Cada PR declara Issue, propietario, archivos, spec/plan/tasks, FR/AC, comandos y resultados de validación, evidencia y límites. En revisión exige resultado reproducible; Hecho exige todos los criterios y merge a develop. El dashboard usa Demo para fixtures, y la consola no convierte un trabajo completado/rechazado en aceptación.

Para C4-006 acordar primero los listados candidatos/evaluaciones y métricas/jobs que faltan en el contrato; no inventar endpoints. Para C4-008 mostrar un caso aceptado, uno rechazado y uno incompleto, con IDs y procedencia, sin insertar porcentajes de la referencia visual. Para Jev consultar [propuesta y aceptación](../producto/JEV.md).

[Rúbrica oficial del reto y pendientes S1–S4](../producto/ENTREGA_S1.md). La auditoría no asigna puntos del jurado ni publica repositorio/tablero.
