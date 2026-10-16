"use client";

import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Solo secciones implementadas; el resto de la navegación de DASHBOARD.md llega con sus vistas.
const ITEMS = [
  { href: "/", label: "Resumen" },
  { href: "/incidents", label: "Incidentes" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex gap-1 md:flex-col">
      {ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "bg-foreground text-background" : "text-foreground hover:bg-muted",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
