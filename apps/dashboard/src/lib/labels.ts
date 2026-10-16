// Etiquetas en español y tono visual de cada estado del contrato v1.
// El tono nunca es la única señal: los badges siempre muestran el texto (DASHBOARD.md, Diseño).
import type {
  ApprovalStatus,
  Decision,
  EvaluationStatus,
  IncidentCategory,
  IncidentStatus,
  JobStage,
  JobStatus,
  PatchType,
  RunStatus,
  Severity,
} from "@/types/contracts";

export type Tone = "success" | "danger" | "warning" | "neutral";

interface Label {
  label: string;
  tone: Tone;
}

export const SEVERITY: Record<Severity, Label> = {
  low: { label: "Baja", tone: "neutral" },
  medium: { label: "Media", tone: "warning" },
  high: { label: "Alta", tone: "danger" },
  critical: { label: "Crítica", tone: "danger" },
};

export const INCIDENT_STATUS: Record<IncidentStatus, Label> = {
  detected: { label: "Detectado", tone: "neutral" },
  diagnosing: { label: "Diagnosticando", tone: "neutral" },
  patch_proposed: { label: "Candidato propuesto", tone: "neutral" },
  evaluating: { label: "Evaluando", tone: "neutral" },
  resolved: { label: "Resuelto", tone: "success" },
  rejected: { label: "Rechazado", tone: "danger" },
  needs_human_review: { label: "Revisión humana", tone: "warning" },
};

export const APPROVAL_STATUS: Record<ApprovalStatus, Label> = {
  proposed: { label: "Propuesto", tone: "neutral" },
  evaluating: { label: "Evaluando", tone: "neutral" },
  accepted: { label: "Aceptado", tone: "success" },
  rejected: { label: "Rechazado", tone: "danger" },
  needs_human_review: { label: "Revisión humana", tone: "warning" },
};

export const DECISION: Record<Decision, Label> = {
  accepted: { label: "Aceptado", tone: "success" },
  rejected: { label: "Rechazado", tone: "danger" },
  needs_human_review: { label: "Revisión humana", tone: "warning" },
};

/** completed solo indica que la evaluación terminó, no que el candidato aprobara. */
export const EVALUATION_STATUS: Record<EvaluationStatus, Label> = {
  pending: { label: "Pendiente", tone: "neutral" },
  running: { label: "En ejecución", tone: "neutral" },
  completed: { label: "Completada", tone: "neutral" },
  failed: { label: "Fallida", tone: "danger" },
};

/** queued/running nunca se muestran como éxito. */
export const JOB_STATUS: Record<JobStatus, Label> = {
  queued: { label: "En cola", tone: "neutral" },
  running: { label: "En ejecución", tone: "neutral" },
  succeeded: { label: "Completado", tone: "success" },
  failed: { label: "Fallido", tone: "danger" },
};

export const RUN_STATUS: Record<RunStatus, Label> = {
  succeeded: { label: "Exitosa", tone: "success" },
  failed: { label: "Fallida", tone: "danger" },
};

export const JOB_STAGE: Record<JobStage, string> = {
  inspect: "Inspección",
  diagnose: "Diagnóstico",
  patch: "Candidato",
  evaluate: "Evaluación",
  decide: "Decisión",
  report: "Reporte",
};

export const CATEGORY: Record<IncidentCategory, string> = {
  policy_violation: "Incumplimiento de política",
  tool_failure: "Fallo de herramienta",
  hallucination: "Alucinación",
  missing_context: "Contexto faltante",
  routing_failure: "Fallo de enrutamiento",
  recovery_failure: "Fallo de recuperación",
  security: "Seguridad",
};

export const PATCH_TYPE: Record<PatchType, string> = {
  prompt: "Prompt",
  config: "Configuración",
};
