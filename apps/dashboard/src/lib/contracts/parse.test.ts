import { describe, expect, it } from "vitest";

import { ContractError, parseEvaluation, parseIncident, parseJob } from "@/lib/contracts/parse";

const incident = {
  id: "inc_1",
  run_id: "run_1",
  category: "policy_violation",
  severity: "high",
  summary: "Resumen",
  root_cause: null,
  status: "detected",
};

const evaluation = {
  id: "eval_1",
  patch_id: "pat_1",
  dataset_id: "ds",
  dataset_version: "1.0.0",
  before: { passed: 1, total: 2 },
  after: { passed: 2, total: 2 },
  regressions: [],
  security_passed: true,
  target_case_id: "case_1",
  case_results: [],
  status: "completed",
};

describe("parse de contratos v1", () => {
  it("acepta un incidente válido con root_cause null", () => {
    expect(parseIncident(incident).root_cause).toBeNull();
  });

  it("rechaza un estado fuera del enum indicando la ruta", () => {
    expect(() => parseIncident({ ...incident, status: "done" })).toThrow(ContractError);
    expect(() => parseIncident({ ...incident, status: "done" })).toThrow(/incident\.status/);
  });

  it("rechaza campos obligatorios ausentes o vacíos", () => {
    expect(() => parseIncident({ ...incident, summary: "" })).toThrow(/incident\.summary/);
    const withoutRun = Object.fromEntries(Object.entries(incident).filter(([key]) => key !== "run_id"));
    expect(() => parseIncident(withoutRun)).toThrow(/incident\.run_id/);
  });

  it("rechaza passed mayor que total", () => {
    expect(() => parseEvaluation({ ...evaluation, after: { passed: 3, total: 2 } })).toThrow(/evaluation\.after/);
  });

  it("rechaza regresiones duplicadas", () => {
    expect(() => parseEvaluation({ ...evaluation, regressions: ["a", "a"] })).toThrow(/regressions/);
  });

  it("valida el error anidado de un job fallido", () => {
    const job = {
      id: "job_1",
      incident_id: "inc_1",
      stage: "diagnose",
      status: "failed",
      attempts: 1,
      error: { code: "provider_unavailable", message: "x", retryable: "sí", details: {} },
      updated_at: "2026-10-11T12:00:00Z",
    };
    expect(() => parseJob(job)).toThrow(/job\.error\.retryable/);
  });
});
