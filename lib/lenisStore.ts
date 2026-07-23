import type Lenis from "lenis";

/* instancia única de Lenis, compartida entre SmoothScroll y el Dock */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => { instance = l; };
export const getLenis = () => instance;

/* Desplaza suave a una sección por id. Usado por el navbar, el dock, el footer, la CTA fija
   y el menú móvil (todos pasan por aquí) para que el salto sea consistente.

   Se calcula una posición NUMÉRICA en vez de usar `offset` de Lenis + `scroll-margin`: esos
   se apilaban y dejaban la sección ~80px de más abajo, con el título a media pantalla. Aquí se
   deja el encabezado de la sección (hoja + eyebrow + título) justo debajo del navbar, midiendo
   su altura en vivo (sirve igual en celular, donde el navbar es más bajo). */
export const scrollToId = (id: string) => {
  const target = document.getElementById(id);
  if (!target) return;
  const reduced = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = target.querySelector<HTMLElement>(".section-reveal") ?? target;
  const navH = Math.round(document.querySelector("nav")?.getBoundingClientRect().height ?? 72);
  const y = Math.max(0, header.getBoundingClientRect().top + window.scrollY - (navH + 16));

  if (instance) {
    instance.scrollTo(y, { duration: reduced ? 0 : 1.2 });
  } else {
    window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  }
};
