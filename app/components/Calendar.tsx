"use client";

import { useState } from "react";
import { C } from "@/lib/theme";

/* ─── Calendario ─── */
export default function Calendar({
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
        <button type="button" onClick={prevMonth} aria-label="Mes anterior" className="w-8 h-8 flex items-center justify-center text-sm transition-opacity hover:opacity-60"
          style={{ color: C.accent }}>‹</button>
        <p className="text-sm font-light tracking-[0.15em]" style={{ color: C.text }}>
          {MONTHS[month]} {year}
        </p>
        <button type="button" onClick={nextMonth} aria-label="Mes siguiente" className="w-8 h-8 flex items-center justify-center text-sm transition-opacity hover:opacity-60"
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
            <button type="button" key={iso} disabled={disabled} onClick={() => onSelect(iso)}
              aria-label={`Seleccionar ${day}`} aria-pressed={isSelected}
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
