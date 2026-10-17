import { describe, expect, it } from "vitest";
import scenario from "../../../../examples/contracts/scenario.json";
import { createHttpDataSource } from "@/lib/http-data-source";
import { loadOverview } from "@/lib/overview";

const missing = { code:"not_found", message:"No disponible", retryable:false, details:{} };
function server(routes: Record<string,unknown>) {
  const requests: string[] = [];
  const request = (async (input: string | URL | Request) => {
    const path = new URL(String(input)).pathname + new URL(String(input)).search;
    requests.push(path);
    return new Response(JSON.stringify(routes[path] ?? missing),{status:path in routes ? 200 : 404});
  }) as typeof fetch;
  return { ds:createHttpDataSource("http://127.0.0.1:8000",request), requests };
}

describe("HTTP data source", () => {
  it("consulta páginas completas y no inventa listado de jobs",async () => {
    const {ds,requests} = server({
      "/api/v1/incidents?limit=100":{items:[scenario.incident],next_cursor:"next"},
      "/api/v1/incidents?limit=100&cursor=next":{items:[],next_cursor:null},
    });
    const result = await ds.listIncidents();
    expect(result).toMatchObject({ok:true,synthetic:false,data:{items:[scenario.incident]}});
    expect(requests).toHaveLength(2);
    expect(await ds.listJobs()).toMatchObject({ok:false,status:501});
    expect(requests).toHaveLength(2);
  });
  it("compone patch y reporte usando solo referencias del contrato",async () => {
    const {ds,requests} = server({
      [`/api/v1/incidents/${scenario.incident.id}/report`]:scenario.report,
      [`/api/v1/patches/${scenario.patch.id}`]:scenario.patch,
    });
    expect(await ds.listPatchesForIncident(scenario.incident.id)).toMatchObject({ok:true,data:[scenario.patch]});
    expect(requests.some((path)=>path.includes("/jobs"))).toBe(false);
  });
  it("distingue reporte pendiente de incidente ausente",async () => {
    const {ds} = server({[`/api/v1/incidents/${scenario.incident.id}`]:scenario.incident});
    expect(await ds.listReportsForIncident(scenario.incident.id)).toMatchObject({ok:true,data:[]});
    expect(await ds.listReportsForIncident("absent")).toMatchObject({ok:false,status:404});
  });
  it("mantiene visible una API caída y nunca devuelve fixtures",async () => {
    const ds=createHttpDataSource("http://127.0.0.1:8000",(async()=>{throw new Error("offline")}) as typeof fetch);
    expect(await ds.listIncidents()).toMatchObject({ok:false,status:503,error:{code:"api_unavailable"}});
  });
  it("muestra overview parcial sin confundir trabajos no disponibles con cero",async () => {
    const {ds} = server({
      "/api/v1/incidents?limit=100":{items:[scenario.incident],next_cursor:null},
      [`/api/v1/incidents/${scenario.incident.id}/report`]:scenario.report,
      [`/api/v1/evaluations/${scenario.evaluation.id}`]:scenario.evaluation,
      [`/api/v1/runs/${scenario.run.id}`]:scenario.run,
    });
    expect(await loadOverview(ds)).toMatchObject({ok:true,synthetic:false,data:{jobsAvailable:false,incidentCount:1,cost:{knownTotalUsd:null}}});
  });
});
