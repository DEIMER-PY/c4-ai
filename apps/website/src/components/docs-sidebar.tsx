"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DOCS, type DocEntry } from "@/content/docs";

const GROUPS: DocEntry["group"][] = ["Empezar", "Usar C4", "Escala y Observabilidad", "Referencia"];

export function DocsSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname === href.replace(/\/$/, "");

  return (
    <nav aria-label="Documentación" className="flex flex-col gap-6 text-[15px]">
      <Link
        href="/docs/"
        aria-current={isActive("/docs/") ? "page" : undefined}
        className="font-medium text-ink-soft hover:text-ink aria-[current=page]:text-violet-deep"
      >
        Introducción
      </Link>
      {GROUPS.map((group) => (
        <div key={group} className="flex flex-col gap-1">
          <p className="mb-1 text-sm font-semibold text-ink">{group}</p>
          {DOCS.filter((d) => d.group === group).map((doc) => {
            const href = `/docs/${doc.slug}/`;
            return (
              <Link
                key={doc.slug}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className="rounded-md border-l-2 border-transparent py-1 pl-3 text-ink-soft hover:text-ink aria-[current=page]:border-violet aria-[current=page]:font-medium aria-[current=page]:text-ink"
              >
                {doc.title}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
