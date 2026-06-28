"use client";

import { useEffect, useRef } from "react";
import { C } from "@/lib/theme";

/* ─── cursor personalizado (solo con ratón) ─── */
export default function CustomCursor({ enabled }: { enabled: boolean }) {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const lag = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    const animate = () => {
      lag.current.x += (pos.current.x - lag.current.x) * 0.12;
      lag.current.y += (pos.current.y - lag.current.y) * 0.12;
      if (dot.current)  dot.current.style.transform  = `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)`;
      if (ring.current) ring.current.style.transform = `translate(${lag.current.x - 16}px, ${lag.current.y - 16}px)`;
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener("mousemove", onMove); if (raf.current) cancelAnimationFrame(raf.current); };
  }, [enabled]);
  if (!enabled) return null;
  return (
    <>
      <div ref={dot}  className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full z-[999] pointer-events-none hidden md:block" style={{ background: C.accent }} />
      <div ref={ring} className="fixed top-0 left-0 w-8 h-8 rounded-full z-[999] pointer-events-none hidden md:block" style={{ border: `1px solid ${C.accent}55` }} />
    </>
  );
}
