# Consola con neurona de alta densidad
Estado: Verified localmente; integración sujeta a CI. Fecha: 2026-10-17. Responsable: Deimer/Codex. Tarea: C4-003, presentación de CLI.

## Intención
Deimer solicita mayor semejanza visual con la referencia: neurona ramificada a la izquierda, núcleo magenta, dendritas violeta/cian y axón hacia la esquina inferior derecha; contexto y actividad a la derecha, prompt y barra inferior.

## Requisitos y aceptación
- FR-001 / AC-001: arte original generado con caracteres Braille Unicode, ramificaciones, núcleo y axón; gradiente magenta/violeta/cian. No depender de imágenes inline, protocolo gráfico, API o descarga al abrir.
- FR-002 / AC-002: composición lateral en terminal ancha y versión compacta apilada en estrecha. Evitar desbordamientos; alternativa ASCII si la codificación no admite Braille.
- FR-003 / AC-003: mostrar versión/modelos, modo de prueba, acciones disponibles y última evidencia real; distinguir resultado anterior de actividad actual. Sin métricas simuladas ni estados connected antes de probe. Prompt con target, barra inferior y duración local.
- FR-004 / AC-004: preservar comandos, selección de proveedor y JSON. Validar suite existente, anchuras, codificación ASCII y exportación visual del renderer real. Sin nuevas generaciones.

## Fuera de alcance
Terminal fotográfica idéntica al bitmap: la densidad depende de fuente, tamaño, colores y soporte Unicode del terminal. Sin cambiar motor, contratos, dashboard ni decisiones.
