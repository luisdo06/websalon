import type Lenis from "lenis";

/* instancia única de Lenis, compartida entre SmoothScroll y el Dock */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => { instance = l; };
export const getLenis = () => instance;

/* desplaza suave a una sección por id (usa Lenis si está activo) */
export const scrollToId = (id: string) => {
  const target = document.getElementById(id);
  if (!target) return;
  const reduced = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance) {
    instance.scrollTo(target, { offset: -80, duration: reduced ? 0 : 1.4 });
  } else {
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
};
