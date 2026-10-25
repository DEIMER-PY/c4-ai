// Orden y metadatos de la documentación. El slug coincide con el archivo MDX de esta carpeta.
export interface DocEntry {
  slug: string;
  title: string;
  description: string;
  group: "Empezar" | "Usar C4" | "Escala y Observabilidad" | "Referencia";
}

export const DOCS: DocEntry[] = [
  { slug: "instalacion", title: "Instalación", description: "Clona el proyecto y prepara Python 3.12 con uv.", group: "Empezar" },
  { slug: "configuracion", title: "Configuración", description: "Claves y modelos en tu archivo .env local.", group: "Empezar" },
  { slug: "primer-ciclo", title: "Primer ciclo", description: "Valida la configuración y ejecuta la demo completa.", group: "Empezar" },
  { slug: "arquitectura", title: "Arquitectura y Core", description: "El ciclo en 5 fases, herramientas nucleares y gate determinista.", group: "Empezar" },
  { slug: "cli", title: "CLI y consola", description: "Comandos por etapa, modo JSON y consola interactiva.", group: "Usar C4" },
  { slug: "atajos", title: "Atajos y comandos AGY", description: "Atajos de 1 letra y comandos reflexivos /diff, /cost y /goal.", group: "Usar C4" },
  { slug: "dashboard", title: "Dashboard", description: "Revisa incidentes, candidatos y comparaciones en el navegador.", group: "Usar C4" },
  { slug: "modelos", title: "Modelos y Tarifas", description: "Pasarela multi-modelo xAI, Groq, DeepSeek y Ollama con tarifas.", group: "Usar C4" },
  { slug: "batch", title: "Escala y Lotes (S4)", description: "Procesamiento de 1.000 unidades, percentiles de latencia y circuit breaker.", group: "Escala y Observabilidad" },
  { slug: "observabilidad", title: "Observabilidad y SSE", description: "Métricas Prometheus, Healthz y streaming reactivo en tiempo real.", group: "Escala y Observabilidad" },
  { slug: "api", title: "API local", description: "Consulta la evidencia por HTTP desde tus herramientas.", group: "Referencia" },
  { slug: "hermes", title: "Hermes", description: "Conecta C4 a Hermes Agent por MCP.", group: "Referencia" },
  { slug: "seguridad", title: "Ciberseguridad y Red Teaming", description: "Mitigación OWASP LLM, escáner adversarial y sanitizador PII.", group: "Referencia" },
  { slug: "limites", title: "Límites y seguridad", description: "Qué hace C4, qué no hace y cómo protege tus claves.", group: "Referencia" },
  { slug: "preguntas", title: "Preguntas frecuentes", description: "Errores comunes y cómo resolverlos.", group: "Referencia" },
];

export function findDoc(slug: string): { doc: DocEntry; prev?: DocEntry; next?: DocEntry } | undefined {
  const index = DOCS.findIndex((d) => d.slug === slug);
  if (index === -1) return undefined;
  return { doc: DOCS[index], prev: DOCS[index - 1], next: DOCS[index + 1] };
}
