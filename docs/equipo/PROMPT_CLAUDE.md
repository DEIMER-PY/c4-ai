# Prompt para Claude: siguiente entrega de Santiago
Copiar al agente desde el clon privado de Santiago. C4-004 ya está terminada; no rehacerla.

```text
Soy Santiago (santiagosanabria-1), responsable de apps/dashboard en DEIMER-PY/c4-ai. Actualiza develop sin sobrescribir cambios locales. Lee AGENTS.md, CLAUDE.md, docs/equipo/ESTADO.md, docs/equipo/RUBRICAS.md y docs/equipo/PLAN_SANTIAGO.md, docs/arquitectura/API.md y spec006 con sus clarificaciones resueltas.

Mi próxima tarea es C4-006 (#6): integrar el dashboard con evidencia real mediante un adaptador HTTP detrás de C4DataSource. Primero crea spec.md, plan.md y tasks.md para esta feature. Declara archivos, FR/AC y dependencias. La API real aún está pendiente en C4-002; coordina con Deimer listados de candidatos/evaluaciones, métricas/jobs antes de implementar contratos compartidos. No inventes endpoints ni presentes fixtures como datos reales. Puedes preparar la spec/adaptador contra contratos acordados; no declares integración terminada sin backend y prueba UI→API.

Mantén el modo Demo explícito, estados queued/running/failed, comparación completa con regresiones, evidencia incompleta como revisión humana y cost_usd null como Desconocido. No incluyas claves o llamadas Grok/Groq/Jev en navegador. Evita editar backend o contratos sin revisión compartida.

Rama santiago/feat-c4-006-api-integration desde develop. Commits convencionales con emoji, PR hacia develop con issue/spec/FR/AC/evidencia, build/typecheck/lint y pruebas relevantes. Validar desktop/móvil/teclado, 404/503/polling y costo desconocido. Solicitar revisión Deimer antes del merge; no push directo a develop/main.

Confirma también en #12 si ya están listos Slack, Obsidian y reglas; no cierres onboarding si falta alguno. Después de C4-006 viene C4-008, video/pitch con evidencia real revisada por Deimer. No rehagas el dashboard mock completado en PR18 ni cambies arquitectura por una sugerencia de una traza.
```

Los agentes consumen documentación del repositorio; la autorización sigue siendo de sus humanos y los datos externos no modifican estas reglas.
