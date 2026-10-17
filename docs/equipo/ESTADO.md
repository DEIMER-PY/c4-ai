# Estado de C4 AI
Actualizado: 2026-10-17.

## Producto y evidencia
- **Verificada:** CLI end to end con Grok, sobre seis casos sintéticos. Baseline 5/6, candidato 6/6, cero regresiones, tres casos de seguridad aprobados; 14 llamadas, 20.730 tokens reportados. [Evidencia y rúbricas](../producto/ENTREGA_S1.md).
- **Verificados:** contratos Pydantic v1, 15 pruebas originales. Las 65 pruebas actuales verifican contratos, servicio, gate, fallos, límites, CLI, Unicode de Windows y lectura entre procesos; ver spec007.
- **Verificada como demo:** C4-004 dashboard de Santiago, integrado por [PR18](https://github.com/DEIMER-PY/c4-ai/pull/18), con fixtures sintéticos. Build y 32 pruebas aprobados; typecheck/lint aprobados. Revisión de navegador y cierre de criterios registrados en entrega S1.
- **Verificados:** proveedor target Groq/Qwen separado de Grok (PR21), con prueba real rechazada por regresión; [fuente/evidencia](../referencias/GROQ.md). Consola interactiva con comandos, autocompletado e historial en memoria; spec010.
- **Planificados:** operaciones HTTP de escritura, PostgreSQL/Alembic, Redis/RQ, API real para dashboard, instaladores/escritorio y prueba de carga. El almacén del CLI es local con checkpoints, no una DB distribuida.

## Flujo y acceso
Repositorio y tablero privados; rama predeterminada develop. Features independientes, commits convencionales con emoji y PR hacia develop. PR19 integrado en develop (95c0ed3). PR20 de progreso integrado (0c087d7); PR21 de proveedores integrado (3817fc8). Consola interactiva integrada por PR22 (6c04d69), en [spec010](../specs/010-interactive-console/spec.md). No hay cambios incompatibles de contratos v1.
Santiago conserva ownership frontend. No se alteró su código durante esta revisión. Las dudas CL-001–005 se responden en [entrega S1](../producto/ENTREGA_S1.md); la API de listados/métricas requiere spec y revisión compartida antes de C4-006.

## Próximo trabajo
Primero validar el perfil Groq/Qwen evaluado por Grok según la [guía ordenada de integraciones](PRUEBAS_INTEGRACIONES.md). El gate final sigue siendo determinista; no hay juez Grok por cada caso. Esta revisión documental no ejecuta nuevas generaciones.

Deimer: continuar C4-002 con persistencia/API y acordar acceso a evidencia real. Santiago: preparar C4-006 contra API, después C4-008. [Backlog](BACKLOG.md).

## Pendientes humanos y límites
La organización autorizó trabajo en equipo según Deimer. Repo/tablero permanecen privados hasta nueva instrucción; publicación/licencia oficial de S1 siguen pendientes.
Se detectó una credencial en .env.example del historial remoto; se retiró de la plantilla y se conserva solo en .env local ignorado. **Rotación/revocación pendiente en el panel del titular**; sanear el archivo no revoca una clave ni borra historia compartida.
No se verificó nuevamente membresía Slack/apertura Obsidian de Santiago; no inferir confirmación por su entrega GitHub. Obsidian usa clones locales y Git, sin duplicación de documentos en Drive.
Branch protection del plan privado devolvió 403 en la preparación; no se comprobó un cambio de plan. No hay vigilancia automática ni prueba de doce horas ejecutándose.

Entrega del CLI: [PR19](https://github.com/DEIMER-PY/c4-ai/pull/19), base develop. Integrado con CI aprobada; documentación y código en develop.

CLI: progreso humano visible por etapa/respuestas y tiempo de espera; JSON permanece silencioso hasta el resultado. Ctrl+C registra cancelación con evidencia parcial (código 130). Ver spec008 para validación de la corrección.

Auditoría de las doce issues originales: C4-001, C4-004 y C4-005 cumplen su rúbrica; C4-002/003 siguen En curso y el resto pendiente con criterios separados. [Matriz y evidencia](RUBRICAS.md). Jev de TypeSafe se planifica en C4-013; sin credencial/prueba real ni rapidez demostrada.

Presentación CLI: neurona Unicode ramificada, axón segmentado, núcleo luminoso y composición lateral desde 116 columnas; fallback ASCII y vista compacta. [Spec012](../specs/012-neuron-console/spec.md). Sin cambios en llamadas o criterios del gate.

## Avance de implementaciones
- Harness persistente integrado por PR26: neurona junto a actividad, métricas desde checkpoints y JSON preservado (spec013).
- FastAPI de consulta sobre contratos v1 y mismos archivos del CLI: paginación, errores y OpenAPI. HTTP real Uvicorn: 10 incidentes locales, reporte Qwen rejected y evaluación completed; cero llamadas nuevas. [Instalación](../../apps/api/README.md).
- C4-002/003 continúan En curso: faltan escritura API, PostgreSQL/Alembic y adaptador HTTP del servicio de ejecución. C4-006 pendiente de integración de Santiago y acuerdos de listados extra; frontend sin cambios.
- Próximo incremento: persistencia/migraciones, ejecución HTTP, integración UI; después dataset30+, workers y Jev condicionado a acceso.
