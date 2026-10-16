import { describe, expect, it } from "vitest";

import { fixtureDataSource as ds, fixtures } from "@/lib/fixtures";

describe("fixtures sintéticos", () => {
  it("cargan los tres escenarios de decisión validados contra el contrato", () => {
    expect(fixtures.patches.map((p) => p.approval_status)).toEqual(["accepted", "rejected", "needs_human_review"]);
    expect(fixtures.reports.map((r) => r.decision)).toEqual(["accepted", "rejected", "needs_human_review"]);
  });

  it("marcan toda respuesta exitosa como sintética", async () => {
    const result = await ds.listIncidents();
    expect(result.ok && result.synthetic).toBe(true);
  });
});

describe("fixtureDataSource", () => {
  it("devuelve la lista vacía del escenario empty", async () => {
    const result = await ds.listIncidents("empty");
    expect(result).toMatchObject({ ok: true, data: { items: [], next_cursor: null } });
  });

  it("devuelve 503 reintentable en el escenario provider_error", async () => {
    const result = await ds.listIncidents("provider_error");
    expect(result).toMatchObject({ ok: false, status: 503, error: { code: "provider_unavailable", retryable: true } });
  });

  it("devuelve 404 para un incidente inexistente", async () => {
    const result = await ds.getIncident("inc_no_existe");
    expect(result).toMatchObject({ ok: false, status: 404, error: { code: "not_found" } });
  });

  it("devuelve 404 al listar patches de un incidente inexistente", async () => {
    const result = await ds.listPatchesForIncident("inc_no_existe");
    expect(result).toMatchObject({ ok: false, status: 404 });
  });

  it("agrupa los tres patches del incidente (CL-001)", async () => {
    const result = await ds.listPatchesForIncident("inc_refunds_001");
    if (!result.ok) throw new Error("se esperaba éxito");
    expect(result.data.map((p) => p.id)).toEqual(["pat_refunds_001", "pat_rejected_001", "pat_review_001"]);
  });

  it("enlaza cada report con un patch y una evaluación existentes", async () => {
    const reports = await ds.listReportsForIncident("inc_refunds_001");
    if (!reports.ok) throw new Error("se esperaba éxito");
    for (const report of reports.data) {
      expect(report.patch_id).not.toBeNull();
      expect(report.evaluation_id).not.toBeNull();
      expect((await ds.getPatch(report.patch_id!)).ok).toBe(true);
      const evaluation = await ds.getEvaluation(report.evaluation_id!);
      expect(evaluation.ok && evaluation.data.patch_id).toBe(report.patch_id);
    }
  });

  it("expone la regresión por ID en la evaluación rechazada", async () => {
    const result = await ds.getEvaluation("eval_rejected_001");
    expect(result).toMatchObject({ ok: true, data: { regressions: ["refund_eligible"], status: "completed" } });
  });

  it("conserva cost_usd null del run como desconocido", async () => {
    const result = await ds.getRun("run_refunds_001");
    expect(result).toMatchObject({ ok: true, data: { usage: { cost_usd: null } } });
  });

  it("incluye jobs queued y failed sin presentarlos como éxito", async () => {
    const result = await ds.listJobs();
    if (!result.ok) throw new Error("se esperaba éxito");
    expect(result.data.map((j) => j.status).sort()).toEqual(["failed", "queued", "succeeded"]);
  });
});
