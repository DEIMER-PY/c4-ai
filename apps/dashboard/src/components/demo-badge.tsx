/** Marca obligatoria para datos sintéticos (FR-005): no son resultados reales. */
export function DemoBadge({ live = false }: { live?: boolean }) {
  return (
    <span
      className={live ? "inline-flex w-fit items-center rounded-md border border-cyan-400/25 bg-cyan-400/10 px-2 py-1 text-[10px] font-semibold tracking-wide text-cyan-200 uppercase" : "inline-flex w-fit items-center rounded-md border border-warning/40 bg-warning/10 px-2 py-1 text-[10px] font-semibold tracking-wide text-warning uppercase"}
      title={live ? "API local de resultados CLI sobre casos sintéticos; no indica disponibilidad del servidor." : "Fixtures sintéticos; no representan ejecuciones reales."}
    >
      {live ? "API local · casos sintéticos" : "Demo · datos sintéticos"}
    </span>
  );
}
