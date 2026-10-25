import Image from "next/image";
import Link from "next/link";

import { InstallCommand } from "@/components/install-command";
import { DocsCards, EvidenceSection, HowItWorks, Integrations, VideoSlot } from "@/components/landing-sections";
import { ProductShowcase } from "@/components/product-showcase";

export default function Home() {
  return (
    <>
      <section className="hero-in mx-auto flex max-w-6xl flex-col items-center px-4 pt-16 pb-14 text-center sm:px-6 sm:pt-20">
        <Image src="/brand/c4-mark-128.png" alt="C4 AI Mark" width={125} height={128} priority className="mb-6 h-auto w-[62px] drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]" />
        <h1 className="max-w-4xl text-[clamp(2.5rem,6.5vw,4.6rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
          Cuando tu agente falla, C4 demuestra la corrección
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty sm:text-xl">
          Encuentra la causa en la traza, propone un prompt corregido y lo prueba contra el original con los mismos
          casos. Solo lo acepta si mejora y no rompe nada.
        </p>
        <div className="mt-10 w-full">
          <InstallCommand />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/docs/"
            className="rounded-full bg-violet px-6 py-3 text-[15px] font-semibold text-white shadow-[0_0_25px_-5px_rgba(139,92,246,0.6)] transition-all hover:bg-violet-deep hover:scale-[1.02]"
          >
            Leer la documentación
          </Link>
          <Link
            href="/#video"
            className="rounded-full border border-rose-500/40 bg-rose-500/10 px-6 py-3 text-[15px] font-medium text-rose-300 shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)] transition-all hover:bg-rose-500/20"
          >
            ▶ Ver Video Demo
          </Link>
          <Link
            href="/#evidencia"
            className="rounded-full border border-rule bg-paper-raised px-6 py-3 text-[15px] font-medium text-ink-soft transition-colors hover:border-cyan hover:text-ink"
          >
            Ver un caso real
          </Link>
        </div>
      </section>
      <div className="showcase-settle mx-auto max-w-6xl px-2 sm:px-6">
        <ProductShowcase />
      </div>
      <HowItWorks />
      <EvidenceSection />
      <Integrations />
      <VideoSlot />
      <DocsCards />
    </>
  );
}
