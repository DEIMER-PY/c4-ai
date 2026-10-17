# Plan
Usar SDK oficial MCP línea1.x mantenida y fijada <2 para la API FastMCP documentada. Crear c4/mcp_server.py con anotaciones readOnly y reusar EvidenceReader; transporte stdio, stdout solo de protocolo. Dependencia en pyproject/uv.lock. No nuevos endpoints HTTP.

Validar desde cliente MCP real stdio y hermes mcp test; agregar servidor con CLI oficial de Hermes y root absoluto solo de artifacts/runs. No copiar tokens/config.yaml al repo ni reiniciar gateway de Telegram. Documentar comandos para recargar herramientas y ejemplos de preguntas para el usuario.

Archivos Deimer/Codex: c4/mcp_server.py, pyproject.toml, uv.lock, tests/unit/test_mcp.py, docs/integraciones/HERMES.md, estado/specs. PR hacia develop y CI.
