export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-16">
      <p className="w-fit rounded border border-current px-2 py-0.5 text-xs font-medium uppercase tracking-wide">
        Demo · datos sintéticos
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">C4 AI — Dashboard</h1>
      <p className="text-base">
        Base del dashboard (C4-004). Las vistas de incidentes, detalle y comparación se construyen
        sobre los fixtures de <code className="font-mono">examples/contracts</code>.
      </p>
    </main>
  );
}
