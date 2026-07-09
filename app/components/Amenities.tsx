import { C } from "@/lib/theme";
import { AMENITIES } from "@/lib/content";

const sp = {
  width: 22, height: 22, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};

/* íconos de línea por clave (definidas en AMENITIES) */
const ICONS: Record<string, React.ReactNode> = {
  users:   <svg {...sp}><circle cx="9" cy="8" r="3" /><path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6" /><path d="M16 6a3 3 0 0 1 0 6M22 21c0-3-1.7-5.2-4-5.8" /></svg>,
  parking: <svg {...sp}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 16V8h3.5a2.5 2.5 0 0 1 0 5H9" /></svg>,
  climate: <svg {...sp}><path d="M12 3v18M3 12h18M6 6l3 3M18 6l-3 3M6 18l3-3M18 18l-3-3" /></svg>,
  access:  <svg {...sp}><circle cx="12" cy="4.5" r="1.6" /><path d="M9 8h6M12 8v6M12 14l-3 6M12 14l3 6M8 11h8" /></svg>,
  chair:   <svg {...sp}><path d="M6 4v8h12V4M5 12h14M7 12v8M17 12v8M7 16h10" /></svg>,
  waiter:  <svg {...sp}><path d="M12 3v3M5 13a7 7 0 0 1 14 0zM3 13h18M12 18v3" /></svg>,
  dish:    <svg {...sp}><path d="M3 12a9 9 0 0 1 18 0zM2 12h20M12 3v2" /></svg>,
  leaf:    <svg {...sp}><path d="M4 20c0-8 6-14 16-16-2 10-8 16-16 16Z" /><path d="M4 20C8 14 12 10 18 8" /></svg>,
};

export default function Amenities() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {AMENITIES.map((a) => (
        <div key={a.label} className="flex flex-col items-center text-center gap-2 p-4"
          style={{ border: `1px solid ${C.accent}18`, background: `${C.surface}` }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: `${C.accent}12`, border: `1px solid ${C.accent}30`, color: C.accent }}>
            {ICONS[a.icon] ?? ICONS.leaf}
          </div>
          <p className="text-xs tracking-[0.12em] uppercase" style={{ color: C.text }}>{a.label}</p>
          <p className="text-[11px] font-light leading-relaxed" style={{ color: `${C.text}99` }}>{a.note}</p>
        </div>
      ))}
    </div>
  );
}
