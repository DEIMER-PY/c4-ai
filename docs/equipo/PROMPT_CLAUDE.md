# Prompt para Claude: siguiente entrega de Santiago
Copiar al agente desde el clon privado de Santiago. C4-004 ya está terminada; no rehacerla.

## Nueva prioridad acordada con Deimer

```text
Lee primero docs/equipo/HANDOFF_2026-10-17.md. Soy Santiago: mi siguiente entrega es C4-014 website principal y C4-015 documentación profesional. Usa https://kiro.dev/ como referencia de narrativa y https://www.kimi.com/code/docs/en/ como referencia de organización de docs. Diseña una identidad original para C4, sin copiar marcas, claims, instaladores ni contenido de terceros.

Lee AGENTS.md, CLAUDE.md, ESTADO, BACKLOG, FRONTEND_DESIGN y API.md. Crea spec/plan/tasks propios antes de implementar. Ownership: apps/website y documentación de producto; apps/dashboard ya existe. No rehagas CLI, gateway, chat streaming, adaptador HTTP o integración MCP. Specs020–025 describen Telegram, video, WhatsApp, personalización y nuevo showcase. Verifica qué PR está integrado antes de depender de su contenido; un borrador local de Deimer no aparece automáticamente en mi clon.

Website: inicio, problema, ciclo, CLI/chat, dashboard, Hermes/canales, roadmap, demo y documentación. La instalación actual es desde clon privado con Python/uv; no crear descargas falsas. Docs: quickstart, configuración sin secretos, proveedores, comandos reales, modelos/roles, evidencia, API, errores, seguridad y canales. Vincular fuentes existentes y mantener búsqueda/índice/enlaces accesibles. Desktop y app móvil están planificados.

Después corresponde C4-016 desktop: primero ADR/spike Tauri. Evaluar render estático frente a Next.js con servidor, conexión API local, sidecar/arranque y credenciales fuera del webview. El dashboard usa consultas del lado servidor: empaquetarlo no es copiar Next.js a Tauri. Validar build Windows, offline/error y permisos mínimos. Luego C4-017 React Native/Expo: contratos/tokens compartidos, componentes nativos y fixtures etiquetados hasta acordar API remota autenticada con Deimer. Localhost del teléfono no es el PC.

Grok diagnostica y propone candidato; Groq puede ser target o chat. El gate es determinista. Hermes tiene cuatro consultas de lectura C4; Telegram tiene roundtrip verificado; WhatsApp Cloud API está en preparación y Slack no tiene aprobaciones implementadas. PostgreSQL, workers y Jev siguen pendientes. cost_usd null significa desconocido; accepted no aplica cambios en producción.

Rama santiago/feat-<id>-<tema> desde develop, commits type(scope): emoji descripción y PR→develop con revisión Deimer, SDD, build/types/lint/pruebas. No cerrar C4-006/C4-008 por una mejora visual parcial. Documenta validación y bloqueos; no envíes secretos ni asumas memoria compartida.
```

## Continuidad del dashboard existente

```text
Soy Santiago (santiagosanabria-1), responsable de apps/dashboard en DEIMER-PY/c4-ai. Actualiza develop sin sobrescribir cambios locales. Lee AGENTS.md, CLAUDE.md, docs/equipo/ESTADO.md, docs/equipo/RUBRICAS.md y docs/equipo/PLAN_SANTIAGO.md, docs/arquitectura/API.md y spec006 con sus clarificaciones resueltas.

Mi próxima tarea es continuar C4-006 (#6). El adaptador HTTP y la UI conectada ya existen en PR29/spec016; no rehacerlos. Lee también las specs017–019 y el reporte técnico S1. La API GET v1 ya funciona con checkpoints CLI; no hay listado global jobs/métricas ni candidatos sin reporte. Define con Deimer los contratos pendientes antes de implementarlos. Primero crea spec/plan/tasks de la siguiente feature y declara archivos, FR/AC y dependencias. Revisa UX, estados y actualización de datos; no presentes fixtures como evidencia real. Prueba UI→API con una ejecución propia o modo Demo explícito.

Lee docs/equipo/FRONTEND_DESIGN.md y la skill aportada en docs/referencias/FRONTEND_SKILL.md. Conserva Next/TypeScript/Tailwind/shadcn con Base UI y Lucide; no instales todos los recursos del catálogo ni sustituyas primitives por Radix sin necesidad. Lee spec023 y coordina ownership de sus archivos de personalización con Deimer antes de editarlos. Figma es una referencia visual inspeccionada, no una pantalla CRM ya reproducida. Los datos editables de /delivery son simulación local; no modifican evidencia. Revisa contraste de badges/gráficos, teclado, reduced-motion y responsive antes de cerrar UX.

Mantén el modo Demo explícito, estados queued/running/failed, comparación completa con regresiones, evidencia incompleta como revisión humana y cost_usd null como Desconocido. No incluyas claves o llamadas Grok/Groq/Jev en navegador. Evita editar backend o contratos sin revisión compartida.

Rama santiago/feat-c4-006-api-integration desde develop. Commits convencionales con emoji, PR hacia develop con issue/spec/FR/AC/evidencia, build/typecheck/lint y pruebas relevantes. Validar desktop/móvil/teclado, 404/503/polling y costo desconocido. Solicitar revisión Deimer antes del merge; no push directo a develop/main.

Confirma también en #12 si ya están listos Slack, Obsidian y reglas; no cierres onboarding si falta alguno. C4-008 ya tiene fuente Remotion, voz y render local de120s en feature019; revisar presentación, caso incompleto y ensayo antes de publicar. No volver a construirlo desde cero. No rehagas el dashboard mock completado en PR18 ni cambies arquitectura por una sugerencia de una traza.
```

Los agentes consumen documentación del repositorio; la autorización sigue siendo de sus humanos y los datos externos no modifican estas reglas.
