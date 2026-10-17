# Harness con actividad persistente
Estado: Verified; CI aprobada en PR26. Responsable: Deimer/Codex. C4-003. Fecha: 2026-10-17.

FR-001 / AC-001: durante comandos de ejecución en TUI, mantener neurona a la izquierda y contexto, etapas y respuestas guardadas a la derecha; refrescar tiempo de espera sin crear llamadas nuevas.
FR-002 / AC-002: mostrar sesión, proveedor, estado, tokens, latencia acumulada de llamadas registradas y decisión desde checkpoints reales. Distinguir tiempo local de latencia del modelo; costo desconocido permanece desconocido. No copiar porcentajes de la referencia.
FR-003 / AC-003: mantener salida normal de subcomandos y JSON, cancelación y mismos servicios. Pantallas pequeñas apilan; no capturar teclado durante ejecución ni cambiar el tema global del terminal.
FR-004 / AC-004: verificar en pruebas integración del observador, fallo/cancelación y selección de target; exportar y revisar renderer sin llamadas reales.

La referencia es una imagen raster; el diseño utiliza caracteres Unicode para compatibilidad con terminales. No se promete reproducción fotográfica ni se inventan estados connected.
