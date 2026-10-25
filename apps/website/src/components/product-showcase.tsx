import Image from "next/image";
import type { ReactNode } from "react";

import { InteractiveSimulator } from "@/components/interactive-simulator";
import { Tabs } from "@/components/tabs";
import { TraceBackdrop } from "@/components/trace-backdrop";
import { REFERENCE_SESSION as S } from "@/content/evidence";

function Window({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-xl bg-window shadow-[0_30px_80px_-30px_rgba(40,20,110,0.55)] ring-1 ring-black/10">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto text-xs text-window-soft">{title}</span>
      </div>
      {children}
    </figure>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-xl bg-window shadow-[0_30px_80px_-30px_rgba(40,20,110,0.55)] ring-1 ring-black/10">
      {children}
    </figure>
  );
}

function Provenance({ children }: { children: ReactNode }) {
  return <figcaption className="border-t border-white/10 px-4 py-2.5 text-xs text-window-soft">{children}</figcaption>;
}

function HermesTranscript() {
  const tool = "text-cyan";
  return (
    <div className="space-y-4 p-5 font-mono text-[13px] leading-6 text-window-ink sm:p-7">
      <p>
        <span className="text-window-soft">Tú</span>
        <br />
        Usa c4-ai para listar incidentes y mostrar la evaluación del último reporte, sin ejecutar cambios.
      </p>
      <div className="space-y-1 border-l-2 border-violet/60 pl-4 text-window-soft">
        <p>
          <span className={tool}>list_incidents</span> → 1 incidente
        </p>
        <p>
          <span className={tool}>get_report</span> {S.id}_incident → {S.decision}
        </p>
        <p>
          <span className={tool}>get_evaluation</span> → {S.before.passed}/{S.before.total} → {S.after.passed}/
          {S.after.total}, {S.regressions} regresiones
        </p>
      </div>
      <p>
        <span className="text-window-soft">Hermes</span>
        <br />
        El candidato fue aceptado: pasa de {S.before.passed} a {S.after.passed} casos de {S.after.total}, sin
        regresiones y con los controles de seguridad aprobados. No se aplicó ningún cambio.
      </p>
    </div>
  );
}

export function ProductShowcase() {
  return (
    <section aria-label="El producto en uso" className="relative overflow-clip rounded-[28px] px-3 pt-6 pb-8 sm:px-10 sm:pt-8 sm:pb-12">
      <TraceBackdrop />
      <div className="relative">
        <Tabs
          label="Vista del producto"
          panelClassName="mx-auto max-w-5xl outline-none"
          items={[
            {
              id: "simulator",
              label: "Simulador en vivo",
              content: (
                <Window title="C4 AI / simulador determinista interactivo">
                  <InteractiveSimulator />
                  <Provenance>
                    Simulación interactiva basada en trazas reales de C4 AI. Explora las 5 etapas del ciclo sin necesidad de instalación.
                  </Provenance>
                </Window>
              ),
            },
            {
              id: "terminal",
              label: "Terminal",
              content: (
                <Frame>
                  <Image
                    src="/showcase/terminal.png"
                    alt="Consola de C4 con el resumen de una evaluación rechazada: 5 de 6 casos antes y después, regresión en refund_eligible, una llamada y costo desconocido."
                    width={1630}
                    height={1148}
                    className="h-auto w-full"
                    priority
                  />
                  <Provenance>Captura real de la consola, {S.date}. Casos sintéticos, respuestas reales del proveedor.</Provenance>
                </Frame>
              ),
            },
            {
              id: "dashboard",
              label: "Dashboard",
              content: (
                <Window title="C4 AI / comparación baseline y candidato">
                  <Image
                    src="/showcase/dashboard.png"
                    alt={`Dashboard de C4 comparando el baseline (${S.before.passed}/${S.before.total}) con el candidato (${S.after.passed}/${S.after.total}), sin regresiones y con decisión aceptada.`}
                    width={1425}
                    height={990}
                    className="h-auto w-full"
                  />
                  <Provenance>Captura real del dashboard leyendo la sesión {S.id}.</Provenance>
                </Window>
              ),
            },
            {
              id: "hermes",
              label: "Hermes",
              content: (
                <Window title="Hermes Agent / c4-ai (MCP)">
                  <HermesTranscript />
                  <Provenance>
                    Transcripción resumida de la prueba MCP documentada ({S.date}). Las herramientas de C4 en Hermes
                    solo leen evidencia.
                  </Provenance>
                </Window>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
}
