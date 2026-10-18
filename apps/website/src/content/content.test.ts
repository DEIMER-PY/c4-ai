import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { DOCS, findDoc } from "@/content/docs";
import { REFERENCE_CASES, REFERENCE_SESSION } from "@/content/evidence";
import { INSTALL_COMMANDS } from "@/content/install";

const root = path.join(import.meta.dirname, "..", "..");

describe("evidencia citada", () => {
  it("los casos suman exactamente los totales declarados", () => {
    expect(REFERENCE_CASES).toHaveLength(REFERENCE_SESSION.after.total);
    expect(REFERENCE_CASES.filter((c) => c.before).length).toBe(REFERENCE_SESSION.before.passed);
    expect(REFERENCE_CASES.filter((c) => c.after).length).toBe(REFERENCE_SESSION.after.passed);
  });

  it("no hay regresiones ocultas: ningún caso pasa de aprobar a fallar", () => {
    const regressions = REFERENCE_CASES.filter((c) => c.before && !c.after);
    expect(regressions).toHaveLength(REFERENCE_SESSION.regressions);
  });

  it("hay un único caso objetivo y mejora", () => {
    const targets = REFERENCE_CASES.filter((c) => c.target);
    expect(targets).toHaveLength(1);
    expect(targets[0]).toMatchObject({ before: false, after: true });
  });

  it("el costo desconocido se mantiene null, nunca cero", () => {
    expect(REFERENCE_SESSION.costUsd).toBeNull();
  });

  it("la fuente citada existe en el repositorio", () => {
    expect(existsSync(path.join(root, "..", "..", REFERENCE_SESSION.source))).toBe(true);
  });
});

describe("documentación", () => {
  it("cada entrada del índice tiene su archivo MDX y slugs únicos", () => {
    for (const doc of DOCS) {
      expect(existsSync(path.join(root, "src", "content", "docs", `${doc.slug}.mdx`)), doc.slug).toBe(true);
    }
    expect(new Set(DOCS.map((d) => d.slug)).size).toBe(DOCS.length);
  });

  it("findDoc devuelve vecinos y undefined para slugs desconocidos", () => {
    expect(findDoc(DOCS[0].slug)?.prev).toBeUndefined();
    expect(findDoc(DOCS[1].slug)?.prev?.slug).toBe(DOCS[0].slug);
    expect(findDoc("no-existe")).toBeUndefined();
  });

  it("los enlaces internos de las guías apuntan a páginas existentes", () => {
    const slugs = new Set(DOCS.map((d) => d.slug));
    for (const doc of DOCS) {
      const mdx = readFileSync(path.join(root, "src", "content", "docs", `${doc.slug}.mdx`), "utf8");
      for (const [, target] of mdx.matchAll(/\]\(\/docs\/([^/)]+)\/\)/g)) {
        expect(slugs.has(target), `${doc.slug} → ${target}`).toBe(true);
      }
    }
  });

  it("ninguna guía ni comando contiene algo con forma de clave real", () => {
    const texts = [
      ...DOCS.map((d) => readFileSync(path.join(root, "src", "content", "docs", `${d.slug}.mdx`), "utf8")),
      ...Object.values(INSTALL_COMMANDS),
    ];
    for (const text of texts) {
      expect(text).not.toMatch(/(gsk_|xai-|sk-)[A-Za-z0-9]{12,}/);
      expect(text).not.toMatch(/API_KEY=(?!tu-clave)\S+/);
    }
  });
});
