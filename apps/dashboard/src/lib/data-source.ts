// Interfaz que consumen los componentes. Hoy la implementa el adaptador de fixtures (src/lib/fixtures.ts);
// en C4-006 la implementará un cliente HTTP de /api/v1 sin cambiar las vistas.
import type { Agent, ApiError, Evaluation, Incident, Job, Page, Patch, Report, Run } from "@/types/contracts";

export type ApiResult<T> =
  | { ok: true; data: T; synthetic: boolean }
  | { ok: false; status: number; error: ApiError };

/** Escenarios de demostración para listas: datos, lista vacía o proveedor caído (503). */
export type ListScenario = "default" | "empty" | "provider_error";

export interface C4DataSource {
  listAgents(): Promise<ApiResult<Page<Agent>>>;
  listIncidents(scenario?: ListScenario): Promise<ApiResult<Page<Incident>>>;
  getIncident(id: string): Promise<ApiResult<Incident>>;
  getRun(id: string): Promise<ApiResult<Run>>;
  /** Endpoint pendiente de contrato (CL-001 en la spec 006); hoy solo existe en el adaptador de mocks. */
  listPatchesForIncident(incidentId: string): Promise<ApiResult<Patch[]>>;
  getPatch(id: string): Promise<ApiResult<Patch>>;
  getEvaluation(id: string): Promise<ApiResult<Evaluation>>;
  /** Reports de un incidente; GET /incidents/{id}/report devuelve uno solo (CL-001). */
  listReportsForIncident(incidentId: string): Promise<ApiResult<Report[]>>;
  /** Sin listado de jobs en el contrato (CL-002); solo para el overview de demostración. */
  listJobs(): Promise<ApiResult<Job[]>>;
}
