import { parseAgent, parseApiError, parseEvaluation, parseIncident, parsePage, parsePatch, parseReport, parseRun } from "@/lib/contracts/parse";
import type { ApiResult, C4DataSource } from "@/lib/data-source";
import type { Page, Patch, Report } from "@/types/contracts";

type Parser<T> = (value: unknown, path?: string) => T;
const fail = <T>(status: number, code: string, message: string): ApiResult<T> => ({ ok: false, status, error: { code, message, retryable: status === 503, details: {} } });
const ok = <T>(data: T): ApiResult<T> => ({ ok: true, data, synthetic: false });

/** Server-side only. Live provider results on synthetic cases; never fallback to fixtures. */
export function createHttpDataSource(baseUrl: string, request: typeof fetch = fetch): C4DataSource {
  const base = new URL(baseUrl);
  if (!["http:", "https:"].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw new Error("C4_API_URL inválida");
  const root = base.toString().replace(/\/$/, "");
  async function get<T>(path: string, parser: Parser<T>): Promise<ApiResult<T>> {
    try {
      const response = await request(root + "/api/v1" + path, { cache: "no-store", signal: AbortSignal.timeout(5000) });
      const value: unknown = await response.json();
      if (!response.ok) {
        try { return { ok: false, status: response.status, error: parseApiError(value) }; }
        catch { return fail(response.status, "api_error", "La API no pudo completar la consulta."); }
      }
      return ok(parser(value));
    } catch {
      return fail(503, "api_unavailable", "No se pudo consultar la API local. Comprueba que C4 API esté ejecutándose.");
    }
  }
  async function all<T>(path: string, parser: Parser<T>): Promise<ApiResult<Page<T>>> {
    const items: T[] = [];
    const seen = new Set<string>();
    let cursor: string | null = null;
    for (let page = 0; page < 50; page++) {
      const result: ApiResult<Page<T>> = await get(`${path}?limit=100${cursor ? "&cursor=" + encodeURIComponent(cursor) : ""}`, (v) => parsePage(v, parser, path));
      if (!result.ok) return result;
      items.push(...result.data.items);
      cursor = result.data.next_cursor;
      if (cursor === null) return ok({ items, next_cursor: null });
      if (seen.has(cursor)) break;
      seen.add(cursor);
    }
    return fail(503, "pagination_incomplete", "La API devolvió una paginación incompleta; no se muestran totales parciales como completos.");
  }
  const id = (value: string) => encodeURIComponent(value);
  const ds: C4DataSource = {
    capabilities: { listJobs: false },
    listAgents: () => all("/agents", parseAgent),
    listIncidents: () => all("/incidents", parseIncident),
    getIncident: (value) => get("/incidents/" + id(value), parseIncident),
    getRun: (value) => get("/runs/" + id(value), parseRun),
    getPatch: (value) => get("/patches/" + id(value), parsePatch),
    getEvaluation: (value) => get("/evaluations/" + id(value), parseEvaluation),
    async listReportsForIncident(value): Promise<ApiResult<Report[]>> {
      const report = await get("/incidents/" + id(value) + "/report", parseReport);
      if (report.ok) return ok([report.data]);
      if (report.status !== 404) return report;
      const incident = await ds.getIncident(value);
      return incident.ok ? ok([]) : incident;
    },
    async listPatchesForIncident(value): Promise<ApiResult<Patch[]>> {
      const reports = await ds.listReportsForIncident(value);
      if (!reports.ok) return reports;
      const ids = [...new Set(reports.data.flatMap((report) => report.patch_id ? [report.patch_id] : []))];
      const patches = await Promise.all(ids.map((value) => ds.getPatch(value)));
      const error = patches.find((patch) => !patch.ok);
      if (error && !error.ok) return error;
      return ok(patches.flatMap((patch) => patch.ok ? [patch.data] : []));
    },
    listJobs: async () => fail(501, "unsupported_operation", "La API v1 todavía no ofrece un listado global de trabajos."),
  };
  return ds;
}
