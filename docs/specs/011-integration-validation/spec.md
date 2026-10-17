# Validación ordenada Groq → Grok → evidencia
Estado: Ready. Fecha: 2026-10-17. Responsable: Deimer/Codex. Vinculada a C4-003.

## Intención y alcance
Deimer solicita consolidar Groq como agente evaluado y Grok como analista, y probar las integraciones existentes antes de implementar nuevas capacidades. Entrega documental, sin modificar contratos ni comportamiento runtime.

## Requisitos y aceptación
- FR-001 / AC-001: explicar qué ejecuta Groq, qué analiza Grok y qué decide el gate de Python; distinguir diagnóstico de un juez semántico por caso que aún no existe.
- FR-002 / AC-002: guía ordenada con selección explícita de Groq, configuración sin secretos, doctor sin red, probe opcional, consola, una ejecución completa y consulta de evidencia. Separar alternativa por etapas para evitar duplicar llamadas.
- FR-003 / AC-003: documentar códigos de salida, rechazo válido, llamadas previstas, dashboard con fixtures y capacidades pendientes. Enlazar desde README, índice y estado.
- FR-004 / AC-004: verificar enlaces/fixtures, configuración local sin probe y existencia de la evidencia de referencia. Registrar resultados en tasks.md; publicación por PR hacia develop.

## Límites
No lanzar nuevas generaciones para esta entrega, integrar Jev ni implementar API/DB. Los resultados previos no garantizan aceptación en ejecuciones futuras.
