"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

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
    noIncluye: ["Comida"] as string[],
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

/* ─── hook: reveal al scroll con delay escalonado ─── */
function useReveal() {
  const refs = useRef<HTMLElement[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const idx = refs.current.indexOf(el);
          const delay = 200 + idx * 80; /* espera a que la sección entre, luego cascada */
          setTimeout(() => el.classList.add("visible"), delay);
          io.unobserve(el);
        }
      }),
      { threshold: 0.06 }
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

/* ─── SectionPhoto: panel izquierdo sticky con foto real o placeholder ─── */
function SectionPhoto({ label, hint, src }: { label: string; hint: string; src?: string }) {
  return (
    <div className="relative h-64 md:h-auto md:self-stretch flex-shrink-0 md:w-1/2 overflow-hidden">
      {src ? (
        <Image src={src} alt={label} fill style={{ objectFit: "cover", objectPosition: "center" }} sizes="50vw" priority />
      ) : (
        <>
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(160deg, ${C.surface2} 0%, ${C.surface} 60%, ${C.bg} 100%)` }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: `radial-gradient(${C.accent}18 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-10 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ border: `1px dashed ${C.accent}50`, background: `${C.accent}10` }}>
              <span className="text-2xl" style={{ color: `${C.accent}70` }}>⬚</span>
            </div>
            <p className="text-sm font-light tracking-[0.12em]" style={{ color: `${C.text}bb` }}>{label}</p>
            <p className="text-[10px] leading-relaxed max-w-[200px]" style={{ color: `${C.text}66` }}>{hint}</p>
          </div>
        </>
      )}
      {/* degradado horizontal → crema (desktop) */}
      <div className="absolute inset-0 pointer-events-none hidden md:block"
        style={{ background: `linear-gradient(to right, transparent 55%, ${C.bg} 92%)` }} />
      {/* degradado vertical → crema (móvil) */}
      <div className="absolute inset-0 pointer-events-none md:hidden"
        style={{ background: `linear-gradient(to bottom, transparent 50%, ${C.bg} 95%)` }} />
    </div>
  );
}

/* ─── SplitSection: wrapper con imagen sticky izquierda + contenido derecha ─── */
function SplitSection({
  id, photoLabel, photoHint, photoSrc, children,
}: {
  id?: string; photoLabel: string; photoHint: string; photoSrc?: string; children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("in-view"); io.disconnect(); } },
      { threshold: 0.06 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id={id} className="md:flex md:items-stretch relative section-entrance">
      <SectionPhoto label={photoLabel} hint={photoHint} src={photoSrc} />
      <div className="w-full md:w-1/2 relative"
        style={{ background: `${C.bg}ee`, backdropFilter: "blur(2px)" }}>
        {children}
      </div>
    </section>
  );
}


/* ─── PhotoSlot: placeholder inline (galería interna) ─── */
function PhotoSlot({ label, hint, wide = false, src }: { label: string; hint: string; wide?: boolean; src?: string }) {
  return (
    <div className={`relative ${wide ? "aspect-[21/6]" : "aspect-[4/3]"} overflow-hidden group`}
      style={{ border: `1px dashed ${C.accent}35`, background: `linear-gradient(135deg, ${C.surface2}, ${C.surface})` }}>
      {src ? (
        <Image src={src} alt={label} fill style={{ objectFit: "cover", objectPosition: "center" }} sizes="25vw" />
      ) : (
        <>
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
        </>
      )}
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
/* ─── Calendario ─── */
function Calendar({
  selected, onSelect, blockedDates,
}: {
  selected: string; onSelect: (d: string) => void; blockedDates: string[];
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay  = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const DAYS   = ["Do","Lu","Ma","Mi","Ju","Vi","Sá"];

  const pad2 = (n: number) => String(n).padStart(2, "0");
  const toISO = (d: number) => `${year}-${pad2(month + 1)}-${pad2(d)}`;

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="p-4" style={{ background: C.surface, border: `1px solid ${C.accent}20` }}>
      {/* nav mes */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center text-sm transition-opacity hover:opacity-60"
          style={{ color: C.accent }}>‹</button>
        <p className="text-sm font-light tracking-[0.15em]" style={{ color: C.text }}>
          {MONTHS[month]} {year}
        </p>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center text-sm transition-opacity hover:opacity-60"
          style={{ color: C.accent }}>›</button>
      </div>

      {/* días de semana */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] tracking-[0.1em] py-1" style={{ color: `${C.text}66` }}>{d}</div>
        ))}
      </div>

      {/* celdas */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const iso      = toISO(day);
          const date     = new Date(year, month, day);
          const isPast   = date < today;
          const isBlocked = blockedDates.includes(iso);
          const isSelected = selected === iso;
          const disabled = isPast || isBlocked;

          let bg = "transparent";
          let color = `${C.text}cc`;
          let border = "transparent";

          if (isSelected)       { bg = C.accent; color = C.bg; }
          else if (isBlocked)   { bg = `${C.rust}15`; color = C.rust; border = `${C.rust}40`; }
          else if (isPast)      { color = `${C.text}30`; }

          return (
            <button key={iso} disabled={disabled} onClick={() => onSelect(iso)}
              className="aspect-square flex items-center justify-center text-xs font-light transition-all duration-150"
              style={{ background: bg, color, border: `1px solid ${border}`,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: isPast ? 0.4 : 1 }}
              onMouseEnter={(e) => { if (!disabled && !isSelected) (e.currentTarget as HTMLElement).style.background = `${C.accent}18`; }}
              onMouseLeave={(e) => { if (!disabled && !isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              {day}
            </button>
          );
        })}
      </div>

      {/* leyenda */}
      <div className="flex gap-4 mt-4 pt-3" style={{ borderTop: `1px solid ${C.accent}12` }}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3" style={{ background: C.accent }} />
          <span className="text-[9px]" style={{ color: `${C.text}77` }}>Seleccionado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3" style={{ background: `${C.rust}15`, border: `1px solid ${C.rust}40` }} />
          <span className="text-[9px]" style={{ color: `${C.text}77` }}>Ocupado</span>
        </div>
      </div>
    </div>
  );
}

/* ─── BookingForm ─── */
function BookingForm({ paqueteInicial }: { paqueteInicial: string }) {
  const [form, setForm] = useState({
    nombre: "", telefono: "", primeraVez: "",
    evento: "", personas: "", paquete: "", fecha: "", fechaVisita: "",
  });
  const [errors, setErrors]       = useState<Partial<Record<keyof typeof form, string>>>({});
  const [blockedDates, setBlocked] = useState<string[]>([]);
  const [preview, setPreview]     = useState(false);

  useEffect(() => {
    if (paqueteInicial) {
      setForm(f => ({ ...f, paquete: paqueteInicial }));
      setErrors(er => ({ ...er, paquete: undefined }));
    }
  }, [paqueteInicial]);

  useEffect(() => {
    import("@/lib/supabase").then(({ supabase }) => {
      supabase.from("blocked_dates").select("date").then(({ data }) => {
        setBlocked((data ?? []).map((r: { date: string }) => r.date));
      });
    });
  }, []);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: undefined })); };

  const validate = () => {
    const e: Partial<Record<keyof typeof form, string>> = {};
    if (!form.nombre.trim())    e.nombre    = "Requerido";
    if (!form.telefono.trim())  e.telefono  = "Requerido";
    if (!form.primeraVez)       e.primeraVez = "Selecciona una opción";
    if (form.primeraVez === "no" && !form.fechaVisita) e.fechaVisita = "Selecciona una fecha para tu visita";
    if (!form.evento)           e.evento    = "Selecciona el tipo de evento";
    if (!form.personas.trim())  e.personas  = "Requerido";
    if (!form.paquete)          e.paquete   = "Selecciona un paquete";
    if (!form.fecha)            e.fecha     = "Selecciona una fecha";
    if (form.fecha && blockedDates.includes(form.fecha)) e.fecha = "Esta fecha ya está ocupada";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setPreview(true);
  };

  const formatFecha = (iso: string) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    return `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`;
  };

  const whatsappMsg = () =>
    `\u{1F331} *Solicitud de reserva - Salón del Bosque*\n\n` +
    `\u{1F464} *Nombre:* ${form.nombre}\n` +
    `\u{1F4DE} *Teléfono:* ${form.telefono}\n` +
    `\u{1F4CD} *Visita:* ${form.primeraVez === "no" ? `Primera vez · Quiero conocer el salón el ${formatFecha(form.fechaVisita)}` : "Ya visitó el salón"}\n` +
    `\u{1F389} *Evento:* ${form.evento} · ${form.personas} personas\n` +
    `\u{1F4CB} *Paquete:* ${form.paquete}\n` +
    `\u{1F4C5} *Fecha deseada:* ${formatFecha(form.fecha)}`;

  const sendWhatsApp = () => {
    const url = `https://wa.me/527225926512?text=${encodeURIComponent(whatsappMsg())}`;
    window.open(url, "_blank");
  };

  const inputBase = "w-full bg-transparent px-4 py-3 text-sm font-light focus:outline-none border";

  if (preview) return (
    <div className="space-y-5">
      <div className="p-6 space-y-3" style={{ background: C.surface, border: `1px solid ${C.accent}20` }}>
        <p className="text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: C.accent }}>Vista previa del mensaje</p>
        <pre className="text-sm font-light leading-relaxed whitespace-pre-wrap" style={{ color: C.text, fontFamily: "inherit" }}>
          {whatsappMsg()}
        </pre>
      </div>
      <p className="text-xs font-light text-center" style={{ color: `${C.text}77` }}>
        Revisa el mensaje y pulsa el botón para enviarlo por WhatsApp
      </p>
      <button onClick={sendWhatsApp}
        className="w-full py-4 text-xs tracking-[0.3em] uppercase font-medium transition-opacity hover:opacity-85 flex items-center justify-center gap-3"
        style={{ background: `linear-gradient(135deg, #25D366, #128C7E)`, color: "#fff" }}>
        <span>📲</span> Enviar por WhatsApp
      </button>
      <button onClick={() => setPreview(false)}
        className="w-full py-3 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
        style={{ border: `1px solid ${C.accent}30`, color: `${C.text}88` }}>
        ← Editar información
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* nombre */}
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Nombre completo</label>
        <input type="text" value={form.nombre} onChange={set("nombre")} placeholder="Tu nombre completo"
          className={inputBase}
          style={{ color: C.text, borderColor: errors.nombre ? C.rust : `${C.accent}30`, caretColor: C.accent }} />
        {errors.nombre && <p className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.nombre}</p>}
      </div>

      {/* teléfono */}
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Número de teléfono</label>
        <input type="tel" value={form.telefono} onChange={set("telefono")} placeholder="722 123 4567"
          className={inputBase}
          style={{ color: C.text, borderColor: errors.telefono ? C.rust : `${C.accent}30`, caretColor: C.accent }} />
        {errors.telefono && <p className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.telefono}</p>}
      </div>

      {/* primera vez */}
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>¿Ya visitaste el salón?</label>
        <div className="flex gap-3">
          {[{ val: "no", label: "Primera visita" }, { val: "si", label: "Ya lo visité" }].map(({ val, label }) => (
            <button type="button" key={val} onClick={() => { setForm(f => ({ ...f, primeraVez: val, fechaVisita: val === "si" ? "" : f.fechaVisita })); setErrors(er => ({ ...er, primeraVez: undefined, fechaVisita: undefined })); }}
              className="flex-1 py-3 text-xs tracking-[0.15em] uppercase transition-all duration-200"
              style={{
                border: `1px solid ${form.primeraVez === val ? C.accent : C.accent + "25"}`,
                background: form.primeraVez === val ? `${C.accent}15` : "transparent",
                color: form.primeraVez === val ? C.accent : `${C.text}88`,
              }}>
              {label}
            </button>
          ))}
        </div>
        {errors.primeraVez && <p className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.primeraVez}</p>}

        {/* calendario para agendar visita */}
        {form.primeraVez === "no" && (
          <div className="mt-4 space-y-2 overflow-hidden transition-all duration-500">
            <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: `${C.accent}99` }}>
              ¿Cuándo quieres visitar el salón?
              {form.fechaVisita && (
                <span className="ml-2 normal-case tracking-normal" style={{ color: C.accent }}>
                  · {formatFecha(form.fechaVisita)}
                </span>
              )}
            </p>
            <Calendar
              selected={form.fechaVisita}
              onSelect={(d) => { setForm(f => ({ ...f, fechaVisita: d })); setErrors(er => ({ ...er, fechaVisita: undefined })); }}
              blockedDates={[]}
            />
            {errors.fechaVisita && <p className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.fechaVisita}</p>}
          </div>
        )}
      </div>

      {/* tipo de evento */}
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Tipo de evento</label>
        <select value={form.evento} onChange={set("evento")} className={`${inputBase} appearance-none`}
          style={{ background: C.surface, color: form.evento ? C.text : `${C.text}66`, borderColor: errors.evento ? C.rust : `${C.accent}30` }}>
          <option value="">Selecciona el tipo de evento</option>
          {["Boda","XV Años","Cumpleaños","Bautizo","Comunión","Grado","Corporativo","Baby Shower","Otro"].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.evento && <p className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.evento}</p>}
      </div>

      {/* personas */}
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Número de personas</label>
        <input type="number" min="1" value={form.personas} onChange={set("personas")} placeholder="Ej: 150"
          className={inputBase}
          style={{ color: C.text, borderColor: errors.personas ? C.rust : `${C.accent}30`, caretColor: C.accent }} />
        {errors.personas && <p className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.personas}</p>}
      </div>

      {/* paquete */}
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Paquete de interés</label>
        <div className="flex gap-3">
          {[{ val: "Paquete Completo", label: "Paquete Completo", sub: "$350/persona" }, { val: "Paquete Sencillo", label: "Paquete Sencillo", sub: "$19,800 total" }].map(({ val, label, sub }) => (
            <button type="button" key={val} onClick={() => { setForm(f => ({ ...f, paquete: val })); setErrors(er => ({ ...er, paquete: undefined })); }}
              className="flex-1 py-3 px-2 text-center transition-all duration-200"
              style={{
                border: `1px solid ${form.paquete === val ? C.accent : C.accent + "25"}`,
                background: form.paquete === val ? `${C.accent}15` : "transparent",
              }}>
              <p className="text-[10px] tracking-[0.1em] uppercase" style={{ color: form.paquete === val ? C.accent : `${C.text}88` }}>{label}</p>
              <p className="text-[9px] mt-0.5" style={{ color: form.paquete === val ? `${C.accent}99` : `${C.text}55` }}>{sub}</p>
            </button>
          ))}
        </div>
        {errors.paquete && <p className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.paquete}</p>}
      </div>

      {/* fecha con calendario */}
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>
          Fecha deseada
          {form.fecha && !blockedDates.includes(form.fecha) && (
            <span className="ml-2 normal-case tracking-normal" style={{ color: C.accent }}>
              · {formatFecha(form.fecha)}
            </span>
          )}
        </label>
        <Calendar selected={form.fecha} onSelect={(d) => { setForm(f => ({ ...f, fecha: d })); setErrors(er => ({ ...er, fecha: undefined })); }} blockedDates={blockedDates} />
        {errors.fecha && <p className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.fecha}</p>}
        {form.fecha && blockedDates.includes(form.fecha) && (
          <p className="text-xs mt-2 px-3 py-2" style={{ background: `${C.rust}12`, color: C.rust, border: `1px solid ${C.rust}30` }}>
            Esta fecha ya está reservada. Por favor elige otra.
          </p>
        )}
      </div>

      {/* submit */}
      <button type="submit"
        disabled={!!(form.fecha && blockedDates.includes(form.fecha))}
        className="w-full py-4 text-xs tracking-[0.3em] uppercase font-medium transition-all duration-300 hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: `linear-gradient(135deg, ${C.accent}, #5a7a30)`, color: C.bg }}>
        Ver resumen y enviar por WhatsApp
      </button>
    </form>
  );
}

/* ─── QuoteCalculator ─── */
function PackageCard({ pkg, onElegir }: { pkg: typeof PACKAGES[number]; onElegir: (nombre: string) => void }) {
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
        <button onClick={() => onElegir(pkg.name)}
          className="block w-full py-3.5 text-center text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300 hover:opacity-85"
          style={{ background: isAccent ? `linear-gradient(135deg, ${C.accent}, #5a7a30)` : `linear-gradient(135deg, ${C.amber}, #c48830)`, color: C.bg }}>
          Solicitar este paquete
        </button>
      </div>
    </div>
  );
}

function QuoteCalculator({ onElegirPaquete }: { onElegirPaquete: (nombre: string) => void }) {
  return (
    <div className="space-y-6">
      {PACKAGES.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} onElegir={onElegirPaquete} />)}
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
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState("");

  const elegirPaquete = (nombre: string) => {
    setPaqueteSeleccionado(nombre);
    setTimeout(() => {
      document.getElementById("reserva")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.text, fontFamily: "var(--font-body,sans-serif)", cursor: "none" }}>
      <CustomCursor />
      <Navbar />

      {/* ══ HERO ══ */}
      <section id="hero" className="md:flex md:items-stretch relative min-h-screen">
        {/* imagen izquierda sticky */}
        <div className="relative h-64 md:h-auto md:self-stretch flex-shrink-0 md:w-1/2 overflow-hidden">
          <Image src="/fotos/salon-noche.jpg" alt="Salón del Bosque" fill style={{ objectFit: "cover", objectPosition: "center" }} sizes="50vw" priority />
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
          </div>
        </div>
      </section>

      {/* ══ NOSOTROS ══ */}
      <SplitSection id="nosotros"
        photoLabel="Salón decorado para evento"
        photoHint="Interior del Salón del Bosque con decoración · 1200 × 1600 px"
        photoSrc="/fotos/salon-dia.jpg">
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
                { label: "Chef Andrés Morales", hint: "Retrato · 600×750",           src: undefined },
                { label: "Equipo de cocina",    hint: "En acción · 600×750",          src: undefined },
                { label: "Preparación",         hint: "Detalle gastronómico · 600×750", src: undefined },
                { label: "Banquete",            hint: "Mesa montada · 600×750",        src: "/fotos/comida-menu.jpg" },
              ].map((p) => <PhotoSlot key={p.label} label={p.label} hint={p.hint} src={p.src} />)}
            </div>
          </div>

          {/* foto grupal */}
          <div ref={addReveal} className="section-reveal">
            <PhotoSlot label="Foto grupal del equipo completo" hint="Panorámica · 1400×600" wide />
          </div>
        </div>
      </SplitSection>


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
        photoHint="Detalle de vajilla y decoración · 1200 × 1600 px"
        photoSrc="/fotos/salon-mesa.jpg">
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
            <QuoteCalculator onElegirPaquete={elegirPaquete} />
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
        photoHint="Iluminación cálida del salón en celebración · 1200 × 1600 px"
        photoSrc="/fotos/salon-noche.jpg">
        <div className="py-20 px-8 md:px-14">
          <div ref={addReveal} className="section-reveal mb-10">
            <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: C.accent }}>Agenda tu visita</p>
            <h2 className="text-4xl md:text-5xl font-light mb-3" style={{ fontFamily: "var(--font-display,serif)" }}>
              <span className="forest-text">Reserva</span> tu evento
            </h2>
            <p className="text-sm font-light" style={{ color: `${C.text}99` }}>Te contactamos en menos de 1 hora.</p>
          </div>
          <div ref={addReveal} className="section-reveal">
            <BookingForm paqueteInicial={paqueteSeleccionado} />
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
