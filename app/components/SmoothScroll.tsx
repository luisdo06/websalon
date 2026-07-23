"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis, scrollToId } from "@/lib/lenisStore";

export default function SmoothScroll() {
  useEffect(() => {
    /* Delegación de anclas: un solo listener en document (cubre también anclas añadidas
       después). Se engancha SIEMPRE —también con reduced-motion— para que los enlaces del
       navbar/footer/CTA usen scrollToId (que deja el título arriba) en vez del salto nativo
       del navegador, que caía a media pantalla. scrollToId ya contempla reduced-motion. */
    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;
      if (!document.getElementById(id)) return;
      e.preventDefault();
      scrollToId(id);
    };
    document.addEventListener("click", onAnchorClick);

    // Respeta a quien prefiere menos movimiento: sin Lenis (scroll nativo), pero el salto a
    // secciones sigue corrigiéndose arriba vía scrollToId.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => document.removeEventListener("click", onAnchorClick);
    }

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });
    setLenis(lenis);

    /* recalcular límites de scroll cuando el contenido cambia de alto
       (p. ej. al abrir un calendario): sin esto, Lenis mantiene la altura
       cacheada y no deja llegar al contenido recién mostrado */
    const ro = new ResizeObserver(() => lenis.resize());
    ro.observe(document.body);

    let raf: number;
    const animate = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
