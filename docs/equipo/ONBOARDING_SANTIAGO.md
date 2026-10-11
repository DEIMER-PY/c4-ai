# Santiago + Claude — empezar
## Leer en orden
1. [Visión](../producto/PRD.md), [reglas compartidas](../../AGENTS.md) y [entrada Claude](../../CLAUDE.md).
2. [Estado](ESTADO.md), [roles](ROLES.md) y [backlog](BACKLOG.md).
3. [Contratos](../arquitectura/API.md), [mock API](../../examples/contracts/api-responses.json) y [dashboard](../producto/DASHBOARD.md).
## Primera tarea
Aplicar [SDD](SDD.md): crear spec/plan/tasks de dashboard antes de implementar; remitir a contratos canónicos y probar escenarios AC.
C4-004: preparar dashboard tipado con fixtures, pantalla de incidentes, detalle y comparaciones.
Partir de develop y crear rama santiago/feat-c4-004-dashboard-mocks. PR hacia develop; commits convencionales con emoji. Deimer/Codex construye backend de forma independiente.
No introducir auth/hosting/otro framework sin ADR.
## Checklist
- Clonar repo y aceptar invitación de GitHub si se requiere escribir.
- Abrir docs en Obsidian y seguir enlaces.
- Claude lee AGENTS + CLAUDE; no necesita chat/memoria de Codex.
- Confirmar task, archivos y dependencias en GitHub.
- Construir interfaz con etiqueta Demo; costos null visibles como desconocidos.
- Enviar PR con screenshots de interfaz futura, validación y bloqueos.
- Para Slack, unirse al workspace y canal; configurar conexión propia de Claude si desea enviar directamente.
No hay comandos de arranque del dashboard todavía; los añadirá esta tarea con su lockfile.
