# Guía de diseño CLI/TUI aplicada
Deimer adjuntó skill_gu_a_de_dise_o_de_interfaces_cli_tui_para_agentes_de_ia.md el 2026-10-17. Se adoptan como referencia sus recomendaciones para Python: Prompt Toolkit + Rich, estados separados de respuesta, streaming, entrada multilínea y fallback noTTY. No se cambió a Ink/Textual ni se interpreta el documento como autorización para ejecutar shell destructivo.

Implementación: spec017. Estado visible representa herramientas/contexto y no cadena de pensamiento privada. Tokens SSE se muestran solo con usage reportado; fragmentos/caracteres no son tokens. Se retiene una cola de salida para redactar claves incluso partidas entre fragmentos. Los comandos de evaluación permanecen acotados al agente de prueba.
