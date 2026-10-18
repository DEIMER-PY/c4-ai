import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DOCS, findDoc } from "@/content/docs";

// Export estático: solo existen las páginas listadas en el índice.
export const dynamicParams = false;

export function generateStaticParams() {
  return DOCS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata(props: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const found = findDoc(slug);
  return found ? { title: found.doc.title, description: found.doc.description } : {};
}

export default async function DocPage(props: PageProps<"/docs/[slug]">) {
  const { slug } = await props.params;
  const found = findDoc(slug);
  if (!found) notFound();
  const { default: Content } = await import(`@/content/docs/${slug}.mdx`);

  return (
    <>
      <Content />
      <nav aria-label="Página anterior y siguiente" className="mt-16 grid gap-3 border-t border-rule pt-8 sm:grid-cols-2">
        {found.prev ? (
          <Link href={`/docs/${found.prev.slug}/`} className="rounded-xl border border-rule p-4 hover:border-violet">
            <span className="block text-sm text-ink-soft">Anterior</span>
            <span className="font-medium">{found.prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {found.next ? (
          <Link href={`/docs/${found.next.slug}/`} className="rounded-xl border border-rule p-4 text-right hover:border-violet">
            <span className="block text-sm text-ink-soft">Siguiente</span>
            <span className="font-medium">{found.next.title}</span>
          </Link>
        ) : null}
      </nav>
    </>
  );
}
