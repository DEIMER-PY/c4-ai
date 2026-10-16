import type { ApiError } from "@/types/contracts";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

/** Error de la API con su código; distingue fallos reintentables (p. ej. 503 del proveedor). */
export function ErrorState({ status, error }: { status: number; error: ApiError }) {
  return (
    <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
      <p className="font-medium text-destructive">
        {status === 503 ? "Proveedor no disponible" : "No se pudieron cargar los datos"}
      </p>
      <p className="mt-1 text-sm">{error.message}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Código <code className="font-mono">{error.code}</code> · HTTP {status} ·{" "}
        {error.retryable ? "Se puede reintentar más tarde." : "No es reintentable."}
      </p>
    </div>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <p role="status" className="animate-pulse text-sm text-muted-foreground">
      {label}
    </p>
  );
}
