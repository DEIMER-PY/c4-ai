"""Cryptographic audit and immutable data integrity schemas for C4 AI."""
import hashlib
import json
from datetime import UTC, datetime
from typing import Annotated, Any, Literal

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field, StringConstraints, field_validator

Sha256Hex = Annotated[str, StringConstraints(pattern=r"^[a-f0-9]{64}$", strict=True)]
Text = Annotated[str, StringConstraints(min_length=1, strict=True)]
AuditAction = Literal[
    "incident_detected",
    "diagnosis_completed",
    "patch_generated",
    "evaluation_executed",
    "gate_verdict_rendered",
    "session_exported",
]


class AuditContract(BaseModel):
    model_config = ConfigDict(extra="forbid", validate_assignment=True)

    @field_validator("*", mode="after")
    @classmethod
    def utc_dates(cls, value: Any) -> Any:
        return value.astimezone(UTC) if isinstance(value, datetime) else value


class AuditLogEntry(AuditContract):
    """Immutable single audit record sealed with cryptographic hash."""
    entry_id: Text
    timestamp: AwareDatetime
    session_id: Text
    actor: Text
    action: AuditAction
    resource_type: Literal["trace", "prompt", "dataset", "evidence", "verdict"]
    resource_hash: Sha256Hex
    signature: Text | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)

    def calculate_entry_hash(self) -> str:
        """Deterministically hashes core audit payload for chaining."""
        payload = {
            "entry_id": self.entry_id,
            "timestamp": self.timestamp.isoformat(),
            "session_id": self.session_id,
            "actor": self.actor,
            "action": self.action,
            "resource_type": self.resource_type,
            "resource_hash": self.resource_hash,
        }
        raw = json.dumps(payload, sort_keys=True, ensure_ascii=True).encode("utf-8")
        return hashlib.sha256(raw).hexdigest()


class IntegrityProof(AuditContract):
    """Cryptographic chain-of-custody proof for an evaluation session."""
    session_id: Text
    dataset_hash: Sha256Hex
    baseline_prompt_hash: Sha256Hex
    candidate_prompt_hash: Sha256Hex
    verdict_hash: Sha256Hex
    merkle_root: Sha256Hex
    verified_at: AwareDatetime
    is_valid: bool = True

    @classmethod
    def compute_root(cls, dataset_h: str, baseline_h: str, candidate_h: str, verdict_h: str) -> str:
        combined = f"{dataset_h}:{baseline_h}:{candidate_h}:{verdict_h}".encode("utf-8")
        return hashlib.sha256(combined).hexdigest()
