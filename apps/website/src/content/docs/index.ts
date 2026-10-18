// Orden y metadatos de la documentación. El slug coincide con el archivo MDX de esta carpeta.
export interface DocEntry {
  slug: string;
  title: string;
  description: string;
  group: "Empezar" | "Usar C4" | "Referencia";
}

export const DOCS: DocEntry[] = [
  { slug: "instalacion", title: "Instalación", description: "Clona el proyecto y prepara Python 3.12 con uv.", group: "Empezar" },
  { slug: "configuracion", title: "Configuración", description: "Claves y modelos en tu archivo .env local.", group: "Empezar" },
  { slug: "primer-ciclo", title: "Primer ciclo", description: "Valida la configuración y ejecuta la demo completa.", group: "Empezar" },
  { slug: "cli", title: "CLI y consola", description: "Comandos por etapa, modo JSON y consola interactiva.", group: "Usar C4" },
  { slug: "dashboard", title: "Dashboard", description: "Revisa incidentes, candidatos y comparaciones en el navegador.", group: "Usar C4" },
  { slug: "api", title: "API local", description: "Consulta la evidencia por HTTP desde tus herramientas.", group: "Usar C4" },
  { slug: "hermes", title: "Hermes", description: "Conecta C4 a Hermes Agent por MCP.", group: "Usar C4" },
  { slug: "limites", title: "Límites y seguridad", description: "Qué hace C4, qué no hace y cómo protege tus claves.", group: "Referencia" },
  { slug: "preguntas", title: "Preguntas frecuentes", description: "Errores comunes y cómo resolverlos.", group: "Referencia" },
];

export function findDoc(slug: string): { doc: DocEntry; prev?: DocEntry; next?: DocEntry } | undefined {
  const index = DOCS.findIndex((d) => d.slug === slug);
  if (index === -1) return undefined;
  return { doc: DOCS[index], prev: DOCS[index - 1], next: DOCS[index + 1] };
}
