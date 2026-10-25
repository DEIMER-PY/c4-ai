"""Enterprise compliance schemas for OWASP LLM Top 10, EU AI Act, and SOC 2 Type II."""
from datetime import UTC, datetime
from typing import Annotated, Any, Literal

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field, StringConstraints, field_validator

Text = Annotated[str, StringConstraints(min_length=1, strict=True)]

OwaspControlId = Literal[
    "LLM01_prompt_injection",
    "LLM02_insecure_output",
    "LLM03_training_poisoning",
    "LLM04_model_dos",
    "LLM05_supply_chain",
    "LLM06_sensitive_disclosure",
    "LLM07_insecure_plugin",
    "LLM08_excessive_agency",
    "LLM09_overreliance",
    "LLM10_model_theft",
]

ComplianceStatus = Literal["compliant", "mitigated", "not_applicable", "non_compliant"]

EuAiActRiskCategory = Literal["unacceptable_risk", "high_risk", "transparency_risk", "minimal_risk"]

Soc2TrustCriteria = Literal[
    "security",
    "availability",
    "processing_integrity",
    "confidentiality",
    "privacy",
]


class ComplianceContract(BaseModel):
    model_config = ConfigDict(extra="forbid", validate_assignment=True)

    @field_validator("*", mode="after")
    @classmethod
    def utc_dates(cls, value: Any) -> Any:
        return value.astimezone(UTC) if isinstance(value, datetime) else value


class OwaspCheck(ComplianceContract):
    """Validation check against OWASP Top 10 for Large Language Model Applications."""
    control_id: OwaspControlId
    name: Text
    status: ComplianceStatus
    mitigation_mechanism: Text
    evidence_ref: Text | None = None


class EuAiActAssessment(ComplianceContract):
    """Conformity evaluation against EU Artificial Intelligence Act requirements for high-risk autonomous agents."""
    system_classification: EuAiActRiskCategory = "high_risk"
    human_oversight_enforced: bool = True  # Article 14: Human-in-the-loop gate
    risk_management_active: bool = True    # Article 9: Continuous risk management
    data_governance_documented: bool = True  # Article 10: High quality datasets and bias detection
    technical_documentation_complete: bool = True  # Article 11: Comprehensive specs and SDD
    record_keeping_logging_active: bool = True  # Article 12: Automatic event logging
    accuracy_robustness_cybersecurity: bool = True  # Article 15: Deterministic harness gate
    assessed_at: AwareDatetime


class Soc2Control(ComplianceContract):
    """Verification entry for SOC 2 Type II Trust Services Criteria."""
    trust_criteria: Soc2TrustCriteria
    control_id: Text
    description: Text
    implemented: bool
    audit_evidence: Text
