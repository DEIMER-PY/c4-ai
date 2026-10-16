import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CATEGORY, INCIDENT_STATUS, SEVERITY } from "@/lib/labels";
import type { Incident } from "@/types/contracts";

function IncidentLink({ incident }: { incident: Incident }) {
  return (
    <Link
      href={`/incidents/${incident.id}`}
      className="font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
    >
      {incident.summary}
    </Link>
  );
}

/** Tabla en escritorio; en móvil, lista apilada para no esconder severidad ni estado tras un scroll lateral. */
export function IncidentTable({ incidents }: { incidents: Incident[] }) {
  return (
    <>
      <ul className="flex flex-col gap-3 md:hidden" aria-label="Incidentes detectados">
        {incidents.map((incident) => (
          <li key={incident.id} className="flex flex-col gap-2 rounded-xl border p-4">
            <IncidentLink incident={incident} />
            <p className="font-mono text-xs text-muted-foreground">{incident.id}</p>
            <div className="flex flex-wrap gap-2">
              <StatusBadge {...SEVERITY[incident.severity]} label={`Severidad ${SEVERITY[incident.severity].label.toLowerCase()}`} />
              <StatusBadge {...INCIDENT_STATUS[incident.status]} />
            </div>
            <p className="text-sm">{CATEGORY[incident.category]}</p>
            <p className="font-mono text-xs">Ejecución {incident.run_id}</p>
          </li>
        ))}
      </ul>
      <div className="hidden md:block">
        <IncidentRows incidents={incidents} />
      </div>
    </>
  );
}

function IncidentRows({ incidents }: { incidents: Incident[] }) {
  return (
    <Table>
      <caption className="sr-only">Incidentes detectados</caption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Incidente</TableHead>
          <TableHead scope="col">Categoría</TableHead>
          <TableHead scope="col">Severidad</TableHead>
          <TableHead scope="col">Estado</TableHead>
          <TableHead scope="col">Ejecución</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incidents.map((incident) => (
          <TableRow key={incident.id}>
            <TableCell className="max-w-sm whitespace-normal">
              <IncidentLink incident={incident} />
              <p className="font-mono text-xs text-muted-foreground">{incident.id}</p>
            </TableCell>
            <TableCell>{CATEGORY[incident.category]}</TableCell>
            <TableCell>
              <StatusBadge {...SEVERITY[incident.severity]} />
            </TableCell>
            <TableCell>
              <StatusBadge {...INCIDENT_STATUS[incident.status]} />
            </TableCell>
            <TableCell className="font-mono text-xs">{incident.run_id}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
