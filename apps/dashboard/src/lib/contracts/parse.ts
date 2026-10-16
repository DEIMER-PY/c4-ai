// Validación en tiempo de ejecución de los contratos v1. Los JSON importados se tipan como `string`
// genérico, así que aquí se comprueban enums, nulos y campos obligatorios antes de exponerlos a la UI.
import {
  APPROVAL_STATUSES,
  DECISIONS,
  EVALUATION_STATUSES,
  INCIDENT_CATEGORIES,
  INCIDENT_STATUSES,
  JOB_STAGES,
  JOB_STATUSES,
  PATCH_TYPES,
  RUN_STATUSES,
  SEVERITIES,
  type Agent,
  type ApiError,
  type CaseResult,
  type Evaluation,
  type Incident,
  type Job,
  type Page,
  type Patch,
  type Report,
  type Run,
  type Score,
  type Usage,
} from "@/types/contracts";

export class ContractError extends Error {
  constructor(
    readonly path: string,
    reason: string,
  ) {
    super(`Contrato v1 inválido en ${path}: ${reason}`);
    this.name = "ContractError";
  }
}

type Obj = Record<string, unknown>;

function obj(value: unknown, path: string): Obj {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ContractError(path, "se esperaba un objeto");
  }
  return value as Obj;
}

function str(o: Obj, key: string, path: string): string {
  const value = o[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new ContractError(`${path}.${key}`, "se esperaba un texto no vacío");
  }
  return value;
}

function nullableStr(o: Obj, key: string, path: string): string | null {
  return o[key] === null ? null : str(o, key, path);
}

function bool(o: Obj, key: string, path: string): boolean {
  const value = o[key];
  if (typeof value !== "boolean") throw new ContractError(`${path}.${key}`, "se esperaba un booleano");
  return value;
}

function nonNegative(value: unknown, path: string, integer: boolean): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || (integer && !Number.isInteger(value))) {
    throw new ContractError(path, integer ? "se esperaba un entero >= 0" : "se esperaba un número >= 0");
  }
  return value;
}

function int(o: Obj, key: string, path: string): number {
  return nonNegative(o[key], `${path}.${key}`, true);
}

function nullableNumber(o: Obj, key: string, path: string, integer: boolean): number | null {
  return o[key] === null ? null : nonNegative(o[key], `${path}.${key}`, integer);
}

function oneOf<T extends string>(o: Obj, key: string, allowed: readonly T[], path: string): T {
  const value = o[key];
  if (typeof value !== "string" || !(allowed as readonly string[]).includes(value)) {
    throw new ContractError(`${path}.${key}`, `valor fuera del enum (${allowed.join(", ")})`);
  }
  return value as T;
}

function arr(o: Obj, key: string, path: string): unknown[] {
  const value = o[key];
  if (!Array.isArray(value)) throw new ContractError(`${path}.${key}`, "se esperaba una lista");
  return value;
}

function strList(o: Obj, key: string, path: string): string[] {
  return arr(o, key, path).map((item, i) => {
    if (typeof item !== "string" || item.length === 0) {
      throw new ContractError(`${path}.${key}[${i}]`, "se esperaba un texto no vacío");
    }
    return item;
  });
}

export function parseAgent(value: unknown, path = "agent"): Agent {
  const o = obj(value, path);
  return {
    id: str(o, "id", path),
    name: str(o, "name", path),
    version: str(o, "version", path),
    prompt_ref: str(o, "prompt_ref", path),
    config_ref: str(o, "config_ref", path),
    created_at: str(o, "created_at", path),
  };
}

function parseUsage(value: unknown, path: string): Usage {
  const o = obj(value, path);
  return {
    input_tokens: nullableNumber(o, "input_tokens", path, true),
    output_tokens: nullableNumber(o, "output_tokens", path, true),
    cost_usd: nullableNumber(o, "cost_usd", path, false),
  };
}

export function parseRun(value: unknown, path = "run"): Run {
  const o = obj(value, path);
  return {
    id: str(o, "id", path),
    agent_id: str(o, "agent_id", path),
    status: oneOf(o, "status", RUN_STATUSES, path),
    input_payload: obj(o.input_payload, `${path}.input_payload`),
    output_payload: obj(o.output_payload, `${path}.output_payload`),
    trace: arr(o, "trace", path).map((step, i) => obj(step, `${path}.trace[${i}]`)),
    latency_ms: int(o, "latency_ms", path),
    usage: parseUsage(o.usage, `${path}.usage`),
    created_at: str(o, "created_at", path),
  };
}

export function parseIncident(value: unknown, path = "incident"): Incident {
  const o = obj(value, path);
  return {
    id: str(o, "id", path),
    run_id: str(o, "run_id", path),
    category: oneOf(o, "category", INCIDENT_CATEGORIES, path),
    severity: oneOf(o, "severity", SEVERITIES, path),
    summary: str(o, "summary", path),
    root_cause: nullableStr(o, "root_cause", path),
    status: oneOf(o, "status", INCIDENT_STATUSES, path),
  };
}

export function parsePatch(value: unknown, path = "patch"): Patch {
  const o = obj(value, path);
  return {
    id: str(o, "id", path),
    incident_id: str(o, "incident_id", path),
    baseline_agent_id: str(o, "baseline_agent_id", path),
    candidate_agent_id: str(o, "candidate_agent_id", path),
    patch_type: oneOf(o, "patch_type", PATCH_TYPES, path),
    diff: str(o, "diff", path),
    rationale: str(o, "rationale", path),
    approval_status: oneOf(o, "approval_status", APPROVAL_STATUSES, path),
  };
}

function parseScore(value: unknown, path: string): Score {
  const o = obj(value, path);
  const score = { passed: int(o, "passed", path), total: int(o, "total", path) };
  if (score.passed > score.total) throw new ContractError(path, "passed no puede superar total");
  return score;
}

function parseCaseResult(value: unknown, path: string): CaseResult {
  const o = obj(value, path);
  return {
    case_id: str(o, "case_id", path),
    before_passed: bool(o, "before_passed", path),
    after_passed: bool(o, "after_passed", path),
  };
}

export function parseEvaluation(value: unknown, path = "evaluation"): Evaluation {
  const o = obj(value, path);
  const regressions = strList(o, "regressions", path);
  if (new Set(regressions).size !== regressions.length) {
    throw new ContractError(`${path}.regressions`, "IDs repetidos");
  }
  return {
    id: str(o, "id", path),
    patch_id: str(o, "patch_id", path),
    dataset_id: str(o, "dataset_id", path),
    dataset_version: str(o, "dataset_version", path),
    before: parseScore(o.before, `${path}.before`),
    after: parseScore(o.after, `${path}.after`),
    regressions,
    security_passed: bool(o, "security_passed", path),
    target_case_id: str(o, "target_case_id", path),
    case_results: arr(o, "case_results", path).map((c, i) => parseCaseResult(c, `${path}.case_results[${i}]`)),
    status: oneOf(o, "status", EVALUATION_STATUSES, path),
  };
}

export function parseApiError(value: unknown, path = "error"): ApiError {
  const o = obj(value, path);
  return {
    code: str(o, "code", path),
    message: str(o, "message", path),
    retryable: bool(o, "retryable", path),
    details: obj(o.details, `${path}.details`),
  };
}

export function parseJob(value: unknown, path = "job"): Job {
  const o = obj(value, path);
  return {
    id: str(o, "id", path),
    incident_id: str(o, "incident_id", path),
    stage: oneOf(o, "stage", JOB_STAGES, path),
    status: oneOf(o, "status", JOB_STATUSES, path),
    attempts: int(o, "attempts", path),
    error: o.error === null ? null : parseApiError(o.error, `${path}.error`),
    updated_at: str(o, "updated_at", path),
  };
}

export function parseReport(value: unknown, path = "report"): Report {
  const o = obj(value, path);
  return {
    id: str(o, "id", path),
    incident_id: str(o, "incident_id", path),
    patch_id: nullableStr(o, "patch_id", path),
    evaluation_id: nullableStr(o, "evaluation_id", path),
    decision: oneOf(o, "decision", DECISIONS, path),
    summary: str(o, "summary", path),
    evidence_refs: strList(o, "evidence_refs", path),
  };
}

export function parsePage<T>(value: unknown, parseItem: (item: unknown, path: string) => T, path: string): Page<T> {
  const o = obj(value, path);
  const cursor = o.next_cursor;
  if (cursor !== null && typeof cursor !== "string") {
    throw new ContractError(`${path}.next_cursor`, "se esperaba texto o null");
  }
  return {
    items: arr(o, "items", path).map((item, i) => parseItem(item, `${path}.items[${i}]`)),
    next_cursor: cursor,
  };
}
