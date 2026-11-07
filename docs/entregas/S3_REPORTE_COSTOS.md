# Reporte de costo por tarea (S3)

Generado automáticamente por `scripts/export_run_evidence.py` el 2026-11-07 a partir de [evidencia real](../evidencia/2026-11-07-ejecuciones-reales.json). No editar a mano: regenerar con el script.

Cada ejecución es una sesión real de C4 AI contra Grok. Los casos del dataset son sintéticos; las llamadas, tokens y latencias son reales y reportados por el proveedor.

## Totales

| Métrica | Valor |
|---|---|
| Ejecuciones reales | 15 |
| Aceptadas / rechazadas / revisión humana / fallidas / incompletas | 8 / 3 / 0 / 2 / 2 |
| Llamadas al proveedor | 281 |
| Tokens reportados | 359488 |
| Costo total | $0.7546 USD |

## Costo por dataset

| Dataset | Casos | Sesiones | Evaluaciones completas | Llamadas | Costo total | Costo por tarea (sesión) | Costo por caso evaluado |
|---|---|---|---|---|---|---|---|
| `refunds_demo@1.0.0` | 6 | 12 | 10 | 159 | $0.3751 | $0.0313 | $0.00521 |
| `refunds_v2@2.0.0` | 32 | 3 | 1 | 122 | $0.3794 | $0.1265 | $0.00395 |

## Fallos por código

| Código | Sesiones |
|---|---|
| `invalid_action` | 1 |
| `provider_timeout` | 1 |

## Ejecuciones

| Sesión | Fecha (UTC) | Dataset | Caso objetivo | Resultado | Antes → Después | Llamadas | Tokens | Costo | p95 ms |
|---|---|---|---|---|---|---|---|---|---|
| `c4_43b81508dd4a47ba93b27db27b6e74c7` | 2026-10-17 13:42 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 14 | 20730 | $0.0451 | 13563 |
| `c4_a1c0c0eb01f045fda504637ca69539f4` | 2026-10-17 14:07 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 14 | 20762 | $0.0451 | 14297 |
| `c4_2ab9399fc7614f2789e52135af3b2cae` | 2026-10-17 14:15 | refunds_demo@1.0.0 | `refund_expired` | incompleta | — | 9 | 13777 | $0.0316 | 40360 |
| `c4_1a29207393e54e1799aa82e0a5d020a2` | 2026-10-17 14:17 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 14 | 20657 | $0.0448 | 19844 |
| `c4_0856214df7754909b1b8bb05e354d8e9` | 2026-10-17 14:23 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 14 | 20863 | $0.0455 | 24516 |
| `c4_cdd0bc9c37394f9b98052ed2fa33862b` | 2026-10-17 14:35 | refunds_demo@1.0.0 | `refund_expired` | failed: `invalid_action` | — | 10 | 3833 | $0.0067 | 14734 |
| `c4_7f6c59daed604961a2e43b4b633f2ebe` | 2026-10-17 14:37 | refunds_demo@1.0.0 | `refund_expired` | rejected | 5/6 → 5/6 | 14 | 4945 | $0.0070 | 1594 |
| `c4_c02c38a7874948e5adc6f8dbe2fb7b23` | 2026-10-17 16:02 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 14 | 20756 | $0.0451 | 7812 |
| `c4_2be67fea45784a8ebe74ffd6a806301d` | 2026-10-17 16:24 | refunds_demo@1.0.0 | `refund_expired` | rejected | 5/6 → 5/6 | 14 | 4802 | $0.0069 | 765 |
| `c4_63fb290ce5244c248f0b929120f14df2` | 2026-10-17 18:43 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 14 | 20720 | $0.0450 | 16422 |
| `c4_71e467c1caa8426bbb1f1b53f7fc7f83` | 2026-10-17 19:30 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 14 | 4772 | $0.0069 | 531 |
| `c4_86950a5b73454cc4b2c4e0a7b4460ac2` | 2026-10-25 16:19 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 14 | 20719 | $0.0453 | 4891 |
| `c4_83422085af524c7d985601fb7592c5ca` | 2026-11-07 15:26 | refunds_v2@2.0.0 | `boundary_day_31_expired` | failed: `provider_timeout` | — | 55 | 81101 | $0.1691 | 10625 |
| `c4_8f258ebcdefe4009b03edef1310bca26` | 2026-11-07 15:32 | refunds_v2@2.0.0 | `boundary_day_35_expired` | rejected | 20/32 → 26/32 | 66 | 99660 | $0.2075 | 25390 |
| `c4_ef3f11915a604d5c884b4ab189ebfff5` | 2026-11-07 15:43 | refunds_v2@2.0.0 | `boundary_day_60_expired` | incompleta | — | 1 | 1391 | $0.0028 | 11984 |

## Método de costo

`cost_usd = (input_tokens * input_rate + output_tokens * output_rate) / 1e6`. Tarifas: c4/tools/rates.py (tabla interna; contrastar con el consumo del panel del reto). Las sesiones previas a la tabla de tarifas (17-oct) guardaron tokens reales sin `cost_usd`; su costo se recalcula desde esos tokens y se marca `cost_source: recomputed_from_reported_tokens`.

- `grok-4.7`: {'input': 2.0, 'output': 10.0}
- `qwen/qwen3.8-27b`: None

Verificación: `uv run --locked python scripts/export_run_evidence.py --check docs/evidencia/2026-11-07-ejecuciones-reales.json` compara cada `evidence_sha256` con el almacén privado.
