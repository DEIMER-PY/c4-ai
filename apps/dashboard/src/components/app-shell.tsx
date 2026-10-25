import Link from "next/link";
import type { ReactNode } from "react";
import { Activity, ExternalLink, Search, ShieldCheck, Terminal } from "lucide-react";

import { DemoBadge } from "@/components/demo-badge";
import { NavLinks } from "@/components/nav-links";
import { dataMode } from "@/lib/data";
import { DashboardCustomizer } from "@/components/dashboard-customizer";
import { AppleIcon, GithubIcon, LinuxIcon, WindowsIcon } from "@/components/icons";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col lg:flex-row bg-background text-foreground">
      <a
        href="#contenido"
        className="sr-only rounded-md bg-background px-3 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:ring-2 focus:ring-ring"
      >
        Saltar al contenido
      </a>
      <header className="c4-sidebar border-b lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex flex-col gap-3 p-4 lg:sticky lg:top-0 lg:min-h-screen lg:gap-6 lg:p-5 lg:py-7">
          <Link href="/" className="flex w-fit items-center gap-3 rounded-md text-xl font-bold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="brand-mark"><ShieldCheck size={22} aria-hidden="true" /></span>
            C4<span className="text-primary">AI</span>
          </Link>
          <p className="hidden text-[10px] font-semibold tracking-[0.22em] text-muted-foreground lg:block">RELIABILITY DASHBOARD</p>
          <nav aria-label="Principal">
            <NavLinks />
          </nav>

          <div className="hidden rounded-xl border border-primary/20 bg-primary/5 p-4 lg:mt-auto lg:block">
            <div className="flex items-center justify-between mb-2">
              <Terminal className="text-primary" size={18} aria-hidden="true" />
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">Grok-4.7</span>
            </div>
            <p className="text-sm font-semibold">Tu agente, bajo control.</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Tolerancia cero a regresiones. Solo parches verificados.</p>
            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-primary/10">
              <span className="text-[10px] text-muted-foreground">SO:</span>
              <WindowsIcon className="size-3 text-cyan-400" />
              <AppleIcon className="size-3 text-muted-foreground" />
              <LinuxIcon className="size-3 text-yellow-400" />
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-between text-xs text-muted-foreground pt-2">
            <a
              href="https://github.com/DEIMER-PY/c4-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <GithubIcon className="size-3.5" /> GitHub
            </a>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors text-[11px]"
            >
              Web <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </header>
      <div className="min-w-0 flex-1 flex flex-col">
        <div className="c4-topbar flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4 md:px-8">
          <form action="/incidents" className="flex min-w-0 flex-1 items-center gap-3 rounded-lg bg-muted/40 px-3 py-2 sm:max-w-md border border-border/50">
            <Search size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="search-incidents" className="sr-only">Buscar incidentes</label>
            <input id="search-incidents" name="q" placeholder="Buscar incidente, estado o ID…" className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary" />
          </form>
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="https://github.com/DEIMER-PY/c4-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            >
              <GithubIcon className="size-3.5" />
              <span>Repo</span>
            </a>
            <DashboardCustomizer />
            <DemoBadge live={dataMode === "api"} />
            <span className="hidden items-center gap-2 text-xs text-muted-foreground xl:flex">
              <Activity size={15} className="text-primary" aria-hidden="true" /> S1 / Testbed local
            </span>
          </div>
        </div>
        <main id="contenido" className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-7 px-5 py-7 md:px-8 md:py-9 flex-1">
          {children}
        </main>
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border/40 px-5 py-4 text-xs text-muted-foreground md:px-8">
          <span>C4 AI · Confiabilidad de agentes · Predicciones sobre casos sintéticos</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <WindowsIcon className="size-3 text-cyan-400" /> Windows
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <AppleIcon className="size-3" /> macOS
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <LinuxIcon className="size-3 text-yellow-400" /> Linux
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {children}
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
