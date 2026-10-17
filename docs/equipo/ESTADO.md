# Estado de C4 AI
Actualizado: 2026-10-17.

## Producto y evidencia
- **Verificada:** CLI end to end con Grok, sobre seis casos sintéticos. Baseline 5/6, candidato 6/6, cero regresiones, tres casos de seguridad aprobados; 14 llamadas, 20.730 tokens reportados. [Evidencia y rúbricas](../producto/ENTREGA_S1.md).
- **Verificados:** contratos Pydantic v1, 15 pruebas originales. Las 36 pruebas actuales verifican contratos, servicio, gate, fallos, límites, CLI, Unicode de Windows y lectura entre procesos; ver spec007.
- **Verificada como demo:** C4-004 dashboard de Santiago, integrado por [PR18](https://github.com/DEIMER-PY/c4-ai/pull/18), con fixtures sintéticos. Build y 32 pruebas aprobados; typecheck/lint aprobados. Revisión de navegador y cierre de criterios registrados en entrega S1.
- **Planificados:** FastAPI, PostgreSQL/Alembic, Redis/RQ, API real para dashboard, instaladores/escritorio y prueba de carga. El almacén del CLI es local con checkpoints, no una DB distribuida.

## Flujo y acceso
Repositorio y tablero privados; rama predeterminada develop. Features independientes, commits convencionales con emoji y PR hacia develop. PR19 integrado en develop (95c0ed3). La corrección de progreso/cancelación se especifica en [spec008](../specs/008-cli-progress/spec.md). No hay cambios incompatibles de contratos v1.
Santiago conserva ownership frontend. No se alteró su código durante esta revisión. Las dudas CL-001–005 se responden en [entrega S1](../producto/ENTREGA_S1.md); la API de listados/métricas requiere spec y revisión compartida antes de C4-006.

## Próximo trabajo
Deimer: continuar C4-002 con persistencia/API y acordar acceso a evidencia real. Santiago: preparar C4-006 contra API, después C4-008. [Backlog](BACKLOG.md).

## Pendientes humanos y límites
La organización autorizó trabajo en equipo según Deimer. Repo/tablero permanecen privados hasta nueva instrucción; publicación/licencia oficial de S1 siguen pendientes.
Se detectó una credencial en .env.example del historial remoto; se retiró de la plantilla y se conserva solo en .env local ignorado. **Rotación/revocación pendiente en el panel del titular**; sanear el archivo no revoca una clave ni borra historia compartida.
No se verificó nuevamente membresía Slack/apertura Obsidian de Santiago; no inferir confirmación por su entrega GitHub. Obsidian usa clones locales y Git, sin duplicación de documentos en Drive.
Branch protection del plan privado devolvió 403 en la preparación; no se comprobó un cambio de plan. No hay vigilancia automática ni prueba de doce horas ejecutándose.

Entrega del CLI: [PR19](https://github.com/DEIMER-PY/c4-ai/pull/19), base develop. Integrado con CI aprobada; documentación y código en develop.

CLI: progreso humano visible por etapa/respuestas y tiempo de espera; JSON permanece silencioso hasta el resultado. Ctrl+C registra cancelación con evidencia parcial (código 130). Ver spec008 para validación de la corrección.
