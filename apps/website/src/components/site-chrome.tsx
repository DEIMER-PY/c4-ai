import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight" aria-label="C4 AI, inicio">
      <Image src="/brand/c4-mark-128.png" alt="" width={125} height={128} priority className="h-auto w-[30px]" />
      <span className="text-[17px]">C4 AI</span>
    </Link>
  );
}

const NAV = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#evidencia", label: "Evidencia" },
  { href: "/docs/", label: "Documentación" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule/70 bg-paper/85 backdrop-blur">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded-md focus:bg-paper-raised focus:px-3 focus:py-2"
      >
        Saltar al contenido
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Principal" className="flex items-center gap-1 text-sm">
          {NAV.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-ink-soft transition-colors hover:text-ink ${index < NAV.length - 1 ? "hidden sm:block" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/docs/instalacion/"
            className="ml-1 rounded-full bg-ink px-4 py-2 font-medium text-paper transition-colors hover:bg-violet-deep"
          >
            Instalar
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-ink-soft sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex max-w-sm flex-col gap-3">
          <Logo />
          <p>
            Ingeniero de confiabilidad para agentes de IA. Proyecto del reto, en desarrollo; los ejemplos usan casos
            sintéticos y agentes de prueba.
          </p>
        </div>
        <nav aria-label="Pie de página" className="grid grid-cols-2 gap-x-10 gap-y-2">
          <Link className="hover:text-ink" href="/docs/">Documentación</Link>
          <Link className="hover:text-ink" href="/docs/instalacion/">Instalación</Link>
          <Link className="hover:text-ink" href="/docs/cli/">CLI</Link>
          <Link className="hover:text-ink" href="/docs/limites/">Límites y seguridad</Link>
        </nav>
      </div>
    </footer>
  );
}
