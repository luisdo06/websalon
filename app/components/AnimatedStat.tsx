"use client";

import { C } from "@/lib/theme";
import { useCounter } from "../hooks";

/* ─── AnimatedStat ─── */
export default function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value);
  return (
    <div className="text-center" ref={ref}>
      <div className="forest-text text-4xl font-semibold" style={{ fontFamily: "var(--font-display,serif)" }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[9px] tracking-[0.35em] uppercase mt-1" style={{ color: `${C.text}aa` }}>{label}</div>
    </div>
  );
}
