"use client";

import { useState } from "react";

type CopyState = "idle" | "copied" | "failed";

const LABEL: Record<CopyState, string> = {
  idle: "Copiar",
  copied: "Copiado",
  failed: "Cópialo a mano",
};

/** Copia texto al portapapeles y anuncia el resultado; si el navegador lo bloquea, lo dice (spec 020, casos de error). */
export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [state, setState] = useState<CopyState>("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2000);
  }

  return (
    <>
      <button type="button" onClick={copy} className={className}>
        {LABEL[state]}
      </button>
      <span role="status" className="sr-only">
        {state === "copied" ? "Comando copiado al portapapeles" : state === "failed" ? "No se pudo copiar; selecciona el comando y cópialo" : ""}
      </span>
    </>
  );
}
