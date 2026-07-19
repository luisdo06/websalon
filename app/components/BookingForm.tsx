"use client";

import { useEffect, useRef, useState } from "react";
import { C } from "@/lib/theme";
import { PHONE } from "@/lib/site";
import Calendar from "./Calendar";
import Stepper, { Step } from "./Stepper";

/* horas disponibles para la primera visita (10 am → 8 pm, una por hora) */
const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => {
  const h = 10 + i; // 10..20
  const value = `${String(h).padStart(2, "0")}:00`;
  const h12 = h > 12 ? h - 12 : h;
  const ampm = h >= 12 ? "pm" : "am";
  return { value, label: `${h12} ${ampm}` };
});
const horaLabel = (value: string) => TIME_SLOTS.find((s) => s.value === value)?.label ?? value;

const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const formatFecha = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${parseInt(d)} de ${MESES[parseInt(m) - 1]} de ${y}`;
};

type FormState = {
  nombre: string; telefono: string; primeraVez: string;
  evento: string; personas: string; paquete: string; fecha: string; fechaVisita: string; horaVisita: string;
};
type FormErrors = Partial<Record<keyof FormState, string>>;

/* resultado de guardar la cita en el panel; decide el aviso de la vista previa */
type SaveState = "idle" | "ok" | "limite" | "error";

const AVISOS: Record<SaveState, string | null> = {
  idle: null,
  ok: null,
  limite:
    "Ya recibimos una solicitud de este teléfono hace poco, así que no la registramos otra vez. " +
    "Envía el mensaje de todos modos y te contactamos por WhatsApp.",
  error:
    "No pudimos registrar tu solicitud en nuestro panel, pero puedes enviarla por WhatsApp sin problema.",
};
type SetForm = React.Dispatch<React.SetStateAction<FormState>>;
type SetErrors = React.Dispatch<React.SetStateAction<FormErrors>>;

/* encabezado de cada paso */
function StepHead({ n, title }: { n: number; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: C.accent }}>Paso {n} de 4</p>
      <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display,serif)", color: C.text }}>{title}</h3>
    </div>
  );
}

/* vista previa del mensaje de WhatsApp antes de enviarlo */
function PreviewPanel({ message, aviso, onSend, onBack }: {
  message: string; aviso: string | null; onSend: () => void; onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="p-6 space-y-3" style={{ background: C.surface, border: `1px solid ${C.accent}20` }}>
        <p className="text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: C.accent }}>Vista previa del mensaje</p>
        <pre className="text-sm font-light leading-relaxed whitespace-pre-wrap" style={{ color: C.text, fontFamily: "inherit" }}>
          {message}
        </pre>
      </div>
      {aviso && (
        <p role="status" className="text-xs font-light leading-relaxed px-4 py-3"
          style={{ border: `1px solid ${C.amber}40`, background: `${C.amber}10`, color: `${C.text}cc` }}>
          {aviso}
        </p>
      )}
      <p className="text-xs font-light text-center" style={{ color: `${C.text}77` }}>
        Revisa el mensaje y pulsa el botón para enviarlo por WhatsApp
      </p>
      <button type="button" onClick={onSend}
        className="w-full py-4 text-xs tracking-[0.3em] uppercase font-medium transition-opacity hover:opacity-85 flex items-center justify-center gap-3"
        style={{ background: `linear-gradient(135deg, #25D366, #128C7E)`, color: "#fff" }}>
        <span>📲</span> Enviar por WhatsApp
      </button>
      <button type="button" onClick={onBack}
        className="w-full py-3 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
        style={{ border: `1px solid ${C.accent}30`, color: `${C.text}88` }}>
        ← Volver y editar
      </button>
    </div>
  );
}

/* ── Paso 3: ¿ya visitó el salón? + agendar visita (fecha/hora) ── */
function VisitStep({ form, setForm, setErrors, errors }: {
  form: FormState; setForm: SetForm; setErrors: SetErrors; errors: FormErrors;
}) {
  return (
    <div>
      <span id="lbl-primera-vez" className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>¿Ya visitaste el salón?</span>
      <div className="flex gap-3" role="group" aria-labelledby="lbl-primera-vez">
        {[{ val: "no", label: "Primera visita" }, { val: "si", label: "Ya lo visité" }].map(({ val, label }) => (
          <button type="button" key={val} onClick={() => { setForm(f => ({ ...f, primeraVez: val, fechaVisita: val === "si" ? "" : f.fechaVisita, horaVisita: val === "si" ? "" : f.horaVisita })); setErrors(er => ({ ...er, primeraVez: undefined, fechaVisita: undefined, horaVisita: undefined })); }}
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
      {errors.primeraVez && <p role="alert" className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.primeraVez}</p>}

      {/* calendario para agendar visita */}
      {form.primeraVez === "no" && (
        <div className="mt-4">
          {/* calendario (izquierda) + horas (derecha); se apila en móvil */}
          <div className="grid md:grid-cols-2 gap-5 items-start">
            {/* ── columna izquierda: fecha ── */}
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: `${C.accent}99` }}>
                ¿Cuándo quieres visitar el salón?
                {form.fechaVisita && (
                  <span className="ml-2 normal-case tracking-normal" style={{ color: C.accent }}>
                    · {formatFecha(form.fechaVisita)}
                  </span>
                )}
              </p>
              <Calendar
                compact
                selected={form.fechaVisita}
                onSelect={(d) => { setForm(f => ({ ...f, fechaVisita: d })); setErrors(er => ({ ...er, fechaVisita: undefined })); }}
                blockedDates={[]}
              />
              {errors.fechaVisita && <p role="alert" className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.fechaVisita}</p>}
            </div>

            {/* ── columna derecha: hora ── */}
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: `${C.accent}99` }}>
                ¿A qué hora?
                {form.horaVisita && (
                  <span className="ml-2 normal-case tracking-normal" style={{ color: C.accent }}>· {horaLabel(form.horaVisita)}</span>
                )}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map(({ value, label }) => {
                  const active = form.horaVisita === value;
                  return (
                    <button type="button" key={value}
                      onClick={() => { setForm(f => ({ ...f, horaVisita: value })); setErrors(er => ({ ...er, horaVisita: undefined })); }}
                      aria-pressed={active}
                      className="py-2.5 text-xs tracking-[0.05em] uppercase transition-all duration-200"
                      style={{
                        border: `1px solid ${active ? C.accent : C.accent + "25"}`,
                        background: active ? `${C.accent}15` : "transparent",
                        color: active ? C.accent : `${C.text}88`,
                      }}>
                      {label}
                    </button>
                  );
                })}
              </div>
              {errors.horaVisita && <p role="alert" className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.horaVisita}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── BookingForm (wizard por pasos) ─── */
export default function BookingForm({ paqueteInicial }: { paqueteInicial: string }) {
  const [form, setForm] = useState<FormState>({
    nombre: "", telefono: "", primeraVez: "",
    evento: "", personas: "", paquete: "", fecha: "", fechaVisita: "", horaVisita: "",
  });
  const sentRef = useRef(false); /* evita doble alta de la cita; no afecta el render */
  const [errors, setErrors]       = useState<FormErrors>({});
  const [blockedDates, setBlocked] = useState<string[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [preview, setPreview]     = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  /* sincroniza el paquete elegido en la sección de cotizaciones (ajuste durante render,
     patrón recomendado por React para reaccionar a un cambio de prop sin useEffect) */
  const [prevPaquete, setPrevPaquete] = useState(paqueteInicial);
  if (paqueteInicial && paqueteInicial !== prevPaquete) {
    setPrevPaquete(paqueteInicial);
    setForm(f => ({ ...f, paquete: paqueteInicial }));
    setErrors(er => ({ ...er, paquete: undefined }));
  }

  useEffect(() => {
    import("@/lib/supabase")
      .then(({ supabase }) => supabase.from("blocked_dates").select("date"))
      .then(({ data, error }) => {
        if (error) { setLoadError(true); return; }
        setBlocked((data ?? []).map((r: { date: string }) => r.date));
      })
      .catch(() => setLoadError(true));
  }, []);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: undefined })); };

  /* validación por paso: si falta algo, bloquea el avance del Stepper */
  const validateStep = (step: number): boolean => {
    const e: Partial<Record<keyof typeof form, string>> = {};
    if (step === 1) {
      if (!form.nombre.trim())   e.nombre   = "Requerido";
      if (!form.telefono.trim()) e.telefono = "Requerido";
    } else if (step === 2) {
      if (!form.evento)          e.evento   = "Selecciona el tipo de evento";
      if (!form.personas.trim()) e.personas = "Requerido";
      else if (Number(form.personas) > 200) e.personas = "Máximo 200 personas";
      else if (Number(form.personas) < 1) e.personas = "Ingresa un número válido";
      if (!form.paquete)         e.paquete  = "Selecciona un paquete";
    } else if (step === 3) {
      if (!form.primeraVez)      e.primeraVez = "Selecciona una opción";
      if (form.primeraVez === "no" && !form.fechaVisita) e.fechaVisita = "Selecciona una fecha para tu visita";
      if (form.primeraVez === "no" && !form.horaVisita)  e.horaVisita  = "Selecciona una hora para tu visita";
    } else if (step === 4) {
      if (!form.fecha)                                     e.fecha = "Selecciona una fecha";
      else if (blockedDates.includes(form.fecha))          e.fecha = "Esta fecha ya está ocupada";
      else if (form.primeraVez === "no" && form.fechaVisita && form.fecha < form.fechaVisita)
        e.fecha = "Tu evento no puede ser antes que tu visita";
    }
    setErrors(prev => ({ ...prev, ...e }));
    return Object.keys(e).length === 0;
  };

  const whatsappMsg = () =>
    `\u{1F331} *Solicitud de reserva - Salón del Bosque*\n\n` +
    `\u{1F464} *Nombre:* ${form.nombre}\n` +
    `\u{1F4DE} *Teléfono:* ${form.telefono}\n` +
    `\u{1F4CD} *Visita:* ${form.primeraVez === "no" ? `Primera vez · Quiero conocer el salón el ${formatFecha(form.fechaVisita)} a las ${horaLabel(form.horaVisita)}` : "Ya visitó el salón"}\n` +
    `\u{1F389} *Evento:* ${form.evento} · ${form.personas} personas\n` +
    `\u{1F4CB} *Paquete:* ${form.paquete}\n` +
    `\u{1F4C5} *Fecha deseada:* ${formatFecha(form.fecha)}`;

  /* Guarda la cita de primera visita en el panel.
     Se llama al ENTRAR a la vista previa, no al pulsar WhatsApp, por dos razones:
     1. Así conocemos el resultado a tiempo para avisar en el resumen.
     2. El window.open de WhatsApp sigue siendo un gesto directo del usuario. Si lo
        lanzáramos después de un await, el bloqueador de ventanas emergentes lo cancelaría. */
  const guardarCita = async () => {
    if (sentRef.current || form.primeraVez !== "no") return;
    sentRef.current = true;
    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.from("citas").insert({
        nombre: form.nombre,
        telefono: form.telefono,
        evento: form.evento || null,
        personas: form.personas ? Number(form.personas) : null,
        paquete: form.paquete || null,
        fecha_evento: form.fecha || null,
        fecha_visita: form.fechaVisita || null,
        hora_visita: form.horaVisita || null,
        /* La degustación ya no se pide desde el sitio: es un beneficio posterior a apartar la
           fecha y se coordina por WhatsApp. Mandamos false explícito porque el esquema de
           `citas` no está versionado y no sabemos si la columna es NOT NULL sin DEFAULT. */
        degustacion: false,
        estado: "pendiente",
      });
      if (!error) { setSaveState("ok"); return; }
      /* P0001 = el trigger citas_limite_quincenal (ver supabase/01-limite-citas.sql) */
      const limitado = error.code === "P0001" || error.message.includes("LIMITE_QUINCENAL");
      if (!limitado) sentRef.current = false; /* fallo pasajero: permitimos reintentar */
      setSaveState(limitado ? "limite" : "error");
    } catch {
      sentRef.current = false;
      setSaveState("error");
    }
  };

  const sendWhatsApp = () => {
    const url = `https://wa.me/${PHONE.whatsapp}?text=${encodeURIComponent(whatsappMsg())}`;
    window.open(url, "_blank");
  };

  const inputBase = "w-full bg-transparent px-4 py-3 text-sm font-light focus:outline-none border";

  if (preview) return (
    <PreviewPanel message={whatsappMsg()} aviso={AVISOS[saveState]} onSend={sendWhatsApp} onBack={() => setPreview(false)} />
  );

  return (
    <Stepper
      validateStep={validateStep}
      onFinalStepCompleted={() => { setPreview(true); guardarCita(); }}
      backButtonText="Atrás"
      nextButtonText="Continuar"
      completeButtonText="Ver resumen"
    >
      {/* ── Paso 1: datos ── */}
      <Step>
        <StepHead n={1} title="Tus datos" />
        <div className="space-y-5">
          <div>
            <label htmlFor="f-nombre" className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Nombre completo</label>
            <input id="f-nombre" type="text" autoComplete="name" value={form.nombre} onChange={set("nombre")} placeholder="Tu nombre completo"
              className={inputBase} aria-invalid={!!errors.nombre}
              style={{ color: C.text, borderColor: errors.nombre ? C.rust : `${C.accent}30`, caretColor: C.accent }} />
            {errors.nombre && <p role="alert" className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.nombre}</p>}
          </div>
          <div>
            <label htmlFor="f-telefono" className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Número de teléfono</label>
            <input id="f-telefono" type="tel" autoComplete="tel" value={form.telefono} onChange={set("telefono")} placeholder="722 123 4567"
              className={inputBase} aria-invalid={!!errors.telefono}
              style={{ color: C.text, borderColor: errors.telefono ? C.rust : `${C.accent}30`, caretColor: C.accent }} />
            {errors.telefono && <p role="alert" className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.telefono}</p>}
          </div>
        </div>
      </Step>

      {/* ── Paso 2: evento ── */}
      <Step>
        <StepHead n={2} title="Tu evento" />
        <div className="space-y-5">
          <div>
            <label htmlFor="f-evento" className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Tipo de evento</label>
            <select id="f-evento" value={form.evento} onChange={set("evento")} className={`${inputBase} appearance-none`} aria-invalid={!!errors.evento}
              style={{ background: C.surface, color: form.evento ? C.text : `${C.text}66`, borderColor: errors.evento ? C.rust : `${C.accent}30` }}>
              <option value="">Selecciona el tipo de evento</option>
              {["Boda","XV Años","Cumpleaños","Bautizo","Comunión","Graduación","Corporativo","Baby Shower","Otro"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.evento && <p role="alert" className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.evento}</p>}
          </div>
          <div>
            <label htmlFor="f-personas" className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Número de personas <span style={{ textTransform: "none", letterSpacing: 0 }}>(máx. 200)</span></label>
            <input id="f-personas" type="number" min="1" max="200" value={form.personas} onChange={set("personas")} placeholder="Ej: 150"
              className={inputBase} aria-invalid={!!errors.personas}
              style={{ color: C.text, borderColor: errors.personas ? C.rust : `${C.accent}30`, caretColor: C.accent }} />
            {errors.personas && <p role="alert" className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.personas}</p>}
          </div>
          <div>
            <span id="lbl-paquete" className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Paquete de interés</span>
            <div className="flex gap-3" role="group" aria-labelledby="lbl-paquete">
              {[{ val: "Paquete Completo", label: "Paquete Completo" }, { val: "Paquete Sencillo", label: "Paquete Sencillo" }].map(({ val, label }) => (
                <button type="button" key={val} onClick={() => { setForm(f => ({ ...f, paquete: val })); setErrors(er => ({ ...er, paquete: undefined })); }}
                  className="flex-1 py-3 px-2 text-center transition-all duration-200"
                  style={{
                    border: `1px solid ${form.paquete === val ? C.accent : C.accent + "25"}`,
                    background: form.paquete === val ? `${C.accent}15` : "transparent",
                  }}>
                  <p className="text-[10px] tracking-[0.1em] uppercase" style={{ color: form.paquete === val ? C.accent : `${C.text}88` }}>{label}</p>
                </button>
              ))}
            </div>
            {errors.paquete && <p role="alert" className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.paquete}</p>}
          </div>
        </div>
      </Step>

      {/* ── Paso 3: visita ── */}
      <Step>
        <StepHead n={3} title="Tu visita" />
        <VisitStep form={form} setForm={setForm} setErrors={setErrors} errors={errors} />
      </Step>

      {/* ── Paso 4: fecha ── */}
      <Step>
        <StepHead n={4} title="Tu fecha" />
        <div>
          <label className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>
            Fecha deseada
            {form.fecha && !blockedDates.includes(form.fecha) && (
              <span className="ml-2 normal-case tracking-normal" style={{ color: C.accent }}>
                · {formatFecha(form.fecha)}
              </span>
            )}
          </label>
          {loadError && (
            <p role="alert" className="text-xs mb-2 px-3 py-2" style={{ background: `${C.rust}12`, color: C.rust, border: `1px solid ${C.rust}30` }}>
              No pudimos cargar las fechas ocupadas. Confirmaremos la disponibilidad por WhatsApp.
            </p>
          )}
          <Calendar selected={form.fecha} onSelect={(d) => { setForm(f => ({ ...f, fecha: d })); setErrors(er => ({ ...er, fecha: undefined })); }} blockedDates={blockedDates} />
          {errors.fecha && <p role="alert" className="text-[10px] mt-1" style={{ color: C.rust }}>{errors.fecha}</p>}
          {form.fecha && blockedDates.includes(form.fecha) && (
            <p className="text-xs mt-2 px-3 py-2" style={{ background: `${C.rust}12`, color: C.rust, border: `1px solid ${C.rust}30` }}>
              Esta fecha ya está reservada. Por favor elige otra.
            </p>
          )}
          {form.primeraVez === "no" && form.fechaVisita && form.fecha && !blockedDates.includes(form.fecha) && form.fecha < form.fechaVisita && (
            <p className="text-xs mt-2 px-3 py-2" style={{ background: `${C.rust}12`, color: C.rust, border: `1px solid ${C.rust}30` }}>
              Tu evento no puede ser antes que tu visita ({formatFecha(form.fechaVisita)}). Elige una fecha posterior.
            </p>
          )}
        </div>
      </Step>
    </Stepper>
  );
}
