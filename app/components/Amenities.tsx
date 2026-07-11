"use client";

import { C } from "@/lib/theme";
import { SERVICE_CARDS, type ServiceCard } from "@/lib/content";
import { usePrefersReducedMotion, useMediaQuery } from "../hooks";
import CardSwap, { Card } from "./CardSwap";

const sp = {
  width: 22, height: 22, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};

const ICONS: Record<string, React.ReactNode> = {
  users:  <svg {...sp}><circle cx="9" cy="8" r="3" /><path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6" /><path d="M16 6a3 3 0 0 1 0 6M22 21c0-3-1.7-5.2-4-5.8" /></svg>,
  chair:  <svg {...sp}><path d="M6 4v8h12V4M5 12h14M7 12v8M17 12v8M7 16h10" /></svg>,
  waiter: <svg {...sp}><path d="M12 3v3M5 13a7 7 0 0 1 14 0zM3 13h18M12 18v3" /></svg>,
  dish:   <svg {...sp}><path d="M3 12a9 9 0 0 1 18 0zM2 12h20M12 3v2" /></svg>,
  leaf:   <svg {...sp}><path d="M4 20c0-8 6-14 16-16-2 10-8 16-16 16Z" /><path d="M4 20C8 14 12 10 18 8" /></svg>,
};

/* contenido interno de cada tarjeta (mismo en modo animado y estático) */
function CardBody({ c }: { c: ServiceCard }) {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
        style={{ background: `${C.accent}12`, border: `1px solid ${C.accent}30`, color: C.accent }}>
        {ICONS[c.icon] ?? ICONS.leaf}
      </div>
      <h3 className="text-lg font-light mb-3" style={{ fontFamily: "var(--font-display,serif)", color: C.text }}>{c.title}</h3>
      <ul className="space-y-2">
        {c.items.map((it) => (
          <li key={it} className="flex gap-2.5 text-sm font-light leading-relaxed" style={{ color: `${C.text}cc` }}>
            <span className="shrink-0 mt-0.5" style={{ color: `${C.accent}80` }}>◆</span>{it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Amenities() {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const animated = isDesktop && !reduced;

  /* fallback estático (móvil o reduce-motion): rejilla legible con el mismo contenido */
  if (!animated) {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        {SERVICE_CARDS.map((c) => (
          <div key={c.title} style={{ background: C.surface, border: `1px solid ${C.accent}25`, borderRadius: 14 }}>
            <CardBody c={c} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-10 items-center">
      {/* texto de apoyo */}
      <div>
        <p className="text-sm font-light leading-relaxed mb-4" style={{ color: `${C.text}cc` }}>
          Nos encargamos de todo para que tú solo disfrutes: espacio, mobiliario, servicio y
          gastronomía, cuidados al detalle en un entorno natural único.
        </p>
        <p className="text-xs font-light" style={{ color: `${C.text}88` }}>
          Pasa el cursor sobre las tarjetas para pausarlas.
        </p>
      </div>
      {/* stack animado */}
      <div className="relative h-[460px]">
        <CardSwap width={330} height={360} cardDistance={50} verticalDistance={58} delay={2000} skewAmount={5} easing="linear" pauseOnHover>
          {SERVICE_CARDS.map((c) => (
            <Card key={c.title}><CardBody c={c} /></Card>
          ))}
        </CardSwap>
      </div>
    </div>
  );
}
