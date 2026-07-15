"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenisStore";

export default function SmoothScroll() {
  useEffect(() => {
    // Respeta a quien prefiere menos movimiento: deja el scroll nativo del navegador.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });
    setLenis(lenis);

    /* conectar con anclas del navbar mediante delegación: un solo listener en
       document (cubre también anclas añadidas después y se limpia con un único
       removeEventListener) */
    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.6 });
    };
    document.addEventListener("click", onAnchorClick);

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
