import type { MDXComponents } from "mdx/types";

// Requerido por @next/mdx en App Router; los estilos de la documentación viven en el layout de /docs.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return components;
}
