# Chat rápido y experiencia de terminal
Estado: Ready. Responsable: Deimer/Codex. Fecha: 2026-10-17. C4-003.

FR-001 / AC-001: chat interactivo con streaming de texto, Markdown y panel de consumo. Separar estado/herramienta de la respuesta; no mostrar razonamiento interno ni inventar conteos de tokens durante SSE. Capturar primer fragmento y duración reales; costo desconocido.
FR-002 / AC-002: contexto de evidencia seleccionado por ID o /use precargado de forma determinista para requerir una sola llamada por turno. /chat groq|grok elige proveedor de conversación; con clave Groq configurada es el predeterminado, sin alterar Grok del diagnóstico ni target del workflow. Qwen permite reasoning_effort none según fuente oficial; no aplicar ese parámetro a modelos no documentados.
FR-003 / AC-003: comandos intuitivos /run, /inspect, /status; entrada multilínea Alt+Enter/Esc+Enter y Enter para enviar. Mantener historial RAM, /new, presupuesto16 y límites menores de entorno. Cancelación y fallos conservan conteo y permiten continuar.
FR-004 / AC-004: no ejecutar acciones desde respuestas ni ampliar herramientas de máquina. Redactar secretos/control de terminal incluso entre fragmentos. CLI JSON y gateway de evaluación sin cambios.
FR-005 / AC-005: pruebas SSE, errores, redacción, límites y regresiones; medir una conversación real acotada por proveedor sin afirmar rapidez universal a partir de una muestra. Adoptar la guía CLI/TUI adjunta en la sesión usando el stack Python existente.
