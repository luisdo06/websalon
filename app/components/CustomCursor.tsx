"use client";

import { useEffect, useRef } from "react";
import { C } from "@/lib/theme";

/* ─── cursor personalizado: hojita (solo con ratón) ─── */
export default function CustomCursor({ enabled }: { enabled: boolean }) {
  const leaf = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const lag = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    /* la hoja es el único cursor en esta página (ver .leaf-cursor en globals.css) */
    document.documentElement.classList.add("leaf-cursor");
    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    const animate = () => {
      lag.current.x += (pos.current.x - lag.current.x) * 0.3;
      lag.current.y += (pos.current.y - lag.current.y) * 0.3;
      if (leaf.current) leaf.current.style.transform = `translate(${lag.current.x - 13}px, ${lag.current.y - 13}px)`;
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => {
      document.documentElement.classList.remove("leaf-cursor");
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={leaf} className="fixed top-0 left-0 z-[999] pointer-events-none hidden md:block"
      style={{ filter: `drop-shadow(0 1px 2px ${C.text}33)` }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path fill={C.accent} d="M4 20c0-8 6-14 16-16-2 10-8 16-16 16Z" />
        <path d="M4 20C8 14 12 10 18 8" stroke={`${C.bg}`} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
