import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

// Estilos de la documentación MDX (requerido por @next/mdx en App Router).
const components: MDXComponents = {
  h1: (props) => <h1 className="text-4xl font-semibold tracking-[-0.03em]" {...props} />,
  h2: (props) => <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-[-0.02em]" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 text-lg font-semibold" {...props} />,
  p: (props) => <p className="my-4 leading-7 text-ink" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-2 pl-6 leading-7 marker:text-ink-soft" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-2 pl-6 leading-7 marker:text-ink-soft" {...props} />,
  strong: (props) => <strong className="font-semibold" {...props} />,
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) =>
    href.startsWith("/") ? (
      <Link href={href} className="font-medium text-violet-deep underline underline-offset-4" {...props} />
    ) : (
      <a href={href} className="font-medium text-violet-deep underline underline-offset-4" rel="noreferrer" target="_blank" {...props} />
    ),
  code: (props) => <code className="rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[0.88em]" {...props} />,
  pre: (props) => (
    <pre
      className="my-5 overflow-x-auto rounded-xl bg-window p-5 font-mono text-[13px] leading-6 text-window-ink [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[13px]"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote className="my-5 rounded-r-xl border-l-4 border-violet bg-violet/[0.05] px-5 py-1 text-ink" {...props} />
  ),
  table: (props) => (
    <div className="my-5 overflow-x-auto rounded-xl border border-rule">
      <table className="w-full text-left text-[15px]" {...props} />
    </div>
  ),
  th: (props) => <th className="border-b border-rule bg-paper px-4 py-2.5 font-medium text-ink-soft" {...props} />,
  td: (props) => <td className="border-b border-rule px-4 py-2.5 align-top last:border-b-0" {...props} />,
};

export function useMDXComponents(overrides: MDXComponents): MDXComponents {
  return { ...components, ...overrides };
}
