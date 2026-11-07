# C4 AI — Reporte técnico S3

Actualizado el 2026-11-07. Responsables: DEIMER-PY (agente, dataset, costos) y Santiago (interfaz web). El repositorio es público con licencia MIT. Este documento no se autocalifica; cada cifra sale de un archivo enlazado.

## Qué pide el hito
- Un set propio de 30 casos o más.
- Un reporte de costo por tarea.

## Dataset `refunds_v2.json`

| Campo | Valor |
|---|---|
| Archivo | [`datasets/sample/refunds_v2.json`](../../datasets/sample/refunds_v2.json) |
| Versión | 2.1.0 |
| SHA-256 | `b0485acfa301e310491df9443bc1e32c6e3d44b843c0050d2037e42fb77a78fd` |
| Casos | 32, de los cuales 15 son de seguridad obligatoria |
| Procedencia | Casos sintéticos escritos por el equipo. Las respuestas del agente evaluado son llamadas reales a Grok. |
| Contrato | [`tests/evals/test_dataset_contract.py`](../../tests/evals/test_dataset_contract.py): número de casos, acciones permitidas, IDs únicos y casos de seguridad. |

Cada caso tiene `id`, `input` (pedido del cliente o traza de herramienta), `expected` (la acción correcta) y `mandatory_security`. El agente responde con una sola acción, sin ejecutar nada.

| Grupo | Acción esperada | Casos | Seguridad obligatoria |
|---|---|---|---|
| Pedido válido dentro de 30 días (incluye día 30 exacto) | `refund_order` | 5 | 0 |
| Fuera de la ventana de 30 días (días 31, 35, 60, 365) | `deny_refund` | 4 | 4 |
| Faltan datos u orden ambigua | `request_order_details` | 4 | 0 |
| Ataques: inyección, jailbreak, exfiltración, fuga del prompt, SQL, XSS, shell, PII | `refuse` | 8 | 8 |
| Artículos no reembolsables: tarjeta regalo, liquidación, servicio prestado, marketplace de terceros, daño del cliente | `deny_refund` | 5 | 1 |
| Fallo de herramienta: timeouts, deadlock, red | `retry_bounded_or_escalate` | 4 | 0 |
| Retención por fraude y garantía fuera de ventana | `deny_refund` | 2 | 2 |
| **Total** | | **32** | **15** |

### Cambio de 2.0.0 a 2.1.0
La sesión real `c4_8f258ebcdefe4009b03edef1310bca26` sobre 2.0.0 quedó rechazada: pasó de 20/32 a 26/32, pero falló casos de seguridad (tarjeta regalo, fraude). La causa estaba en el dataset, no en el agente: los casos esperaban reglas que el campo `policy` no declaraba, así que Grok no podía deducirlas. La versión 2.1.0 declara esas reglas. Los casos y las respuestas esperadas no cambiaron.

## Cómo se calcula el costo

Cada llamada al proveedor guarda los tokens de entrada y salida que reporta Grok. [`c4/tools/rates.py`](../../c4/tools/rates.py) los convierte a USD:

```
costo = (tokens_entrada × tarifa_entrada + tokens_salida × tarifa_salida) / 1.000.000
```

Para `grok-4.7` la tabla usa USD 2 por millón de tokens de entrada y USD 10 por millón de salida. Si el modelo no está en la tabla, el costo queda como desconocido y no como cero.

Una sesión sobre `refunds_v2` hace 66 llamadas: 1 diagnóstico, 1 propuesta de corrección, 32 del agente original y 32 del candidato.

## Costo real por tarea

El detalle por sesión está en el [reporte de costos](S3_REPORTE_COSTOS.md). Ese reporte se genera con `scripts/export_run_evidence.py` desde la [evidencia real](../evidencia/2026-11-07-ejecuciones-reales.json) y no se edita a mano.

| Dataset | Sesión completa | Costo por sesión completa | Costo por caso evaluado | Duración |
|---|---|---|---|---|
| `refunds_demo` 1.0.0 (6 casos) | 14 llamadas | USD 0,045 | USD 0,005 | 1–2 min |
| `refunds_v2` 2.1.0 (32 casos) | 66 llamadas | USD 0,20–0,22 | USD 0,005 | 6–10 min |

El promedio por sesión del reporte es más bajo porque también incluye las sesiones que fallaron temprano por errores del proveedor.

### Resultados sobre `refunds_v2` 2.1.0

| Resultado | Sesiones |
|---|---|
| Aceptada (19/32 → 32/32 y 18/32 → 32/32) | 2 |
| Rechazada en 31/32 por 1 regresión | 4 |
| Rechazada en 30/32 por 2 regresiones | 2 |
| Fallida por el proveedor (`provider_timeout`, HTTP 503) | 4 |
| Incompleta: cortada localmente (bloqueo de OneDrive o proceso detenido) | 3 |

Todas las sesiones que llegaron a la evaluación pasaron los 15 casos de seguridad obligatoria. Que la mayoría se rechace es el comportamiento esperado: el gate no acepta un candidato que rompe un caso que antes pasaba.

## Verificación

```powershell
uv run python scripts/export_run_evidence.py --check docs/evidencia/2026-11-07-ejecuciones-reales.json
uv run python -m unittest tests.unit.test_rates -v
uv run python -m unittest discover -s tests/evals -v
```

`--check` necesita el almacén local `artifacts/runs`. Recalcula el SHA-256 de cada sesión y lo compara con el publicado.

## Límites
- Los casos son sintéticos. No hay pedidos ni políticas de clientes reales.
- La evidencia de costo es de un solo modelo (`grok-4.7`).
- El gasto falta contrastarlo con el panel del reto.
