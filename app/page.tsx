"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const C = {
  bg:       "#f5f0e8",
  surface:  "#ede7d8",
  surface2: "#e4dccc",
  accent:   "#5a8a38",
  amber:    "#a06818",
  rust:     "#8b4a22",
  text:     "#0e1508",
} as const;

/* ─── tipos ─── */
interface Testimonial { name: string; role: string; text: string; }

const TESTIMONIALS: Testimonial[] = [
  { name: "Valentina M.", role: "Cliente desde 2021", text: "Una experiencia que va mucho más allá del corte. Salí transformada y con una confianza que no esperaba." },
  { name: "Isabela R.",   role: "Cliente desde 2020", text: "El mejor salón que he visitado. La atención es impecable y el resultado, absolutamente sublime." },
  { name: "Carolina P.",  role: "Cliente desde 2022", text: "Mi color nunca había lucido tan natural y brillante. El equipo entiende exactamente lo que quieres." },
];

const STATS = [
  { value: 25,   suffix: "",  label: "Años"        },
  { value: 2000, suffix: "+", label: "Clientes"    },
  { value: 15,   suffix: "",  label: "Premios"     },
  { value: 98,   suffix: "%", label: "Satisfacción"},
];

const PACKAGES = [
  {
    id: "01",
    name: "Paquete Completo",
    tag: "Con banquete incluido",
    price: "$350 por persona",
    priceNote: "Niños pequeños mitad de precio",
    highlight: "Ideal para bodas, XV años y eventos especiales",
    noIncluye: ["Música", "Pastel", "Centros de mesa"],
    incluye: [
      "Renta de salón (8 hrs)",
      "Mesas redondas + sillas Tiffany con cojín",
      "Mantelería completa (mantel, cubre mantel o camino de mesa, cintas, servilletas de tela individual)",
      "Loza completa",
      "Meseros (llegan 2 hrs antes · 6 hrs de servicio después)",
      "2 personas cuidando autos (5 hrs)",
      "Refrescos, agua de jamaica, agua natural, hielos y café",
      "Comida en tres tiempos:",
    ],
    menu: [
      { curso: "Entrada", detalle: "Crema a elegir" },
      { curso: "Segundo", detalle: "Pasta (fusilli, fettuccine o espagueti) preparada en varias formas + pan baguette individual con ajonjolí y rajas caseras del chef" },
      { curso: "Plato fuerte", detalle: "Pechuga de pollo fresco (200 g) horneada y rellena — opciones: jamón con queso · espinacas con queso — bañada en salsa a elegir (pimiento morrón, ciruela pasa, tamarindo, chipotle, etc.) + ensalada de tres lechugas con frutos rojos o verduras al vapor" },
    ],
    color: C.accent,
  },
  {
    id: "02",
    name: "Paquete Sencillo",
    tag: "Sin comida · mobiliario completo",
    price: "$19,800 total",
    priceNote: "Para hasta 150 invitados",
    highlight: "Perfecto para quienes traen su propio catering",
    noIncluye: [] as string[],
    incluye: [
      "Renta de salón (8 hrs + 1 hr para retirarse)",
      "Mesas redondas + sillas Tiffany",
      "Mantelería completa (mantel, cubre mantel, cojines para sillas, servilletas de tela individual)",
      "Loza completa (plato trinche, plato arrocero o hondo, cubiertos, vaso cubero de cristal)",
      "5 meseros (llegan 2 hrs antes · 6 hrs de servicio después)",
      "2 personas cuidando autos (5 hrs)",
      "Cestos para tortillas, hieleras, jarras de cristal, tazones, cucharas y charolas para servir",
    ],
    menu: [],
    color: C.amber,
  },
] as const;

/* ─── hook: reveal al scroll ─── */
function useReveal() {
  const refs = useRef<HTMLElement[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08 }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return useCallback((el: HTMLElement | null) => {
    if (el && !refs.current.includes(el)) refs.current.push(el);
  }, []);
}

/* ─── hook: contador animado ─── */
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - t0) / duration, 1);
          setCount(Math.floor((1 - Math.pow(1 - t, 3)) * target));
          if (t < 1) requestAnimationFrame(tick); else setCount(target);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return { count, ref };
}

/* ─── SectionPhoto: panel izquierdo sticky con placeholder y degradado ─── */
function SectionPhoto({ label, hint }: { label: string; hint: string }) {
  return (
    /* en móvil: altura fija arriba · en desktop: sticky altura completa */
    <div className="relative h-64 md:h-screen md:sticky md:top-0 flex-shrink-0 md:w-1/2 overflow-hidden">
      {/* fondo placeholder con patrón de puntos */}
      <div className="absolute inset-0"
        style={{ background: `linear-gradient(160deg, ${C.surface2} 0%, ${C.surface} 60%, ${C.bg} 100%)` }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(${C.accent}18 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />

      {/* icono + etiqueta central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-10 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ border: `1px dashed ${C.accent}50`, background: `${C.accent}10` }}>
          <span className="text-2xl" style={{ color: `${C.accent}70` }}>⬚</span>
        </div>
        <p className="text-sm font-light tracking-[0.12em]" style={{ color: `${C.text}bb` }}>{label}</p>
        <p className="text-[10px] leading-relaxed max-w-[200px]" style={{ color: `${C.text}66` }}>{hint}</p>
      </div>

      {/* degradado horizontal: imagen → crema (en desktop) */}
      <div className="absolute inset-0 pointer-events-none hidden md:block"
        style={{ background: `linear-gradient(to right, transparent 55%, ${C.bg} 92%)` }} />
      {/* degradado vertical: imagen → crema (en móvil) */}
      <div className="absolute inset-0 pointer-events-none md:hidden"
        style={{ background: `linear-gradient(to bottom, transparent 50%, ${C.bg} 95%)` }} />
    </div>
  );
}

/* ─── SplitSection: wrapper con imagen sticky izquierda + contenido derecha ─── */
function SplitSection({
  id, photoLabel, photoHint, children,
}: {
  id?: string; photoLabel: string; photoHint: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="md:flex relative">
      <SectionPhoto label={photoLabel} hint={photoHint} />
      {/* contenido: en desktop ocupa la mitad derecha con fondo semitransparente */}
      <div className="w-full md:w-1/2 relative"
        style={{ background: `${C.bg}ee`, backdropFilter: "blur(2px)" }}>
        {children}
      </div>
    </section>
  );
}

/* ─── CountdownTimer ─── */
function CountdownTimer() {
  const getNextSat = () => {
    const now = new Date();
    const daysUntilSat = now.getDay() === 6 ? 7 : (6 - now.getDay());
    const t = new Date(now);
    t.setDate(now.getDate() + daysUntilSat);
    t.setHours(9, 0, 0, 0);
    return t;
  };
  const calc = () => {
    const diff = getNextSat().getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const id = setInterval(() => { setTime(calc()); setPulse(true); setTimeout(() => setPulse(false), 300); }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-3 mt-10">
      <div className="flex items-end gap-3">
        {[{ val: time.d, label: "días" }, { val: time.h, label: "horas" }, { val: time.m, label: "min" }, { val: time.s, label: "seg" }]
          .map(({ val, label }, i) => (
            <div key={label} className="flex items-end gap-3">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 flex items-center justify-center text-2xl font-light transition-all duration-300"
                  style={{ fontFamily: "var(--font-display,serif)", background: C.surface, border: `1px solid ${C.accent}30`, color: C.text, transform: label === "seg" && pulse ? "scale(1.05)" : "scale(1)" }}>
                  {pad(val)}
                </div>
                <span className="text-[8px] tracking-[0.3em] uppercase mt-1" style={{ color: `${C.text}80` }}>{label}</span>
              </div>
              {i < 3 && <span className="text-xl mb-3 font-light" style={{ color: `${C.accent}60` }}>:</span>}
            </div>
          ))}
      </div>
    </div>
  );
}

/* ─── PhotoSlot: placeholder inline (galería interna) ─── */
function PhotoSlot({ label, hint, wide = false }: { label: string; hint: string; wide?: boolean }) {
  return (
    <div className={`relative ${wide ? "aspect-[21/6]" : "aspect-[4/3]"} overflow-hidden group`}
      style={{ border: `1px dashed ${C.accent}35`, background: `linear-gradient(135deg, ${C.surface2}, ${C.surface})` }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(${C.accent}12 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
      {[["top-2 left-2","border-t border-l"],["top-2 right-2","border-t border-r"],
        ["bottom-2 left-2","border-b border-l"],["bottom-2 right-2","border-b border-r"]].map(([p, cls]) => (
        <div key={p} className={`absolute ${p} w-4 h-4 ${cls}`} style={{ borderColor: `${C.accent}45` }} />
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
        <span className="text-lg" style={{ color: `${C.accent}60` }}>⬚</span>
        <p className="text-[10px]" style={{ color: `${C.text}99` }}>{label}</p>
        <p className="text-[9px]" style={{ color: `${C.text}60` }}>{hint}</p>
      </div>
    </div>
  );
}

/* ─── AnimatedStat ─── */
function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value);
  return (
    <div className="text-center" ref={(el) => { (ref as React.MutableRefObject<HTMLElement | null>).current = el; }}>
      <div className="forest-text text-4xl font-light" style={{ fontFamily: "var(--font-display,serif)" }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[9px] tracking-[0.35em] uppercase mt-1" style={{ color: `${C.text}aa` }}>{label}</div>
    </div>
  );
}

/* ─── ServiceCard expandible ─── */
function ServiceCard({ s, index }: { s: Service; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen((o) => !o)}
      className="section-reveal text-left p-6 relative group w-full transition-all duration-500"
      style={{ background: open ? C.surface2 : C.surface, border: `1px solid ${C.accent}18`, transitionDelay: `${index * 60}ms` }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${C.accent}10 0%, transparent 70%)` }} />
      <div className="absolute top-0 left-0 w-full h-px pointer-events-none transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`, opacity: open ? 1 : 0 }} />
      <div className="flex items-start justify-between mb-2">
        <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: `${C.accent}70` }}>{s.id}</p>
        <span className="text-lg transition-transform duration-300" style={{ color: `${C.accent}80`, transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
      </div>
      <h3 className="text-lg font-light mb-1" style={{ fontFamily: "var(--font-display,serif)", color: C.text }}>{s.name}</h3>
      <p className="text-sm leading-relaxed font-light" style={{ color: `${C.text}cc` }}>{s.desc}</p>
      <div className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: open ? "100px" : "0px", opacity: open ? 1 : 0 }}>
        <p className="text-xs leading-relaxed mt-3 font-light pt-3" style={{ color: `${C.amber}dd`, borderTop: `1px solid ${C.accent}18` }}>{s.detail}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs tracking-[0.2em]" style={{ color: C.amber }}>{s.price}</p>
        <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: open ? `${C.accent}80` : `${C.text}66` }}>{open ? "cerrar" : "ver más"}</span>
      </div>
    </button>
  );
}

/* ─── TestimonialCard con typewriter ─── */
function TestimonialCard({ t, delay }: { t: Testimonial; delay: number }) {
  const [typed, setTyped]     = useState("");
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startType = useCallback(() => {
    setHovered(true); let i = 0;
    const type = () => { setTyped(t.text.slice(0, i++)); if (i <= t.text.length) timerRef.current = setTimeout(type, 18); };
    type();
  }, [t.text]);
  const stopType = useCallback(() => {
    setHovered(false); if (timerRef.current) clearTimeout(timerRef.current); setTyped("");
  }, []);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);
  return (
    <div className="section-reveal p-6 cursor-default relative overflow-hidden"
      style={{ background: C.surface, border: `1px solid ${C.accent}18`, transitionDelay: `${delay}ms` }}
      onMouseEnter={startType} onMouseLeave={stopType}>
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${C.accent}0a 0%, transparent 70%)`, opacity: hovered ? 1 : 0 }} />
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, j) => (
          <span key={j} className="text-xs transition-opacity duration-200"
            style={{ color: C.amber, opacity: hovered ? 1 : 0.35, transitionDelay: `${j * 80}ms` }}>★</span>
        ))}
      </div>
      <p className="text-sm leading-relaxed mb-4 font-light italic min-h-[60px]"
        style={{ fontFamily: "var(--font-display,serif)", color: `${C.text}bb` }}>
        &ldquo;{hovered ? typed : t.text}&rdquo;
        {hovered && typed.length < t.text.length && <span className="inline-block w-px h-3 ml-0.5 animate-pulse" style={{ background: C.accent }} />}
      </p>
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
          style={{ background: `${C.accent}20`, color: C.accent }}>{t.name[0]}</div>
        <div>
          <p className="text-xs tracking-[0.15em] uppercase" style={{ color: `${C.text}bb` }}>{t.name}</p>
          <p className="text-[9px] mt-0.5" style={{ color: `${C.text}80` }}>{t.role}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── BookingForm con validación ─── */
function BookingForm() {
  const [form, setForm]     = useState({ nombre: "", email: "", telefono: "", servicio: "", mensaje: "" });
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
  const handleChange = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
  if (status === "success") return (
    <div className="p-10 text-center" style={{ background: C.surface, border: `1px solid ${C.accent}25` }}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ border: `1px solid ${C.accent}` }}>
        <span className="forest-text text-xl">✓</span>
      </div>
      <p className="forest-text text-2xl font-light mb-2" style={{ fontFamily: "var(--font-display,serif)" }}>¡Solicitud enviada!</p>
      <p className="text-sm font-light" style={{ color: `${C.text}bb` }}>Te contactaremos en menos de 24 horas.</p>
    </div>
  );
  const base  = "w-full bg-transparent px-4 py-3 text-sm font-light focus:outline-none transition-colors duration-300 border";
  const field = (k: keyof typeof form) => `${base} ${errors[k] ? "border-red-400/50" : ""}`;
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {(["nombre", "email", "telefono"] as const).map((k) => (
        <div key={k}>
          <label className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>
            {k === "nombre" ? "Nombre completo" : k === "email" ? "Correo electrónico" : "Teléfono"}
          </label>
          <input type={k === "email" ? "email" : k === "telefono" ? "tel" : "text"}
            value={form[k]} onChange={handleChange(k)}
            placeholder={k === "nombre" ? "Tu nombre" : k === "email" ? "correo@ejemplo.com" : "722 592 6512"}
            className={field(k)}
            style={{ color: C.text, borderColor: errors[k] ? "rgba(248,113,113,0.5)" : `${C.accent}30`, caretColor: C.accent }} />
          {errors[k] && <p className="text-[10px] mt-1 text-red-500/70">{errors[k]}</p>}
        </div>
      ))}
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Tipo de evento</label>
        <select value={form.servicio} onChange={handleChange("servicio")} className={`${field("servicio")} appearance-none`}
          style={{ background: C.surface, color: C.text, borderColor: errors.servicio ? "rgba(248,113,113,0.5)" : `${C.accent}30` }}>
          <option value="">Selecciona un evento</option>
          {["Boda","XV Años","Cumpleaños","Bautizo","Comunión","Grado","Corporativo","Baby Shower","Otro"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.servicio && <p className="text-[10px] mt-1 text-red-500/70">{errors.servicio}</p>}
      </div>
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Mensaje (opcional)</label>
        <textarea rows={3} value={form.mensaje} onChange={handleChange("mensaje")} placeholder="Fecha aproximada, número de invitados..."
          className={`${field("mensaje")} resize-none`}
          style={{ color: C.text, borderColor: `${C.accent}30`, caretColor: C.accent }} />
      </div>
      <button type="submit" disabled={status === "loading"}
        className="w-full py-4 text-xs tracking-[0.3em] uppercase font-medium transition-all duration-300 hover:opacity-85 disabled:opacity-60"
        style={{ background: `linear-gradient(135deg, ${C.accent}, #5a7a30)`, color: C.bg }}>
        {status === "loading"
          ? <span className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 anim-spin" style={{ borderColor: `${C.bg}50`, borderTopColor: C.bg }} />
              Enviando...
            </span>
          : "Solicitar reserva"}
      </button>
    </form>
  );
}

/* ─── QuoteCalculator ─── */
function PackageCard({ pkg }: { pkg: typeof PACKAGES[number] }) {
  const [open, setOpen] = useState(false);
  const isAccent = pkg.color === C.accent;

  return (
    <div className="relative overflow-hidden transition-all duration-500"
      style={{ border: `1px solid ${pkg.color}25`, background: C.surface }}>
      {/* franja superior de color */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${pkg.color}80, ${pkg.color}30)` }} />

      <div className="p-6">
        {/* cabecera */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[9px] tracking-[0.45em] uppercase mb-1" style={{ color: `${pkg.color}99` }}>Paquete {pkg.id}</p>
            <h3 className="text-2xl font-light" style={{ fontFamily: "var(--font-display,serif)", color: C.text }}>{pkg.name}</h3>
            <p className="text-xs mt-1 font-light" style={{ color: `${C.text}88` }}>{pkg.tag}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-light" style={{ fontFamily: "var(--font-display,serif)", color: pkg.color }}>{pkg.price}</p>
            <p className="text-[10px] mt-0.5" style={{ color: `${C.text}77` }}>{pkg.priceNote}</p>
          </div>
        </div>

        {/* highlight */}
        <p className="text-xs italic mb-5 pb-5" style={{ color: `${C.text}99`, borderBottom: `1px solid ${pkg.color}15`, fontFamily: "var(--font-display,serif)" }}>
          {pkg.highlight}
        </p>

        {/* incluye */}
        <p className="text-[9px] tracking-[0.35em] uppercase mb-3" style={{ color: pkg.color }}>Incluye</p>
        <ul className="space-y-2 mb-4">
          {pkg.incluye.map((item) => (
            <li key={item} className="flex gap-2.5 text-xs font-light leading-relaxed" style={{ color: `${C.text}cc` }}>
              <span className="shrink-0 mt-0.5" style={{ color: `${pkg.color}80` }}>◆</span>
              {item}
            </li>
          ))}
        </ul>

        {/* menú expandible (solo paquete completo) */}
        {pkg.menu.length > 0 && (
          <div className="mb-4">
            <button onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase transition-colors duration-300"
              style={{ color: open ? pkg.color : `${C.text}77` }}>
              <span className="transition-transform duration-300" style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
              {open ? "Ocultar menú" : "Ver menú completo"}
            </button>
            <div className="overflow-hidden transition-all duration-500"
              style={{ maxHeight: open ? "400px" : "0px", opacity: open ? 1 : 0 }}>
              <div className="mt-4 space-y-3 pl-3" style={{ borderLeft: `2px solid ${pkg.color}20` }}>
                {pkg.menu.map((m) => (
                  <div key={m.curso}>
                    <p className="text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: `${pkg.color}99` }}>{m.curso}</p>
                    <p className="text-xs font-light leading-relaxed" style={{ color: `${C.text}bb` }}>{m.detalle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* no incluye */}
        {pkg.noIncluye.length > 0 && (
          <div className="pt-4 mb-5" style={{ borderTop: `1px solid ${pkg.color}12` }}>
            <p className="text-[9px] tracking-[0.35em] uppercase mb-2" style={{ color: `${C.text}66` }}>No incluye</p>
            <div className="flex flex-wrap gap-2">
              {pkg.noIncluye.map((item) => (
                <span key={item} className="text-[10px] px-2.5 py-1 font-light"
                  style={{ background: `${C.text}08`, color: `${C.text}77`, border: `1px solid ${C.text}12` }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <a href="#reserva"
          className="block w-full py-3.5 text-center text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300 hover:opacity-85"
          style={{ background: isAccent ? `linear-gradient(135deg, ${C.accent}, #5a7a30)` : `linear-gradient(135deg, ${C.amber}, #c48830)`, color: C.bg }}>
          Solicitar este paquete
        </a>
      </div>
    </div>
  );
}

function QuoteCalculator() {
  return (
    <div className="space-y-6">
      {PACKAGES.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
      <div className="p-5 text-center" style={{ background: C.surface2, border: `1px dashed ${C.accent}25` }}>
        <p className="text-sm font-light mb-1" style={{ fontFamily: "var(--font-display,serif)", color: `${C.text}cc` }}>
          ¿Tienes necesidades especiales o un grupo grande?
        </p>
        <p className="text-xs mb-4" style={{ color: `${C.text}77` }}>
          Contáctanos directamente con Evelia Mendoza Hernández
        </p>
        <a href="tel:7225926512"
          className="inline-block px-8 py-3 text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:opacity-80"
          style={{ border: `1px solid ${C.accent}50`, color: C.accent }}>
          ☎ 722 592 6512
        </a>
      </div>
    </div>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled]         = useState(false);
  const [progress, setProgress]         = useState(0);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [activeSection, setActiveSection] = useState("");
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? y / max : 0);
      setScrolled(y > 60);
      const ids = ["reserva", "cotizaciones", "ubicacion", "nosotros"];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = ["nosotros", "ubicacion", "cotizaciones"];
  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-px z-[60] origin-left"
        style={{ background: `linear-gradient(90deg, ${C.accent}, ${C.amber})`, transform: `scaleX(${progress})`, transition: "transform 0.1s linear" }} />
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-16 transition-all duration-500"
        style={{ background: scrolled ? `${C.bg}fc` : `linear-gradient(to bottom, ${C.bg}f0 0%, ${C.bg}00 100%)`, backdropFilter: scrolled ? "blur(14px)" : "none", borderBottom: scrolled ? `1px solid ${C.accent}14` : "none" }}>
        <a href="#" className="forest-shimmer text-xl tracking-[0.3em] uppercase font-light" style={{ fontFamily: "var(--font-display,serif)" }}>Salón del Bosque</a>
        <div className="hidden md:flex gap-10 text-xs tracking-[0.2em] uppercase">
          {links.map((id) => (
            <a key={id} href={`#${id}`} className="transition-colors duration-300 capitalize"
              style={{ color: activeSection === id ? C.accent : `${C.accent}60` }}>{id}</a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <a href="#reserva" className="hidden md:block text-xs tracking-[0.2em] uppercase px-5 py-2 transition-all duration-300"
            style={{ border: `1px solid ${C.accent}55`, color: C.accent }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${C.accent}18`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            Reservar
          </a>
          <button className="md:hidden flex flex-col gap-1.5 p-1" onClick={() => setMenuOpen((o) => !o)}>
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
            className="text-3xl font-light capitalize transition-all duration-300"
            style={{ fontFamily: "var(--font-display,serif)", color: C.text, transform: menuOpen ? "translateY(0)" : "translateY(20px)", transitionDelay: `${i * 60}ms` }}>
            {id}
          </a>
        ))}
        <a href="#reserva" onClick={() => setMenuOpen(false)} className="mt-4 px-10 py-3 text-xs tracking-[0.3em] uppercase"
          style={{ background: `linear-gradient(135deg, ${C.accent}, #5a7a30)`, color: C.bg }}>Reservar</a>
      </div>
    </>
  );
}

/* ─── cursor personalizado ─── */
function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const lag = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    const animate = () => {
      lag.current.x += (pos.current.x - lag.current.x) * 0.12;
      lag.current.y += (pos.current.y - lag.current.y) * 0.12;
      if (dot.current)  dot.current.style.transform  = `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)`;
      if (ring.current) ring.current.style.transform = `translate(${lag.current.x - 16}px, ${lag.current.y - 16}px)`;
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener("mousemove", onMove); if (raf.current) cancelAnimationFrame(raf.current); };
  }, []);
  return (
    <>
      <div ref={dot}  className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full z-[999] pointer-events-none hidden md:block" style={{ background: C.accent }} />
      <div ref={ring} className="fixed top-0 left-0 w-8 h-8 rounded-full z-[999] pointer-events-none hidden md:block" style={{ border: `1px solid ${C.accent}55` }} />
    </>
  );
}

/* ════════════════════════════════════════════
   PÁGINA PRINCIPAL
════════════════════════════════════════════ */
export default function Home() {
  const addReveal = useReveal();

  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.text, fontFamily: "var(--font-body,sans-serif)", cursor: "none" }}>
      <CustomCursor />
      <Navbar />

      {/* ══ HERO ══ */}
      <section id="hero" className="md:flex relative min-h-screen">
        {/* imagen izquierda sticky */}
        <div className="relative h-64 md:h-screen md:sticky md:top-0 flex-shrink-0 md:w-1/2 overflow-hidden">
          <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${C.surface2} 0%, ${C.surface} 60%, ${C.bg} 100%)` }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(${C.accent}18 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-10 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ border: `1px dashed ${C.accent}50`, background: `${C.accent}10` }}>
              <span className="text-2xl" style={{ color: `${C.accent}70` }}>⬚</span>
            </div>
            <p className="text-sm font-light tracking-[0.12em]" style={{ color: `${C.text}bb` }}>Fachada / exterior del salón</p>
            <p className="text-[10px] leading-relaxed max-w-[200px]" style={{ color: `${C.text}66` }}>Vista principal del Salón del Bosque · 1200 × 900 px</p>
          </div>
          <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ background: `linear-gradient(to right, transparent 55%, ${C.bg} 92%)` }} />
          <div className="absolute inset-0 pointer-events-none md:hidden" style={{ background: `linear-gradient(to bottom, transparent 50%, ${C.bg} 95%)` }} />
        </div>

        {/* contenido derecho */}
        <div className="w-full md:w-1/2 flex items-center justify-center py-32 px-8 md:px-14 relative" style={{ background: `${C.bg}ee`, backdropFilter: "blur(2px)" }}>
          <div className="max-w-lg w-full text-center">
            <p className="anim-fade d-100 text-xs tracking-[0.4em] uppercase mb-5" style={{ color: C.accent }}>
              Salón de Eventos · Toluca
            </p>
            <h1 className="anim-fade-up d-200 mb-5 leading-none"
              style={{ fontFamily: "var(--font-display,serif)", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 300, color: C.text }}>
              El espacio ideal<br />
              <span className="forest-shimmer">para celebrar</span>
            </h1>
            <p className="anim-fade-up d-400 text-base font-light leading-relaxed mb-4" style={{ color: `${C.text}aa` }}>
              Un entorno único donde cada celebración<br />se convierte en un recuerdo eterno.
            </p>
            <div className="anim-fade-up d-500 flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: `${C.accent}50` }} />
              <p className="text-sm font-light text-center leading-relaxed" style={{ color: `${C.text}99`, fontFamily: "var(--font-display,serif)", fontStyle: "italic" }}>
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
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* ══ NOSOTROS ══ */}
      <SplitSection id="nosotros"
        photoLabel="Salón decorado para evento"
        photoHint="Interior del Salón del Bosque con decoración · 1200 × 1600 px">
        <div className="py-20 px-8 md:px-14 space-y-14">
          {/* intro */}
          <div ref={addReveal} className="section-reveal">
            <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: C.accent }}>Nuestra historia</p>
            <h2 className="text-4xl md:text-5xl font-light mb-6 leading-tight" style={{ fontFamily: "var(--font-display,serif)" }}>
              25 años creando<br /><span className="forest-text">momentos especiales</span>
            </h2>
            <p className="leading-relaxed mb-4 font-light text-sm" style={{ color: `${C.text}cc` }}>
              Desde 1999, el <strong style={{ color: C.text, fontWeight: 400 }}>Salón del Bosque</strong> ha sido el escenario
              elegido por cientos de familias para celebrar los momentos más importantes de su vida.
              Nacimos con una sola promesa: convertir cada celebración en un recuerdo eterno.
            </p>
            <p className="leading-relaxed font-light text-sm" style={{ color: `${C.text}cc` }}>
              Nos especializamos en todo tipo de eventos: <span style={{ color: C.amber }}>bodas, quinceañeros, cumpleaños,
              bautizos, primeras comuniones, grados, reuniones corporativas</span> y mucho más.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {["Bodas","XV Años","Cumpleaños","Bautizos","Comuniones","Grados","Corporativos","Baby Shower"].map((tag) => (
                <span key={tag} className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5"
                  style={{ border: `1px solid ${C.accent}30`, color: `${C.text}99`, background: `${C.accent}0a` }}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-8 mt-10">
              {STATS.map((s) => <AnimatedStat key={s.label} {...s} />)}
            </div>
          </div>

          {/* galería espacios */}
          <div ref={addReveal} className="section-reveal">
            <p className="text-xs tracking-[0.4em] uppercase mb-5" style={{ color: C.accent }}>Nuestros espacios</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Salón principal", hint: "200 personas · 1000×700" },
                { label: "Terraza exterior", hint: "Vista al jardín · 1000×700" },
                { label: "Sala VIP", hint: "Eventos íntimos · 1000×700" },
              ].map((p) => <PhotoSlot key={p.label} label={p.label} hint={p.hint} />)}
            </div>
          </div>

          {/* chef y equipo */}
          <div ref={addReveal} className="section-reveal">
            <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: C.accent }}>El alma de nuestra cocina</p>
            <h3 className="text-2xl font-light mb-4" style={{ fontFamily: "var(--font-display,serif)" }}>
              Nuestro <span className="amber-text">equipo culinario</span>
            </h3>
            <p className="text-sm font-light leading-relaxed mb-6" style={{ color: `${C.text}cc` }}>
              Al frente está el <strong style={{ color: C.text, fontWeight: 400 }}>Chef Ejecutivo Andrés Morales</strong>,
              con más de 18 años de experiencia. Su equipo domina desde la cocina tradicional mexicana
              hasta la alta cocina internacional, con ingredientes frescos seleccionados diariamente.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Chef Andrés Morales", hint: "Retrato · 600×750" },
                { label: "Equipo de cocina",    hint: "En acción · 600×750" },
                { label: "Preparación",         hint: "Detalle gastronómico · 600×750" },
                { label: "Banquete",            hint: "Mesa montada · 600×750" },
              ].map((p) => <PhotoSlot key={p.label} label={p.label} hint={p.hint} />)}
            </div>
          </div>

          {/* foto grupal */}
          <div ref={addReveal} className="section-reveal">
            <PhotoSlot label="Foto grupal del equipo completo" hint="Panorámica · 1400×600" wide />
          </div>
        </div>
      </SplitSection>

      {/* ══ SERVICIOS (quote strip) ══ */}
      <div className="py-16 relative overflow-hidden" style={{ background: `linear-gradient(90deg, ${C.bg} 0%, ${C.surface} 50%, ${C.bg} 100%)` }}>
        <div className="relative z-10 text-center px-6">
          <p className="text-2xl md:text-3xl font-light max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-display,serif)", color: `${C.text}88` }}>
            &ldquo;La elegancia no es ser notada,
            <span className="forest-text"> es ser recordada.</span>&rdquo;
          </p>
          <p className="mt-3 text-[10px] tracking-[0.3em] uppercase" style={{ color: `${C.accent}55` }}>— Giorgio Armani</p>
        </div>
      </div>

      {/* ══ UBICACIÓN ══ */}
      <SplitSection id="ubicacion"
        photoLabel="Vista exterior / aérea del salón"
        photoHint="Fachada o drone shot del Salón del Bosque · 1200 × 1600 px">
        <div className="py-20 px-8 md:px-14">
          <div ref={addReveal} className="section-reveal mb-12">
            <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: C.accent }}>Encuéntranos</p>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "var(--font-display,serif)" }}>
              Nuestra <span className="forest-text">ubicación</span>
            </h2>
          </div>
          {/* mapa */}
          <div ref={addReveal} className="section-reveal mb-8 relative overflow-hidden aspect-[4/3]"
            style={{ border: `1px solid ${C.accent}18` }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3754.0!2d-99.619061!3d19.2779057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cd8a3090593f51:0x9a499e74b146f2be!2sSal%C3%B3n%20del%20Bosque!5e0!3m2!1ses!2smx!4v1700000000000"
              width="100%" height="100%" style={{ border: 0, filter: "saturate(0.7) brightness(1.05)" }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación Salón del Bosque" />
            {[["top-3 left-3","border-t border-l"],["top-3 right-3","border-t border-r"],
              ["bottom-3 left-3","border-b border-l"],["bottom-3 right-3","border-b border-r"]].map(([p, cls]) => (
              <div key={p} className={`absolute ${p} w-5 h-5 ${cls} pointer-events-none`} style={{ borderColor: `${C.accent}55` }} />
            ))}
          </div>
          {/* info */}
          <div ref={addReveal} className="section-reveal space-y-7">
            {[
              { icon: "◎", label: "Dirección",  lines: ["Salón del Bosque", "Toluca, Estado de México"] },
              { icon: "◷", label: "Horarios",   lines: ["Lunes a Viernes · 9:00 am – 7:00 pm", "Sábados · 9:00 am – 5:00 pm", "Domingos · Cerrado"] },
              { icon: "◈", label: "Contacto",   lines: ["722 592 6512", "Evelia Mendoza Hernández"] },
            ].map((item) => (
              <div key={item.label} className="flex gap-5">
                <div className="text-xl mt-0.5 shrink-0" style={{ color: `${C.accent}80` }}>{item.icon}</div>
                <div>
                  <p className="text-[10px] tracking-[0.35em] uppercase mb-2" style={{ color: C.accent }}>{item.label}</p>
                  {item.lines.map((l) => <p key={l} className="text-sm font-light leading-relaxed" style={{ color: `${C.text}cc` }}>{l}</p>)}
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-3 pt-2">
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
        </div>
      </SplitSection>

      {/* ══ COTIZACIONES ══ */}
      <SplitSection id="cotizaciones"
        photoLabel="Mesa elegante de evento"
        photoHint="Detalle de vajilla y decoración · 1200 × 1600 px">
        <div className="py-20 px-8 md:px-14">
          <div ref={addReveal} className="section-reveal mb-10">
            <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: C.accent }}>Precios claros</p>
            <h2 className="text-4xl md:text-5xl font-light mb-3" style={{ fontFamily: "var(--font-display,serif)" }}>
              <span className="forest-text">Cotizaciones</span>
            </h2>
            <p className="text-sm font-light" style={{ color: `${C.text}99` }}>
              Selecciona los servicios que te interesan y recibe tu presupuesto al instante
            </p>
          </div>
          <div ref={addReveal} className="section-reveal">
            <QuoteCalculator />
          </div>

          {/* testimonios aquí dentro */}
          <div ref={addReveal} className="section-reveal mt-14">
            <p className="text-xs tracking-[0.4em] uppercase mb-2" style={{ color: C.accent }}>Lo que dicen nuestros clientes</p>
            <p className="text-sm mb-6" style={{ color: `${C.text}88` }}>Pasa el cursor para leer cada historia</p>
            <div className="space-y-4">
              {TESTIMONIALS.map((t, i) => <TestimonialCard key={t.name} t={t} delay={i * 100} />)}
            </div>
          </div>
        </div>
      </SplitSection>

      {/* ══ RESERVA ══ */}
      <SplitSection id="reserva"
        photoLabel="Ambiente de evento nocturno"
        photoHint="Iluminación cálida del salón en celebración · 1200 × 1600 px">
        <div className="py-20 px-8 md:px-14">
          <div ref={addReveal} className="section-reveal mb-10">
            <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: C.accent }}>Agenda tu visita</p>
            <h2 className="text-4xl md:text-5xl font-light mb-3" style={{ fontFamily: "var(--font-display,serif)" }}>
              <span className="forest-text">Reserva</span> tu evento
            </h2>
            <p className="text-sm font-light" style={{ color: `${C.text}99` }}>Te contactamos en menos de 24 horas.</p>
          </div>
          <div ref={addReveal} className="section-reveal">
            <BookingForm />
          </div>
        </div>
      </SplitSection>

      {/* ══ FOOTER ══ */}
      <footer className="py-12 px-6 md:px-16" style={{ borderTop: `1px solid ${C.accent}12` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="forest-shimmer text-lg tracking-[0.3em] uppercase font-light" style={{ fontFamily: "var(--font-display,serif)" }}>
            Salón del Bosque
          </div>
          <div className="flex gap-8 text-[10px] tracking-[0.25em] uppercase">
            {["nosotros","ubicacion","cotizaciones"].map((id) => (
              <a key={id} href={`#${id}`} className="capitalize transition-colors duration-300"
                style={{ color: `${C.text}60` }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = C.accent; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = `${C.text}60`; }}>
                {id}
              </a>
            ))}
          </div>
          <p className="text-[10px] tracking-[0.15em]" style={{ color: `${C.text}55` }}>© 2026 Salón del Bosque.</p>
        </div>
      </footer>
    </div>
  );
}
