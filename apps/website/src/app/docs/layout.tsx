import type { ReactNode } from "react";

import { DocsSidebar } from "@/components/docs-sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[220px_1fr] lg:py-16">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <details className="rounded-xl border border-rule bg-paper-raised p-4 lg:hidden">
          <summary className="cursor-pointer font-medium">Índice de la documentación</summary>
          <div className="mt-4">
            <DocsSidebar />
          </div>
        </details>
        <div className="hidden lg:block">
          <DocsSidebar />
        </div>
      </aside>
      <article className="min-w-0 max-w-[70ch]">{children}</article>
    </div>
  );
}
