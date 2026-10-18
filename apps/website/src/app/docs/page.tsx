import type { Metadata } from "next";
import Link from "next/link";

import { DOCS } from "@/content/docs";

export const metadata: Metadata = {
  title: "Documentación",
  description: "Instala C4, configura tus claves y ejecuta tu primer ciclo de confiabilidad.",
};

export default function DocsIndex() {
  return (
    <>
      <h1 className="text-4xl font-semibold tracking-[-0.03em]">Documentación</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        C4 toma una ejecución fallida de tu agente, encuentra la causa, propone una corrección y la evalúa contra el
        original con los mismos casos. Estas guías te llevan de cero a tu primera decisión con evidencia.
      </p>
      <p className="mt-4 leading-7">
        Hoy C4 trabaja con un agente de prueba de soporte y reembolsos y un dataset de seis casos sintéticos. Las llamadas
        al modelo son reales; las acciones del agente son predicciones y nunca se ejecutan.
      </p>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {DOCS.map((doc) => (
          <li key={doc.slug}>
            <Link
              href={`/docs/${doc.slug}/`}
              className="flex h-full flex-col gap-1 rounded-xl border border-rule bg-paper-raised p-5 hover:border-violet"
            >
              <span className="font-semibold">{doc.title}</span>
              <span className="text-[15px] text-ink-soft">{doc.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
