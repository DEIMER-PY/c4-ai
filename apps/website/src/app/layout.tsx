import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

import { MOTION_BOOTSTRAP, RevealOnScroll } from "@/components/reveal-on-scroll";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

import "./globals.css";

const hanken = Hanken_Grotesk({ variable: "--font-hanken", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "C4 AI — Confiabilidad para agentes de IA", template: "%s · C4 AI" },
  description:
    "C4 detecta por qué falló tu agente, propone una corrección y la evalúa contra el original con los mismos casos. Solo la acepta con evidencia.",
  openGraph: {
    title: "C4 AI — Confiabilidad para agentes de IA",
    description: "Diagnostica, corrige y demuestra la mejora de tus agentes, sin regresiones ocultas.",
    type: "website",
    locale: "es",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`dark ${hanken.variable} ${jetbrains.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOTSTRAP }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-paper text-ink">
        <SiteHeader />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <RevealOnScroll />
      </body>
    </html>
  );
}
