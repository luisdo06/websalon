"use client";

import { useState } from "react";
import Image from "next/image";
import { C } from "@/lib/theme";
import { GALLERY } from "@/lib/content";
import { SITE } from "@/lib/site";
import { useReveal, usePrefersReducedMotion, useFinePointer, useMediaQuery } from "./hooks";
import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";
import QuoteCalculator from "./components/Packages";
import BookingForm from "./components/BookingForm";
import Amenities from "./components/Amenities";
import WhatsAppButton from "./components/WhatsAppButton";
import SocialLinks from "./components/SocialLinks";
import FallingLeaves from "./components/FallingLeaves";
import DomeGallery from "./components/DomeGallery";
import PhotoBento, { type BentoItem } from "./components/PhotoBento";
import BounceCards from "./components/BounceCards";

/* fotos del salón para el bento de "Nuestra historia" */
const HISTORIA_FOTOS: BentoItem[] = [
  { src: "/fotos/salon-dia.jpg", alt: "Salón montado para un evento", label: "Salón principal" },
  { src: "/fotos/salon-noche.jpg", alt: "Ambiente nocturno con pista de baile", label: "Ambiente nocturno" },
  { src: "/fotos/salon-mesa.jpg", alt: "Mesa montada con mantelería", label: "Mesa montada" },
  { src: "/fotos/salon-fuera-4.jpeg", alt: "Jardín y patio del salón", label: "Jardín" },
];

/* bento de "Equipo culinario": el retrato del chef va destacado (ocupa la columna
   izquierda completa) y a su derecha se apilan el equipo y el banquete */
const CULINARIA_FOTOS: BentoItem[] = [
  { src: "/fotos/chef-roman.jpg", alt: "Retrato del Chef Román Hernández", label: "Chef Román Hernández", featured: true },
  { src: "/fotos/equipo-grupo.jpg", alt: "Parte del equipo del salón en la barra", label: "Nuestro equipo" },
  { src: "/fotos/comida-menu.jpg", alt: "Banquete del salón", label: "Banquete" },
];

/* acento botánico sutil para encabezados centrados */
function LeafAccent() {
  return (
    <div className="flex items-center justify-center gap-3 mb-5" aria-hidden="true">
      <span className="h-px w-10" style={{ background: `${C.accent}40` }} />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20c0-8 6-14 16-16-2 10-8 16-16 16Z" /><path d="M4 20C8 14 12 10 18 8" />
      </svg>
      <span className="h-px w-10" style={{ background: `${C.accent}40` }} />
    </div>
  );
}

/* callback-ref de useReveal, compartido con las secciones extraídas */
type RevealRef = (el: HTMLElement | null) => void;

/* configuración responsiva del abanico de fotos (BounceCards) */
type BounceConfig = {
  containerWidth: number; containerHeight: number; cardSize: number;
  enableHover: boolean; transformStyles: string[];
};

/* ── HERO ── */
function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* foto de fondo */}
      <Image src="/fotos/salon-dia.jpg" alt="Salón del Bosque" fill priority sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }} />
      {/* velo crema que desvanece la foto (texto oscuro legible) */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `${C.bg}8c` }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, ${C.bg}66 0%, transparent 32%, transparent 58%, ${C.bg} 100%)` }} />

      {/* hojas cayendo (detrás del texto) */}
      <FallingLeaves />

      {/* contenido centrado */}
      <div className="relative z-10 w-full max-w-2xl mx-auto text-center px-6 py-24">
        <div className="anim-fade d-100"><LeafAccent /></div>
        <p className="anim-fade d-100 text-xs tracking-[0.4em] uppercase mb-5" style={{ color: C.accent }}>
          Salón de Eventos · Toluca
        </p>
        <h1 className="anim-fade-up d-200 mb-5 leading-none"
          style={{ fontFamily: "var(--font-display,serif)", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 600, color: C.text }}>
          Tu espacio ideal<br />
          <span className="forest-text">para celebrar</span>
        </h1>
        <p className="anim-fade-up d-400 text-base font-normal leading-relaxed mb-4" style={{ color: `${C.text}bb` }}>
          Un entorno único donde cada celebración<br />se convierte en un recuerdo eterno.
        </p>
        <div className="anim-fade-up d-500 flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-8" style={{ background: `${C.accent}50` }} />
          <p className="text-sm font-normal text-center leading-relaxed" style={{ color: `${C.text}aa`, fontFamily: "var(--font-display,serif)", fontStyle: "italic" }}>
            Empresa familiar comprometida con la calidad y calidez<br />en el servicio y la satisfacción total de sus clientes
          </p>
          <div className="h-px w-8" style={{ background: `${C.accent}50` }} />
        </div>
        <div className="anim-fade-up d-600 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#reserva" className="inline-block px-10 py-4 text-xs tracking-[0.25em] uppercase font-medium hover:opacity-85 transition-opacity duration-300"
            style={{ background: `linear-gradient(135deg, ${C.accent}, #5a7a30)`, color: C.bg }}>
            Reservar evento
          </a>
          <a href="#nosotros" className="inline-block px-10 py-4 text-xs tracking-[0.25em] uppercase transition-all duration-300"
            style={{ border: `1px solid ${C.text}28`, color: `${C.text}cc` }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${C.accent}60`; el.style.color = C.accent; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${C.text}28`; el.style.color = `${C.text}cc`; }}>
            Conócenos
          </a>
        </div>
      </div>

      {/* indicador de scroll (en móvil, por encima de la barra fija "Reservar") */}
      <a href="#nosotros" aria-label="Desliza para ver más"
        className="anim-fade d-800 absolute bottom-28 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: `${C.text}88` }}>Desliza</span>
        <span className="anim-float" style={{ color: C.accent }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
        </span>
      </a>
    </section>
  );
}

/* ── NOSOTROS ── */
function NosotrosSection({ addReveal, bounce }: { addReveal: RevealRef; bounce: BounceConfig }) {
  return (
    <section id="nosotros" className="py-24 px-6 md:px-16 section-blend" style={{ background: C.bg }}>
      <div className="max-w-3xl mx-auto">
        {/* header centrado */}
        <div ref={addReveal} className="section-reveal mb-10 text-center">
          <LeafAccent />
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: C.accent }}>Nuestra historia</p>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight" style={{ fontFamily: "var(--font-display,serif)" }}>
            15 años creando<br /><span className="forest-text">momentos especiales</span>
          </h2>
          <p className="text-base font-light leading-relaxed max-w-2xl mx-auto mt-6" style={{ color: `${C.text}cc` }}>
            Desde 2011, hemos sido el lugar
            donde las celebraciones más importantes se transforman en recuerdos inolvidables. Con años de
            experiencia y el compromiso de cuidar cada detalle, ofrecemos el escenario perfecto para bodas,
            quinceañeras, cumpleaños, bautizos, graduaciones, eventos empresariales y mucho más. Nuestro
            objetivo es que tú y tus invitados vivan una experiencia única, llena de momentos que
            permanecerán para siempre en su memoria. Porque las mejores historias merecen comenzar en un
            lugar extraordinario.
          </p>
        </div>

        {/* abanico de fotos del salón (BounceCards) */}
        <div ref={addReveal} className="section-reveal">
          <div className="flex justify-center">
            <BounceCards
              images={HISTORIA_FOTOS.map((f) => f.src as string)}
              containerWidth={bounce.containerWidth}
              containerHeight={bounce.containerHeight}
              cardSize={bounce.cardSize}
              transformStyles={bounce.transformStyles}
              enableHover={bounce.enableHover}
              animationDelay={0.3}
              animationStagger={0.09}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-10 justify-center">
            {["Bodas","XV Años","Cumpleaños","Bautizos","Comuniones","Graduaciones","Corporativos","Baby Shower"].map((tag) => (
              <span key={tag} className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5"
                style={{ border: `1px solid ${C.accent}30`, color: `${C.text}99`, background: `${C.accent}0a` }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* cocina */}
        <div ref={addReveal} className="section-reveal mt-16 text-center">
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: C.accent }}>El alma de nuestra cocina</p>
          <h3 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: "var(--font-display,serif)" }}>
            Nuestro <span className="amber-text">equipo culinario</span>
          </h3>
        </div>
        <div ref={addReveal} className="section-reveal max-w-2xl mx-auto mt-6">
          <p className="text-sm font-light leading-relaxed mb-4" style={{ color: `${C.text}cc` }}>
            Al frente está el <strong style={{ color: C.text, fontWeight: 400 }}>Chef Román Hernández</strong>,
            con más de <strong style={{ color: C.text, fontWeight: 400 }}>40 años de experiencia</strong> en
            La Finca de Adobe. Domina todo tipo de cocinas, desde la tradicional mexicana hasta la alta cocina
            internacional, con ingredientes frescos seleccionados cada día.
          </p>
          <p className="text-sm font-light leading-relaxed" style={{ color: `${C.text}cc` }}>
            Cuando apartes tu fecha con nosotros, te invitamos a una{" "}
            <strong style={{ color: C.text, fontWeight: 400 }}>degustación sin costo</strong> con el
            Chef Román, para elegir con calma el menú de tu celebración.
          </p>
        </div>
        <div className="mt-10">
          <PhotoBento items={CULINARIA_FOTOS} />
        </div>
      </div>
    </section>
  );
}

/* ── UBICACIÓN ── */
function UbicacionSection({ addReveal }: { addReveal: RevealRef }) {
  return (
    <section id="ubicacion" className="py-24 px-6 md:px-16 section-blend" style={{ background: C.bg }}>
      <div className="max-w-5xl mx-auto">
        <div ref={addReveal} className="section-reveal mb-10 text-center">
          <LeafAccent />
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: C.accent }}>Encuéntranos</p>
          <h2 className="text-4xl md:text-5xl font-semibold" style={{ fontFamily: "var(--font-display,serif)" }}>
            Nuestra <span className="forest-text">ubicación</span>
          </h2>
        </div>
        {/* mapa (izq.) + info (der.) */}
        <div ref={addReveal} className="section-reveal grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* mapa más pequeño, a la izquierda */}
          <div className="relative overflow-hidden aspect-[4/3]" style={{ border: `1px solid ${C.accent}18` }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3754.0!2d-99.619061!3d19.2779057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cd8a3090593f51:0x9a499e74b146f2be!2sSal%C3%B3n%20del%20Bosque!5e0!3m2!1ses!2smx!4v1700000000000"
              width="100%" height="100%" style={{ border: 0, filter: "saturate(0.7) brightness(1.05)" }}
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación Salón del Bosque" />
            {[["top-3 left-3","border-t border-l"],["top-3 right-3","border-t border-r"],
              ["bottom-3 left-3","border-b border-l"],["bottom-3 right-3","border-b border-r"]].map(([p, cls]) => (
              <div key={p} className={`absolute ${p} w-5 h-5 ${cls} pointer-events-none`} style={{ borderColor: `${C.accent}55` }} />
            ))}
          </div>
          {/* info a la derecha + Facebook */}
          <div className="space-y-6">
            {[
              { icon: "◎", label: "Dirección",  lines: ["Salón del Bosque", "Toluca, Estado de México"] },
              { icon: "◷", label: "Horarios",   lines: ["Lunes a Viernes · 9:00 am – 7:00 pm", "Sábados · 9:00 am – 5:00 pm", "Domingos · Cerrado"] },
              { icon: "◈", label: "Contacto",   lines: ["722 592 6512", "Evelia Mendoza Hernández"] },
            ].map((item) => (
              <div key={item.label} className="flex gap-3">
                <div className="text-xl shrink-0 mt-0.5" style={{ color: `${C.accent}80` }}>{item.icon}</div>
                <div>
                  <p className="text-[10px] tracking-[0.35em] uppercase mb-1.5" style={{ color: C.accent }}>{item.label}</p>
                  {item.lines.map((l) => <p key={l} className="text-sm font-light leading-relaxed" style={{ color: `${C.text}cc` }}>{l}</p>)}
                </div>
              </div>
            ))}
            {/* botón de Facebook */}
            <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-80"
              style={{ border: `1px solid ${C.accent}50`, color: C.accent }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 4h-2.5A3.5 3.5 0 0 0 9 7.5V10H6.5v3H9v8h3v-8h2.5l.5-3H12V7.5a.5.5 0 0 1 .5-.5H15z" />
              </svg>
              Síguenos en Facebook
            </a>
          </div>
        </div>
        {/* botones centrados */}
        <div ref={addReveal} className="section-reveal flex flex-wrap gap-3 justify-center mt-12">
          <a href="#reserva" className="inline-block px-8 py-3 text-xs tracking-[0.25em] uppercase font-medium hover:opacity-85 transition-opacity duration-300"
            style={{ background: `linear-gradient(135deg, ${C.accent}, #5a7a30)`, color: C.bg }}>
            Reservar cita
          </a>
          <a href="https://maps.app.goo.gl/YZwtrZ7VSL3aCEz88" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:opacity-80"
            style={{ border: `1px solid ${C.accent}50`, color: C.accent }}>
            ◎ Ver en Maps
          </a>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   PÁGINA PRINCIPAL
════════════════════════════════════════════ */
export default function Home() {
  const addReveal = useReveal();
  const reduced = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const cursorEnabled = finePointer && !reduced;
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState("");

  /* config del abanico de fotos (BounceCards), responsiva */
  const bounce = isDesktop
    ? {
        containerWidth: 520, containerHeight: 300, cardSize: 185, enableHover: true,
        transformStyles: ["rotate(8deg) translate(-150px)", "rotate(-4deg) translate(-52px)", "rotate(4deg) translate(52px)", "rotate(-8deg) translate(150px)"],
      }
    : {
        containerWidth: 320, containerHeight: 220, cardSize: 128, enableHover: false,
        transformStyles: ["rotate(8deg) translate(-92px)", "rotate(-4deg) translate(-32px)", "rotate(4deg) translate(32px)", "rotate(-8deg) translate(92px)"],
      };

  const elegirPaquete = (nombre: string) => {
    setPaqueteSeleccionado(nombre);
    setTimeout(() => {
      document.getElementById("reserva")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0" style={{ background: C.bg, color: C.text, fontFamily: "var(--font-body,sans-serif)", cursor: cursorEnabled ? "none" : "auto" }}>
      <CustomCursor enabled={cursorEnabled} />
      <Navbar />

      {/* ══ HERO ══ */}
      <HeroSection />

      {/* ══ SERVICIOS Y AMENIDADES ══ */}
      <section id="servicios" className="py-24 px-6 md:px-16 section-blend" style={{ background: C.bg }}>
        <div className="max-w-6xl mx-auto">
          <div ref={addReveal} className="section-reveal mb-12 text-center">
            <LeafAccent />
            <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: C.accent }}>Todo a tu servicio</p>
            <h2 className="text-4xl md:text-5xl font-semibold" style={{ fontFamily: "var(--font-display,serif)" }}>
              Servicios y <span className="amber-text">amenidades</span>
            </h2>
          </div>
          <div ref={addReveal} className="section-reveal">
            <Amenities />
          </div>
        </div>
      </section>

      {/* ══ NOSOTROS ══ */}
      <NosotrosSection addReveal={addReveal} bounce={bounce} />

      {/* ══ COTIZACIONES ══ */}
      <section id="cotizaciones" className="py-24 px-6 md:px-16 section-blend" style={{ background: C.bg }}>
        <div className="max-w-5xl mx-auto">
          <div ref={addReveal} className="section-reveal mb-12 text-center">
            <LeafAccent />
            <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: C.accent }}>Nuestros paquetes</p>
            <h2 className="text-4xl md:text-5xl font-semibold" style={{ fontFamily: "var(--font-display,serif)" }}>
              <span className="forest-text">Cotizaciones</span>
            </h2>
            <p className="text-sm font-light mt-3" style={{ color: `${C.text}99` }}>
              Elige el paquete que mejor se ajusta a tu evento
            </p>
          </div>
          <div ref={addReveal} className="section-reveal">
            <QuoteCalculator onElegirPaquete={elegirPaquete} />
          </div>
        </div>
      </section>

      {/* ══ UBICACIÓN ══ */}
      <UbicacionSection addReveal={addReveal} />

      {/* ══ GALERÍA ══ */}
      <section id="galeria" className="py-24 px-6 md:px-16 section-blend" style={{ background: C.bg }}>
        <div className="max-w-6xl mx-auto">
          <div ref={addReveal} className="section-reveal mb-10 text-center">
            <LeafAccent />
            <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: C.accent }}>Galería</p>
            <h2 className="text-4xl md:text-5xl font-semibold" style={{ fontFamily: "var(--font-display,serif)" }}>
              Nuestros <span className="forest-text">eventos</span>
            </h2>
            <p className="text-sm font-light mt-3" style={{ color: `${C.text}99` }}>
              Arrastra para explorar · toca una foto para ampliarla
            </p>
          </div>
          <div ref={addReveal} className="section-reveal relative w-full h-[70vh] min-h-[460px]">
            <DomeGallery
              images={GALLERY.flatMap((g) => (g.src ? [{ src: g.src as string, alt: g.label }] : []))}
              grayscale={false}
              overlayBlurColor={C.bg}
              fit={0.5}
              minRadius={380}
              mobile={!isDesktop}
            />
          </div>
        </div>
      </section>

      {/* ══ RESERVA ══ */}
      <section id="reserva" className="py-24 px-6 md:px-16 section-blend" style={{ background: C.bg }}>
        <div className="max-w-3xl mx-auto">
          <div ref={addReveal} className="section-reveal mb-10 text-center">
            <LeafAccent />
            <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: C.accent }}>Agenda tu visita</p>
            <h2 className="text-4xl md:text-5xl font-semibold" style={{ fontFamily: "var(--font-display,serif)" }}>
              <span className="forest-text">Reserva</span> tu evento
            </h2>
            <p className="text-sm font-light mt-3" style={{ color: `${C.text}99` }}>Te contactamos en menos de 1 hora.</p>
          </div>

          {/* mini-guía: cómo reservar en 3 pasos */}
          <div ref={addReveal} className="section-reveal mb-12">
            <p className="text-[10px] tracking-[0.35em] uppercase mb-6 text-center" style={{ color: C.accent }}>Cómo reservar</p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { n: "1", title: "Cuéntanos de tu evento", desc: "Completa los pasos del formulario." },
                { n: "2", title: "Revisa y envía", desc: "Confirma el resumen y mándalo por WhatsApp." },
                { n: "3", title: "Te confirmamos", desc: "Respondemos la disponibilidad en menos de 1 hora." },
              ].map((s) => (
                <div key={s.n} className="flex sm:flex-col items-start sm:items-center sm:text-center gap-4 sm:gap-0">
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center text-sm font-light sm:mb-3"
                    style={{ borderRadius: "9999px", background: `${C.accent}15`, color: C.accent, border: `1px solid ${C.accent}40`, fontFamily: "var(--font-display,serif)" }}>
                    {s.n}
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.1em] uppercase mb-1" style={{ color: C.text }}>{s.title}</p>
                    <p className="text-xs font-light leading-relaxed" style={{ color: `${C.text}99` }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs font-light leading-relaxed text-center mt-8 max-w-md mx-auto" style={{ color: `${C.text}99` }}>
              Al apartar tu fecha te invitamos a una degustación del menú con el Chef Román.
            </p>
          </div>

          <div ref={addReveal} className="section-reveal">
            <BookingForm paqueteInicial={paqueteSeleccionado} />
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="py-12 px-6 md:px-16" style={{ borderTop: `1px solid ${C.accent}12` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="forest-shimmer text-lg tracking-[0.3em] uppercase font-light" style={{ fontFamily: "var(--font-display,serif)" }}>
            Salón del Bosque
          </div>
          <div className="flex gap-7 text-[10px] tracking-[0.25em] uppercase">
            {[["nosotros","Nosotros"],["cotizaciones","Paquetes"],["ubicacion","Ubicación"],["galeria","Galería"]].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="transition-colors duration-300"
                style={{ color: `${C.text}99` }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = C.accent; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = `${C.text}99`; }}>
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <span style={{ color: `${C.text}99` }}><SocialLinks size={18} /></span>
            <p className="text-[10px] tracking-[0.15em]" style={{ color: `${C.text}88` }}>© 2026 Salón del Bosque.</p>
          </div>
        </div>
      </footer>

      {/* CTA fijo en móvil */}
      <a href="#reserva"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 flex items-center justify-center py-4 text-xs tracking-[0.3em] uppercase font-medium"
        style={{ background: `linear-gradient(135deg, ${C.accent}, #5a7a30)`, color: C.bg, boxShadow: `0 -8px 24px ${C.accent}22` }}>
        Reservar evento
      </a>

      {/* WhatsApp flotante */}
      <WhatsAppButton />
    </div>
  );
}
