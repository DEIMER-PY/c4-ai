# Tareas
Responsable Deimer/Codex. Dependencia: respuesta de Deimer y acceso Meta.
- [x] AC-001: ruta elegida y situación de cuenta identificada: solo app móvil; Deimer seleccionó Meta Cloud API con número de prueba. Adaptador/asistente presentes, credenciales ausentes según inspección local.
- [ ] AC-002: credenciales/webhook/configuración local.
- [ ] AC-003: prueba real Meta/Hermes/C4/respuesta.
- [ ] AC-004: documentación y evidencia/rollback.
  Guía, ejemplo sin secretos y diagnóstico de presencia preparados. Falta evidencia real y comprobar rollback tras activar el canal.
- [x] AC-005a: registrar MCP oficial en Codex con CLI; configuración registrada en2026-10-17.
- [x] AC-005b1: completar OAuth humano; CLI devolvió Successfully logged in y registro HTTP enabled confirmado.
- [x] AC-005b2: descubrir herramientas tras recargar Codex:11 expuestas, sin app_create. Consulta autenticada de apps devuelve0 accesibles, sin página siguiente; discovery oficial funciona.
- [ ] AC-005c: crear/configurar app de prueba y caso WhatsApp, por MCP si está disponible o dashboard Meta; sin app_id ni creación confirmada.
- [x] AC-006: diagnóstico seguro y entrada al asistente oficial implementados;5 pruebas unittest aprobadas. Deimer; scripts/whatsapp_hermes.py y tests/test_whatsapp_hermes.py. Diagnóstico real confirma adaptador/ejecutable presentes y cinco variables ausentes; no equivale a conexión Meta.

Deimer confirmó que creará la app de prueba en Meta. AC005c/AC002/AC003 siguen pendientes; no cerrar integración por completar el diagnóstico.
