# Plan de Implementación: Streaming SSE y Firmas Criptográficas
ID: C4-PLAN-037. Spec: docs/specs/037-sse-streaming-and-crypto-signatures/spec.md. Responsable: DEIMER-PY.

## Fases de Implementación

### Fase 1: Motor Criptográfico (`c4/tools/crypto.py`)
1. Implementar `EvidenceSigner` utilizando HMAC-SHA256 con claves derivadas deterministas o aleatorias de nodo.
2. Definir métodos `sign_evidence(payload: dict) -> str` y `verify_signature(payload: dict, signature: str) -> bool`.
3. Soportar rotación y consulta del ID público del nodo firmante (`node_public_id`).

### Fase 2: Endpoints de Streaming SSE y Verificación en FastAPI (`c4/api.py`)
1. Implementar generador asíncrono de eventos SSE para una sesión existente o simulada.
2. Añadir endpoint `/api/v1/runs/{session_id}/stream` retornando `StreamingResponse(..., media_type="text/event-stream")`.
3. Añadir endpoints `/api/v1/signature/public-id` y `/api/v1/signature/verify`.

### Fase 3: Documentación Técnica
1. Crear `docs/arquitectura/STREAMING_Y_FIRMAS.md` detallando la especificación de eventos SSE y el protocolo de no repudio criptográfico.

### Fase 4: Pruebas y Validación Integral
1. Crear `tests/unit/test_crypto_signature.py`.
2. Crear `tests/unit/test_sse_stream.py`.
3. Actualizar `docs/specs/README.md`.
4. Validar suite completa con `unittest` y `verify_docs.py`.
