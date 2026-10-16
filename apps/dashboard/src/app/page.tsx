import Link from "next/link";

import { PageHeader } from "@/components/app-shell";
import { ErrorState } from "@/components/states";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dataSource } from "@/lib/data";
import { formatCostUsd, formatScore } from "@/lib/format";
import { DECISION, EVALUATION_STATUS, INCIDENT_STATUS, JOB_STATUS } from "@/lib/labels";
import { loadOverview } from "@/lib/overview";
import { INCIDENT_STATUSES, JOB_STATUSES, DECISIONS } from "@/types/contracts";

function CountList<K extends string>({
  keys,
  counts,
  labels,
}: {
  keys: readonly K[];
  counts: Partial<Record<K, number>>;
  labels: Record<K, { label: string; tone: "success" | "danger" | "warning" | "neutral" }>;
}) {
  const present = keys.filter((key) => (counts[key] ?? 0) > 0);
  if (present.length === 0) return <p className="text-sm text-muted-foreground">Sin registros.</p>;
  return (
    <ul className="flex flex-col gap-2">
      {present.map((key) => (
        <li key={key} className="flex items-center justify-between gap-2">
          <StatusBadge {...labels[key]} />
          <span className="font-mono text-sm tabular-nums">{counts[key]}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function OverviewPage() {
  const result = await loadOverview(dataSource);
  if (!result.ok) {
    return (
      <>
        <PageHeader title="Resumen" />
        <ErrorState status={result.status} error={result.error} />
      </>
    );
  }
  const { data } = result;

  return (
    <>
      <PageHeader
        title="Resumen"
        description="Estado de incidentes, trabajos, decisiones y evaluaciones. Derivado de los fixtures: aún no existe el contrato de /metrics."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Incidentes</CardTitle>
            <CardDescription>
              {data.incidentCount} en total · <Link href="/incidents" className="underline underline-offset-4">ver lista</Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CountList keys={INCIDENT_STATUSES} counts={data.incidentsByStatus} labels={INCIDENT_STATUS} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Trabajos</CardTitle>
            <CardDescription>En cola y en ejecución no cuentan como éxito.</CardDescription>
          </CardHeader>
          <CardContent>
            <CountList keys={JOB_STATUSES} counts={data.jobsByStatus} labels={JOB_STATUS} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Decisiones</CardTitle>
            <CardDescription>Reportes por decisión final.</CardDescription>
          </CardHeader>
          <CardContent>
            <CountList keys={DECISIONS} counts={data.decisions} labels={DECISION} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Costo</CardTitle>
            <CardDescription>
              Cobertura: {data.cost.known} de {data.cost.total} ejecuciones con costo conocido.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{formatCostUsd(data.cost.knownTotalUsd)}</p>
          </CardContent>
        </Card>
      </div>

      <section aria-labelledby="evaluaciones" className="flex flex-col gap-3">
        <h2 id="evaluaciones" className="text-lg font-semibold">
          Evaluaciones
        </h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {data.evaluations.map((evaluation) => (
            <li key={evaluation.id}>
              <Card size="sm">
                <CardHeader>
                  <CardTitle className="font-mono text-sm">{evaluation.id}</CardTitle>
                  <CardDescription>
                    {evaluation.dataset_id} v{evaluation.dataset_version}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <StatusBadge {...EVALUATION_STATUS[evaluation.status]} />
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                    <dt className="text-muted-foreground">Antes</dt>
                    <dd className="tabular-nums">{formatScore(evaluation.before)}</dd>
                    <dt className="text-muted-foreground">Después</dt>
                    <dd className="tabular-nums">{formatScore(evaluation.after)}</dd>
                    <dt className="text-muted-foreground">Regresiones</dt>
                    <dd className="tabular-nums">{evaluation.regressions.length}</dd>
                  </dl>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
