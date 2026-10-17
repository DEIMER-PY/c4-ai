import Link from "next/link";
import type { ReactNode } from "react";
import { Activity, ArrowUpRight, Search, ShieldCheck, Terminal } from "lucide-react";

import { DemoBadge } from "@/components/demo-badge";
import { NavLinks } from "@/components/nav-links";
import { dataMode } from "@/lib/data";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col lg:flex-row">
      <a
        href="#contenido"
        className="sr-only rounded-md bg-background px-3 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:ring-2 focus:ring-ring"
      >
        Saltar al contenido
      </a>
      <header className="c4-sidebar border-b lg:w-60 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex flex-col gap-3 p-4 lg:sticky lg:top-0 lg:min-h-screen lg:gap-7 lg:p-5 lg:py-8">
          <Link href="/" className="flex w-fit items-center gap-3 rounded-md text-xl font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="brand-mark"><ShieldCheck size={23} aria-hidden="true" /></span>
            C4<span className="text-primary">AI</span>
          </Link>
          <p className="hidden text-[10px] font-semibold tracking-[0.22em] text-muted-foreground lg:block">AGENT RELIABILITY</p>
          <nav aria-label="Principal">
            <NavLinks />
          </nav>
          <div className="hidden rounded-xl border border-primary/20 bg-primary/5 p-4 lg:mt-auto lg:block">
            <Terminal className="mb-3 text-primary" size={20} aria-hidden="true" />
            <p className="text-sm font-medium">Tu agente, bajo control.</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Del incidente a una decisión respaldada por evidencia.</p>
            <Link href="/delivery" className="mt-4 inline-flex items-center gap-2 text-xs text-primary">Revisar entrega S1 <ArrowUpRight size={14} aria-hidden="true" /></Link>
          </div>
        </div>
      </header>
      <div className="min-w-0 flex-1">
      <div className="c4-topbar flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4 md:px-8">
        <form action="/incidents" className="flex min-w-0 flex-1 items-center gap-3 rounded-lg bg-muted/50 px-3 py-2 sm:max-w-md">
          <Search size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="search-incidents" className="sr-only">Buscar incidentes</label>
          <input id="search-incidents" name="q" placeholder="Buscar incidente, estado o ID…" className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary" />
        </form>
        <div className="flex items-center gap-4"><DemoBadge live={dataMode === "api"} /><span className="hidden items-center gap-2 text-xs text-muted-foreground xl:flex"><Activity size={15} aria-hidden="true" /> S1 / Testbed local</span></div>
      </div>
      <main id="contenido" className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-7 px-5 py-7 md:px-8 md:py-9">
        {children}
      </main>
      <footer className="px-5 pb-5 text-xs text-muted-foreground md:px-8">C4 AI · Confiabilidad de agentes · Predicciones sobre casos sintéticos</footer>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {children}
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
