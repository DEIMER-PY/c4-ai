# Consola interactiva y aceptación del equipo
Estado: Verified localmente; integración condicionada a CI por PR hacia develop. Fecha: 2026-10-17. Responsable: Deimer/Codex. C4-003.

## Intención
Deimer quiere utilizar la CLI con la composición e identidad violeta/cian de su referencia: arte de neurona, contexto del agente, salida de herramientas y prompt persistente. No copiar porcentajes, versiones, latencias ni proveedores de la imagen como si fueran resultados de C4.

## Requisitos y aceptación
FR-001/AC-001: c4 en terminal abre consola; c4 tui es entrada explícita. Cabecera con neurona ASCII original, versión real, Grok de razonamiento y target elegido. Adaptar composición a terminal estrecha, sin red al abrir.
FR-002/AC-002: Prompt con autocompletado e historial en memoria; /help, /doctor, /target, /demo, /start, /patch, /eval, /runs, /report, /compare, /clear y /quit. Ejecutar mismos comandos/servicios existentes; no shell ni eval de código. /target no modifica modelos dentro de sesiones existentes.
FR-003/AC-003: Mostrar únicamente evidencia real por ID, soportar last para report/compare y listar costo desconocido/estados parciales. Error/cancelación no cierra la consola. EOF sale; Ctrl+C ocioso no crea trabajo. JSON sigue sin UI.
FR-004/AC-004: Auditar las 12 issues originales, actualizar rúbricas/estados y evidencias; cerrar solo criterios cumplidos (gateway, dashboard mocks y gate local), mantener API/colas/dataset/video/escala/onboarding pendiente donde falta evidencia. Dejar próximas tareas de Santiago claras. Añadir Jev de TypeSafe al plan con fuentes, condición de acceso y aceptación medible, sin afirmar integración ni rapidez verificada.
FR-005/AC-005: Pruebas de comandos, entrada no interactiva, cambio de target y recuperación tras error; ensayo PTY sin nuevas llamadas de generación y preview visual exportada desde el renderer real. CI y PR hacia develop, commits convencionales con emoji.

## Alcance
No modificar apps/dashboard ni contratos HTTP v1. No construir escritorio, sitio o video. Jev es un modelo externo de TypeSafe; requiere API/acceso y evaluación antes de habilitarlo. No reemplazarlo por porcentajes inventados de un LLM ni saltar el gate.
