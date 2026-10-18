import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { INTEGRATIONS, REFERENCE_CASES, REFERENCE_SESSION as S } from "@/content/evidence";

/** Orden de aparición escalonada (70 ms por elemento) para grupos que entran juntos. */
function revealIndex(index: number): CSSProperties {
  return { "--reveal-index": index } as CSSProperties;
}

function SectionHeading({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <div data-reveal className="max-w-2xl">
      <h2 id={id} className="text-3xl font-semibold tracking-[-0.025em] text-balance sm:text-[2.5rem] sm:leading-[1.1]">
        {title}
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">{children}</p>
    </div>
  );
}

const STEPS = [
  { title: "Detecta", text: "Lee la traza de una ejecución fallida y clasifica el incidente por categoría y severidad." },
  { title: "Diagnostica", text: "Busca la causa con evidencia: qué devolvió cada herramienta y qué ignoró el agente." },
  { title: "Propone", text: "Prepara un candidato versionado, un cambio de prompt o de configuración, con su diff." },
  { title: "Evalúa", text: "Ejecuta el original y el candidato sobre los mismos casos del mismo dataset." },
  { title: "Decide", text: "Acepta solo si mejora el caso objetivo, no rompe ninguno que pasaba y aprueba seguridad." },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="como-funciona" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading id="como-funciona" title="De un fallo a una decisión que puedes revisar">
        C4 repite lo que haría un ingeniero con tiempo: investigar, corregir y volver a probar. Cada paso queda guardado.
      </SectionHeading>
      <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, index) => (
          <li key={step.title} data-reveal style={revealIndex(index)} className="flex flex-col gap-3 bg-paper-raised p-6">
            <span className="font-mono text-sm text-violet">{index + 1}</span>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="text-[15px] leading-relaxed text-ink-soft">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Mark({ passed }: { passed: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${passed ? "text-pass" : "text-fail"}`}>
      <span aria-hidden className={`size-2 rounded-full ${passed ? "bg-pass" : "bg-fail"}`} />
      {passed ? "Pasa" : "Falla"}
    </span>
  );
}

export function EvidenceSection() {
  return (
    <section aria-labelledby="evidencia" className="border-y border-rule bg-paper-raised">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div className="flex flex-col gap-8">
          <SectionHeading id="evidencia" title="Evidencia, no promesas">
            Un agente de soporte aprobaba reembolsos fuera del plazo de 30 días. C4 encontró la causa, corrigió el prompt
            y lo comprobó contra los seis casos del dataset.
          </SectionHeading>
          <p className="number-in origin-left text-[clamp(3rem,8vw,5.5rem)] leading-none font-semibold tracking-[-0.04em] tabular-nums">
            <span className="text-ink-soft">
              {S.before.passed}/{S.before.total}
            </span>
            <span aria-hidden className="mx-3 text-violet">
              →
            </span>
            <span className="sr-only"> pasó a </span>
            {S.after.passed}/{S.after.total}
          </p>
          <dl data-reveal style={revealIndex(1)} className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-ink-soft">Regresiones</dt>
              <dd className="text-lg font-semibold">{S.regressions}</dd>
            </div>
            <div>
              <dt className="text-ink-soft">Seguridad</dt>
              <dd className="text-lg font-semibold">{S.securityPassed ? "Aprobada" : "No aprobada"}</dd>
            </div>
            <div>
              <dt className="text-ink-soft">Llamadas al modelo</dt>
              <dd className="text-lg font-semibold tabular-nums">{S.calls}</dd>
            </div>
            <div>
              <dt className="text-ink-soft">Costo</dt>
              <dd className="text-lg font-semibold">{S.costUsd === null ? "Desconocido" : S.costUsd}</dd>
            </div>
          </dl>
          <p className="text-[13px] leading-relaxed text-ink-soft">
            Sesión {S.id}, {S.date}. {S.provenance}; agente de prueba, sin acciones en producción. El costo es
            desconocido porque el gateway no publica tarifas.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-rule">
          <table className="w-full text-left">
            <caption className="sr-only">Resultado de cada caso antes y después de la corrección</caption>
            <thead className="border-b border-rule bg-paper text-sm text-ink-soft">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Caso</th>
                <th scope="col" className="px-3 py-3 font-medium">Antes</th>
                <th scope="col" className="px-3 py-3 font-medium">Después</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {REFERENCE_CASES.map((c, index) => (
                <tr key={c.id} data-reveal style={revealIndex(index)} className={c.target ? "bg-violet/[0.05]" : undefined}>
                  <th scope="row" className="px-5 py-4 font-normal">
                    <span className="block text-[15px] font-medium">{c.label}</span>
                    <span className="font-mono text-xs text-ink-soft">
                      {c.id}
                      {c.target ? ", caso objetivo" : ""}
                      {c.security ? ", seguridad" : ""}
                    </span>
                  </th>
                  <td className="px-3 py-4">
                    <Mark passed={c.before} />
                  </td>
                  <td className="px-3 py-4">
                    <Mark passed={c.after} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function Integrations() {
  return (
    <section aria-labelledby="integraciones" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading id="integraciones" title="Dónde funciona hoy">
        Lo verificado está disponible en el clon del proyecto. Lo planificado se marca como tal hasta tener evidencia.
      </SectionHeading>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTEGRATIONS.map((item, index) => (
          <li key={item.name} data-reveal style={revealIndex(index)} className="flex flex-col gap-2 rounded-2xl border border-rule bg-paper-raised p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  item.status === "verified" ? "bg-pass/10 text-pass" : "bg-ink/5 text-ink-soft"
                }`}
              >
                {item.status === "verified" ? "Verificado" : "Planificado"}
              </span>
            </div>
            <p className="text-[15px]">{item.role}</p>
            <p className="text-sm text-ink-soft">{item.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** FR-007: el video de C4-008 se conecta aquí cuando exista; mientras tanto no se simula. */
export function VideoSlot({ src }: { src?: string }) {
  return (
    <section aria-labelledby="video" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <h2 id="video" className="sr-only">
        Video de presentación
      </h2>
      {src ? (
        <video controls preload="metadata" className="aspect-video w-full rounded-2xl bg-window" src={src} />
      ) : (
        <div className="flex w-full flex-col items-start gap-1 rounded-2xl border border-dashed border-rule bg-paper-raised px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-semibold">Video de presentación</p>
          <p className="text-ink-soft">Próximamente: el recorrido completo de C4, de la traza a la decisión.</p>
        </div>
      )}
    </section>
  );
}

const DOC_LINKS = [
  { href: "/docs/instalacion/", title: "Instalación", text: "Clona el proyecto y prepara Python 3.12 con uv." },
  { href: "/docs/primer-ciclo/", title: "Primer ciclo", text: "Valida tu configuración y ejecuta la demo completa." },
  { href: "/docs/cli/", title: "CLI y consola", text: "Comandos por etapa, modo JSON y consola interactiva." },
  { href: "/docs/hermes/", title: "Hermes", text: "Consulta la evidencia de C4 desde Hermes por MCP." },
];

export function DocsCards() {
  return (
    <section aria-labelledby="docs" className="border-t border-rule bg-paper-raised">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionHeading id="docs" title="Empieza en diez minutos">
          Necesitas tu clave del gateway del reto. Groq es opcional para evaluar un segundo modelo.
        </SectionHeading>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DOC_LINKS.map((doc, index) => (
            <li key={doc.href} data-reveal style={revealIndex(index)}>
              <Link
                href={doc.href}
                className="flex h-full flex-col gap-2 rounded-2xl border border-rule bg-paper p-6 transition-colors hover:border-violet"
              >
                <span className="text-lg font-semibold">{doc.title}</span>
                <span className="text-[15px] text-ink-soft">{doc.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
