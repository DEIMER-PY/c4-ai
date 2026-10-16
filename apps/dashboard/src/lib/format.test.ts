import { describe, expect, it } from "vitest";

import { formatCostUsd, formatScore, NO_DATA, passRate, UNKNOWN_COST } from "@/lib/format";

describe("formatCostUsd", () => {
  it("muestra null como Desconocido y no como cero", () => {
    expect(formatCostUsd(null)).toBe(UNKNOWN_COST);
  });

  it("formatea cero como un costo conocido", () => {
    expect(formatCostUsd(0)).not.toBe(UNKNOWN_COST);
    expect(formatCostUsd(0)).toMatch(/0,00/);
  });

  it("conserva hasta cuatro decimales para costos pequeños", () => {
    expect(formatCostUsd(0.0123)).toMatch(/0,0123/);
  });
});

describe("formatScore / passRate", () => {
  it("devuelve Sin datos con total 0 en vez de 0 %", () => {
    expect(passRate({ passed: 0, total: 0 })).toBeNull();
    expect(formatScore({ passed: 0, total: 0 })).toBe(NO_DATA);
  });

  it("muestra conteo y porcentaje", () => {
    expect(formatScore({ passed: 1, total: 2 })).toMatch(/^1\/2 \(50\s?%\)$/);
    expect(formatScore({ passed: 2, total: 2 })).toMatch(/^2\/2 \(100\s?%\)$/);
  });
});
