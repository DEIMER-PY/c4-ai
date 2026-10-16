// Contratos v1 de C4 AI. Fuente canónica: examples/contracts/schemas.json y docs/arquitectura/API.md.
// Cualquier cambio aquí debe reflejar un cambio acordado en esos archivos, nunca adelantarse a ellos.

export const RUN_STATUSES = ["succeeded", "failed"] as const;
export const INCIDENT_CATEGORIES = [
  "policy_violation",
  "tool_failure",
  "hallucination",
  "missing_context",
  "routing_failure",
  "recovery_failure",
  "security",
] as const;
export const SEVERITIES = ["low", "medium", "high", "critical"] as const;
export const INCIDENT_STATUSES = [
  "detected",
  "diagnosing",
  "patch_proposed",
  "evaluating",
  "resolved",
  "rejected",
  "needs_human_review",
] as const;
export const PATCH_TYPES = ["prompt", "config"] as const;
export const APPROVAL_STATUSES = [
  "proposed",
  "evaluating",
  "accepted",
  "rejected",
  "needs_human_review",
] as const;
export const EVALUATION_STATUSES = ["pending", "running", "completed", "failed"] as const;
export const JOB_STAGES = ["inspect", "diagnose", "patch", "evaluate", "decide", "report"] as const;
export const JOB_STATUSES = ["queued", "running", "succeeded", "failed"] as const;
export const DECISIONS = ["accepted", "rejected", "needs_human_review"] as const;

export type RunStatus = (typeof RUN_STATUSES)[number];
export type IncidentCategory = (typeof INCIDENT_CATEGORIES)[number];
export type Severity = (typeof SEVERITIES)[number];
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];
export type PatchType = (typeof PATCH_TYPES)[number];
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];
export type EvaluationStatus = (typeof EVALUATION_STATUSES)[number];
export type JobStage = (typeof JOB_STAGES)[number];
export type JobStatus = (typeof JOB_STATUSES)[number];
export type Decision = (typeof DECISIONS)[number];

/** Fecha ISO 8601 en UTC, tal como llega del contrato. */
export type IsoDateTime = string;

export interface Agent {
  id: string;
  name: string;
  version: string;
  prompt_ref: string;
  config_ref: string;
  created_at: IsoDateTime;
}

export interface Usage {
  input_tokens: number | null;
  output_tokens: number | null;
  /** null significa costo desconocido, nunca cero. */
  cost_usd: number | null;
}

export interface Run {
  id: string;
  agent_id: string;
  status: RunStatus;
  input_payload: Record<string, unknown>;
  output_payload: Record<string, unknown>;
  trace: Record<string, unknown>[];
  latency_ms: number;
  usage: Usage;
  created_at: IsoDateTime;
}

export interface Incident {
  id: string;
  run_id: string;
  category: IncidentCategory;
  severity: Severity;
  summary: string;
  root_cause: string | null;
  status: IncidentStatus;
}

export interface Patch {
  id: string;
  incident_id: string;
  baseline_agent_id: string;
  candidate_agent_id: string;
  patch_type: PatchType;
  diff: string;
  rationale: string;
  approval_status: ApprovalStatus;
}

export interface Score {
  passed: number;
  total: number;
}

export interface CaseResult {
  case_id: string;
  before_passed: boolean;
  after_passed: boolean;
}

export interface Evaluation {
  id: string;
  patch_id: string;
  dataset_id: string;
  dataset_version: string;
  before: Score;
  after: Score;
  regressions: string[];
  security_passed: boolean;
  target_case_id: string;
  case_results: CaseResult[];
  status: EvaluationStatus;
}

export interface ApiError {
  code: string;
  message: string;
  retryable: boolean;
  details: Record<string, unknown>;
}

export interface Job {
  id: string;
  incident_id: string;
  stage: JobStage;
  status: JobStatus;
  attempts: number;
  error: ApiError | null;
  updated_at: IsoDateTime;
}

export interface Report {
  id: string;
  incident_id: string;
  patch_id: string | null;
  evaluation_id: string | null;
  decision: Decision;
  summary: string;
  evidence_refs: string[];
}

/** Listados de la API: items y cursor nullable (API.md, convenciones). */
export interface Page<T> {
  items: T[];
  next_cursor: string | null;
}
