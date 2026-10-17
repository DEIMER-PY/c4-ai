import type { Evaluation } from "@/types/contracts";

export function EvaluationChart({ evaluations }: { evaluations: Evaluation[] }) {
  const rows = evaluations.filter((e) => e.status === "completed").slice(-12);
  if (!rows.length) return <p className="py-12 text-sm text-muted-foreground">Todavía no hay evaluaciones completas para comparar.</p>;
  return <div className="overflow-x-auto">
    <div className="mb-5 flex gap-5 text-xs text-muted-foreground"><span>● Baseline</span><span className="text-primary">● Candidato</span></div>
    <div className="flex h-48 min-w-[260px] items-end gap-3 border-b border-dashed border-border pt-5" role="img" aria-label="Porcentaje de casos aprobados por evaluación: baseline y candidato">
      {rows.map((e,i) => <div key={e.id} className="flex h-full min-w-6 flex-1 items-end justify-center gap-1" title={`${e.id}: baseline ${e.before.passed}/${e.before.total}; candidato ${e.after.passed}/${e.after.total}`}>
        <span className="w-3 rounded-t bg-muted-foreground/40" style={{height:`${e.before.total ? e.before.passed/e.before.total*100 : 0}%`}} />
        <span className="w-3 rounded-t bg-primary" style={{height:`${e.after.total ? e.after.passed/e.after.total*100 : 0}%`}} />
        <span className="sr-only">Evaluación {i+1}: {e.before.passed}/{e.before.total} antes, {e.after.passed}/{e.after.total} después.</span>
      </div>)}
    </div>
    <p className="mt-3 text-xs text-muted-foreground">Cada par representa una comparación completa. Altura: proporción de casos aprobados; no es una serie temporal.</p>
  </div>;
}
