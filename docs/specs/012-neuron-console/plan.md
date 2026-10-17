# Plan
1. Implementar rasterizador determinista de curvas ramificadas a puntos Braille y color por posición; núcleo luminoso, dendritas y axón segmentado. Mantener ASCII como fallback.
2. Usar c4/terminal.py para contexto lateral sin marcos pesados, actividad local claramente rotulada y estado listo para recibir comandos; adaptar tamaño a anchura.
3. Verificar con tests/unit/test_terminal.py, suite completa y scripts/verify_docs.py. Exportar preview SVG/PNG del mismo header, sin datos secretos ni llamadas a modelos.
4. Actualizar CLI.md, estado, README y esta spec; commit convencional con emoji, PR hacia develop y CI.

Ownership: Deimer/Codex. Archivos: c4/terminal.py, nuevo c4/terminal_art.py, tests/unit/test_terminal.py, documentación citada y specs012. No cambios compartidos de contratos.
