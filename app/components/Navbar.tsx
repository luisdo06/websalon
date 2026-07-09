"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { C } from "@/lib/theme";
import { scrollToId } from "@/lib/lenisStore";
import { useMediaQuery } from "../hooks";
import Dock, { type DockItemData } from "./Dock";
import SocialLinks from "./SocialLinks";

/* etiquetas legibles para cada sección (el href usa el id) */
const LABELS: Record<string, string> = {
  nosotros: "Nosotros",
  galeria: "Galería",
  cotizaciones: "Paquetes",
  ubicacion: "Ubicación",
};

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
      /* dirección del scroll: bajando muestra el Dock, subiendo vuelve el menú original */
      if (y < 300) {
        setShowDock(false);
      } else {
        const dy = y - lastY.current;
        if (dy > 6) setShowDock(true);
        else if (dy < -6) setShowDock(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["nosotros", "cotizaciones", "ubicacion", "galeria"];

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
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-16 transition-all duration-500 ${showDock ? "md:-translate-y-full md:opacity-0 md:pointer-events-none" : ""}`}
        style={{ background: scrolled ? `${C.bg}fc` : `linear-gradient(to bottom, ${C.bg}f0 0%, ${C.bg}00 100%)`, backdropFilter: scrolled ? "blur(14px)" : "none", borderBottom: scrolled ? `1px solid ${C.accent}14` : "none" }}>
        <a href="#" className="forest-shimmer text-xl tracking-[0.3em] uppercase font-light" style={{ fontFamily: "var(--font-display,serif)" }}>Salón del Bosque</a>
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
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 md:hidden transition-all duration-500"
        style={{ background: `${C.bg}fe`, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none" }}>
        {links.map((id, i) => (
          <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}
            className="text-3xl font-light transition-all duration-300"
            style={{ fontFamily: "var(--font-display,serif)", color: C.text, transform: menuOpen ? "translateY(0)" : "translateY(20px)", transitionDelay: `${i * 60}ms` }}>
            {LABELS[id]}
          </a>
        ))}
        <a href="#reserva" onClick={() => setMenuOpen(false)} className="mt-4 px-10 py-3 text-xs tracking-[0.3em] uppercase"
          style={{ background: `linear-gradient(135deg, ${C.accent}, #5a7a30)`, color: C.bg }}>Reservar</a>
      </div>

      {/* Dock flotante (solo escritorio): aparece al bajar, desaparece al subir */}
      <AnimatePresence>
        {showDock && isDesktop && (
          <motion.div
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
