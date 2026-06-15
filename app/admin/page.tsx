"use client";

import { useEffect, useState } from "react";
import { supabase, BlockedDate } from "@/lib/supabase";

const PASSWORD = "SalondelBosque06";

const C = {
  bg:      "#f5f0e8",
  surface: "#ede7d8",
  surface2:"#e4dccc",
  accent:  "#5a8a38",
  amber:   "#a06818",
  rust:    "#8b4a22",
  text:    "#0e1508",
} as const;

export default function AdminPage() {
  const [auth, setAuth]         = useState(false);
  const [pwd, setPwd]           = useState("");
  const [pwdErr, setPwdErr]     = useState(false);
  const [dates, setDates]       = useState<BlockedDate[]>([]);
  const [newDate, setNewDate]   = useState("");
  const [newReason, setNewReason] = useState("");
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast]       = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const fetchDates = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("blocked_dates")
      .select("*")
      .order("date", { ascending: true });
    setDates(data ?? []);
    setLoading(false);
  };

  useEffect(() => { if (auth) fetchDates(); }, [auth]);

  const handleLogin = () => {
    if (pwd === PASSWORD) { setAuth(true); setPwdErr(false); }
    else { setPwdErr(true); }
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

  /* ── LOGIN ── */
  if (!auth) return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: C.bg, fontFamily: "Georgia, serif" }}>
      <div className="w-full max-w-sm p-10 space-y-6"
        style={{ background: C.surface, border: `1px solid ${C.accent}20` }}>
        <div className="text-center">
          <p className="text-xs tracking-[0.4em] uppercase mb-2" style={{ color: C.accent }}>Panel de Administración</p>
          <h1 className="text-2xl font-light" style={{ color: C.text }}>Salón del Bosque</h1>
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: `${C.accent}99` }}>Contraseña</label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => { setPwd(e.target.value); setPwdErr(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-transparent px-4 py-3 text-sm font-light focus:outline-none"
            style={{ border: `1px solid ${pwdErr ? "#b94a4a" : C.accent + "30"}`, color: C.text, caretColor: C.accent }}
            placeholder="••••••••••••••"
          />
          {pwdErr && <p className="text-[10px] mt-1" style={{ color: "#b94a4a" }}>Contraseña incorrecta</p>}
        </div>
        <button onClick={handleLogin}
          className="w-full py-3 text-xs tracking-[0.3em] uppercase font-medium transition-opacity hover:opacity-85"
          style={{ background: `linear-gradient(135deg, ${C.accent}, #5a7a30)`, color: C.bg }}>
          Entrar
        </button>
      </div>
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
          <button onClick={() => setAuth(false)}
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
              <label className="block text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: `${C.text}77` }}>Fecha</label>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-transparent px-3 py-2.5 text-sm font-light focus:outline-none"
                style={{ border: `1px solid ${C.accent}30`, color: C.text }} />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: `${C.text}77` }}>Motivo (opcional)</label>
              <input type="text" value={newReason} onChange={(e) => setNewReason(e.target.value)}
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
