import Image from "next/image";
import Link from "next/link";

import { InstallCommand } from "@/components/install-command";
import { DocsCards, EvidenceSection, HowItWorks, Integrations, VideoSlot } from "@/components/landing-sections";
import { ProductShowcase } from "@/components/product-showcase";

export default function Home() {
  return (
    <>
      <section className="hero-in mx-auto flex max-w-6xl flex-col items-center px-4 pt-16 pb-14 text-center sm:px-6 sm:pt-20">
        <Image src="/brand/c4-mark-128.png" alt="" width={125} height={128} priority className="mb-6 h-auto w-[62px]" />
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
            className="rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-violet-deep"
          >
            Leer la documentación
          </Link>
          <Link
            href="/#evidencia"
            className="rounded-full border border-rule bg-paper-raised px-6 py-3 text-[15px] font-medium transition-colors hover:border-ink"
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
