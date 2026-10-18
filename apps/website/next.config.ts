import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio público estático: sin servidor, sin datos locales ni claves (spec 020, FR-001).
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ["ts", "tsx", "mdx"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default createMDX({})(nextConfig);
