# Protocolo de colaboración
## Fuente de verdad
GitHub: tareas, cambios, decisiones y documentación versionada.
Slack #c4-ai: avisos, dudas y un hilo por tarea. Resumir acuerdos permanentes en issue/ADR.
Obsidian: abrir docs como bóveda en cada clon. Usar Git pull antes y commit/push después; evitar editar el mismo archivo simultáneamente.
## Tablero
Pendiente → En curso → En revisión → Hecho. Bloqueado requiere causa, responsable de desbloqueo y siguiente acción.
No duplicar estado manualmente sin referencia; ESTADO es resumen, el tablero es estado por tarea.
## Tarea
ID, objetivo, persona responsable, fase, prioridad, dependencias, archivos, aceptación y validación.
Avisar antes de ampliar alcance o editar contratos comunes.
## Handoff agente a agente
Tarea: C4-xxx / issue URL
Rama/PR/commit:
Cambios:
Contrato y fixture usados:
Validación y resultado:
Bloqueos:
Siguiente acción y responsable:

Claude publica la entrega en PR/issue y, si tiene acceso, en hilo Slack. Codex revisa evidencia y responde ahí durante sesiones activas.
No hay vigilancia en segundo plano configurada.
## Obsidian
Sin plugins obligatorios ni Sync de pago. .obsidian local; no versionar disposición privada de ventanas.
Enlaces relativos y Mermaid. Raíz docs visible; reglas/código accesibles desde GitHub/editor.
Los hilos/memoria privados no se sincronizan: CONTEXTO, decisiones y bitácora son memoria explícita del proyecto.
## Slack onboarding
Santiago debe ser miembro del workspace antes de invitarlo al canal. Buscar perfil exacto antes de enviar.
No publicar correo privado en repo/canal público. Invitación GitHub y aceptación se registran como pendientes hasta verificarlas.
