"use client";

import { useEffect, useState } from "react";
import { supabase, BlockedDate } from "@/lib/supabase";
import { C } from "@/lib/theme";

export default function AdminPage() {
  const [auth, setAuth]         = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail]       = useState("");
  const [pwd, setPwd]           = useState("");
  const [pwdErr, setPwdErr]     = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [dates, setDates]       = useState<BlockedDate[]>([]);
  const [newDate, setNewDate]   = useState("");
  const [newReason, setNewReason] = useState("");
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast]       = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  /* sesión persistida: se restaura al recargar y reacciona a login/logout */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuth(!!data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuth(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const fetchDates = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("blocked_dates")
      .select("*")
      .order("date", { ascending: true });
    setDates(data ?? []);
    setLoading(false);
  };

  /* carga las fechas cuando hay sesión (suscripción a un sistema externo: Supabase) */
  useEffect(() => {
    if (!auth) return;
    let active = true;
    supabase
      .from("blocked_dates")
      .select("*")
      .order("date", { ascending: true })
      .then(({ data }) => {
        if (!active) return;
        setDates(data ?? []);
        setLoading(false);
      });
    return () => { active = false; };
  }, [auth]);

  const handleLogin = async () => {
    if (!email || !pwd) { setPwdErr("Ingresa tu correo y contraseña"); return; }
    setLoggingIn(true);
    setPwdErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    if (error) setPwdErr("Credenciales incorrectas");
    setLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleAdd = async () => {
    if (!newDate) return;
    setSaving(true);
    const { error } = await supabase.from("blocked_dates").insert({ date: newDate, reason: newReason || null });
    if (error) { showToast("Error: " + error.message); }
    else { showToast("Fecha bloqueada ✓"); setNewDate(""); setNewReason(""); fetchDates(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from("blocked_dates").delete().eq("id", id);
    showToast("Fecha eliminada");
    setDeleting(null);
    fetchDates();
  };

  const formatDate = (d: string) => {
    const [y, m, day] = d.split("-");
    const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`;
  };

  /* ── carga inicial: evita parpadeo del login mientras se restaura la sesión ── */
  if (!authReady) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
      <p className="text-sm font-light" style={{ color: `${C.text}66`, fontFamily: "Georgia, serif" }}>Cargando…</p>
    </div>
  );

  /* ── LOGIN ── */
  if (!auth) return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: C.bg, fontFamily: "Georgia, serif" }}>
      <form className="w-full max-w-sm p-10 space-y-6"
        onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
        style={{ background: C.surface, border: `1px solid ${C.accent}20` }}>
        <div className="text-center">
          <p className="text-xs tracking-[0.4em] uppercase mb-2" style={{ color: C.accent }}>Panel de Administración</p>
          <h1 className="text-2xl font-light" style={{ color: C.text }}>Salón del Bosque</h1>
        </div>
        <div>
          <label htmlFor="admin-email" className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Correo</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setPwdErr(""); }}
            className="w-full bg-transparent px-4 py-3 text-sm font-light focus:outline-none"
            style={{ border: `1px solid ${pwdErr ? "#b94a4a" : C.accent + "30"}`, color: C.text, caretColor: C.accent }}
            placeholder="correo@ejemplo.com"
          />
        </div>
        <div>
          <label htmlFor="admin-pwd" className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Contraseña</label>
          <input
            id="admin-pwd"
            type="password"
            autoComplete="current-password"
            value={pwd}
            onChange={(e) => { setPwd(e.target.value); setPwdErr(""); }}
            aria-invalid={!!pwdErr}
            className="w-full bg-transparent px-4 py-3 text-sm font-light focus:outline-none"
            style={{ border: `1px solid ${pwdErr ? "#b94a4a" : C.accent + "30"}`, color: C.text, caretColor: C.accent }}
            placeholder="••••••••••••••"
          />
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

  /* ── PANEL ── */
  return (
    <div className="min-h-screen px-4 py-10" style={{ background: C.bg, fontFamily: "Georgia, serif" }}>
      {/* toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 text-sm font-light"
          style={{ background: C.accent, color: C.bg }}>
          {toast}
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-8">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase mb-1" style={{ color: C.accent }}>Panel de Administración</p>
            <h1 className="text-3xl font-light" style={{ color: C.text }}>Fechas ocupadas</h1>
          </div>
          <button onClick={handleLogout}
            className="text-[10px] tracking-[0.2em] uppercase px-4 py-2 transition-opacity hover:opacity-70"
            style={{ border: `1px solid ${C.text}20`, color: `${C.text}77` }}>
            Cerrar sesión
          </button>
        </div>

        {/* agregar fecha */}
        <div className="p-6 space-y-4" style={{ background: C.surface, border: `1px solid ${C.accent}18` }}>
          <p className="text-[10px] tracking-[0.35em] uppercase" style={{ color: C.accent }}>Bloquear nueva fecha</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="new-date" className="block text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: `${C.text}77` }}>Fecha</label>
              <input id="new-date" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-transparent px-3 py-2.5 text-sm font-light focus:outline-none"
                style={{ border: `1px solid ${C.accent}30`, color: C.text }} />
            </div>
            <div className="flex-1">
              <label htmlFor="new-reason" className="block text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: `${C.text}77` }}>Motivo (opcional)</label>
              <input id="new-reason" type="text" value={newReason} onChange={(e) => setNewReason(e.target.value)}
                placeholder="Ej: Boda reservada"
                className="w-full bg-transparent px-3 py-2.5 text-sm font-light focus:outline-none"
                style={{ border: `1px solid ${C.accent}30`, color: C.text, caretColor: C.accent }} />
            </div>
          </div>
          <button onClick={handleAdd} disabled={!newDate || saving}
            className="px-8 py-3 text-xs tracking-[0.25em] uppercase font-medium transition-opacity hover:opacity-85 disabled:opacity-40"
            style={{ background: `linear-gradient(135deg, ${C.accent}, #5a7a30)`, color: C.bg }}>
            {saving ? "Guardando..." : "Bloquear fecha"}
          </button>
        </div>

        {/* lista de fechas */}
        <div style={{ border: `1px solid ${C.accent}18` }}>
          <div className="px-6 py-4" style={{ background: C.surface, borderBottom: `1px solid ${C.accent}12` }}>
            <p className="text-[10px] tracking-[0.35em] uppercase" style={{ color: C.accent }}>
              Fechas bloqueadas ({dates.length})
            </p>
          </div>
          {loading ? (
            <div className="px-6 py-8 text-center text-sm font-light" style={{ color: `${C.text}66` }}>Cargando...</div>
          ) : dates.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm font-light" style={{ color: `${C.text}66` }}>
              No hay fechas bloqueadas aún
            </div>
          ) : (
            <ul>
              {dates.map((d, i) => (
                <li key={d.id} className="flex items-center justify-between px-6 py-4"
                  style={{ background: i % 2 === 0 ? C.bg : C.surface, borderBottom: `1px solid ${C.accent}10` }}>
                  <div>
                    <p className="text-sm font-light" style={{ color: C.text }}>{formatDate(d.date)}</p>
                    {d.reason && <p className="text-[10px] mt-0.5" style={{ color: `${C.text}77` }}>{d.reason}</p>}
                  </div>
                  <button onClick={() => handleDelete(d.id)} disabled={deleting === d.id}
                    className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 transition-opacity hover:opacity-70 disabled:opacity-30"
                    style={{ border: `1px solid ${C.rust}40`, color: C.rust }}>
                    {deleting === d.id ? "..." : "Eliminar"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
