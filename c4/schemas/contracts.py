"""Typed wire contracts v1; no provider calls or production actions."""
from datetime import UTC, datetime
from typing import Annotated, Any, Literal, Self

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field, StrictBool, StringConstraints, field_validator, model_validator

Text = Annotated[str, StringConstraints(min_length=1, strict=True)]
Count = Annotated[int, Field(ge=0, strict=True)]
Cost = Annotated[float, Field(ge=0, strict=True, allow_inf_nan=False)]
Decision = Literal["accepted", "rejected", "needs_human_review"]


class Contract(BaseModel):
    model_config = ConfigDict(extra="forbid", validate_assignment=True)

    @field_validator("*", mode="after")
    @classmethod
    def utc_dates(cls, value: Any) -> Any:
        return value.astimezone(UTC) if isinstance(value, datetime) else value


class Agent(Contract):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: Text
    name: Text
    version: Text
    prompt_ref: Text
    config_ref: Text
    created_at: AwareDatetime


class Usage(Contract):
    input_tokens: Count | None
    output_tokens: Count | None
    cost_usd: Cost | None


class Run(Contract):
    id: Text
    agent_id: Text
    status: Literal["succeeded", "failed"]
    input_payload: dict[str, Any]
    output_payload: dict[str, Any]
    trace: list[dict[str, Any]]
    latency_ms: Count
    usage: Usage
    created_at: AwareDatetime


class Incident(Contract):
    id: Text
    run_id: Text
    category: Literal["policy_violation", "tool_failure", "hallucination", "missing_context", "routing_failure", "recovery_failure", "security"]
    severity: Literal["low", "medium", "high", "critical"]
    summary: Text
    root_cause: Text | None
    status: Literal["detected", "diagnosing", "patch_proposed", "evaluating", "resolved", "rejected", "needs_human_review"]


class Patch(Contract):
    id: Text
    incident_id: Text
    baseline_agent_id: Text
    candidate_agent_id: Text
    patch_type: Literal["prompt", "config"]
    diff: Text
    rationale: Text
    approval_status: Literal["proposed", "evaluating", "accepted", "rejected", "needs_human_review"]


class Score(Contract):
    passed: Count
    total: Count

    @model_validator(mode="after")
    def bounded_count(self) -> Self:
        if self.passed > self.total:
            raise ValueError("passed cannot exceed total")
        return self


class CaseResult(Contract):
    case_id: Text
    before_passed: StrictBool
    after_passed: StrictBool


class Evaluation(Contract):
    id: Text
    patch_id: Text
    dataset_id: Text
    dataset_version: Text
    before: Score
    after: Score
    regressions: list[Text]
    security_passed: StrictBool
    target_case_id: Text
    case_results: list[CaseResult]
    status: Literal["pending", "running", "completed", "failed"]

    @model_validator(mode="after")
    def coherent_results(self) -> Self:
        ids = [case.case_id for case in self.case_results]
        if len(ids) != len(set(ids)):
            raise ValueError("case IDs must be unique")
        if len(self.regressions) != len(set(self.regressions)):
            raise ValueError("regression IDs must be unique")
        if self.status == "completed":
            if not ids or self.target_case_id not in ids:
                raise ValueError("completed evaluation requires cases and target evidence")
            for stage in ("before", "after"):
                score = getattr(self, stage)
                passed = sum(getattr(case, stage + "_passed") for case in self.case_results)
                if score.total != len(ids) or score.passed != passed:
                    raise ValueError("scores must match case results")
            actual = {case.case_id for case in self.case_results if case.before_passed and not case.after_passed}
            if actual != set(self.regressions):
                raise ValueError("regressions must match case results")
        return self


class Error(Contract):
    code: Text
    message: Text
    retryable: StrictBool
    details: dict[str, Any]


class Job(Contract):
    id: Text
    incident_id: Text
    stage: Literal["inspect", "diagnose", "patch", "evaluate", "decide", "report"]
    status: Literal["queued", "running", "succeeded", "failed"]
    attempts: Count
    error: Error | None
    updated_at: AwareDatetime


class Report(Contract):
    id: Text
    incident_id: Text
    patch_id: Text | None
    evaluation_id: Text | None
    decision: Decision
    summary: Text
    evidence_refs: list[Text]

    @model_validator(mode="after")
    def accepted_references(self) -> Self:
        if self.decision == "accepted" and (self.patch_id is None or self.evaluation_id is None):
            raise ValueError("accepted report requires patch and evaluation references")
        return self


class SyntheticScenario(Contract):
    synthetic: Literal[True]
    agents: list[Agent]
    run: Run
    incident: Incident
    patch: Patch
    evaluation: Evaluation
    job: Job
    report: Report

    @field_validator("synthetic", mode="before")
    @classmethod
    def synthetic_boolean(cls, value: Any) -> bool:
        if value is not True:
            raise ValueError("synthetic must be JSON true")
        return value

    @model_validator(mode="after")
    def linked_entities(self) -> Self:
        agent_ids = {agent.id for agent in self.agents}
        if len(agent_ids) != len(self.agents):
            raise ValueError("agent IDs must be unique")
        if not {self.run.agent_id, self.patch.baseline_agent_id, self.patch.candidate_agent_id} <= agent_ids:
            raise ValueError("unknown agent reference")
        if self.incident.run_id != self.run.id:
            raise ValueError("incident references a different run")
        if {self.patch.incident_id, self.job.incident_id, self.report.incident_id} != {self.incident.id}:
            raise ValueError("incident references mismatch")
        if self.evaluation.patch_id != self.patch.id or self.report.patch_id != self.patch.id:
            raise ValueError("patch references mismatch")
        if self.report.evaluation_id != self.evaluation.id:
            raise ValueError("evaluation reference mismatch")
        if self.patch.approval_status != self.report.decision:
            raise ValueError("patch and report decision mismatch")
        return self
