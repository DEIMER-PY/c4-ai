import Link from "next/link";
import { Suspense } from "react";
import { Activity, ShieldCheck, GitCompareArrows, Cpu, ArrowUpRight, Terminal } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { EvaluationChart } from "@/components/evaluation-chart";
import { ErrorState } from "@/components/states";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dataMode, dataSource } from "@/lib/data";
import { formatCostUsd, formatScore } from "@/lib/format";
import { DECISION, EVALUATION_STATUS } from "@/lib/labels";
import { loadOverview } from "@/lib/overview";
import { DECISIONS } from "@/types/contracts";

async function OverviewContent() {
 const result = await loadOverview(dataSource);
 if (!result.ok) return <><PageHeader title="Centro de control" /><ErrorState status={result.status} error={result.error} /></>;
 const { data } = result;
 const metrics = [
  { title:"Incidentes registrados", value:data.incidentCount, note:"Detectados en el almacén consultado", icon:Activity, color:"text-primary" },
  { title:"Candidatos aceptados", value:data.decisions.accepted ?? 0, note:"Con reporte de evaluación", icon:ShieldCheck, color:"text-success" },
  { title:"Regresiones detectadas", value:data.evaluations.reduce((s,e)=>s+e.regressions.length,0), note:"Casos que dejaron de pasar", icon:GitCompareArrows, color:"text-pink-300" },
  { title:"Tokens del baseline inicial", value:data.usage.tokens.toLocaleString("es"), note:`Cobertura ${data.usage.knownRuns}/${data.usage.totalRuns} ejecuciones iniciales`, icon:Cpu, color:"text-cyan-300" },
 ];
 return <>
  <PageHeader title="Centro de control" description={dataMode === "api" ? "Evidencia del CLI, consultada desde tu API local. Cada decisión conserva su contexto." : "Modo Demo: fixtures sintéticos, separados de las ejecuciones del CLI."} />
  <section className="c4-hero overflow-hidden rounded-2xl border border-primary/20 p-6 md:p-8"><div className="flex flex-wrap items-center justify-between gap-6">
   <div className="max-w-xl"><p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-primary">C4 AI / RELIABILITY HARNESS</p><h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Menos incertidumbre.<br /><span className="text-primary">Más evidencia.</span></h2><p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">Detecta fallos, compara candidatos y rechaza las correcciones que introducen regresiones.</p></div>
   <div className="flex flex-col gap-3"><div className="flex items-center gap-2 rounded-xl border border-primary/25 bg-background/30 p-4 font-mono text-xs"><Terminal size={17} className="text-primary" aria-hidden="true" />c4 --target-provider groq tui</div><Link href="/incidents" className="flex items-center justify-between rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Explorar incidentes <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
  </div></section>
  <section aria-label="Métricas de la evidencia disponible" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((m)=><article key={m.title} className="c4-kpi"><div className="flex items-center justify-between gap-3"><h2 className="text-xs text-muted-foreground">{m.title}</h2><m.icon size={18} className={m.color} aria-hidden="true" /></div><strong>{m.value}</strong><p className="text-[11px] leading-relaxed text-muted-foreground">{m.note}</p></article>)}</section>
  <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
   <Card><CardHeader><CardTitle>Baseline y candidato</CardTitle><CardDescription>Comparaciones completas del mismo dataset por ejecución.</CardDescription></CardHeader><CardContent><EvaluationChart evaluations={data.evaluations} /></CardContent></Card>
   <Card><CardHeader><CardTitle>Decisiones con evidencia</CardTitle><CardDescription>Aceptar no significa aplicar a producción.</CardDescription></CardHeader><CardContent className="space-y-5">{DECISIONS.map((d)=><div className="flex items-center justify-between gap-3" key={d}><StatusBadge {...DECISION[d]} /><span className="font-mono text-xl">{data.decisions[d] ?? 0}</span></div>)}<div className="border-t pt-4 text-xs leading-relaxed text-muted-foreground">Costo conocido: <span className="text-foreground">{formatCostUsd(data.cost.knownTotalUsd)}</span><br />Cobertura {data.cost.known}/{data.cost.total}.<br />{data.jobsAvailable ? "Trabajos consultados desde la fuente Demo." : "Listado global de trabajos: no disponible en API v1."}</div></CardContent></Card>
  </div>
  <section aria-labelledby="evaluaciones" className="space-y-4"><div className="flex items-center justify-between"><h2 id="evaluaciones" className="text-lg font-semibold">Evaluaciones registradas</h2><Link href="/incidents" className="text-xs text-primary">Ver incidentes →</Link></div>
   {data.evaluations.length===0 ? <p className="text-sm text-muted-foreground">Sin evaluaciones disponibles todavía.</p> : <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.evaluations.map((e)=><li key={e.id}><Card size="sm"><CardHeader><div className="flex items-center justify-between gap-3"><CardTitle className="text-sm">{e.dataset_id}</CardTitle><StatusBadge {...EVALUATION_STATUS[e.status]} /></div><CardDescription>Dataset v{e.dataset_version}</CardDescription></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex items-center justify-between rounded-lg bg-muted/50 p-3"><span>{formatScore(e.before)}</span><span className="text-primary">→</span><strong>{formatScore(e.after)}</strong></div><div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">{e.regressions.length} regresiones</span><Link href={`/evaluations/${encodeURIComponent(e.id)}`} className="text-primary underline-offset-4 hover:underline">Ver comparación</Link></div><p className="break-all font-mono text-[10px] text-muted-foreground">{e.id}</p></CardContent></Card></li>)}</ul>}
  </section>
 </>;
}

export default function OverviewPage() { return <Suspense fallback={<p className="text-muted-foreground">Cargando evidencia local…</p>}><OverviewContent /></Suspense>; }
