"use client";

import { useEffect, useRef } from "react";
import { C } from "@/lib/theme";
import SectionPhoto from "./SectionPhoto";

/* ─── SplitSection: wrapper con imagen sticky izquierda + contenido derecha ─── */
export default function SplitSection({
  id, photoLabel, photoHint, photoSrc, priority = false, children,
}: {
  id?: string; photoLabel: string; photoHint: string; photoSrc?: string; priority?: boolean; children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("in-view"); io.disconnect(); } },
      { threshold: 0.06 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id={id} className="md:flex md:items-stretch relative section-entrance">
      <SectionPhoto label={photoLabel} hint={photoHint} src={photoSrc} priority={priority} />
      <div className="w-full md:w-1/2 relative"
        style={{ background: `${C.bg}ee`, backdropFilter: "blur(2px)" }}>
        {children}
      </div>
    </section>
  );
}
