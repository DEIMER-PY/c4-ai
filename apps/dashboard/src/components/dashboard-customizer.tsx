"use client";

import { useState, useSyncExternalStore } from "react";
import { defaultPalette, paletteKey, paletteVariables, parsePalette, validComparison, type DashboardPalette } from "@/lib/dashboard-preferences";

let snapshot = defaultPalette;
const listeners = new Set<() => void>();
function apply(palette: DashboardPalette) {
  for (const [key, value] of Object.entries(paletteVariables(palette))) document.documentElement.style.setProperty(key, value);
  document.documentElement.dataset.c4CustomTheme = "true";
  snapshot = palette;
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  try { apply(parsePalette(localStorage.getItem(paletteKey))); } catch { apply(defaultPalette); }
  const onStorage = (event: StorageEvent) => { if (event.key === paletteKey || event.key === null) apply(parsePalette(event.newValue)); };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}
const getSnapshot = () => snapshot;
const getServerSnapshot = () => defaultPalette;

export function DashboardCustomizer() {
  const palette = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [persistence, setPersistence] = useState<boolean | null>(null);
  function update(next: DashboardPalette) {
    try { localStorage.setItem(paletteKey, JSON.stringify(next)); setPersistence(true); } catch { setPersistence(false); }
    apply(next);
  }
  return <details className="relative">
    <summary className="cursor-pointer rounded-lg border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Colores</summary>
    <section aria-label="Personalizar colores" className="absolute right-0 z-40 mt-3 w-[min(20rem,85vw)] space-y-4 rounded-xl border bg-popover p-5 text-popover-foreground shadow-xl">
      <h2 className="font-semibold">Tu espacio de trabajo</h2>
      <p className="text-xs">Colores locales. El texto ajusta su contraste automáticamente.</p>
      {([["accent", "Acento"], ["background", "Fondo"], ["surface", "Tarjetas"]] as const).map(([key, title]) => <label key={key} className="flex items-center justify-between gap-3 text-sm">
        {title}<span className="flex items-center gap-2"><code className="text-xs">{palette[key]}</code><input type="color" aria-label={title} value={palette[key]} onChange={(event) => update({ ...palette, [key]: event.target.value })} className="h-9 w-11 cursor-pointer rounded border" /></span>
      </label>)}
      <div className="flex flex-wrap gap-2">{[
        { name: "C4", palette: defaultPalette },
        { name: "Kit claro", palette: { accent: "#723ceb", background: "#f7f5fb", surface: "#ffffff" } },
        { name: "Kit oscuro", palette: { accent: "#723ceb", background: "#010101", surface: "#1f1f21" } },
        { name: "Océano", palette: { accent: "#5ee3e8", background: "#08171c", surface: "#11282e" } },
      ].map((preset) => <button key={preset.name} type="button" className="rounded-md border px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-ring" onClick={() => update(preset.palette)}>{preset.name}</button>)}</div>
      <button type="button" onClick={() => update(defaultPalette)} className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">Restablecer colores</button>
      <p role="status" className="text-xs">{persistence === null ? "Preferencias de este navegador; no se comparten con el equipo." : persistence ? "Preferencia guardada en este navegador." : "Solo esta sesión: almacenamiento local no disponible."}</p>
    </section>
  </details>;
}

export function DashboardDataLab() {
  const [values, setValues] = useState({ total: "6", before: "5", after: "6" });
  const total = Number(values.total), before = Number(values.before), after = Number(values.after);
  const valid = Object.values(values).every((v) => v.trim() !== "") && validComparison(total, before, after);
  return <section className="space-y-5 rounded-xl border bg-card p-6 text-card-foreground" aria-labelledby="data-lab-title">
    <div><p className="mb-2 text-xs font-semibold uppercase tracking-widest">Simulación local / datos editables</p><h2 id="data-lab-title" className="text-xl font-semibold">Explora una comparación</h2><p className="mt-2 max-w-3xl text-sm">Edita conteos para probar el diseño. Estos datos no proceden del API, no se guardan como evidencia y no representan una decisión del evaluador.</p></div>
    <div className="grid gap-4 sm:grid-cols-3">{([["total", "Casos totales"], ["before", "Baseline: casos aprobados"], ["after", "Candidato: casos aprobados"]] as const).map(([key, label]) => <label key={key} className="grid gap-2 text-sm">{label}<input type="number" min={key === "total" ? 1 : 0} max={key === "total" ? 10000 : total || 10000} step="1" value={values[key]} onChange={(event) => setValues({ ...values, [key]: event.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-ring" /></label>)}</div>
    {!valid ? <p role="alert" className="text-sm">Usa enteros: 1–10.000 casos y aprobados entre cero y el total.</p> : <div aria-live="polite" className="grid gap-4 sm:grid-cols-2">{[["Baseline", before], ["Candidato", after]].map(([label, count]) => <div key={label} className="rounded-lg border p-4"><div className="mb-3 flex justify-between gap-4 text-sm"><span>{label}</span><strong>{count} / {total} · {((Number(count) / total) * 100).toFixed(1)}%</strong></div><div role="meter" aria-label={`${label} simulado`} aria-valuemin={0} aria-valuemax={total} aria-valuenow={Number(count)} className="h-3 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${Number(count) / total * 100}%` }} /></div></div>)}</div>}
    <button type="button" className="rounded-lg border px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-ring" onClick={() => setValues({ total: "6", before: "5", after: "6" })}>Restablecer simulación</button>
  </section>;
}
