import { useEffect, useRef, useCallback, useSyncExternalStore } from "react";

/* ─── hook: media query reactiva (SSR-safe) ─── */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false // snapshot en servidor: sin preferencias detectables
  );
}

/* ─── hook: respeta prefers-reduced-motion ─── */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/* ─── hook: ¿el dispositivo tiene puntero fino (ratón)? ─── */
export function useFinePointer() {
  return useMediaQuery("(pointer: fine)");
}

/* ─── hook: reveal al scroll con delay escalonado ─── */
export function useReveal() {
  const refs = useRef<HTMLElement[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const idx = refs.current.indexOf(el);
          const delay = Math.min(idx, 4) * 55; /* cascada corta y acotada: aparece rápido */
          setTimeout(() => el.classList.add("visible"), delay);
          io.unobserve(el);
        }
      }),
      { threshold: 0.05 }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return useCallback((el: HTMLElement | null) => {
    if (el && !refs.current.includes(el)) refs.current.push(el);
  }, []);
}

