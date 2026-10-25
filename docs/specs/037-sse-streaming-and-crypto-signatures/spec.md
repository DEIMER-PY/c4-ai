# Streaming SSE en Tiempo Real y Firma Criptográfica de Evidencia
ID: C4-CORE-037. Estado: Draft. Responsable: DEIMER-PY. Revisores: Santiago/Claude.

## Problema y Contexto
Tras la auditoría integral de arquitectura, se identificaron dos requisitos críticos para la experiencia de usuario y la integridad probatoria de C4 AI en entornos empresariales:
1. **Streaming Reactivo en Tiempo Real (Server-Sent Events)**: Actualmente, la API de C4 AI solo ofrece endpoints estáticos que leen checkpoints cerrados. Los operadores de confiabilidad y jurados que observan una corrida deben esperar hasta que el ciclo concluya o refrescar manualmente. Se requiere un canal SSE unidireccional de baja latencia (`/api/v1/runs/{session_id}/stream`) que emita eventos granulares en vivo (etapas, evaluación caso a caso, cálculo de tokens y veredicto del gate).
2. **Firma Criptográfica y No Repudio de Reportes**: Los reportes y veredictos del gate determinista están sellados con Merkle roots, pero carecen de una firma criptográfica emitida por el nodo de ejecución (`node_id` y `signature`). Un motor de firma criptográfica permite a auditores externos certificar de forma matemática e independiente que la evidencia no fue manipulada en tránsito ni alterada a posteriori.

## Alcance
- **Incluido**:
  - Motor criptográfico en `c4/tools/crypto.py`:
    - Generación y gestión de claves de nodo criptográficas.
    - Firma determinista de reportes y pruebas de integridad (`IntegrityProof`).
    - Verificación matemática de firmas (`verify_signature`).
    - Endpoint `/api/v1/signature/public-id` y `/api/v1/signature/verify`.
  - Endpoint de streaming SSE en `c4/api.py`:
    - `/api/v1/runs/{session_id}/stream`: Emite flujo continuo `text/event-stream` con eventos `init`, `stage`, `case_eval`, `verdict` y `done`.
  - Documentación de arquitectura en `docs/arquitectura/STREAMING_Y_FIRMAS.md`.
  - Pruebas unitarias completas:
    - `tests/unit/test_crypto_signature.py`
    - `tests/unit/test_sse_stream.py`
  - Registro de la especificación en `docs/specs/README.md`.
- **Excluido**:
  - Dependencias binarias externas pesadas (se utiliza criptografía determinista de la biblioteca estándar de Python 3.12 con HMAC-SHA256 y tokens criptográficos).

## Requisitos
- **FR-001 (Motor de Firma)**: `c4/tools/crypto.py` implementa `sign_evidence(payload: dict) -> str` y `verify_evidence(payload: dict, signature: str) -> bool`.
- **FR-002 (Streaming SSE)**: `c4/api.py` expone `/api/v1/runs/{session_id}/stream` con cabeceras `Cache-Control: no-cache` y eventos estructurados `event: <tipo>\ndata: <json>\n\n`.
- **FR-003 (Endpoints de Verificación)**: `c4/api.py` provee `/api/v1/signature/verify` y `/api/v1/signature/public-id`.
- **FR-004 (Documentación de Flujo)**: `docs/arquitectura/STREAMING_Y_FIRMAS.md` describe los protocolos y formatos de evento.
- **FR-005 (Pruebas Automatizadas)**: 100% de cobertura en pruebas unitarias para streaming y firmas.

## Criterios de Aceptación
- **AC-001**: `verify_evidence` retorna True para cargas legítimas y False ante cualquier alteración de un byte en el payload.
- **AC-002**: El endpoint SSE transmite los eventos ordenados de la sesión y finaliza con `event: done`.
- **AC-003**: Todas las pruebas unitarias aprueban y `scripts/verify_docs.py` pasa sin errores.

## Dudas Bloqueantes
- Ninguna.
