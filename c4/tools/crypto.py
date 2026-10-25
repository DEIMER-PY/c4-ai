"""Cryptographic evidence signing, verification, and non-repudiation for C4 AI."""
import hashlib
import hmac
import json
import os
from typing import Any

DEFAULT_NODE_SECRET = os.environ.get("C4_NODE_SECRET", "c4-enterprise-sovereign-node-secret-2026").encode("utf-8")


class EvidenceSigner:
    """Cryptographically signs and verifies evaluation payloads using HMAC-SHA256."""

    def __init__(self, secret_key: bytes | None = None):
        self._secret = secret_key or DEFAULT_NODE_SECRET
        # Public node identity: SHA256 of secret key, truncated to 16 hex chars
        self.node_public_id = "node_" + hashlib.sha256(self._secret).hexdigest()[:16]

    def canonicalize(self, payload: Any) -> bytes:
        """Serializes dictionary to deterministic canonical JSON bytes."""
        return json.dumps(
            payload,
            sort_keys=True,
            ensure_ascii=True,
            separators=(",", ":"),
        ).encode("utf-8")

    def sign_payload(self, payload: dict[str, Any]) -> str:
        """Computes deterministic cryptographic signature for a payload."""
        canonical_bytes = self.canonicalize(payload)
        sig = hmac.new(self._secret, canonical_bytes, hashlib.sha256).hexdigest()
        return sig

    def verify_payload(self, payload: dict[str, Any], signature: str) -> bool:
        """Verifies signature in constant time to prevent timing attacks."""
        expected = self.sign_payload(payload)
        return hmac.compare_digest(expected, signature)


_GLOBAL_SIGNER = EvidenceSigner()


def get_default_signer() -> EvidenceSigner:
    return _GLOBAL_SIGNER


def sign_evidence(payload: dict[str, Any]) -> str:
    return _GLOBAL_SIGNER.sign_payload(payload)


def verify_evidence(payload: dict[str, Any], signature: str) -> bool:
    return _GLOBAL_SIGNER.verify_payload(payload, signature)
