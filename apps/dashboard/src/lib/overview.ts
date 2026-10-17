// Resumen del overview derivado de las operaciones existentes. GET /metrics aún no tiene contrato (CL-002),
// así que no se inventan totales: solo se cuenta lo que devuelve la fuente de datos.
import type { ApiResult, C4DataSource } from "@/lib/data-source";
import type { Decision, Evaluation, IncidentStatus, JobStatus, Run } from "@/types/contracts";

export interface CostCoverage {
  /** Runs con cost_usd conocido. */
  known: number;
  total: number;
  /** Suma de costos conocidos; null si ninguno es conocido. */
  knownTotalUsd: number | null;
}

export interface Overview {
  incidentCount: number;
  incidentsByStatus: Partial<Record<IncidentStatus, number>>;
  jobsByStatus: Partial<Record<JobStatus, number>>;
  jobsAvailable: boolean;
  decisions: Partial<Record<Decision, number>>;
  evaluations: Evaluation[];
  cost: CostCoverage;
  usage: { tokens: number; knownRuns: number; totalRuns: number };
}

function tally<K extends string>(keys: K[]): Partial<Record<K, number>> {
  const counts: Partial<Record<K, number>> = {};
  for (const key of keys) counts[key] = (counts[key] ?? 0) + 1;
  return counts;
}

function unwrap<T>(result: ApiResult<T>): T {
  if (!result.ok) throw new OverviewError(result);
  return result.data;
}

export class OverviewError extends Error {
  constructor(readonly result: Extract<ApiResult<unknown>, { ok: false }>) {
    super(result.error.message);
    this.name = "OverviewError";
  }
}

export async function loadOverview(ds: C4DataSource): Promise<ApiResult<Overview>> {
  try {
    const incidentsResult = await ds.listIncidents();
    const incidents = unwrap(incidentsResult).items;
    const jobsAvailable = ds.capabilities?.listJobs !== false;
    const jobs = jobsAvailable ? unwrap(await ds.listJobs()) : [];

    const reports = (await Promise.all(incidents.map((i) => ds.listReportsForIncident(i.id).then(unwrap)))).flat();
    const evaluations = await Promise.all(
      reports
        .map((r) => r.evaluation_id)
        .filter((id): id is string => id !== null)
        .map((id) => ds.getEvaluation(id).then(unwrap)),
    );
    const runIds = [...new Set(incidents.map((i) => i.run_id))];
    const runResults = await Promise.all(runIds.map((id) => ds.getRun(id)));
    const runs: Run[] = [];
    for (const result of runResults) {
      if (result.ok) runs.push(result.data);
      else if (result.status !== 404) throw new OverviewError(result);
    }
    const knownCosts = runs.map((r) => r.usage.cost_usd).filter((c): c is number => c !== null);

    return {
      ok: true,
      synthetic: incidentsResult.ok && incidentsResult.synthetic,
      data: {
        incidentCount: incidents.length,
        incidentsByStatus: tally(incidents.map((i) => i.status)),
        jobsByStatus: tally(jobs.map((j) => j.status)),
        jobsAvailable,
        decisions: tally(reports.map((r) => r.decision)),
        evaluations,
        usage: {
          tokens: runs.reduce((sum,r) => sum + (r.usage.input_tokens ?? 0) + (r.usage.output_tokens ?? 0),0),
          knownRuns: runs.filter((r) => r.usage.input_tokens !== null && r.usage.output_tokens !== null).length,
          totalRuns: runIds.length,
        },
        cost: {
          known: knownCosts.length,
          total: runIds.length,
          knownTotalUsd: knownCosts.length === 0 ? null : knownCosts.reduce((a, b) => a + b, 0),
        },
      },
    };
  } catch (error) {
    if (error instanceof OverviewError) return error.result;
    throw error;
  }
}
