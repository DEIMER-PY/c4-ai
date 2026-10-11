# Demo y criterios de aceptación
## Preparación documental
Enlaces locales funcionan en GitHub/Obsidian; JSON parsea; fixtures referencian IDs existentes; AGENTS y CLAUDE comparten reglas.
Cada tarea tiene responsable, dependencias, archivos y criterios. Frontend puede comenzar sin backend.
## Demo del producto futuro
1. Mostrar agente baseline fallando en reembolso fuera de plazo.
2. Ingresar traza; C4 analiza sin guía paso a paso.
3. Mostrar diagnóstico y candidato de prompt/config.
4. Ejecutar baseline/candidato sobre mismo dataset.
5. Mostrar un candidato aceptado y otro rechazado por regresión.
6. Mostrar evidencia incompleta escalada, costo conocido/desconocido y reporte.
Duración objetivo 2 min para video de S2; log completo separado.
## Evidencia necesaria
Dataset/version, agent version, job IDs, trazas saneadas, resultados por caso y decisiones.
Etiquetar simulaciones. No afirmar llamadas Grok, mejoras o ejecución de 12h hasta contar con prueba real.
## Onboarding
Santiago puede leer reglas, tomar tarea frontend y consumir fixtures.
Codex puede interpretar un PR de Claude con tarea, validación y contrato sin acceder a su chat privado.
