"use client";

import { useState } from "react";
import { C } from "@/lib/theme";
import { FAQ } from "@/lib/content";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y" style={{ borderColor: `${C.accent}18` }}>
      {FAQ.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} style={{ borderColor: `${C.accent}18` }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 py-4 text-left transition-colors duration-200"
            >
              <span className="text-sm font-light" style={{ color: C.text }}>{item.q}</span>
              <span className="shrink-0 text-lg leading-none transition-transform duration-300"
                style={{ color: C.accent, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
            </button>
            <div className="overflow-hidden transition-all duration-400"
              style={{ maxHeight: isOpen ? "240px" : "0px", opacity: isOpen ? 1 : 0 }}>
              <p className="pb-4 pr-8 text-sm font-light leading-relaxed" style={{ color: `${C.text}aa` }}>
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
