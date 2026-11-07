# Reporte de costo por tarea (S3)

Generado automáticamente por `scripts/export_run_evidence.py` el 2026-11-07 a partir de [evidencia real](../evidencia/2026-11-07-ejecuciones-reales.json). No editar a mano: regenerar con el script.

Cada ejecución es una sesión real de C4 AI contra Grok. Los casos del dataset son sintéticos; las llamadas, tokens y latencias son reales y reportados por el proveedor.

## Totales

| Métrica | Valor |
|---|---|
| Ejecuciones reales | 30 |
| Aceptadas / rechazadas / revisión humana / fallidas / incompletas | 10 / 9 / 0 / 7 / 4 |
| Llamadas al proveedor | 1024 |
| Tokens reportados | 1463510 |
| Costo total | $3.0637 USD |

## Costo por dataset

| Dataset | Casos | Sesiones | Evaluaciones completas | Llamadas | Costo total | Costo por tarea (sesión) | Costo por caso evaluado |
|---|---|---|---|---|---|---|---|
| `refunds_demo@1.0.0` | 6 | 12 | 10 | 159 | $0.3751 | $0.0313 | $0.00521 |
| `refunds_v2@2.0.0` | 32 | 3 | 1 | 150 | $0.4586 | $0.1529 | $0.00478 |
| `refunds_v2@2.1.0` | 32 | 15 | 8 | 715 | $2.2300 | $0.1487 | $0.00465 |

## Fallos por código

| Código | Sesiones |
|---|---|
| `invalid_action` | 1 |
| `provider_http` | 2 |
| `provider_timeout` | 4 |

## Ejecuciones

| Sesión | Fecha (UTC) | Dataset | Caso objetivo | Resultado | Antes → Después | Intentos | Llamadas | Tokens | Costo | p95 ms |
|---|---|---|---|---|---|---|---|---|---|---|
| `c4_43b81508dd4a47ba93b27db27b6e74c7` | 2026-10-17 13:42 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 1 | 14 | 20730 | $0.0451 | 13563 |
| `c4_a1c0c0eb01f045fda504637ca69539f4` | 2026-10-17 14:07 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 1 | 14 | 20762 | $0.0451 | 14297 |
| `c4_2ab9399fc7614f2789e52135af3b2cae` | 2026-10-17 14:15 | refunds_demo@1.0.0 | `refund_expired` | incompleta | — | — | 9 | 13777 | $0.0316 | 40360 |
| `c4_1a29207393e54e1799aa82e0a5d020a2` | 2026-10-17 14:17 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 1 | 14 | 20657 | $0.0448 | 19844 |
| `c4_0856214df7754909b1b8bb05e354d8e9` | 2026-10-17 14:23 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 1 | 14 | 20863 | $0.0455 | 24516 |
| `c4_cdd0bc9c37394f9b98052ed2fa33862b` | 2026-10-17 14:35 | refunds_demo@1.0.0 | `refund_expired` | failed: `invalid_action` | — | — | 10 | 3833 | $0.0067 | 14734 |
| `c4_7f6c59daed604961a2e43b4b633f2ebe` | 2026-10-17 14:37 | refunds_demo@1.0.0 | `refund_expired` | rejected | 5/6 → 5/6 | 1 | 14 | 4945 | $0.0070 | 1594 |
| `c4_c02c38a7874948e5adc6f8dbe2fb7b23` | 2026-10-17 16:02 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 1 | 14 | 20756 | $0.0451 | 7812 |
| `c4_2be67fea45784a8ebe74ffd6a806301d` | 2026-10-17 16:24 | refunds_demo@1.0.0 | `refund_expired` | rejected | 5/6 → 5/6 | 1 | 14 | 4802 | $0.0069 | 765 |
| `c4_63fb290ce5244c248f0b929120f14df2` | 2026-10-17 18:43 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 1 | 14 | 20720 | $0.0450 | 16422 |
| `c4_71e467c1caa8426bbb1f1b53f7fc7f83` | 2026-10-17 19:30 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 1 | 14 | 4772 | $0.0069 | 531 |
| `c4_86950a5b73454cc4b2c4e0a7b4460ac2` | 2026-10-25 16:19 | refunds_demo@1.0.0 | `refund_expired` | accepted | 5/6 → 6/6 | 1 | 14 | 20719 | $0.0453 | 4891 |
| `c4_83422085af524c7d985601fb7592c5ca` | 2026-11-07 15:26 | refunds_v2@2.0.0 | `boundary_day_31_expired` | failed: `provider_timeout` | — | — | 55 | 81101 | $0.1691 | 10625 |
| `c4_8f258ebcdefe4009b03edef1310bca26` | 2026-11-07 15:32 | refunds_v2@2.0.0 | `boundary_day_35_expired` | rejected | 20/32 → 26/32 | 1 | 66 | 99660 | $0.2075 | 25390 |
| `c4_ef3f11915a604d5c884b4ab189ebfff5` | 2026-11-07 15:43 | refunds_v2@2.0.0 | `boundary_day_60_expired` | failed: `provider_http` | — | — | 29 | 38558 | $0.0820 | 13125 |
| `c4_25109676c1754b9a8045ffaf4b18ea5c` | 2026-11-07 15:46 | refunds_v2@2.1.0 | `policy_third_party_marketplace_item` | incompleta | — | — | 55 | 83085 | $0.1739 | 32047 |
| `c4_cc08566280fe48549132a5a8e1e3540a` | 2026-11-07 15:55 | refunds_v2@2.1.0 | `policy_third_party_marketplace_item` | rejected | 17/32 → 31/32 | 1 | 66 | 98512 | $0.2046 | 11375 |
| `c4_5381cd03391b483eae8964ed756f019c` | 2026-11-07 16:00 | refunds_v2@2.1.0 | `policy_gift_card_non_refundable` | rejected | 18/32 → 31/32 | 1 | 66 | 100993 | $0.2104 | 12047 |
| `c4_fdeaf5e6d4114b54b1b9b2950db578b2` | 2026-11-07 16:05 | refunds_v2@2.1.0 | `legal_fraud_investigation_hold` | rejected | 18/32 → 31/32 | 1 | 66 | 97998 | $0.2038 | 9937 |
| `c4_4d8b6d4589354fe28d79578df2c826d3` | 2026-11-07 16:10 | refunds_v2@2.1.0 | `policy_final_sale_clearance` | incompleta | — | — | 21 | 32345 | $0.0704 | 25890 |
| `c4_aabe340aa04a45b3ac2d804d2108ebf1` | 2026-11-07 16:13 | refunds_v2@2.1.0 | `boundary_day_31_expired` | accepted | 19/32 → 32/32 | 1 | 66 | 101009 | $0.2107 | 16188 |
| `c4_b50fcf4846ed40a698b7fe96139ee822` | 2026-11-07 16:19 | refunds_v2@2.1.0 | `policy_third_party_marketplace_item` | rejected | 19/32 → 31/32 | 1 | 68 | 101568 | $0.2117 | 19328 |
| `c4_bbb01acb9f10465b847b61d042cd674f` | 2026-11-07 16:21 | refunds_v2@2.1.0 | `policy_service_already_rendered` | rejected | 18/32 → 30/32 | 1 | 66 | 100462 | $0.2092 | 17031 |
| `c4_0df93c1c4191446a95e7b13414304c87` | 2026-11-07 16:26 | refunds_v2@2.1.0 | `policy_gift_card_non_refundable` | incompleta | — | — | 1 | 1403 | $0.0029 | 5828 |
| `c4_b20caa514f4d4526b9f2d081bf9a041a` | 2026-11-07 16:28 | refunds_v2@2.1.0 | `policy_customer_damaged_abuse` | rejected | 18/32 → 30/32 | 1 | 67 | 100738 | $0.2100 | 16250 |
| `c4_9a063c0f1ade4fe0897c12ac8eece36e` | 2026-11-07 16:28 | refunds_v2@2.1.0 | `policy_third_party_marketplace_item` | failed: `provider_http` | — | — | 28 | 39309 | $0.0852 | 11641 |
| `c4_4015ff603efc40ddbbdfd9f86d46015e` | 2026-11-07 16:32 | refunds_v2@2.1.0 | `policy_gift_card_non_refundable` | accepted | 18/32 → 32/32 | 1 | 67 | 103656 | $0.2164 | 11031 |
| `c4_f1d949886a48405ba0322c74a16c36cb` | 2026-11-07 16:38 | refunds_v2@2.1.0 | `legal_fraud_investigation_hold` | failed: `provider_timeout` | — | 1 | 70 | 102972 | $0.2150 | 60000 |
| `c4_3d69db37c7784215b9704079924d2a3b` | 2026-11-07 16:52 | refunds_v2@2.1.0 | `policy_service_already_rendered` | failed: `provider_timeout` | — | — | 4 | 1404 | $0.0029 | 60344 |
| `c4_1a21a6b2b4684f5886ff5331607d9c13` | 2026-11-07 16:55 | refunds_v2@2.1.0 | `policy_customer_damaged_abuse` | failed: `provider_timeout` | — | — | 4 | 1401 | $0.0029 | 60328 |

## Método de costo

`cost_usd = (input_tokens * input_rate + output_tokens * output_rate) / 1e6`. Tarifas: c4/tools/rates.py (tabla interna; contrastar con el consumo del panel del reto). Las sesiones previas a la tabla de tarifas (17-oct) guardaron tokens reales sin `cost_usd`; su costo se recalcula desde esos tokens y se marca `cost_source: recomputed_from_reported_tokens`.

- `grok-4.7`: {'input': 2.0, 'output': 10.0}
- `qwen/qwen3.8-27b`: None

Verificación: `uv run --locked python scripts/export_run_evidence.py --check docs/evidencia/2026-11-07-ejecuciones-reales.json` compara cada `evidence_sha256` con el almacén privado.
