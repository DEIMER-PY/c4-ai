import Link from "next/link";

import { PageHeader } from "@/components/app-shell";

export default function NotFound() {
  return (
    <>
      <PageHeader title="Recurso no encontrado" description="El identificador no existe en los datos disponibles." />
      <Link href="/incidents" className="w-fit text-sm underline underline-offset-4">
        Volver a incidentes
      </Link>
    </>
  );
}
