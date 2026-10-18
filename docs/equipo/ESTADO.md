# Estado de C4 AI
Actualizado: 2026-10-17. Fuente vigente para retomar trabajo; detalles históricos en specs/PR y evidencia. [Reporte actual S1](../entregas/S1_REPORTE_TECNICO.md) · [Criterios oficiales](../entregas/S1_CRITERIOS.md).

## Verificado
- CLI end-to-end con Grok: sesión c4_63fb290ce5244c248f0b929120f14df2, baseline5/6→candidato6/6, cero regresiones, controles obligatorios aprobados. 14 llamadas,20.720 tokens,106,029 segundos de pared. Seis inputs sintéticos; respuestas reales. Costo USD desconocido. Solo versiones de prueba, sin aplicar a producción.
- Target Groq/Qwen separado del analista Grok: candidato rechazado por regresión refund_eligible (PR21). El gate determinista conserva baseline/dataset y no acepta candidatos incompletos.
- CLI/TUI: neurona magenta/cian, actividad y consumo, comandos con Tab, chat streaming Markdown, historial RAM y entrada multilínea. Una solicitud por turno, hasta16/conversación. Groq predeterminado si tiene clave; /chat grok cambia conversación. Enter envía y Alt+Enter inserta línea. PR30.
- API local FastAPI de consulta v1 sobre los mismos checkpoints. 48 consultas concurrentes aprobadas; launcher c4-api con SelectorEventLoop para Windows. Escritura/ejecución HTTP pendientes.
- Dashboard inicial de Santiago (PR18) integrado con API real por PR29: filtro, incidentes, evidencia/comparación, costo desconocido, modo Demo explícito, sin fallback silencioso. Vistas1440/820/390 revisadas. 37 pruebas frontend y build/typecheck/lint aprobados.
- Hermes v0.22.2: MCP stdio con cuatro consultas de lectura, descubrimiento Hermes y reporte accepted comprobados sin llamadas nuevas. PR31; [guía](../integraciones/HERMES.md). Spec020: Telegram→Hermes→C4→Telegram verificado; get_report/get_evaluation devolvieron accepted,5/6→6/6 y cero regresiones; entrega final19,110s.
- 83 pruebas Python aprobadas (contratos, gate, CLI, límites, lectura API, SSE y MCP). Checklists y enlaces documentales verificados por feature.

## Entrega y siguiente trabajo
- Meta MCP: registro/OAuth y11 herramientas básicas comprobados. app_list autenticado devuelve0 apps concedidas y no expone app_create; no implica que la cuenta no tenga apps. Deimer creará la app de prueba en Meta. Diagnóstico/asistente local scripts/whatsapp_hermes.py implementado,5 pruebas aprobadas; adaptador/ejecutable presentes y cinco credenciales requeridas ausentes. No hay app creada por el agente ni WhatsApp conectado. [Evidencia MCP](../evidencia/2026-10-17-meta-mcp.json) · [Preparación Hermes](../integraciones/WHATSAPP.md).
- Skill frontend de Deimer incorporada: [guía del equipo](FRONTEND_DESIGN.md) y copia de referencia versionable. README del dashboard y prompt Claude rectificados sobre Base UI, adaptador HTTP existente y launcher Windows. Sin dependencias/frameworks nuevos ni validación visual atribuida a esta revisión documental.
- Referencia visual de Figma17:8006 inspeccionada: portada Mega Chart Kit, frame3826:69704. Selector incorpora Kit claro/Kit oscuro con acento#723ceb; adaptación de colores, no importación exacta del CRM. [Fuente y alcance](../referencias/FIGMA_DASHBOARD.md). Revisión visual y publicación pendientes.
- Trabajo local021/023: composición nueva Remotion1080p con siete escenas editables, guía/visor de capítulos y SVG de marca/canales; exportación pendiente. Dashboard añade selector local de colores y laboratorio simulado de conteos, con tipos/lint y3 pruebas nuevas aprobados. Suite completa bloqueada por temporales Vitest; build/revisión visual pendientes. [Cierre S1](../entregas/S1_CIERRE.md). Telegram, WhatsApp y dashboard publicados como features con commits separados y PR38/39/40 en borrador; revisión pendiente.
- Figma: ambos enlaces de Deimer apuntan al mismo nodo Introduction; modo Dev no cambia el nodo y la nueva consulta MCP confirma imágenes promocionales. Falta enlace al frame CRM para fidelidad exacta. WhatsApp: Deimer eligió Meta Cloud API con número de prueba; adaptador/asistente instalados, cinco variables requeridas ausentes. [Preparación y requisitos](../integraciones/WHATSAPP.md), sin conexión activada. YouTube elegido; URL pendiente.
- Entrega019: reporte actual, matriz, video Remotion narrado de120s renderizado y verificado, prototipo responsive probado en navegador y snapshot de entrega. Revisión humana, alojamiento del video y formulario pendientes.
- C4-002/003 En curso: faltan PostgreSQL/Alembic y API de ejecución del mismo servicio.
- C4-006 En curso: lectura API ya implementada. Santiago revisa UX y completa jobs/métricas, candidatos sin reporte y actualización de estados con contratos acordados; no inventar endpoints.
- C4-008 En curso: fuente y video de entrega preparados por Deimer/Codex; Santiago revisa presentación y ensayo con Deimer.
- Dataset30+, tarifas/costo, Redis/RQ/idempotencia,1.000 unidades/12h, Jev y escritorio/Tauri siguen planificados. El prototipo móvil/tablet es web responsive, no app nativa.

## Actualización de producto y video — 17 de octubre

Nueva spec025 amplía el teaser aprobado de15s a120s/30fps/1080p: ocho escenas, Cortex SVG, transiciones, subtítulos y roadmap explícito. Montaje en exportación/revisión. Dylan/ElevenLabs elegido: capítulo Hermes generado, resto bloqueado por créditos Higgsfield; Deimer eligió cuenta ElevenLabs propia, clave todavía ausente. El render visual no se presenta como narración final completa. [Fuente, comandos y configuración](../../my-video/FILM.md).

[Handoff completo a Santiago/Claude](HANDOFF_2026-10-17.md) y prompt actualizados: C4-014 website (referencia Kiro), C4-015 docs (referencia Kimi Code), después C4-016 desktop y C4-017 React Native. Son tareas pendientes, no aplicaciones ya publicadas. Mantener C4-006 y revisión del dashboard existente.

Verificación actual:83 pruebas unitarias backend y5 del asistente WhatsApp aprobadas;40 pruebas dashboard aprobadas. Tipos/lint/build del dashboard y nueva exportación en revisión. El bloqueo previo de aprobación por cuota fue transitorio: nuevas acciones Git ya se autorizan; verificar publicación por PR antes de afirmar que llegó al remoto.

## Trabajo y acceso
Repositorio/tablero privados y develop predeterminado. Features desde develop, commits type(scope): emoji descripción, PR→develop. Santiago conserva ownership de frontend; cambios frontend solicitados en esta sesión por Deimer. Los contratos HTTP v1 no se cambiaron. Sin mensajes a compañeros ni publicación automática.

## Pendientes humanos
Publicación/licencia oficial S1 pendientes por decisión de privacidad. Una credencial retirada de .env.example en historial requiere rotación/revocación por su titular; limpiar plantilla no revoca ni elimina historia. Confirmar Slack/Obsidian de Santiago y revisión compartida. Git es fuente de verdad, Obsidian abre la raíz de cada clon y lee docs/; no duplicar documentación en Drive. Branch protection privado devolvió403 en preparación; no se comprobó cambio de plan. No hay vigilancia automática ni prueba de12h en curso.

Entrega019 integrada por PR32 con CI quality/dashboard/video aprobada. Rama privada codex/release-s1-end-to-end creada desde develop; snapshot inicial ad1438e. [Campos preparados](../entregas/S1_FORMULARIO.md). Revisión humana y URL del video pendientes.

## Corrección Telegram y proveedor (spec020)
Usuario autorizado/chat privado corregidos tras confirmar identidad con el humano; backup local y acceso limitado a un usuario. Gateway reconectado. Se corrigió la ruta de inferencia a custom:c4-reto/chat_completions con credencial específica del gateway: el intento anterior xai/Codex Responses se interrumpió por timeout y conserva evidencia. Prueba final Telegram con herramientas MCP y entrega confirmada en19,110s. No se usó el teléfono como ID ni se cambiaron permisos nativos. [Evidencia](../evidencia/2026-10-17-telegram.json). El video S1 conserva el estado anterior a esta mejora; no se reeditó como si la integración ya existiera durante su captura.
