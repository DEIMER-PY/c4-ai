import Link from "next/link";
import type { ReactNode } from "react";

import { DemoBadge } from "@/components/demo-badge";
import { NavLinks } from "@/components/nav-links";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col md:flex-row">
      <a
        href="#contenido"
        className="sr-only rounded-md bg-background px-3 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:ring-2 focus:ring-ring"
      >
        Saltar al contenido
      </a>
      <header className="border-b md:w-56 md:shrink-0 md:border-r md:border-b-0">
        <div className="flex flex-col gap-3 p-4 md:sticky md:top-0">
          <Link href="/" className="w-fit rounded-md text-lg font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring">
            C4 AI
          </Link>
          <DemoBadge />
          <nav aria-label="Principal">
            <NavLinks />
          </nav>
        </div>
      </header>
      <main id="contenido" className="flex w-full max-w-6xl min-w-0 flex-1 flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        {children}
      </main>
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
