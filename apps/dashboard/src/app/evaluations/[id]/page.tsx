import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PageHeader } from "@/components/app-shell";
import { ErrorState, LoadingState } from "@/components/states";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { caseRows, gateChecks, isEvidenceIncomplete } from "@/lib/comparison";
import { dataSource } from "@/lib/data";
import { formatScore } from "@/lib/format";
import { APPROVAL_STATUS, CASE_CHANGE, CHECK_STATE, DECISION, EVALUATION_STATUS, PASSED, PATCH_TYPE } from "@/lib/labels";
import type { Evaluation, Report } from "@/types/contracts";

/** No hay listado de evaluaciones en el contrato: se recorren incidentes → reports (como en el resumen). */
export async function generateStaticParams() {
  const incidents = await dataSource.listIncidents();
  if (!incidents.ok) return [];
  const reports = await Promise.all(incidents.data.items.map((i) => dataSource.listReportsForIncident(i.id)));
  return reports.flatMap((r) => (r.ok ? r.data : [])).flatMap((r) => (r.evaluation_id ? [{ id: r.evaluation_id }] : []));
}

export async function generateMetadata(props: PageProps<"/evaluations/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  return { title: `Evaluación ${id}` };
}

function DecisionBanner({ report, evaluation }: { report: Report | undefined; evaluation: Evaluation }) {
  const incomplete = isEvidenceIncomplete(evaluation);
  return (
    <div
      role={incomplete ? "alert" : undefined}
      className="flex flex-col gap-2 rounded-xl border p-4 data-[incomplete=true]:border-warning/40 data-[incomplete=true]:bg-warning/5"
      data-incomplete={incomplete}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Decisión final:</span>
        {report ? <StatusBadge {...DECISION[report.decision]} /> : <StatusBadge label="Sin reporte" tone="warning" />}
      </div>
      {report ? <p className="text-sm">{report.summary}</p> : null}
      {incomplete ? (
        <p className="text-sm font-medium text-warning">
          Evidencia incompleta: la evaluación no terminó o no tiene casos comparables. El candidato no puede aceptarse y
          requiere revisión humana.
        </p>
      ) : null}
      {report && report.evidence_refs.length > 0 ? (
        <p className="text-xs text-muted-foreground">
          Evidencia: <span className="font-mono">{report.evidence_refs.join(", ")}</span>
        </p>
      ) : null}
    </div>
  );
}

function ScoreCard({ title, score, agent }: { title: string; score: Evaluation["before"]; agent: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="font-mono">{agent}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums">{formatScore(score)}</p>
        <p className="text-xs text-muted-foreground">casos aprobados</p>
      </CardContent>
    </Card>
  );
}

async function EvaluationDetail({ params }: { params: PageProps<"/evaluations/[id]">["params"] }) {
  const { id } = await params;
  const evaluationResult = await dataSource.getEvaluation(id);
  if (!evaluationResult.ok) {
    if (evaluationResult.status === 404) notFound();
    return <ErrorState status={evaluationResult.status} error={evaluationResult.error} />;
  }
  const evaluation = evaluationResult.data;
  const patchResult = await dataSource.getPatch(evaluation.patch_id);
  if (!patchResult.ok) return <ErrorState status={patchResult.status} error={patchResult.error} />;
  const patch = patchResult.data;
  const [reportsResult, agentsResult] = await Promise.all([
    dataSource.listReportsForIncident(patch.incident_id),
    dataSource.listAgents(),
  ]);
  const report = reportsResult.ok ? reportsResult.data.find((r) => r.evaluation_id === evaluation.id) : undefined;
  const agentLabel = (agentId: string) => {
    const agent = agentsResult.ok ? agentsResult.data.items.find((a) => a.id === agentId) : undefined;
    return agent ? `${agent.id} · v${agent.version}` : agentId;
  };
  const rows = caseRows(evaluation);

  return (
    <>
      <PageHeader title="Comparación baseline / candidato">
        <Link
          href={`/incidents/${patch.incident_id}`}
          className="w-fit text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Incidente {patch.incident_id}
        </Link>
      </PageHeader>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-mono text-muted-foreground">{evaluation.id}</span>
        <StatusBadge {...EVALUATION_STATUS[evaluation.status]} />
        <span>
          Dataset <span className="font-mono">{evaluation.dataset_id}</span> v{evaluation.dataset_version}
        </span>
      </div>

      <DecisionBanner report={report} evaluation={evaluation} />

      <div className="grid gap-4 sm:grid-cols-2">
        <ScoreCard title="Baseline (antes)" score={evaluation.before} agent={agentLabel(patch.baseline_agent_id)} />
        <ScoreCard title="Candidato (después)" score={evaluation.after} agent={agentLabel(patch.candidate_agent_id)} />
      </div>

      <section aria-labelledby="regresiones" className="flex flex-col gap-2">
        <h2 id="regresiones" className="text-lg font-semibold">
          Regresiones
        </h2>
        {evaluation.regressions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {evaluation.status === "completed" ? "Ninguna: ningún caso que pasaba dejó de pasar." : "Sin datos: la evaluación no se completó."}
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {evaluation.regressions.map((caseId) => (
              <li key={caseId}>
                <StatusBadge tone="danger" label={caseId} className="font-mono" />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="casos" className="flex flex-col gap-2">
        <h2 id="casos" className="text-lg font-semibold">
          Resultados por caso
        </h2>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay resultados por caso en esta evaluación.</p>
        ) : (
          <Table>
            <caption className="sr-only">Resultado de cada caso antes y después del candidato</caption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Caso</TableHead>
                <TableHead scope="col">Antes</TableHead>
                <TableHead scope="col">Después</TableHead>
                <TableHead scope="col">Cambio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.case_id}>
                  <TableCell className="font-mono text-xs break-all whitespace-normal">
                    {row.case_id}
                    {row.isTarget ? <span className="block font-sans text-muted-foreground">caso objetivo</span> : null}
                  </TableCell>
                  <TableCell>
                    <StatusBadge {...PASSED[String(row.before_passed) as "true" | "false"]} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge {...PASSED[String(row.after_passed) as "true" | "false"]} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge {...CASE_CHANGE[row.change]} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <section aria-labelledby="criterios" className="flex flex-col gap-2">
        <h2 id="criterios" className="text-lg font-semibold">
          Criterios del protocolo
        </h2>
        <p className="text-sm text-muted-foreground">
          Lectura de la evidencia según el protocolo de evaluación. La decisión vinculante es la del reporte.
        </p>
        <ul className="flex flex-col gap-2">
          {gateChecks(evaluation).map((check) => (
            <li key={check.id} className="flex items-start gap-2 text-sm">
              <StatusBadge {...CHECK_STATE[check.state]} className="min-w-24 justify-center" />
              {check.label}
            </li>
          ))}
        </ul>
      </section>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            Candidato <span className="font-mono text-sm">{patch.id}</span>
            <StatusBadge {...APPROVAL_STATUS[patch.approval_status]} />
          </CardTitle>
          <CardDescription>{PATCH_TYPE[patch.patch_type]} · {patch.rationale}</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs whitespace-pre-wrap">{patch.diff}</pre>
        </CardContent>
      </Card>
    </>
  );
}

export default function EvaluationPage(props: PageProps<"/evaluations/[id]">) {
  return (
    <Suspense fallback={<LoadingState label="Cargando evaluación…" />}>
      <EvaluationDetail params={props.params} />
    </Suspense>
  );
}
