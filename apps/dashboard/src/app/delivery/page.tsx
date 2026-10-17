import Link from "next/link";
import { PageHeader } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeliveryPage() {
  return <>
    <PageHeader title="Entrega S1" description="Un ciclo completo, evidencia trazable y límites visibles. Esta vista no representa la aceptación oficial del reto." />
    <Card><CardHeader><CardTitle>Del fallo a una decisión verificable</CardTitle></CardHeader><CardContent className="space-y-4 text-sm leading-relaxed">
      <p>Grok diagnostica el fallo y propone un nuevo prompt. El modelo objetivo ejecuta baseline y candidato sobre el mismo dataset. El gate comprueba mejora, seguridad y regresiones antes de aceptar.</p>
      <ol className="grid gap-3 sm:grid-cols-3">{["1. Ejecutar CLI y guardar evidencia","2. Consultar API local","3. Revisar diagnóstico y comparación"].map((step) => <li className="rounded-lg border border-primary/25 bg-primary/5 p-4" key={step}>{step}</li>)}</ol>
      <p className="text-muted-foreground">Las pruebas usan casos sintéticos y respuestas reales de proveedores. No se aplican cambios a producción. El costo sigue desconocido donde no hay tarifas verificadas.</p>
      <Link href="/incidents" className="inline-block rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground">Abrir evidencia</Link>
    </CardContent></Card>
    <Card><CardHeader><CardTitle>Pendientes de publicación</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Repositorio y tablero siguen privados. Video, enlace del reporte y envío del formulario se verifican por separado; esta pantalla no implica que ya se hayan enviado.</CardContent></Card>
  </>;
}
