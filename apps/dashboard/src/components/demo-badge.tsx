/** Marca obligatoria para datos sintéticos (FR-005): no son resultados reales. */
export function DemoBadge() {
  return (
    <span
      className="inline-flex w-fit items-center rounded-md border border-warning/40 bg-warning/10 px-2 py-0.5 text-xs font-semibold tracking-wide text-warning uppercase"
      title="Datos sintéticos de examples/contracts; no representan ejecuciones reales."
    >
      Demo · datos sintéticos
    </span>
  );
}
