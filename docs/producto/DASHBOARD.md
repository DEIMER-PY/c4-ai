# Dashboard — definición para Santiago
Estado: planificado; primera interfaz usa fixtures sintéticos.
## Navegación
Overview, Agents, Incidents, Patch queue, Evaluations, Security y Reports.
## Flujo principal
Elegir incidente → ver traza/diagnóstico → inspeccionar diff baseline/candidato → comparar casos → consultar decisión y evidencia.
## Pantallas mínimas
Overview: jobs por estado, pass rate con tamaño de muestra, regresiones y costo con cobertura conocida.
Incidents: categoría, severidad, estado, agente/version y fecha; detalle con pasos, errores y referencias.
Patch queue: diff y estado; sin botón de aplicar a producción.
Evaluations: before/after, conteos, casos por ID, regresiones, seguridad y dataset/version.
Reports: decisión final, motivo y exportación futura.
## Estados UX
Carga, lista vacía, recurso ausente, error recuperable, job pendiente, proveedor fallido, evidencia incompleta.
Usar null como Desconocido en costos; valores sintéticos llevan etiqueta Demo.
No mostrar éxito cuando job está queued/running ni evaluación failed.
## Diseño
Panel sobrio con sidebar, tarjetas y tabla; contraste accesible, navegación teclado, texto además de color para severidad.
Desktop como prioridad de demo; móvil sin pérdida de información crítica. Evitar gráficos decorativos sin evidencia.
## Primera tarea
Construir vistas de lectura sobre examples/contracts/api-responses.json. No depender de Grok ni secretos para frontend.
Tipar datos contra schemas y documentar endpoint pendiente de integrar.
