import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PageHeader } from "@/components/app-shell";
import { ErrorState, LoadingState } from "@/components/states";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dataSource } from "@/lib/data";
import { formatCostUsd } from "@/lib/format";
import {
  APPROVAL_STATUS,
  CATEGORY,
  DECISION,
  INCIDENT_STATUS,
  JOB_STAGE,
  JOB_STATUS,
  PATCH_TYPE,
  RUN_STATUS,
  SEVERITY,
} from "@/lib/labels";
import type { Agent, Job, Report, Run } from "@/types/contracts";

export async function generateStaticParams() {
  const result = await dataSource.listIncidents();
  return result.ok ? result.data.items.map((incident) => ({ id: incident.id })) : [];
}

export async function generateMetadata(props: PageProps<"/incidents/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  return { title: `Incidente ${id}` };
}

function formatNullable(value: number | null, unit = ""): string {
  return value === null ? "Desconocido" : `${value.toLocaleString("es")}${unit}`;
}

function RunCard({ run, agent }: { run: Run; agent: Agent | undefined }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ejecución</CardTitle>
        <CardDescription className="font-mono">{run.id}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
          <dt className="text-muted-foreground">Estado</dt>
          <dd>
            <StatusBadge {...RUN_STATUS[run.status]} />
          </dd>
          <dt className="text-muted-foreground">Agente</dt>
          <dd>{agent ? `${agent.name} v${agent.version}` : <span className="font-mono">{run.agent_id}</span>}</dd>
          <dt className="text-muted-foreground">Fecha</dt>
          <dd>
            <time dateTime={run.created_at}>{new Date(run.created_at).toLocaleString("es", { timeZone: "UTC" })} UTC</time>
          </dd>
          <dt className="text-muted-foreground">Latencia</dt>
          <dd className="tabular-nums">{run.latency_ms.toLocaleString("es")} ms</dd>
          <dt className="text-muted-foreground">Tokens</dt>
          <dd className="tabular-nums">
            {formatNullable(run.usage.input_tokens)} entrada · {formatNullable(run.usage.output_tokens)} salida
          </dd>
          <dt className="text-muted-foreground">Costo</dt>
          <dd className="tabular-nums">{formatCostUsd(run.usage.cost_usd)}</dd>
        </dl>
        <div>
          <h3 className="mb-2 font-medium">Traza</h3>
          <ol className="flex flex-col gap-2">
            {run.trace.map((step, index) => (
              <li key={index} className="rounded-md border p-3">
                <p className="mb-1 font-medium">
                  Paso {String(step.step ?? index + 1)}
                  {typeof step.tool === "string" ? <span className="font-mono font-normal"> · {step.tool}</span> : null}
                </p>
                <pre className="overflow-x-auto font-mono text-xs whitespace-pre-wrap text-muted-foreground">
                  {JSON.stringify(
                    Object.fromEntries(Object.entries(step).filter(([key]) => key !== "step" && key !== "tool")),
                    null,
                    2,
                  )}
                </pre>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

/** Trabajos del incidente. queued/running nunca se presentan como éxito; un fallo muestra su error. */
function JobList({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) return <p className="text-sm text-muted-foreground">Sin trabajos registrados.</p>;
  return (
    <ul className="flex flex-col gap-2">
      {jobs.map((job) => (
        <li key={job.id} className="flex flex-col gap-1 rounded-md border p-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs">{job.id}</span>
            <StatusBadge {...JOB_STATUS[job.status]} />
            <span className="text-muted-foreground">
              Etapa: {JOB_STAGE[job.stage]} · {job.attempts} {job.attempts === 1 ? "intento" : "intentos"}
            </span>
          </div>
          {job.error ? (
            <p className="text-destructive">
              {job.error.message} (<code className="font-mono">{job.error.code}</code>
              {job.error.retryable ? ", reintentable" : ", no reintentable"})
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Actualizado <time dateTime={job.updated_at}>{new Date(job.updated_at).toLocaleString("es", { timeZone: "UTC" })} UTC</time>
          </p>
        </li>
      ))}
    </ul>
  );
}

async function IncidentDetail({ params }: { params: PageProps<"/incidents/[id]">["params"] }) {
  const { id } = await params;
  const incidentResult = await dataSource.getIncident(id);
  if (!incidentResult.ok) {
    if (incidentResult.status === 404) notFound();
    return <ErrorState status={incidentResult.status} error={incidentResult.error} />;
  }
  const incident = incidentResult.data;
  const [runResult, patchesResult, reportsResult, agentsResult, jobsResult] = await Promise.all([
    dataSource.getRun(incident.run_id),
    dataSource.listPatchesForIncident(incident.id),
    dataSource.listReportsForIncident(incident.id),
    dataSource.listAgents(),
    dataSource.listJobs(),
  ]);
  const agents = agentsResult.ok ? agentsResult.data.items : [];
  const reportByPatch = new Map<string, Report>(
    reportsResult.ok ? reportsResult.data.flatMap((r) => (r.patch_id ? [[r.patch_id, r] as const] : [])) : [],
  );
  const agentLabel = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    return agent ? `v${agent.version}` : agentId;
  };

  return (
    <>
      <PageHeader title={incident.summary}>
        <Link href="/incidents" className="w-fit text-sm text-muted-foreground underline-offset-4 hover:underline">
          ← Incidentes
        </Link>
      </PageHeader>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-mono text-muted-foreground">{incident.id}</span>
        <StatusBadge {...SEVERITY[incident.severity]} label={`Severidad ${SEVERITY[incident.severity].label.toLowerCase()}`} />
        <StatusBadge {...INCIDENT_STATUS[incident.status]} />
        <span>{CATEGORY[incident.category]}</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          {incident.root_cause ?? <span className="text-muted-foreground">Sin diagnóstico todavía.</span>}
        </CardContent>
      </Card>

      <section aria-labelledby="trabajos" className="flex flex-col gap-3">
        <h2 id="trabajos" className="text-lg font-semibold">
          Trabajos
        </h2>
        {jobsResult.ok ? (
          <JobList jobs={jobsResult.data.filter((job) => job.incident_id === incident.id)} />
        ) : (
          <ErrorState status={jobsResult.status} error={jobsResult.error} />
        )}
      </section>

      <section aria-labelledby="candidatos" className="flex flex-col gap-3">
        <h2 id="candidatos" className="text-lg font-semibold">
          Candidatos
        </h2>
        {!patchesResult.ok ? (
          <ErrorState status={patchesResult.status} error={patchesResult.error} />
        ) : patchesResult.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay candidatos para este incidente.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {patchesResult.data.map((patch) => {
              const report = reportByPatch.get(patch.id);
              return (
                <li key={patch.id}>
                  <Card size="sm">
                    <CardHeader>
                      <CardTitle className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm">{patch.id}</span>
                        <StatusBadge {...APPROVAL_STATUS[patch.approval_status]} />
                      </CardTitle>
                      <CardDescription>
                        {PATCH_TYPE[patch.patch_type]} · baseline {agentLabel(patch.baseline_agent_id)} → candidato{" "}
                        {agentLabel(patch.candidate_agent_id)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 text-sm">
                      <p>{patch.rationale}</p>
                      <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs whitespace-pre-wrap">{patch.diff}</pre>
                      {report ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-muted-foreground">Decisión:</span>
                          <StatusBadge {...DECISION[report.decision]} />
                          <span>{report.summary}</span>
                          {report.evaluation_id ? (
                            <Link
                              href={`/evaluations/${report.evaluation_id}`}
                              className="font-medium underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              Ver comparación
                            </Link>
                          ) : null}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Sin reporte de decisión.</p>
                      )}
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {runResult.ok ? (
        <RunCard run={runResult.data} agent={agents.find((a) => a.id === runResult.data.agent_id)} />
      ) : (
        <ErrorState status={runResult.status} error={runResult.error} />
      )}
    </>
  );
}

export default function IncidentPage(props: PageProps<"/incidents/[id]">) {
  return (
    <Suspense fallback={<LoadingState label="Cargando incidente…" />}>
      <IncidentDetail params={props.params} />
    </Suspense>
  );
}
