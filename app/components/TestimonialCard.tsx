"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { C } from "@/lib/theme";
import { type Testimonial } from "@/lib/content";

/* ─── TestimonialCard con typewriter ─── */
export default function TestimonialCard({ t, delay }: { t: Testimonial; delay: number }) {
  const [typed, setTyped]     = useState("");
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startType = useCallback(() => {
    setHovered(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(t.text); return; // sin efecto de máquina de escribir
    }
    let i = 0;
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
