"use client";

import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Workflow, FileCheck2 } from "lucide-react";

// Solo secciones implementadas; el resto de la navegación de DASHBOARD.md llega con sus vistas.
const ITEMS = [
  { href: "/", label: "Centro de control", short: "Resumen", icon: LayoutDashboard },
  { href: "/incidents", label: "Incidentes", short: "Incidentes", icon: Workflow },
  { href: "/delivery", label: "Entrega S1", short: "Entrega", icon: FileCheck2 },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex flex-wrap gap-2 lg:flex-col">
      {ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon size={17} aria-hidden="true" /><span className="sm:hidden">{item.short}</span><span className="hidden sm:inline">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
