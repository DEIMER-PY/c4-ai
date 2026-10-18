"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Marca como visibles, una sola vez, los elementos con `data-reveal` cuando entran en pantalla.
 * Volver a animarlos en cada pasada distraería al lector; por eso se deja de observar tras revelar.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (document.documentElement.dataset.motion !== "on") return;
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-visible])");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-visible", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

/** Se ejecuta antes de pintar: activa el movimiento solo si hay JavaScript y el usuario no pidió reducirlo. */
export const MOTION_BOOTSTRAP = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.motion="on"}catch(e){}`;
