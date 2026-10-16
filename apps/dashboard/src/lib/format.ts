import type { Score } from "@/types/contracts";

export const UNKNOWN_COST = "Desconocido";
export const NO_DATA = "Sin datos";

const usd = new Intl.NumberFormat("es", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

/** cost_usd null significa costo desconocido: nunca se muestra como 0. */
export function formatCostUsd(cost: number | null): string {
  return cost === null ? UNKNOWN_COST : usd.format(cost);
}

/** Tasa de aprobación en [0, 1], o null si no hubo casos evaluados. */
export function passRate(score: Score): number | null {
  return score.total === 0 ? null : score.passed / score.total;
}

/** "2/2 (100 %)"; con total 0 devuelve "Sin datos" en vez de un 0 % engañoso (CL-005). */
export function formatScore(score: Score): string {
  const rate = passRate(score);
  if (rate === null) return NO_DATA;
  const percent = new Intl.NumberFormat("es", { style: "percent", maximumFractionDigits: 0 }).format(rate);
  return `${score.passed}/${score.total} (${percent})`;
}
