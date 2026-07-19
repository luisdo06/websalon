"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { C } from "@/lib/theme";
import { scrollToId } from "@/lib/lenisStore";
import { useMediaQuery } from "../hooks";
import Dock, { type DockItemData } from "./Dock";
import SocialLinks from "./SocialLinks";
import StaggeredMenu, { type SMItem } from "./StaggeredMenu";

/* etiquetas legibles para cada sección (el href usa el id) */
const LABELS: Record<string, string> = {
  nosotros: "Nosotros",
  galeria: "Galería",
  cotizaciones: "Paquetes",
  ubicacion: "Ubicación",
};

/* secciones que aparecen en los enlaces del navbar (orden de aparición) */
const links = ["nosotros", "cotizaciones", "ubicacion", "galeria"];

/* Dock: a partir de qué scroll puede aparecer, y cuánto recorrido seguido en una
   dirección hace falta para alternarlo. Un golpe de rueda son ~90 px, así que con
   estos valores sale durante el segundo golpe. Subir DOCK_RECORRIDO lo hace más
   perezoso; bajarlo, más sensible al rebote del scroll por inercia. */
const DOCK_DESDE = 150;
const DOCK_RECORRIDO = 24;

/* ─── íconos de línea para el Dock ─── */
const svgProps = {
  width: 24, height: 24, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};
const IconLeaf = () => (
  <svg {...svgProps}><path d="M4 20c0-8 6-14 16-16-2 10-8 16-16 16Z" /><path d="M4 20C8 14 12 10 18 8" /></svg>
);
const IconBox = () => (
  <svg {...svgProps}><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>
);
const IconPin = () => (
  <svg {...svgProps}><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
const IconCalendar = () => (
  <svg {...svgProps}><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M3.5 9.5h17M8 3v4M16 3v4M9 14.5l2 2 4-4" /></svg>
);
const IconImage = () => (
  <svg {...svgProps}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m4 17 4.5-4.5L13 17M13 14l2.5-2.5L20 16" /></svg>
);

/* ─── Navbar ─── */
export default function Navbar() {
  const [scrolled, setScrolled]           = useState(false);
  const [progress, setProgress]           = useState(0);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showDock, setShowDock]           = useState(false);
  const lastY = useRef(0);
  const dirAccum = useRef(0); /* recorrido acumulado en la dirección actual */
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? y / max : 0);
      setScrolled(y > 60);
      const ids = ["reserva", "galeria", "ubicacion", "cotizaciones", "nosotros", "servicios"];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) { setActiveSection(id); break; }
      }
      /* Dirección del scroll: bajando muestra el Dock, subiendo vuelve el menú original.
         Se acumula el recorrido en la dirección actual en vez de mirar el delta de un
         solo evento. Con Lenis (duration 1.4) un golpe de rueda son ~90 px repartidos
         en unos 36 eventos de 1-7 px: comparar evento a evento contra un umbral fallaba
         casi siempre, porque el evento que cruzaba el límite solía ser de los pequeños,
         y con un trackpad el pico ni siquiera llegaba al umbral. */
      const dy = y - lastY.current;
      lastY.current = y;

      if (y < DOCK_DESDE) {
        setShowDock(false);
        dirAccum.current = 0;
      } else if (dy !== 0) {
        /* al cambiar de sentido se reinicia el acumulador */
        if (dy > 0 !== dirAccum.current > 0) dirAccum.current = 0;
        dirAccum.current += dy;
        if (dirAccum.current >= DOCK_RECORRIDO) {
          setShowDock(true);
          dirAccum.current = 0;
        } else if (dirAccum.current <= -DOCK_RECORRIDO) {
          setShowDock(false);
          dirAccum.current = 0;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ítems del menú móvil (StaggeredMenu) */
  const mobileItems: SMItem[] = useMemo(
    () => [
      ...links.map((id) => ({ label: LABELS[id], link: `#${id}` })),
      { label: "Reservar", link: "#reserva" },
    ],
    [],
  );

  const dockItems: DockItemData[] = useMemo(() => [
    { icon: <IconLeaf />,     label: "Nosotros",  onClick: () => scrollToId("nosotros") },
    { icon: <IconBox />,      label: "Paquetes",  onClick: () => scrollToId("cotizaciones") },
    { icon: <IconPin />,      label: "Ubicación", onClick: () => scrollToId("ubicacion") },
    { icon: <IconImage />,    label: "Galería",   onClick: () => scrollToId("galeria") },
    { icon: <IconCalendar />, label: "Reservar",  onClick: () => scrollToId("reserva") },
  ], []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-px z-[60] origin-left"
        style={{ background: `linear-gradient(90deg, ${C.accent}, ${C.amber})`, transform: `scaleX(${progress})`, transition: "transform 0.1s linear" }} />
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-16 ${showDock ? "md:-translate-y-full md:opacity-0 md:pointer-events-none" : ""}`}
        style={{
          /* El borde y el desenfoque se declaran SIEMPRE y solo varía su intensidad.
             Alternarlos con "none" hacía que el borde se interpolara desde currentColor
             (#0e1508, casi negro): durante los primeros ~200 ms de cada scroll aparecía
             una franja negra de 2 px cruzando la pantalla, y la barra cambiaba de alto
             (72→74→73 px) porque también se animaba el grosor del borde. */
          backgroundColor: scrolled ? `${C.bg}fc` : `${C.bg}00`,
          backgroundImage: `linear-gradient(to bottom, ${C.bg}f0 0%, ${C.bg}00 100%)`,
          /* El degradado debe cubrir también la franja del borde. Por defecto
             background-origin es padding-box mientras background-clip es border-box:
             el navegador rellenaba esa fila de 1 px repitiendo el degradado, y lo que
             asomaba era su color inicial (crema al 94 %) — una línea clara bajo el menú. */
          backgroundOrigin: "border-box",
          backgroundRepeat: "no-repeat",
          backdropFilter: `blur(${scrolled ? 14 : 0}px)`,
          WebkitBackdropFilter: `blur(${scrolled ? 14 : 0}px)`,
          borderBottom: `1px solid ${C.accent}${scrolled ? "14" : "00"}`,
          /* Lista explícita en vez de transition-all, que animaba también el grosor
             del borde y el padding.
             Va `translate` y no `transform`: Tailwind v4 implementa -translate-y-full
             con la propiedad `translate` independiente. Al declarar solo `transform`,
             la barra saltaba fuera de pantalla en un fotograma y el fundido ocurría
             después, ya invisible: parecía desaparecer de golpe. */
          transition:
            "background-color 350ms ease, backdrop-filter 350ms ease, " +
            "border-color 350ms ease, opacity 320ms ease, " +
            "translate 380ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
        <a href="#hero" aria-label="Ir al inicio" className="forest-text text-xl md:text-2xl tracking-[0.28em] uppercase font-semibold cursor-pointer" style={{ fontFamily: "var(--font-display,serif)" }}>Salón del Bosque</a>
        <div className="hidden md:flex gap-10 text-xs tracking-[0.2em] uppercase">
          {links.map((id) => (
            <a key={id} href={`#${id}`} className="transition-colors duration-300"
              style={{ color: activeSection === id ? C.accent : `${C.accent}aa` }}>{LABELS[id]}</a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:flex" style={{ color: C.accent }}><SocialLinks size={17} /></span>
          <a href="#reserva" className="hidden md:block text-xs tracking-[0.2em] uppercase px-5 py-2 transition-all duration-300"
            style={{ border: `1px solid ${C.accent}55`, color: C.accent }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${C.accent}18`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            Reservar
          </a>
          <button type="button" className="md:hidden flex flex-col gap-1.5 p-1" onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="block w-6 h-px transition-all duration-300"
                style={{ background: C.accent, transform: menuOpen ? (i === 0 ? "translateY(8px) rotate(45deg)" : i === 2 ? "translateY(-8px) rotate(-45deg)" : "scaleX(0)") : "none", opacity: menuOpen && i === 1 ? 0 : 1 }} />
            ))}
          </button>
        </div>
      </nav>
      {/* menú móvil animado (StaggeredMenu, controlado por la hamburguesa) */}
      <StaggeredMenu
        open={menuOpen}
        items={mobileItems}
        position="right"
        colors={[C.surface2, C.accent]}
        accentColor={C.accent}
        onItemClick={() => setMenuOpen(false)}
      />

      {/* Dock flotante (solo escritorio): aparece al bajar, desaparece al subir */}
      <AnimatePresence>
        {showDock && isDesktop && (
          <m.div
            key="dock"
            className="fixed inset-x-0 bottom-5 z-40 flex justify-center pointer-events-none"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 28 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pointer-events-auto">
              <Dock items={dockItems} baseItemSize={56} panelHeight={74} magnification={88} distance={200} />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
