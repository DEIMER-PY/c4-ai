import { describe, expect, it } from "vitest";

import type { C4DataSource } from "@/lib/data-source";
import { fixtureDataSource } from "@/lib/fixtures";
import { loadOverview } from "@/lib/overview";

describe("loadOverview", () => {
  it("resume los fixtures sin inventar totales", async () => {
    const result = await loadOverview(fixtureDataSource);
    if (!result.ok) throw new Error("se esperaba éxito");
    expect(result.synthetic).toBe(true);
    expect(result.data.incidentCount).toBe(1);
    expect(result.data.jobsByStatus).toEqual({ succeeded: 1, queued: 1, failed: 1 });
    expect(result.data.decisions).toEqual({ accepted: 1, rejected: 1, needs_human_review: 1 });
    expect(result.data.evaluations.map((e) => e.id)).toEqual(["eval_refunds_001", "eval_rejected_001", "eval_review_001"]);
  });

  it("reporta costo desconocido cuando ningún run tiene cost_usd", async () => {
    const result = await loadOverview(fixtureDataSource);
    expect(result).toMatchObject({ ok: true, data: { cost: { known: 0, total: 1, knownTotalUsd: null } } });
  });

  it("propaga el error del proveedor en vez de mostrar un resumen vacío", async () => {
    const failing: C4DataSource = {
      ...fixtureDataSource,
      listIncidents: () => fixtureDataSource.listIncidents("provider_error"),
    };
    const result = await loadOverview(failing);
    expect(result).toMatchObject({ ok: false, status: 503, error: { code: "provider_unavailable" } });
  });
});
