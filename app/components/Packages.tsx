"use client";

import { useState } from "react";
import { C } from "@/lib/theme";
import { PHONE } from "@/lib/site";
import { PACKAGES, type Package } from "@/lib/content";

/* ─── PackageCard ─── */
function PackageCard({ pkg, onElegir }: { pkg: Package; onElegir: (nombre: string) => void }) {
  const [open, setOpen] = useState(false);
  const isAccent = pkg.color === C.accent;

  return (
    <div className="relative overflow-hidden transition-all duration-500"
      style={{ border: `1px solid ${pkg.color}25`, background: C.surface }}>
      {/* franja superior de color */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${pkg.color}80, ${pkg.color}30)` }} />

      <div className="p-6">
        {/* cabecera */}
        <div className="mb-4">
          <p className="text-[9px] tracking-[0.45em] uppercase mb-1" style={{ color: `${pkg.color}99` }}>Paquete {pkg.id}</p>
          <h3 className="text-2xl font-light" style={{ fontFamily: "var(--font-display,serif)", color: C.text }}>{pkg.name}</h3>
          <p className="text-xs mt-1 font-light" style={{ color: `${C.text}88` }}>{pkg.tag}</p>
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

/* ─── QuoteCalculator ─── */
export default function QuoteCalculator({ onElegirPaquete }: { onElegirPaquete: (nombre: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {PACKAGES.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} onElegir={onElegirPaquete} />)}
      </div>
      <div className="p-5 text-center" style={{ background: C.surface2, border: `1px dashed ${C.accent}25` }}>
        <p className="text-sm font-light mb-1" style={{ fontFamily: "var(--font-display,serif)", color: `${C.text}cc` }}>
          ¿Tienes necesidades especiales o un grupo grande?
        </p>
        <p className="text-xs mb-4" style={{ color: `${C.text}77` }}>
          Contáctanos directamente con Evelia Mendoza Hernández
        </p>
        <a href={`tel:${PHONE.tel}`}
          className="inline-block px-8 py-3 text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:opacity-80"
          style={{ border: `1px solid ${C.accent}50`, color: C.accent }}>
          ☎ {PHONE.display}
        </a>
      </div>
    </div>
  );
}
