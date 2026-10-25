# Qué prueba C4 y cómo decide

Cuando un agente falla, C4 puede reproducir un caso controlado, proponer un cambio declarativo y comparar baseline/candidato sobre el mismo dataset. La aceptación exige mejora del caso objetivo, ninguna regresión en casos que pasaban y controles obligatorios aprobados. Una respuesta convincente no sustituye el resultado de las pruebas.

## Tres niveles distintos

| Nivel | Qué comprueba | Estado |
| --- | --- | --- |
| Tests del software C4 | Contratos, gate, errores, chat, API, MCP | Implementados para desarrollar C4; no significan que el runtime genere tests de cualquier repo |
| Evaluaciones de comportamiento | Acciones de agentes de prueba frente al dataset y política de reembolsos | Implementadas: casos sintéticos, respuestas reales, comparación trazable |
| Runner de pruebas unitarias de repositorios | Suite autorizada del proyecto objetivo, resultado por prueba y código de salida | Planificado fuera del alcance del MVP actual |

Mensaje de producto: **«Cuando tu agente falla, C4 vuelve a probar la corrección y decide con evidencia.»** El futuro runner permitirá usar resultados de tests unitarios como otra fuente; no se afirma que hoy se ejecute código arbitrario ni que un LLM pueda declarar aceptado un cambio por opinión.

## Siguiente capacidad propuesta: runner aislado

C4-018, Deimer/Codex, Pendiente. Antes de implementarlo: spec/plan/tasks y revisión compartida. Alcance inicial sugerido: una suite ya existente en un repositorio de prueba autorizado, comandos permitidos, entorno aislado sin secretos ni red por defecto, límites de tiempo/recursos y salida estructurada. No entrenar modelos ni aplicar parches de producción.

Criterios: mismo commit/entorno para baseline y candidato, resultados por test, stdout/stderr saneados, correlación de IDs, presupuesto y cancelación. Timeout, salida inválida o suite incompleta conservan evidencia y escalan; jamás equivalen a aprobar. Pruebas de regresión, aislamiento y recuperación deben pasar antes de habilitarlo. No usar una herramienta de shell general de Hermes como sustitución del aislamiento.

## Papel previsto de JEV

[Jev de TypeSafe](JEV.md) se investigará para categoría, riesgo y prioridad. Primero en modo sombra: registrar qué recomendaría sin alterar el gate. Si el experimento justifica activar rutas, la incertidumbre debe escalar y las pruebas siguen siendo obligatorias. No hay integración, calibración ni rapidez/ahorro medidos en C4. [Fuente oficial](https://typesafe.ai/blog/introducing-system-one-models-and-jev).

## Impacto y medición

Para desarrollo: causa y diff versionado; para calidad: comparación por caso; para operaciones: reporte y decisión explicable. Son mecanismos concretos del producto. Ahorro de tiempo/costo y reducción de incidentes requieren medir contra un proceso de referencia; no extrapolar seis casos sintéticos a precisión general o ROI de clientes.

[Evaluaciones actuales](../arquitectura/EVALUACIONES.md) · [Límites y seguridad](../arquitectura/SEGURIDAD.md) · [Video ampliado](../../my-video/EXTENSION.md).
