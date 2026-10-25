import Image from "next/image";
import Link from "next/link";
import { AppleIcon, GithubIcon, LinuxIcon, WindowsIcon, YouTubeIcon } from "@/components/icons";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight" aria-label="C4 AI, inicio">
      <Image src="/brand/c4-mark-128.png" alt="" width={125} height={128} priority className="h-auto w-[30px]" />
      <span className="text-[17px] font-bold tracking-tight text-ink">
        C4<span className="text-cyan">AI</span>
      </span>
    </Link>
  );
}

const NAV = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#video", label: "Video Demo" },
  { href: "/#evidencia", label: "Evidencia" },
  { href: "/docs/", label: "Documentación" },
];

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-40 border-b border-rule/70 bg-paper/90 backdrop-blur-md">
      <div aria-hidden className="scroll-progress absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-violet via-cyan to-pass" />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-paper-raised focus:px-3 focus:py-2 focus:text-ink"
      >
        Saltar al contenido
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Principal" className="flex items-center gap-2 text-sm">
          {NAV.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-ink-soft transition-colors hover:text-ink ${index < NAV.length - 2 ? "hidden md:block" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/DEIMER-PY/c4-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-rule bg-paper-raised/60 px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-cyan/50 hover:text-ink"
            aria-label="Repositorio de C4 AI en GitHub"
          >
            <GithubIcon className="size-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <Link
            href="/docs/instalacion/"
            className="rounded-full bg-violet px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] transition-all hover:bg-violet-deep hover:shadow-[0_0_25px_-3px_rgba(139,92,246,0.7)]"
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
    <footer className="border-t border-rule bg-paper/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 text-sm text-ink-soft sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-md flex-col gap-3">
            <Logo />
            <p className="text-xs leading-relaxed text-ink-soft">
              Ingeniero de confiabilidad para agentes de IA. Detecta fallos en trazas, formula parches deterministas y
              garantiza que ninguna corrección introduzca regresiones.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-ink-soft">
              <span className="font-medium text-ink">Multiplataforma:</span>
              <span className="flex items-center gap-1.5 rounded border border-rule/80 bg-paper-raised px-2 py-0.5">
                <WindowsIcon className="size-3.5 text-cyan" /> Windows
              </span>
              <span className="flex items-center gap-1.5 rounded border border-rule/80 bg-paper-raised px-2 py-0.5">
                <AppleIcon className="size-3.5 text-ink" /> macOS
              </span>
              <span className="flex items-center gap-1.5 rounded border border-rule/80 bg-paper-raised px-2 py-0.5">
                <LinuxIcon className="size-3.5 text-yellow-400" /> Linux
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink">Documentación</span>
              <Link className="text-xs text-ink-soft hover:text-cyan transition-colors" href="/docs/">Índice general</Link>
              <Link className="text-xs text-ink-soft hover:text-cyan transition-colors" href="/docs/instalacion/">Instalación rápida</Link>
              <Link className="text-xs text-ink-soft hover:text-cyan transition-colors" href="/docs/arquitectura/">Arquitectura</Link>
              <Link className="text-xs text-ink-soft hover:text-cyan transition-colors" href="/docs/modelos/">Modelos y costos</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink">Escala y Seguridad</span>
              <Link className="text-xs text-ink-soft hover:text-cyan transition-colors" href="/docs/cli/">CLI interactivo</Link>
              <Link className="text-xs text-ink-soft hover:text-cyan transition-colors" href="/docs/batch/">Benchmark 1.000 (S4)</Link>
              <Link className="text-xs text-ink-soft hover:text-cyan transition-colors" href="/docs/observabilidad/">Métricas Prometheus</Link>
              <Link className="text-xs text-ink-soft hover:text-cyan transition-colors" href="/docs/limites/">Hardening y seguridad</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink">Comunidad y Enlaces</span>
              <a
                href="https://github.com/DEIMER-PY/c4-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink transition-colors"
              >
                <GithubIcon className="size-3.5" /> GitHub Repo
              </a>
              <a
                href="https://www.youtube.com/watch?v=DqAuvL8im9M"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-rose-400 transition-colors"
              >
                <YouTubeIcon className="size-3.5 text-rose-500" /> Video Oficial
              </a>
              <Link className="text-xs text-ink-soft hover:text-cyan transition-colors" href="/#como-funciona">
                Ciclo de 5 fases
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-rule pt-6 text-xs text-window-soft sm:flex-row">
          <p>© 2026 C4 AI Team. Licencia MIT. Respaldado con pruebas criptográficas SHA-256.</p>
          <p className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-pass animate-pulse" />
            Gateway y Testbed Activos
          </p>
        </div>
      </div>
    </footer>
  );
}
