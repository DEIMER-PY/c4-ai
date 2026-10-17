# Tareas
- [x] AC-001: SSE y panel de consumo/estado.
- [x] AC-002: contexto precargado, proveedor y una llamada/turno.
- [x] AC-003: entrada y atajos.
- [x] AC-004: privacidad, límites y cancelación.
- [x] AC-005: pruebas, benchmark acotado, documentación y PR/CI.

Responsable Deimer/Codex; depende de spec015 y guía adjunta de diseño.

80 pruebas Python aprobadas antes del ajuste final de etiquetas. SSE real: Groq906ms/primerfragmento625ms, Grok6391ms/5797ms; una muestra por proveedor. Preview final Groq672ms/1423tokens; se descartó una captura previa (1047ms/1341tokens) tras mejorar contexto: distinguir causa del baseline de regresión del candidato y añadir acciones observadas/esperadas. No se guardaron chats completos como historial; solo metadatos y captura seleccionada para documentación. JSON/gate sin cambios. Captura del renderer real revisada; CI pendiente del PR.
