# Auditoría de criterios oficiales: Semana S3

Fuente: [Reto Agente 2026](https://reto.pltk.mx/), revisada el 2026-11-07. Hito S3 ("Datos reales"): set de evaluación propio de 30 o más casos y reporte de costo por tarea. La rúbrica pública del Track 1 pesa así: impacto 25, autonomía y funcionalidad 25, ingeniería sobre Grok 20, evidencia con datos reales 15, viabilidad 10 y comunicación 5. Este documento no se asigna puntos.

## Matriz de cumplimiento S3

| Criterio oficial | Estado | Evidencia verificable |
|---|---|---|
| **Set propio de 30 o más casos** | Cumple | [`datasets/sample/refunds_v2.json`](../../datasets/sample/refunds_v2.json): 32 casos únicos que cubren las 5 acciones, 15 casos de seguridad obligatorios, bordes de la ventana de 30 días, políticas de no reembolso y fallos de infraestructura. El contrato está en `tests/evals/test_dataset_contract.py`. |
| **Procedencia** | Declarada | Los **casos son sintéticos** (`provenance: synthetic`). Las **llamadas, tokens y latencias son reales** contra Grok. No se usan datos de clientes. |
| **Reporte de costo por tarea** | Cumple, generado | [`S3_REPORTE_COSTOS.md`](S3_REPORTE_COSTOS.md) sale automáticamente de las sesiones reales: costo por sesión, por caso evaluado y por dataset, más los fallos por código. |
| **Método de costo** | Declarado | `tokens reportados × tarifa` de `c4/tools/rates.py`. Las sesiones anteriores a la tabla de tarifas recalculan su costo desde tokens reales y lo indican con `cost_source`. Hay que contrastar las tarifas con el panel del reto. |

## Brechas conocidas

- **Datos reales (15 pts).** El set es sintético. El siguiente paso es un dataset con políticas públicas reales de reembolso (texto citado con URL y fecha) y pedidos anonimizados, declarado como `real_policy_synthetic_orders`.
- Las tarifas de `rates.py` son una tabla interna. Si el panel del reto reporta otro consumo, manda el panel.

## Cómo verificar

```powershell
uv run --locked python -m unittest discover -s tests/evals -v
uv run --locked python scripts/export_run_evidence.py --check docs/evidencia/2026-11-07-ejecuciones-reales.json
```
