import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { PageHeader } from "@/components/app-shell";
import { IncidentTable } from "@/components/incident-table";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { dataSource } from "@/lib/data";
import type { ListScenario } from "@/lib/data-source";

export const metadata: Metadata = { title: "Incidentes" };

const SCENARIOS: { value: ListScenario; label: string }[] = [
  { value: "default", label: "Con datos" },
  { value: "empty", label: "Lista vacía" },
  { value: "provider_error", label: "Proveedor caído" },
];

function toScenario(value: string | string[] | undefined): ListScenario {
  return SCENARIOS.some((s) => s.value === value) ? (value as ListScenario) : "default";
}

async function IncidentList({ searchParams }: { searchParams: PageProps<"/incidents">["searchParams"] }) {
  const scenario = toScenario((await searchParams).demo);
  const result = await dataSource.listIncidents(scenario);

  return (
    <>
      <nav aria-label="Escenario de demostración" className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Escenario:</span>
        {SCENARIOS.map((s) => (
          <Link
            key={s.value}
            href={s.value === "default" ? "/incidents" : `/incidents?demo=${s.value}`}
            aria-current={s.value === scenario ? "true" : undefined}
            className="rounded-md border px-2 py-1 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring aria-[current=true]:bg-foreground aria-[current=true]:text-background"
          >
            {s.label}
          </Link>
        ))}
      </nav>
      {!result.ok ? (
        <ErrorState status={result.status} error={result.error} />
      ) : result.data.items.length === 0 ? (
        <EmptyState title="No hay incidentes" description="Cuando C4 detecte un fallo en una ejecución aparecerá aquí." />
      ) : (
        <IncidentTable incidents={result.data.items} />
      )}
    </>
  );
}

export default function IncidentsPage(props: PageProps<"/incidents">) {
  return (
    <>
      <PageHeader title="Incidentes" description="Fallos detectados en ejecuciones de agentes, con su severidad y estado." />
      <Suspense fallback={<LoadingState label="Cargando incidentes…" />}>
        <IncidentList searchParams={props.searchParams} />
      </Suspense>
    </>
  );
}
