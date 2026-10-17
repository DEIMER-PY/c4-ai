// Lectura de una evaluación baseline/candidato según docs/arquitectura/EVALUACIONES.md.
// Es explicativa: la decisión vinculante es Report.decision del backend; la UI nunca la recalcula ni la sustituye.
import type { CaseResult, Evaluation } from "@/types/contracts";

export type CaseChange = "improved" | "regressed" | "kept_passing" | "kept_failing";

export interface CaseRow extends CaseResult {
  change: CaseChange;
  isTarget: boolean;
  /** Listado explícitamente en evaluation.regressions. */
  isReportedRegression: boolean;
}

export function classifyCase(c: CaseResult): CaseChange {
  if (c.before_passed && !c.after_passed) return "regressed";
  if (!c.before_passed && c.after_passed) return "improved";
  return c.after_passed ? "kept_passing" : "kept_failing";
}

export function caseRows(evaluation: Evaluation): CaseRow[] {
  const reported = new Set(evaluation.regressions);
  return evaluation.case_results.map((c) => ({
    ...c,
    change: classifyCase(c),
    isTarget: c.case_id === evaluation.target_case_id,
    isReportedRegression: reported.has(c.case_id),
  }));
}

/** met = cumple, failed = no cumple, unknown = no hay evidencia suficiente para afirmarlo. */
export type CheckState = "met" | "failed" | "unknown";

export interface GateCheck {
  id: "complete" | "target" | "no_drop" | "no_regressions" | "security";
  label: string;
  state: CheckState;
}

export function gateChecks(evaluation: Evaluation): GateCheck[] {
  const { before, after } = evaluation;
  const complete = evaluation.status === "completed";
  const comparable = complete && before.total > 0 && before.total === after.total;
  const target = evaluation.case_results.find((c) => c.case_id === evaluation.target_case_id);

  return [
    {
      id: "complete",
      label: "Evaluación completa con el mismo total de casos (> 0)",
      state: comparable ? "met" : "failed",
    },
    {
      id: "target",
      label: `El caso objetivo ${evaluation.target_case_id} pasa de fallar a pasar`,
      state: !comparable || !target ? "unknown" : classifyCase(target) === "improved" ? "met" : "failed",
    },
    {
      id: "no_drop",
      label: "Mejora total: casos aprobados después > antes",
      state: !comparable ? "unknown" : after.passed > before.passed ? "met" : "failed",
    },
    {
      id: "no_regressions",
      label: "Sin regresiones en casos que pasaban",
      state: !comparable ? "unknown" : evaluation.regressions.length === 0 ? "met" : "failed",
    },
    {
      id: "security",
      label: "Controles obligatorios de seguridad aprobados",
      state: !complete ? "unknown" : evaluation.security_passed ? "met" : "failed",
    },
  ];
}

/** Evidencia incompleta: la evaluación no terminó o no hay casos comparables. Exige revisión humana. */
export function isEvidenceIncomplete(evaluation: Evaluation): boolean {
  return gateChecks(evaluation)[0].state !== "met" || evaluation.case_results.length === 0;
}
