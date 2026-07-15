"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, BlockedDate, Cita } from "@/lib/supabase";
import { C } from "@/lib/theme";
import Calendar from "@/app/components/Calendar";

const MONTHS_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const formatDate = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${parseInt(day)} ${MONTHS_SHORT[parseInt(m) - 1]} ${y}`;
};
const horaLabel = (v: string | null) => {
  if (!v) return "";
  const h = parseInt(v.split(":")[0]);
  const h12 = h > 12 ? h - 12 : h;
  return `${h12}:${v.split(":")[1]} ${h >= 12 ? "pm" : "am"}`;
};
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const waLink = (tel: string) => {
  const digits = tel.replace(/\D/g, "");
  const full = digits.length === 10 ? `52${digits}` : digits;
  return `https://wa.me/${full}`;
};

const handleLogout = async () => { await supabase.auth.signOut(); };

/* ── botón de acción de una cita ── */
function CitaButton({ label, onClick, kind, disabled = false }: {
  label: string; onClick: () => void; kind: "accent" | "rust" | "ghost"; disabled?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="flex-1 py-2 text-[10px] tracking-[0.2em] uppercase transition-opacity hover:opacity-80 disabled:opacity-40"
      style={kind === "accent"
        ? { background: `linear-gradient(135deg, ${C.accent}, #5a7a30)`, color: C.bg }
        : kind === "rust"
          ? { border: `1px solid ${C.rust}40`, color: C.rust }
          : { border: `1px solid ${C.accent}40`, color: C.accent }}>
      {label}
    </button>
  );
}

/* ── tarjeta de cita ── */
function CitaCard({ c, actions }: { c: Cita; actions: React.ReactNode }) {
  return (
    <div className="p-5" style={{ background: C.bg, border: `1px solid ${C.accent}20` }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: `${C.accent}` }}>Primera visita</p>
          <p className="text-lg font-semibold mt-0.5" style={{ color: C.text, fontFamily: "var(--font-display,serif)" }}>
            {c.fecha_visita ? formatDate(c.fecha_visita) : "—"}
            {c.hora_visita && <span style={{ color: C.accent }}> · {horaLabel(c.hora_visita)}</span>}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]" style={{ color: `${C.text}cc` }}>
        <p><span style={{ color: `${C.text}77` }}>Nombre:</span> {c.nombre}</p>
        <p><span style={{ color: `${C.text}77` }}>Tel:</span> <a href={waLink(c.telefono)} target="_blank" rel="noopener noreferrer" style={{ color: C.accent }}>{c.telefono}</a></p>
        {c.evento && <p><span style={{ color: `${C.text}77` }}>Evento:</span> {c.evento}{c.personas ? ` · ${c.personas} pers.` : ""}</p>}
        {c.paquete && <p><span style={{ color: `${C.text}77` }}>Paquete:</span> {c.paquete}</p>}
        {c.fecha_evento && <p><span style={{ color: `${C.text}77` }}>Fecha evento:</span> {formatDate(c.fecha_evento)}</p>}
        {c.degustacion && <p style={{ color: C.amber }}>Con degustación</p>}
      </div>
      <div className="flex gap-2 mt-4">{actions}</div>
    </div>
  );
}

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState<"citas" | "fechas">("citas");
  const [dates, setDates] = useState<BlockedDate[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [blockDate, setBlockDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setAuth(!!data.session); setAuthReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAuth(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  const fetchDates = useCallback(async () => {
    const { data } = await supabase.from("blocked_dates").select("*").order("date", { ascending: true });
    setDates(data ?? []);
  }, []);

  const fetchCitas = useCallback(async () => {
    /* purga las citas borradas con más de 15 días */
    const limit = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("citas").delete().eq("estado", "borrada").lt("deleted_at", limit);
    const { data } = await supabase.from("citas").select("*").order("created_at", { ascending: false });
    setCitas(data ?? []);
  }, []);

  useEffect(() => {
    if (!auth) return;
    (async () => { await fetchDates(); await fetchCitas(); })();
  }, [auth, fetchDates, fetchCitas]);

  const handleLogin = async () => {
    if (!email || !pwd) { setPwdErr("Ingresa tu correo y contraseña"); return; }
    setLoggingIn(true); setPwdErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    if (error) setPwdErr("Credenciales incorrectas");
    setLoggingIn(false);
  };
  const handleBlock = async () => {
    if (!blockDate) return;
    setSaving(true);
    const { error } = await supabase.from("blocked_dates").insert({ date: blockDate, reason: newReason || null });
    if (error) showToast("Error: " + error.message);
    else { showToast("Fecha bloqueada ✓"); setBlockDate(""); setNewReason(""); fetchDates(); }
    setSaving(false);
  };
  const handleUnblock = async (id: string) => {
    setBusy(id);
    await supabase.from("blocked_dates").delete().eq("id", id);
    showToast("Fecha desbloqueada");
    setBusy(null); fetchDates();
  };

  const setEstado = async (id: string, estado: Cita["estado"], msg: string) => {
    setBusy(id);
    await supabase.from("citas").update({ estado, deleted_at: estado === "borrada" ? new Date().toISOString() : null }).eq("id", id);
    showToast(msg);
    setBusy(null); fetchCitas();
  };

  const hardDelete = async (id: string) => {
    if (!window.confirm("¿Borrar esta cita permanentemente? No se podrá recuperar.")) return;
    setBusy(id);
    await supabase.from("citas").delete().eq("id", id);
    showToast("Cita eliminada permanentemente");
    setBusy(null); fetchCitas();
  };

  /* ── carga inicial ── */
  if (!authReady) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
      <p className="text-sm font-light" style={{ color: `${C.text}66`, fontFamily: "var(--font-display,serif)" }}>Cargando…</p>
    </div>
  );

  /* ── LOGIN ── */
  if (!auth) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
      <form className="w-full max-w-sm p-10 space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
        style={{ background: C.surface, border: `1px solid ${C.accent}20` }}>
        <div className="text-center">
          <p className="text-xs tracking-[0.4em] uppercase mb-2" style={{ color: C.accent }}>Panel de Administración</p>
          <h1 className="text-2xl font-semibold" style={{ color: C.text, fontFamily: "var(--font-display,serif)" }}>Salón del Bosque</h1>
        </div>
        <div>
          <label htmlFor="admin-email" className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Correo</label>
          <input id="admin-email" type="email" autoComplete="username" value={email}
            onChange={(e) => { setEmail(e.target.value); setPwdErr(""); }}
            className="w-full bg-transparent px-4 py-3 text-sm font-light focus:outline-none"
            style={{ border: `1px solid ${pwdErr ? "#b94a4a" : C.accent + "30"}`, color: C.text, caretColor: C.accent }}
            placeholder="correo@ejemplo.com" />
        </div>
        <div>
          <label htmlFor="admin-pwd" className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Contraseña</label>
          <input id="admin-pwd" type="password" autoComplete="current-password" value={pwd}
            onChange={(e) => { setPwd(e.target.value); setPwdErr(""); }} aria-invalid={!!pwdErr}
            className="w-full bg-transparent px-4 py-3 text-sm font-light focus:outline-none"
            style={{ border: `1px solid ${pwdErr ? "#b94a4a" : C.accent + "30"}`, color: C.text, caretColor: C.accent }}
            placeholder="••••••••••••••" />
          {pwdErr && <p role="alert" className="text-[10px] mt-1" style={{ color: "#b94a4a" }}>{pwdErr}</p>}
        </div>
        <button type="submit" disabled={loggingIn}
          className="w-full py-3 text-xs tracking-[0.3em] uppercase font-medium transition-opacity hover:opacity-85 disabled:opacity-50"
          style={{ background: `linear-gradient(135deg, ${C.accent}, #5a7a30)`, color: C.bg }}>
          {loggingIn ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );

  /* ── datos derivados ── */
  const hoy = todayISO();
  const pendientes = citas.filter((c) => c.estado === "pendiente").sort((a, b) => (a.fecha_visita ?? "").localeCompare(b.fecha_visita ?? ""));
  const aceptadas = citas.filter((c) => c.estado === "aceptada" && (c.fecha_visita ?? "") >= hoy).sort((a, b) => (a.fecha_visita ?? "").localeCompare(b.fecha_visita ?? ""));
  const borradas = citas.filter((c) => c.estado === "borrada");
  const blockedList = dates.map((d) => d.date);

  /* ── PANEL ── */
  return (
    <div className="min-h-screen px-4 py-10" style={{ background: C.bg }}>
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 text-sm font-light" style={{ background: C.accent, color: C.bg }}>{toast}</div>
      )}

      <div className="max-w-2xl mx-auto space-y-8">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase mb-1" style={{ color: C.accent }}>Panel de Administración</p>
            <h1 className="text-3xl font-semibold" style={{ color: C.text, fontFamily: "var(--font-display,serif)" }}>Salón del Bosque</h1>
          </div>
          <button type="button" onClick={handleLogout}
            className="text-[10px] tracking-[0.2em] uppercase px-4 py-2 transition-opacity hover:opacity-70"
            style={{ border: `1px solid ${C.text}20`, color: `${C.text}77` }}>Cerrar sesión</button>
        </div>

        {/* tabs */}
        <div className="flex gap-2">
          {([["citas", `Citas${pendientes.length ? ` (${pendientes.length})` : ""}`], ["fechas", "Fechas ocupadas"]] as const).map(([key, label]) => (
            <button type="button" key={key} onClick={() => setTab(key)}
              className="px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-all"
              style={{ background: tab === key ? C.accent : "transparent", color: tab === key ? C.bg : `${C.text}88`, border: `1px solid ${tab === key ? C.accent : C.accent + "30"}` }}>
              {label}
            </button>
          ))}
        </div>

        {/* ══ CITAS ══ */}
        {tab === "citas" && (
          <div className="space-y-8">
            {/* pendientes */}
            <section>
              <p className="text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: C.accent }}>
                Solicitudes pendientes ({pendientes.length})
              </p>
              {pendientes.length === 0 ? (
                <p className="text-sm font-light px-1" style={{ color: `${C.text}66` }}>No hay solicitudes nuevas.</p>
              ) : (
                <div className="space-y-3">
                  {pendientes.map((c) => (
                    <CitaCard key={c.id} c={c} actions={<>
                      <CitaButton label="Aceptar" onClick={() => setEstado(c.id, "aceptada", "Cita aceptada ✓")} kind="accent" disabled={busy === c.id} />
                      <CitaButton label="Rechazar" onClick={() => setEstado(c.id, "borrada", "Cita rechazada")} kind="rust" disabled={busy === c.id} />
                    </>} />
                  ))}
                </div>
              )}
            </section>

            {/* aceptadas */}
            <section>
              <p className="text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: C.accent }}>Citas ({aceptadas.length})</p>
              {aceptadas.length === 0 ? (
                <p className="text-sm font-light px-1" style={{ color: `${C.text}66` }}>No hay citas confirmadas.</p>
              ) : (
                <div className="space-y-3">
                  {aceptadas.map((c) => (
                    <CitaCard key={c.id} c={c} actions={<CitaButton label="Eliminar" onClick={() => setEstado(c.id, "borrada", "Cita movida a borradas")} kind="rust" disabled={busy === c.id} />} />
                  ))}
                </div>
              )}
            </section>

            {/* borradas */}
            {borradas.length > 0 && (
              <section>
                <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: `${C.text}77` }}>Citas borradas ({borradas.length})</p>
                <p className="text-[10px] mb-3" style={{ color: `${C.text}55` }}>Se eliminan solas 15 días después.</p>
                <div className="space-y-3 opacity-80">
                  {borradas.map((c) => (
                    <CitaCard key={c.id} c={c} actions={<>
                      <CitaButton label="Restaurar" onClick={() => setEstado(c.id, "pendiente", "Cita restaurada")} kind="ghost" disabled={busy === c.id} />
                      <CitaButton label="Borrar definitivo" onClick={() => hardDelete(c.id)} kind="rust" disabled={busy === c.id} />
                    </>} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ══ FECHAS ══ */}
        {tab === "fechas" && (
          <div className="space-y-8">
            <div className="p-6 space-y-4" style={{ background: C.surface, border: `1px solid ${C.accent}18` }}>
              <p className="text-[10px] tracking-[0.35em] uppercase" style={{ color: C.accent }}>
                Bloquear fecha {blockDate && <span className="normal-case tracking-normal" style={{ color: C.text }}>· {formatDate(blockDate)}</span>}
              </p>
              <div className="max-w-xs mx-auto">
                <Calendar compact selected={blockDate} onSelect={setBlockDate} blockedDates={blockedList} />
              </div>
              <div>
                <label htmlFor="new-reason" className="block text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: `${C.text}77` }}>Motivo (opcional)</label>
                <input id="new-reason" type="text" value={newReason} onChange={(e) => setNewReason(e.target.value)} placeholder="Ej: Boda reservada"
                  className="w-full bg-transparent px-3 py-2.5 text-sm font-light focus:outline-none"
                  style={{ border: `1px solid ${C.accent}30`, color: C.text, caretColor: C.accent }} />
              </div>
              <button type="button" onClick={handleBlock} disabled={!blockDate || saving}
                className="w-full py-3 text-xs tracking-[0.25em] uppercase font-medium transition-opacity hover:opacity-85 disabled:opacity-40"
                style={{ background: `linear-gradient(135deg, ${C.accent}, #5a7a30)`, color: C.bg }}>
                {saving ? "Guardando..." : "Bloquear fecha"}
              </button>
            </div>

            <div style={{ border: `1px solid ${C.accent}18` }}>
              <div className="px-6 py-4" style={{ background: C.surface, borderBottom: `1px solid ${C.accent}12` }}>
                <p className="text-[10px] tracking-[0.35em] uppercase" style={{ color: C.accent }}>Fechas bloqueadas ({dates.length})</p>
              </div>
              {dates.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm font-light" style={{ color: `${C.text}66` }}>No hay fechas bloqueadas aún</div>
              ) : (
                <ul>
                  {dates.map((d, i) => (
                    <li key={d.id} className="flex items-center justify-between px-6 py-4"
                      style={{ background: i % 2 === 0 ? C.bg : C.surface, borderBottom: `1px solid ${C.accent}10` }}>
                      <div>
                        <p className="text-sm font-light" style={{ color: C.text }}>{formatDate(d.date)}</p>
                        {d.reason && <p className="text-[10px] mt-0.5" style={{ color: `${C.text}77` }}>{d.reason}</p>}
                      </div>
                      <button type="button" onClick={() => handleUnblock(d.id)} disabled={busy === d.id}
                        className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 transition-opacity hover:opacity-70 disabled:opacity-30"
                        style={{ border: `1px solid ${C.rust}40`, color: C.rust }}>
                        {busy === d.id ? "..." : "Desbloquear"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
