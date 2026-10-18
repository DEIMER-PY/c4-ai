# Estado de C4 AI
Actualizado: 2026-10-17. Fuente para retomar trabajo; [handoff completo](HANDOFF_2026-10-17.md) y [backlog](BACKLOG.md).

## Runtime verificado

- CLI end-to-end Grok: sesión c4_63fb290ce5244c248f0b929120f14df2; baseline5/6→candidato6/6, cero regresiones y controles aprobados. Seis casos sintéticos, respuestas reales;14 llamadas,20.720 tokens,106,029s de pared. Costo USD desconocido. Solo versiones de prueba.
- Target Groq/Qwen separado del analista Grok: prueba completa rechazada por regresión refund_eligible. La mejora de un caso no basta para aceptar.
- TUI con neurona, chat streaming Markdown, contexto de evidencia, consumo, Tab y multilínea. Una solicitud por turno; límites y proveedor por entorno. Abrir consola no genera llamadas.
- API FastAPI GET v1 lee los mismos checkpoints para el dashboard. Escritura/ejecución HTTP, métricas globales, PostgreSQL y workers siguen pendientes.
- Dashboard existente: lectura API real y modo Demo explícito. Personalización local de paleta/datos simulados añadida en PR40;40 pruebas, tipos, lint y build aprobados localmente. Revisión UX de Santiago pendiente; C4-006 no está cerrada.
- Hermes: cuatro consultas MCP de solo lectura. Telegram→Hermes→C4→respuesta verificado en19,110s en una prueba: get_report/get_evaluation devolvieron accepted,5/6→6/6 y cero regresiones. No es un SLA ni una nueva evaluación.
- Validación local de esta entrega:83 pruebas unitarias backend y5 del asistente WhatsApp aprobadas. Tests de desarrollo y mocks no sustituyen evidencia de proveedor.

## Entrega de Santiago recibida

PR41 se integró en develop589e410: apps/website estático (Next.js/React/TypeScript/Tailwind), nueve guías MDX, navegación, instalación, vitrina y evidencia con fuente. La copia local integra ese remoto sin sobrescribir sus archivos; se resolvió el índice conservando ambas specs. El teaser se renumeró026 porque024 corresponde al website.

Website:15 pruebas, tipos, lint y build estático aprobados localmente. C4-014/C4-015 pasan a En revisión, no a reconstrucción. Hosting y publicación siguen pendientes. Revisar sincronización editorial de Telegram (ya verificado) y WhatsApp (pendiente) antes de publicar.

Siguiente desarrollo de Santiago/Claude: C4-016 desktop, primero ADR/spike Tauri y empaquetado real; después C4-017 React Native con contrato de acceso seguro acordado. Mantener integración/UX C4-006. [Prompt actual](PROMPT_CLAUDE.md).

## Video y presentación

Deimer eligió el MP4 de Santiago de71s como referencia principal. Se preservan su voz, montaje y archivo original; spec027 inserta49s subtitulados sobre pruebas, JEV, impacto y ecosistema, hasta120s. La fuente del editor/voz original no está identificada por metadatos ni por el remoto. El proyecto editable no está disponible. [Source y reproducción](../../my-video/EXTENSION.md).

La variante025 de120s y el teaser026 de15s aprobado se conservan. Dylan/ElevenLabs se intentó antes del cambio de preferencia: una pista previa por Higgsfield, sin créditos para el resto; cuenta propia Free rechazó Dylan de biblioteca con402. No se compraron planes, no se importaron voces ni se presenta otra voz como original. La clave permanece local.

Montaje027 exportado y verificado:120.000s de video,3600frames,1080p30. Revisión humana y alojamiento YouTube pendientes. No se ha enviado el formulario S1 ni cambiado visibilidad. [Campos de entrega](../entregas/S1_FORMULARIO.md).

## Pendientes del producto

- WhatsApp Cloud API: diagnóstico y asistente preparados,5 tests. Adaptador presente; faltan app/credenciales/webhook/prueba real. Deimer creará app y número de prueba. Meta MCP OAuth/11 herramientas comprobados; app_list devuelve0 accesibles y no expone app_create. No equivale a canal conectado.
- JEV: propuesta para triage probabilístico en shadow mode; no hay integración, credencial, calibración o rapidez/ahorro medidos. No sustituye el gate. [Diseño y aceptación](../producto/JEV.md).
- Runner unitario de repositorios: nueva propuesta C4-018, fuera del MVP actual; necesita aislamiento, permisos y spec. [Qué prueba C4 hoy](../producto/PRUEBAS_Y_DECISIONES.md).
- C4-002/003: persistencia y ejecución HTTP. C4-007: dataset30+. C4-009: workers/idempotencia/recuperación. C4-010:1.000 unidades/12h reales. Ninguno se considera terminado por mockups o video.

## Git y coordinación

Repo/tablero privados; develop predeterminado. Commits type(scope): emoji descripción, features y PR→develop. PR38 Telegram, PR39 preparación WhatsApp y PR40 dashboard en borrador, apilados; no se han fusionado. Video/handoff se publica por feature independiente. El bloqueo anterior por cuota fue transitorio; nuevas acciones Git se autorizan.

Git es fuente de verdad. Obsidian abre el clon y sus Markdown; no duplicar documentación en Drive ni exportar chats/memoria privados. Slack coordina, no almacena decisiones. No se enviaron mensajes a Santiago por preparar contexto. Confirmaciones humanas de onboarding y revisión final siguen pendientes.

La decisión sobre publicación/licencia S1 sigue siendo humana. La limpieza de una credencial histórica no la revoca; su titular conserva la acción de rotación pendiente. No se comprobó cambio de plan para branch protection privado. No hay vigilancia ni prueba de12h ejecutándose.
