# Tareas
- [x] AC-001: chat Grok y comandos coexistentes.
- [x] AC-002: evidencia local acotada y privacidad.
- [x] AC-003: presupuesto, historial y reinicio.
- [x] AC-004: pruebas, conversación real acotada y PR/CI.

Responsable Deimer/Codex; depende de specs010/014. Archivos y criterios en plan/spec.

Validación: 73 pruebas Python, presupuesto reducido/cancelación, privacidad y herramientas permitidas. Conversación real Grok sobre sesión Qwen guardada: dos llamadas, 3.904 tokens reportados, 14.000 ms de latencia acumulada. Explicó correctamente refund_expired corregido y refund_eligible regresado, citando ID. No hubo demo ni modificación de evidencia; solo se guardaron metadatos de ensayo, no historial del chat. Documentación: 109 Markdown, 11 JSON y 15 SVG. Integración condicionada a CI.
