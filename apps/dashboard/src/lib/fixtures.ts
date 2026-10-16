// Adaptador de fixtures sintéticos (examples/contracts). Valida cada objeto contra los contratos v1
// al cargar el módulo: si un fixture deja de cumplirlos, falla el build en vez de pintar datos dudosos.
import apiResponses from "../../../../examples/contracts/api-responses.json";
import scenario from "../../../../examples/contracts/scenario.json";

import {
  parseAgent,
  parseApiError,
  parseEvaluation,
  parseIncident,
  parseJob,
  parsePage,
  parsePatch,
  parseReport,
  parseRun,
} from "@/lib/contracts/parse";
import type { ApiResult, C4DataSource, ListScenario } from "@/lib/data-source";
import type { ApiError, Evaluation, Patch, Report } from "@/types/contracts";

const DECISION_GROUPS = ["accepted", "rejected", "incomplete"] as const;

function loadFixtures() {
  if (apiResponses.synthetic !== true || scenario.synthetic !== true) {
    throw new Error("Los fixtures de examples/contracts deben declarar synthetic: true.");
  }
  const patches: Patch[] = [];
  const evaluations: Evaluation[] = [];
  const reports: Report[] = [];
  for (const group of DECISION_GROUPS) {
    const g = apiResponses[group];
    patches.push(parsePatch(g.patch, `api-responses.${group}.patch`));
    evaluations.push(parseEvaluation(g.evaluation, `api-responses.${group}.evaluation`));
    reports.push(parseReport(g.report, `api-responses.${group}.report`));
  }
  return {
    agents: parsePage(apiResponses.agents, parseAgent, "api-responses.agents"),
    incidents: parsePage(apiResponses.incidents, parseIncident, "api-responses.incidents"),
    emptyIncidents: parsePage(apiResponses.empty_incidents, parseIncident, "api-responses.empty_incidents"),
    providerError: parseApiError(apiResponses.provider_error, "api-responses.provider_error"),
    runs: [parseRun(scenario.run, "scenario.run")],
    jobs: [
      parseJob(scenario.job, "scenario.job"),
      parseJob(apiResponses.pending_job, "api-responses.pending_job"),
      parseJob(apiResponses.failed_job, "api-responses.failed_job"),
    ],
    patches,
    evaluations,
    reports,
  };
}

export const fixtures = loadFixtures();

function ok<T>(data: T): ApiResult<T> {
  return { ok: true, data, synthetic: true };
}

function fail<T>(status: number, error: ApiError): ApiResult<T> {
  return { ok: false, status, error };
}

function notFound<T>(resource: string, id: string): ApiResult<T> {
  return fail(404, {
    code: "not_found",
    message: `No existe ${resource} con id ${id}.`,
    retryable: false,
    details: { resource, id },
  });
}

function byId<T extends { id: string }>(items: T[], resource: string, id: string): ApiResult<T> {
  const found = items.find((item) => item.id === id);
  return found ? ok(found) : notFound(resource, id);
}

/** Igual que la API real: un incidente inexistente da 404 en vez de lista vacía. */
function forIncident<T extends { incident_id: string }>(items: T[], incidentId: string): ApiResult<T[]> {
  if (!fixtures.incidents.items.some((incident) => incident.id === incidentId)) {
    return notFound("incident", incidentId);
  }
  return ok(items.filter((item) => item.incident_id === incidentId));
}

export const fixtureDataSource: C4DataSource = {
  async listAgents() {
    return ok(fixtures.agents);
  },
  async listIncidents(listScenario: ListScenario = "default") {
    if (listScenario === "empty") return ok(fixtures.emptyIncidents);
    if (listScenario === "provider_error") return fail(503, fixtures.providerError);
    return ok(fixtures.incidents);
  },
  async getIncident(id) {
    return byId(fixtures.incidents.items, "incident", id);
  },
  async getRun(id) {
    return byId(fixtures.runs, "run", id);
  },
  async listPatchesForIncident(incidentId) {
    return forIncident(fixtures.patches, incidentId);
  },
  async getPatch(id) {
    return byId(fixtures.patches, "patch", id);
  },
  async getEvaluation(id) {
    return byId(fixtures.evaluations, "evaluation", id);
  },
  async listReportsForIncident(incidentId) {
    return forIncident(fixtures.reports, incidentId);
  },
  async listJobs() {
    return ok(fixtures.jobs);
  },
};
