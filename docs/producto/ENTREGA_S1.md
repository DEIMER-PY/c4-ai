# Entrega y rúbrica del reto
Revisión: 2026-10-17. Fuente oficial [reto.pltk.mx](https://reto.pltk.mx/), HTTP 200 consultado hoy; copia pública local en artifacts, fuera de Git. Repo y tablero continúan privados por decisión de Deimer. La participación en equipo fue autorizada según confirmación de Deimer.

## Evidencia de hoy
CLI end to end contra el gateway Grok: sesión c4_43b81508dd4a47ba93b27db27b6e74c7, modelo grok-4.7, 14 solicitudes HTTP exitosas, 20.730 tokens reportados en total, 104,703 segundos desde creación hasta reporte. Dataset refunds_demo 1.0.0, seis casos sintéticos. Baseline 5/6, candidato 6/6, cero regresiones, tres controles obligatorios aprobados, decisión accepted sobre una **versión de prueba**. No se ejecutó un reembolso real ni se modificó producción.

[Evidencia JSON completa saneada](../evidencia/2026-10-17-cli.json): prompts, diff, resultados por caso, respuestas y consumo. Checksum dataset: 4a4fa1825fc074db06377f7d9bc51861dbceb62b4f829c88499472603edc8239. Costo USD desconocido, no estimado sin tarifas. La prueba de conexión separada consumió otra solicitud (1262 tokens de entrada y 5 de salida); no se cuenta dentro de las 14 del ciclo.

Validación local final: 33 pruebas backend, 32 pruebas frontend, build/typecheck/lint y enlaces/fixtures/SVG aprobados.

La primera impresión de JSON en PowerShell falló por codificación cp1252 después de guardar el reporte. Se corrigió la salida a JSON con escapes Unicode; report recupera la ejecución sin nuevas llamadas. Esa corrección de presentación no altera la evidencia ni requiere repetir la ejecución.

## Hitos oficiales y pendientes
| Hito | Requisito publicado | Estado de C4 AI / siguiente acción |
|---|---|---|
| S1 | End to end con Grok, repo público y README del problema | Ciclo CLI real y README disponibles; publicación/licencia abierta **pendientes de decisión de Deimer**. No declarar S1 aceptado por la organización |
| S2 | Tres herramientas, errores, diez ejecuciones y video de dos minutos | Inspector/propuesta/evaluación controlados disponibles y fallos cubiertos en pruebas; faltan diez ejecuciones reales documentadas y video. Una sesión con 14 llamadas no equivale a diez ejecuciones |
| S3 | Set propio de 30+ casos y costo por tarea | Solo seis casos sintéticos; ampliar/procedencia y calcular costos con tarifas verificadas |
| S4 | 1.000 unidades, doce horas desatendido y bitácora | Pendientes workers, idempotencia, recuperación, presupuesto, prueba real de escala y bitácora |

## Track 1: pesos públicos, sin autoasignarnos puntos
| Rúbrica | Peso | Evidencia actual | Brecha |
|---|---:|---|---|
| Impacto del problema | 25 | PRD y demo de fallo de política | Validación con usuarios y ejemplos representativos |
| Autonomía y funcionalidad | 25 | Ciclo CLI acotado completo | Recuperación, variedad de incidentes y diez ejecuciones |
| Ingeniería sobre Grok | 20 | Gateway real, JSON validado, límites y consumo | Contrato de tarifas, fallos reales medidos y mejores controles de presupuesto |
| Evidencia con datos reales | 15 | Respuestas reales sobre seis inputs sintéticos | 30+ casos propios con procedencia; no llamar datos de clientes a los mocks |
| Viabilidad | 10 | Stack/roles/roadmap | Usuarios objetivo, unit economics y validación |
| Comunicación | 5 | Documentación y dashboard de demostración | Video/pitch e instalación para evaluador |

La página publica umbrales de 60 para revisión humana y 80 para finalista; el puntaje corresponde al evaluador, no a nuestras pruebas. Las fechas de entrega individuales deben confirmarse en el panel/comunicación oficial; no se infiere un nuevo calendario de esta tabla.

## Revisión de Santiago: C4-004
[PR18](https://github.com/DEIMER-PY/c4-ai/pull/18) está integrado en develop. Incluye shell accesible, overview, incidentes/detalle, comparación, estados alternativos y fixtures tipados. El PR conservó vacía la plantilla de descripción: completar evidencia/resumen en futuras entregas para que el reviewer pueda evaluar aceptación.

CL-001: aprobado agrupar candidatos/reportes por incident_id **solo en el adaptador demo**. Para C4-006 acordar listados paginados de candidatos y evaluaciones; el contrato v1 actual sigue sin esos endpoints. Los tres reportes sintéticos de un incidente son alternativas demo, no tres resultados reales del mismo trabajo.

CL-002: aprobado overview derivado de fixtures, con Demo visible. No inventar un esquema de GET /metrics ni afirmar consumo de una API real. Listado de jobs/contrato de métricas se define en una nueva spec conjunta antes de C4-006.

CL-003: mostrar run_id y omitir fecha/agente donde no existe información; no inventarla. CL-004: costo de Run nullable; desconocido sigue visible como tal. CL-005: total cero muestra Sin datos.

La aprobación de estas soluciones de mocks no añade endpoints al contrato compartido. Revisión 2026-10-17: build, typecheck, lint y 32 pruebas locales aprobadas. Navegación de resumen a incidente/comparación aceptada y rechazada, revisión humana, lista vacía, error 503 y enlace Saltar al contenido verificados en navegador. Capturas observadas en escritorio y viewport 390×844; viewport restaurado. C4-004 cumple esta entrega con mocks; no equivale a C4-006. #12 conserva pendientes humanos de onboarding.

## Secuencia inmediata
Deimer: concluir evidencia/CI/PR de CLI, continuar C4-002 (DB/API), acordar endpoints y facilitar evidencia a Santiago. Santiago: revisar C4-004 y preparar spec de C4-006 contra API real; después C4-008 video/pitch. Ambos: revisión de contratos y decisión futura sobre licencia/publicación.

Escritorio, Hermes y sitio explicativo quedan después de esta entrega; [evaluación técnica](../decisiones/ADR-002-desktop.md). No se anuncian instaladores, API real ni integración frontend que todavía no existen.
