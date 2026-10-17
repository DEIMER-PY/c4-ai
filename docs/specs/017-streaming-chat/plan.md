# Plan
Crear c4/tools/streaming.py reutilizando límites/cliente de Gateway, SSE solo de delta.content y usage final. Chat incorpora método de streaming con contexto acotado precargado; mantiene ask JSON para compatibilidad y pruebas existentes.

Harness muestra Markdown y ventana de métricas con Rich Live, estado de consulta local y primer fragmento; no atribuir fragmentos a tokens. /chat, /status, aliases /run/demo y /inspect/report, entrada Prompt Toolkit multilínea. Añadir documentación de proveedor y benchmark limitado.

Archivos Deimer/Codex: c4/tools/streaming.py, c4/services/chat.py, c4/terminal.py, tests/unit/test_streaming.py, docs CLI/estado/referencias/specs. Sin cambios de contratos ni frontend. PR hacia develop con CI.
