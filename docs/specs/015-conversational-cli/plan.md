# Plan
Crear c4/services/chat.py sobre Gateway Grok existente, esquema Pydantic estricto y herramientas de lectura permitidas. Limitar mensajes/contexto y sanear secretos por valor y patrones. Conservar historial solo en RAM y contabilizar llamadas antes de cerrar el cliente en finally.

Harness enruta texto normal al chat; /use selecciona evidencia y /new reinicia conversación. Slash desconocido conserva error local. Mantener alias existentes y comandos del sistema bloqueados sin envío a modelos. Prompt-toolkit no guarda entradas con credenciales en su historial.

Archivos Deimer/Codex: servicio chat, c4/terminal.py, tests/unit/test_chat.py, docs CLI/estado/README/índice y esta spec. Sin cambios en contratos/API ni frontend. Pruebas de privacidad, límites, herramientas, contexto y regresiones; PR hacia develop con emoji y CI.
