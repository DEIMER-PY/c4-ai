# Estado de C4 AI
Actualizado: 2026-10-17. Fuente vigente para retomar trabajo; detalles históricos en specs/PR y evidencia. [Reporte actual S1](../entregas/S1_REPORTE_TECNICO.md) · [Criterios oficiales](../entregas/S1_CRITERIOS.md).

## Verificado
- CLI end-to-end con Grok: sesión c4_63fb290ce5244c248f0b929120f14df2, baseline5/6→candidato6/6, cero regresiones, controles obligatorios aprobados. 14 llamadas,20.720 tokens,106,029 segundos de pared. Seis inputs sintéticos; respuestas reales. Costo USD desconocido. Solo versiones de prueba, sin aplicar a producción.
- Target Groq/Qwen separado del analista Grok: candidato rechazado por regresión refund_eligible (PR21). El gate determinista conserva baseline/dataset y no acepta candidatos incompletos.
- CLI/TUI: neurona magenta/cian, actividad y consumo, comandos con Tab, chat streaming Markdown, historial RAM y entrada multilínea. Una solicitud por turno, hasta16/conversación. Groq predeterminado si tiene clave; /chat grok cambia conversación. Enter envía y Alt+Enter inserta línea. PR30.
- API local FastAPI de consulta v1 sobre los mismos checkpoints. 48 consultas concurrentes aprobadas; launcher c4-api con SelectorEventLoop para Windows. Escritura/ejecución HTTP pendientes.
- Dashboard inicial de Santiago (PR18) integrado con API real por PR29: filtro, incidentes, evidencia/comparación, costo desconocido, modo Demo explícito, sin fallback silencioso. Vistas1440/820/390 revisadas. 37 pruebas frontend y build/typecheck/lint aprobados.
- Hermes v0.22.2: MCP stdio con cuatro consultas de lectura, descubrimiento Hermes y reporte accepted comprobados sin llamadas nuevas. PR31; [guía](../integraciones/HERMES.md). Telegram configurado por Deimer; conversación Telegram→C4 pendiente de prueba humana.
- 83 pruebas Python aprobadas (contratos, gate, CLI, límites, lectura API, SSE y MCP). Checklists y enlaces documentales verificados por feature.

## Entrega y siguiente trabajo
- Entrega019: reporte actual, matriz, video Remotion narrado de120s renderizado y verificado, prototipo responsive probado en navegador y snapshot de entrega. Revisión humana, alojamiento del video y formulario pendientes.
- C4-002/003 En curso: faltan PostgreSQL/Alembic y API de ejecución del mismo servicio.
- C4-006 En curso: lectura API ya implementada. Santiago revisa UX y completa jobs/métricas, candidatos sin reporte y actualización de estados con contratos acordados; no inventar endpoints.
- C4-008 En curso: fuente y video de entrega preparados por Deimer/Codex; Santiago revisa presentación y ensayo con Deimer.
- Dataset30+, tarifas/costo, Redis/RQ/idempotencia,1.000 unidades/12h, Jev y escritorio/Tauri siguen planificados. El prototipo móvil/tablet es web responsive, no app nativa.

## Trabajo y acceso
Repositorio/tablero privados y develop predeterminado. Features desde develop, commits type(scope): emoji descripción, PR→develop. Santiago conserva ownership de frontend; cambios frontend solicitados en esta sesión por Deimer. Los contratos HTTP v1 no se cambiaron. Sin mensajes a compañeros ni publicación automática.

## Pendientes humanos
Publicación/licencia oficial S1 pendientes por decisión de privacidad. Una credencial retirada de .env.example en historial requiere rotación/revocación por su titular; limpiar plantilla no revoca ni elimina historia. Confirmar Slack/Obsidian de Santiago y revisión compartida. Git es fuente de verdad, Obsidian abre la raíz de cada clon y lee docs/; no duplicar documentación en Drive. Branch protection privado devolvió403 en preparación; no se comprobó cambio de plan. No hay vigilancia automática ni prueba de12h en curso.

Entrega019 integrada por PR32 con CI quality/dashboard/video aprobada. Rama privada codex/release-s1-end-to-end creada desde develop; snapshot inicial ad1438e. [Campos preparados](../entregas/S1_FORMULARIO.md). Revisión humana y URL del video pendientes.
