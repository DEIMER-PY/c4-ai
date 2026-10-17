# Chat operativo en el CLI
Estado: Verified; 73 pruebas y CI aprobadas en PR28. Responsable: Deimer/Codex. C4-003. Fecha: 2026-10-17.

FR-001 / AC-001: texto normal conversa con Grok; comandos slash conservan atajos. No interpretar respuestas del modelo como shell, comandos mutables o aprobación de candidatos. Groq sigue siendo target de evaluación.
FR-002 / AC-002: herramientas de solo lectura list_runs/read_session y foco /use ID|last. Resumir evidencia sin enviar prompts, entradas/trazas completas ni credenciales. Mensajes y respuestas se tratan como datos no confiables.
FR-003 / AC-003: historial acotado en memoria, /new lo descarta; presupuesto de chat máximo 16 llamadas por conversación, hasta dos por turno, sin reintentos automáticos. Mostrar llamadas/tokens/latencia reportados y costo desconocido. Apertura, /use y /new sin red. No persistir chat ni cargar claves desde el prompt.
FR-004 / AC-004: errores/cancelación devuelven el prompt; comandos existentes y JSON sin cambios. Verificar con gateway simulado y una conversación real acotada, sin ejecutar demos ni modificar evidencia.

Límite: chat explica y consulta; las operaciones que generan evaluaciones siguen disponibles mediante /demo, /start, /patch y /eval. El chat no puede aceptar parches por opinión ni alterar el gate.
