"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─── tipos ─── */
interface Service {
  id: string;
  name: string;
  desc: string;
  price: string;
  detail: string;
}
interface Testimonial {
  name: string;
  role: string;
  text: string;
}

/* ─── datos ─── */
const SERVICES: Service[] = [
  { id: "01", name: "Corte & Forma", desc: "Precisión milimétrica que define tu silueta.", price: "desde $85", detail: "Análisis de rostro + corte personalizado + secado con técnica profesional." },
  { id: "02", name: "Color & Mechas", desc: "Técnicas exclusivas para un acabado luminoso.", price: "desde $140", detail: "Balayage, highlights, color completo con pigmentos de alta fijación." },
  { id: "03", name: "Tratamiento Capilar", desc: "Rituales de hidratación y restauración profunda.", price: "desde $70", detail: "Diagnosis capilar + mascarilla de keratina + ampolla nutritiva personalizada." },
  { id: "04", name: "Peinado de Novia", desc: "El día más especial merece la perfección.", price: "desde $200", detail: "Prueba previa + peinado el día del evento + fijación de larga duración." },
  { id: "05", name: "Keratina Premium", desc: "Alisado de larga duración con fórmula exclusiva.", price: "desde $180", detail: "Fórmula sin formaldehído, resultado liso hasta 6 meses, brillo espejo." },
  { id: "06", name: "Consulta & Asesoría", desc: "Guía personalizada para tu imagen ideal.", price: "Gratuito", detail: "Análisis de colorimetría personal, tipo de rostro y recomendación de servicios." },
];

const TESTIMONIALS: Testimonial[] = [
  { name: "Valentina M.", role: "Cliente desde 2021", text: "Una experiencia que va mucho más allá del corte. Salí transformada y con una confianza que no esperaba." },
  { name: "Isabela R.", role: "Cliente desde 2020", text: "El mejor salón que he visitado. La atención es impecable y el resultado, absolutamente sublime." },
  { name: "Carolina P.", role: "Cliente desde 2022", text: "Mi color nunca había lucido tan natural y brillante. El equipo entiende exactamente lo que quieres." },
];

const STATS = [
  { value: 10, suffix: "+", label: "Años" },
  { value: 2000, suffix: "+", label: "Clientes" },
  { value: 15, suffix: "", label: "Premios" },
  { value: 98, suffix: "%", label: "Satisfacción" },
];

/* ─── hook: IntersectionObserver genérico ─── */
function useReveal() {
  const refs = useRef<HTMLElement[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const add = useCallback((el: HTMLElement | null) => {
    if (el && !refs.current.includes(el)) refs.current.push(el);
  }, []);
  return add;
}

/* ─── hook: contador animado ─── */
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setCount(Math.floor(ease * target));
          if (t < 1) requestAnimationFrame(tick);
          else setCount(target);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ─── componente: stat con contador ─── */
function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value);
  return (
    <div className="text-center" ref={(el) => { (ref as React.MutableRefObject<HTMLElement | null>).current = el; }}>
      <div className="gold-text text-4xl font-light" style={{ fontFamily: "var(--font-display, serif)" }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[9px] tracking-[0.35em] uppercase text-[#f0ebe4]/35 mt-1">{label}</div>
    </div>
  );
}

/* ─── componente: service card con expand ─── */
function ServiceCard({ s, index }: { s: Service; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="section-reveal text-left border border-[#c9a96e]/10 p-8 relative group w-full transition-all duration-500"
      style={{
        background: open ? "linear-gradient(135deg, #130f09 0%, #0c0a07 100%)" : "linear-gradient(135deg, #0f0c08 0%, #080807 100%)",
        transitionDelay: `${index * 70}ms`,
      }}
    >
      {/* hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.09) 0%, transparent 70%)" }} />
      {/* top line reveal */}
      <div className="absolute top-0 left-0 w-full h-px transition-opacity duration-500 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
          opacity: open ? 1 : 0,
        }} />

      <div className="flex items-start justify-between mb-3">
        <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e]/45">{s.id}</p>
        <span className="text-[#c9a96e]/50 text-lg transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
      </div>
      <h3 className="text-xl font-light mb-2 text-[#f0ebe4]"
        style={{ fontFamily: "var(--font-display, serif)" }}>{s.name}</h3>
      <p className="text-[#f0ebe4]/45 text-sm leading-relaxed font-light">{s.desc}</p>

      {/* expandible */}
      <div className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: open ? "120px" : "0px", opacity: open ? 1 : 0 }}>
        <p className="text-[#c9a96e]/70 text-xs leading-relaxed mt-4 font-light border-t border-[#c9a96e]/10 pt-4">
          {s.detail}
        </p>
      </div>

      <div className="flex items-center justify-between mt-5">
        <p className="text-[#c9a96e] text-xs tracking-[0.2em]">{s.price}</p>
        <span className="text-[9px] tracking-[0.2em] uppercase text-[#f0ebe4]/25 group-hover:text-[#c9a96e]/50 transition-colors duration-300">
          {open ? "cerrar" : "ver más"}
        </span>
      </div>
    </button>
  );
}

/* ─── componente: testimonial con typewriter al hover ─── */
function TestimonialCard({ t, delay }: { t: Testimonial; delay: number }) {
  const [typed, setTyped] = useState("");
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startType = useCallback(() => {
    setHovered(true);
    let i = 0;
    const type = () => {
      setTyped(t.text.slice(0, i));
      i++;
      if (i <= t.text.length) timerRef.current = setTimeout(type, 18);
    };
    type();
  }, [t.text]);

  const stopType = useCallback(() => {
    setHovered(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setTyped("");
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div className="section-reveal border border-[#c9a96e]/10 p-8 cursor-default relative overflow-hidden"
      style={{ background: "#0c0a07", transitionDelay: `${delay}ms` }}
      onMouseEnter={startType}
      onMouseLeave={stopType}>
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(201,169,110,0.05) 0%, transparent 70%)",
          opacity: hovered ? 1 : 0,
        }} />
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, j) => (
          <span key={j} className="text-[#c9a96e] text-xs"
            style={{ opacity: hovered ? 1 : 0.4, transition: `opacity 0.2s ${j * 80}ms` }}>★</span>
        ))}
      </div>
      <p className="text-[#f0ebe4]/60 text-sm leading-relaxed mb-5 font-light italic min-h-[72px]"
        style={{ fontFamily: "var(--font-display, serif)" }}>
        &ldquo;{hovered ? typed : t.text}&rdquo;
        {hovered && typed.length < t.text.length && (
          <span className="inline-block w-px h-3 bg-[#c9a96e] ml-0.5 animate-pulse" />
        )}
      </p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#c9a96e]/15 flex items-center justify-center text-[#c9a96e] text-xs">
          {t.name[0]}
        </div>
        <div>
          <p className="text-xs tracking-[0.15em] text-[#f0ebe4]/60 uppercase">{t.name}</p>
          <p className="text-[9px] text-[#f0ebe4]/25 mt-0.5">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── componente: formulario con validación JS ─── */
function BookingForm() {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", servicio: "", mensaje: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
    if (!form.telefono.trim()) e.telefono = "Requerido";
    if (!form.servicio) e.servicio = "Selecciona un servicio";
    return e;
  };

  const handleChange = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1800);
  };

  if (status === "success") {
    return (
      <div className="border border-[#c9a96e]/15 p-10 text-center" style={{ background: "#0c0a07" }}>
        <div className="w-12 h-12 rounded-full border border-[#c9a96e] flex items-center justify-center mx-auto mb-4 anim-scale-in">
          <span className="gold-text text-xl">✓</span>
        </div>
        <p className="gold-text text-2xl font-light mb-2" style={{ fontFamily: "var(--font-display, serif)" }}>
          ¡Solicitud enviada!
        </p>
        <p className="text-[#f0ebe4]/45 text-sm font-light">Te contactaremos en menos de 24 horas.</p>
      </div>
    );
  }

  const inputBase = "w-full bg-transparent border px-4 py-3 text-sm text-[#f0ebe4]/80 placeholder:text-[#f0ebe4]/20 focus:outline-none transition-colors duration-300 font-light";
  const fieldClass = (k: keyof typeof form) =>
    `${inputBase} ${errors[k] ? "border-red-400/50" : "border-[#c9a96e]/15 focus:border-[#c9a96e]/50"}`;

  return (
    <form onSubmit={handleSubmit} noValidate
      className="border border-[#c9a96e]/15 p-8 md:p-10 space-y-5" style={{ background: "#0c0a07" }}>
      {(["nombre", "email", "telefono"] as const).map((k) => (
        <div key={k}>
          <label className="block text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/55 mb-2">
            {k === "nombre" ? "Nombre completo" : k === "email" ? "Correo electrónico" : "Teléfono"}
          </label>
          <input
            type={k === "email" ? "email" : k === "telefono" ? "tel" : "text"}
            value={form[k]}
            onChange={handleChange(k)}
            placeholder={k === "nombre" ? "Tu nombre" : k === "email" ? "correo@ejemplo.com" : "+57 300 000 0000"}
            className={fieldClass(k)}
          />
          {errors[k] && <p className="text-red-400/70 text-[10px] mt-1">{errors[k]}</p>}
        </div>
      ))}
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/55 mb-2">Servicio</label>
        <select value={form.servicio} onChange={handleChange("servicio")}
          className={`${fieldClass("servicio")} bg-[#0c0a07]`}>
          <option value="">Selecciona un servicio</option>
          {SERVICES.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
        {errors.servicio && <p className="text-red-400/70 text-[10px] mt-1">{errors.servicio}</p>}
      </div>
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/55 mb-2">Mensaje (opcional)</label>
        <textarea rows={3} value={form.mensaje} onChange={handleChange("mensaje")}
          placeholder="Cuéntanos sobre lo que buscas..."
          className={`${fieldClass("mensaje")} resize-none`} />
      </div>
      <button type="submit" disabled={status === "loading"}
        className="w-full py-4 text-xs tracking-[0.3em] uppercase font-medium text-[#080807] transition-all duration-300 hover:opacity-85 relative overflow-hidden disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #c9a96e, #a07c45)" }}>
        {status === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 rounded-full border border-[#080807]/40 border-t-[#080807] animate-spin" />
            Enviando...
          </span>
        ) : "Solicitar reserva"}
      </button>
    </form>
  );
}

/* ─── componente: nav con scroll progress y menú móvil ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
      setScrolled(scrollTop > 60);

      const sections = ["servicios", "nosotros", "testimonios", "reserva"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["servicios", "nosotros", "testimonios", "reserva"];

  return (
    <>
      {/* progress bar */}
      <div className="fixed top-0 left-0 right-0 h-px z-[60] origin-left transition-transform duration-100"
        style={{
          background: "linear-gradient(90deg, #c9a96e, #e8d5a3)",
          transform: `scaleX(${progress})`,
        }} />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-16 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(8,8,7,0.97)" : "linear-gradient(to bottom, rgba(8,8,7,0.9) 0%, rgba(8,8,7,0) 100%)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(201,169,110,0.08)" : "none",
        }}>
        <a href="#" className="gold-shimmer text-xl tracking-[0.3em] uppercase font-light"
          style={{ fontFamily: "var(--font-display, serif)" }}>
          Maison Aurea
        </a>

        {/* desktop links */}
        <div className="hidden md:flex gap-10 text-xs tracking-[0.2em] uppercase">
          {navLinks.map((id) => (
            <a key={id} href={`#${id}`}
              className="transition-colors duration-300 capitalize"
              style={{ color: activeSection === id ? "#c9a96e" : "rgba(201,169,110,0.5)" }}>
              {id}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a href="#reserva"
            className="hidden md:block text-xs tracking-[0.2em] uppercase border border-[#c9a96e]/50 text-[#c9a96e] px-5 py-2 hover:bg-[#c9a96e]/10 transition-all duration-300">
            Reservar
          </a>
          {/* hamburger */}
          <button className="md:hidden flex flex-col gap-1.5 p-1" onClick={() => setMenuOpen((o) => !o)}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="block w-6 h-px bg-[#c9a96e] transition-all duration-300"
                style={{
                  transform: menuOpen
                    ? i === 0 ? "translateY(8px) rotate(45deg)" : i === 2 ? "translateY(-8px) rotate(-45deg)" : "scaleX(0)"
                    : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }} />
            ))}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 md:hidden transition-all duration-500"
        style={{
          background: "rgba(8,8,7,0.98)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}>
        {navLinks.map((id, i) => (
          <a key={id} href={`#${id}`}
            onClick={() => setMenuOpen(false)}
            className="text-3xl font-light capitalize transition-all duration-300"
            style={{
              fontFamily: "var(--font-display, serif)",
              color: "#f0ebe4",
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transitionDelay: `${i * 60}ms`,
            }}>
            {id}
          </a>
        ))}
        <a href="#reserva" onClick={() => setMenuOpen(false)}
          className="mt-4 px-10 py-3 text-xs tracking-[0.3em] uppercase text-[#080807]"
          style={{ background: "linear-gradient(135deg, #c9a96e, #a07c45)" }}>
          Reservar
        </a>
      </div>
    </>
  );
}

/* ─── componente: cursor personalizado ─── */
function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#c9a96e] z-[999] pointer-events-none hidden md:block" />
      <div ref={ring} className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#c9a96e]/40 z-[999] pointer-events-none hidden md:block" />
    </>
  );
}

/* ─── componente: parallax hero text ─── */
function HeroSection() {
  const [offset, setOffset] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setOffset(y * 0.4);
      setOpacity(Math.max(0, 1 - y / 500));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 60% 50%, rgba(201,169,110,0.07) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(160,124,69,0.05) 0%, transparent 50%)"
        }} />
      <div className="absolute top-0 left-1/2 w-px h-32 bg-gradient-to-b from-transparent to-[#c9a96e]/25 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 w-px h-32 bg-gradient-to-t from-transparent to-[#c9a96e]/25 pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={{ transform: `translateY(${offset}px)`, opacity }}>
        <p className="anim-fade d-100 text-xs tracking-[0.4em] uppercase text-[#c9a96e] mb-6">
          Atelier de Belleza · Bogotá
        </p>
        <h1 className="anim-fade-up d-200 mb-6 leading-none"
          style={{ fontFamily: "var(--font-display, serif)", fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 300 }}>
          El arte de la<br />
          <span className="gold-shimmer">belleza auténtica</span>
        </h1>
        <p className="anim-fade-up d-400 text-[#f0ebe4]/45 text-base md:text-lg font-light tracking-wide max-w-xl mx-auto mb-12 leading-relaxed">
          Un espacio donde la precisión se encuentra con el lujo.<br />
          Cada visita, una experiencia irrepetible.
        </p>
        <div className="anim-fade-up d-600 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#reserva"
            className="inline-block px-10 py-4 text-xs tracking-[0.25em] uppercase text-[#080807] font-medium hover:opacity-85 transition-opacity duration-300"
            style={{ background: "linear-gradient(135deg, #c9a96e, #a07c45)" }}>
            Reservar cita
          </a>
          <a href="#servicios"
            className="inline-block px-10 py-4 text-xs tracking-[0.25em] uppercase border border-[#f0ebe4]/20 text-[#f0ebe4]/60 hover:border-[#c9a96e]/50 hover:text-[#c9a96e] transition-all duration-300">
            Ver servicios
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 anim-fade d-800 pointer-events-none">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/40">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#c9a96e]/40 to-transparent anim-float" />
      </div>
    </section>
  );
}

/* ─── página principal ─── */
export default function Home() {
  const addReveal = useReveal();

  return (
    <div className="bg-[#080807] text-[#f0ebe4] min-h-screen" style={{ fontFamily: "var(--font-body, sans-serif)", cursor: "none" }}>
      <CustomCursor />
      <Navbar />
      <HeroSection />

      {/* decorative divider */}
      <div className="flex items-center justify-center py-4">
        <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#c9a96e]/35" />
        <div className="mx-4 text-[#c9a96e]/35 text-base">◆</div>
        <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#c9a96e]/35" />
      </div>

      {/* NOSOTROS */}
      <section id="nosotros" className="py-24 md:py-36 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div ref={addReveal} className="section-reveal">
            <p className="text-xs tracking-[0.4em] uppercase text-[#c9a96e] mb-4">Nuestra esencia</p>
            <h2 className="text-4xl md:text-5xl font-light mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display, serif)" }}>
              Donde el cuidado<br /><span className="gold-text">se convierte en arte</span>
            </h2>
            <p className="text-[#f0ebe4]/50 leading-relaxed mb-4 font-light text-sm">
              En Maison Aurea creemos que la belleza es un lenguaje propio. Desde 2015,
              nuestro equipo de artistas capilares trabaja con técnicas de vanguardia
              y productos de la más alta calidad.
            </p>
            <p className="text-[#f0ebe4]/50 leading-relaxed font-light text-sm">
              Escuchamos, asesoramos y creamos una experiencia completamente personalizada
              desde el momento en que cruzas nuestra puerta.
            </p>
            <div className="flex items-center gap-8 mt-10">
              {STATS.map((s) => <AnimatedStat key={s.label} {...s} />)}
            </div>
          </div>
          <div ref={addReveal} className="section-reveal">
            <div className="relative aspect-[4/5]"
              style={{ background: "linear-gradient(135deg, #1a1410 0%, #0f0c08 100%)" }}>
              <div className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(201,169,110,0.1) 0%, transparent 60%)" }} />
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
                <div className="gold-text font-light"
                  style={{ fontFamily: "var(--font-display, serif)", fontSize: "6rem", opacity: 0.2 }}>M</div>
                <div className="w-10 h-px bg-[#c9a96e]/25 mx-auto" />
                <div className="text-[9px] tracking-[0.6em] uppercase text-[#c9a96e]/25">Aurea</div>
              </div>
              {[["top-4 left-4", "border-t border-l"], ["top-4 right-4", "border-t border-r"],
                ["bottom-4 left-4", "border-b border-l"], ["bottom-4 right-4", "border-b border-r"]].map(([pos, cls]) => (
                <div key={pos} className={`absolute ${pos} w-8 h-8 ${cls} border-[#c9a96e]/25`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="py-24 md:py-36 px-6 md:px-16 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(201,169,110,0.04) 0%, transparent 60%)" }} />
        <div className="max-w-6xl mx-auto relative">
          <div ref={addReveal} className="section-reveal text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-[#c9a96e] mb-4">Lo que ofrecemos</p>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "var(--font-display, serif)" }}>
              Nuestros <span className="gold-text">servicios</span>
            </h2>
            <p className="text-[#f0ebe4]/35 text-sm mt-3">Haz clic en cada servicio para ver más detalles</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.id} s={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, #080807 0%, #110d07 50%, #080807 100%)" }} />
        <div className="relative z-10 text-center px-6">
          <div ref={addReveal} className="section-reveal">
            <p className="text-2xl md:text-3xl font-light text-[#f0ebe4]/60 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: "var(--font-display, serif)" }}>
              &ldquo;La elegancia no es ser notada,
              <span className="gold-text"> es ser recordada.</span>&rdquo;
            </p>
            <p className="mt-4 text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/35">— Giorgio Armani</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" className="py-24 md:py-36 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div ref={addReveal} className="section-reveal text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-[#c9a96e] mb-4">Ellas hablan</p>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "var(--font-display, serif)" }}>
              <span className="gold-text">Experiencias</span> reales
            </h2>
            <p className="text-[#f0ebe4]/35 text-sm mt-3">Pasa el cursor para leer cada historia</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.name} t={t} delay={i * 120} />
            ))}
          </div>
        </div>
      </section>

      {/* RESERVA */}
      <section id="reserva" className="py-24 md:py-36 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(201,169,110,0.06) 0%, transparent 60%)" }} />
        <div className="max-w-xl mx-auto relative">
          <div ref={addReveal} className="section-reveal text-center mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-[#c9a96e] mb-4">Agenda tu visita</p>
            <h2 className="text-4xl md:text-5xl font-light mb-4" style={{ fontFamily: "var(--font-display, serif)" }}>
              <span className="gold-text">Reserva</span> tu cita
            </h2>
            <p className="text-[#f0ebe4]/40 text-sm font-light">Te contactamos en menos de 24 horas.</p>
          </div>
          <div ref={addReveal} className="section-reveal">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 px-6 md:px-16 border-t border-[#c9a96e]/8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="gold-shimmer text-lg tracking-[0.3em] uppercase font-light"
            style={{ fontFamily: "var(--font-display, serif)" }}>
            Maison Aurea
          </div>
          <div className="flex gap-8 text-[10px] tracking-[0.25em] uppercase text-[#f0ebe4]/25">
            {["servicios", "nosotros", "reserva"].map((id) => (
              <a key={id} href={`#${id}`}
                className="hover:text-[#c9a96e] transition-colors duration-300 capitalize">{id}</a>
            ))}
          </div>
          <p className="text-[10px] tracking-[0.15em] text-[#f0ebe4]/18">
            © 2026 Maison Aurea.
          </p>
        </div>
      </footer>
    </div>
  );
}
