# Plan actual de Santiago
Responsable: santiagosanabria-1 + Claude. Actualizado: 2026-10-17. Ownership: apps/dashboard; contratos/decisiones compartidos.

C4-004 está terminada: PR18 integrado y revisado con 32 pruebas, build/typecheck/lint, desktop/móvil/teclado y estados alternativos. No repetir el bootstrap. [Rúbricas del equipo](RUBRICAS.md).

## Próxima feature: C4-006 / issue #6
1. Actualizar develop, revisar cambios locales y leer AGENTS/CLAUDE, ESTADO, API y las clarificaciones resueltas de spec006.
2. Preparar spec/plan/tasks para integración. Coordinar con Deimer listados de candidatos/evaluaciones y métricas/jobs antes de cambiar contratos; no existen esos endpoints aún. Backend/API es la dependencia de C4-002.
3. Implementar un adaptador HTTP detrás de C4DataSource, manteniendo las vistas y un modo Demo explícito. No leer archivos locales desde el navegador ni usar claves de modelos en frontend.
4. Validar navegación con IDs reales, trabajos pendientes/fallidos, evidencia incompleta, 404/503 y costo desconocido; polling con límite/limpieza al salir. Mostrar proveedor/modelo real solo si el contrato lo ofrece.
5. Build, typecheck, lint, pruebas y capturas desktop/móvil. PR pequeño hacia develop y revisión Deimer; no marcar integrado hasta probar UI→API→evidencia.

## Después: C4-008 / issue #8
Guion/pitch/video de unos dos minutos sobre una ejecución aceptada, una rechazada y una incompleta. Usar evidencia real con procedencia; no copiar métricas de la imagen de referencia ni generar una demo simulada. Deimer valida los resultados antes de grabar.

## Onboarding C4-011 / issue #12
La entrega GitHub/Claude y acceso al repositorio están verificados. Confirmar personalmente Slack, apertura del clon como bóveda Obsidian y lectura/acceso de las reglas en #12. No inferir esos pasos de un commit.

## Entrega y límites
Ramas santiago/feat-<id>-<tema>, Conventional Commits con emoji y PR→develop. Declarar archivos, criterio, validación y bloqueo. No editar backend/root Python ni contratos sin coordinación; Groq/Grok/Jev son integraciones del backend. Claude recibe el contexto desde Git, no del chat privado de Codex. [Prompt actualizado](PROMPT_CLAUDE.md).
