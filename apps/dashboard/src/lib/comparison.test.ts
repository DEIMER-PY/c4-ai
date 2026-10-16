import { describe, expect, it } from "vitest";

import { caseRows, classifyCase, gateChecks, isEvidenceIncomplete } from "@/lib/comparison";
import { fixtures } from "@/lib/fixtures";
import type { Evaluation } from "@/types/contracts";

function evaluation(id: string): Evaluation {
  const found = fixtures.evaluations.find((e) => e.id === id);
  if (!found) throw new Error(`fixture ${id} ausente`);
  return found;
}

const states = (e: Evaluation) => Object.fromEntries(gateChecks(e).map((c) => [c.id, c.state]));

describe("classifyCase", () => {
  it("distingue mejora, regresión y casos sin cambio", () => {
    expect(classifyCase({ case_id: "a", before_passed: false, after_passed: true })).toBe("improved");
    expect(classifyCase({ case_id: "a", before_passed: true, after_passed: false })).toBe("regressed");
    expect(classifyCase({ case_id: "a", before_passed: true, after_passed: true })).toBe("kept_passing");
    expect(classifyCase({ case_id: "a", before_passed: false, after_passed: false })).toBe("kept_failing");
  });
});

describe("caseRows", () => {
  it("marca el caso objetivo y la regresión reportada por ID", () => {
    const rows = caseRows(evaluation("eval_rejected_001"));
    expect(rows.find((r) => r.case_id === "refund_expired")).toMatchObject({ isTarget: true, change: "improved" });
    expect(rows.find((r) => r.case_id === "refund_eligible")).toMatchObject({
      change: "regressed",
      isReportedRegression: true,
    });
  });
});

describe("gateChecks", () => {
  it("cumple todos los criterios en la evaluación aceptada", () => {
    expect(Object.values(states(evaluation("eval_refunds_001")))).toEqual(["met", "met", "met", "met", "met"]);
  });

  it("falla por regresión aunque el caso objetivo mejore y el total no baje", () => {
    expect(states(evaluation("eval_rejected_001"))).toEqual({
      complete: "met",
      target: "met",
      no_drop: "met",
      no_regressions: "failed",
      security: "met",
    });
  });

  it("no afirma nada sobre casos cuando la evaluación falló", () => {
    expect(states(evaluation("eval_review_001"))).toEqual({
      complete: "failed",
      target: "unknown",
      no_drop: "unknown",
      no_regressions: "unknown",
      security: "unknown",
    });
  });

  it("no compara conteos con totales distintos", () => {
    const e = { ...evaluation("eval_refunds_001"), before: { passed: 1, total: 2 }, after: { passed: 3, total: 3 } };
    expect(states(e).complete).toBe("failed");
    expect(states(e).no_drop).toBe("unknown");
  });
});

describe("isEvidenceIncomplete", () => {
  it("solo la evaluación fallida tiene evidencia incompleta", () => {
    expect(isEvidenceIncomplete(evaluation("eval_refunds_001"))).toBe(false);
    expect(isEvidenceIncomplete(evaluation("eval_rejected_001"))).toBe(false);
    expect(isEvidenceIncomplete(evaluation("eval_review_001"))).toBe(true);
  });
});
