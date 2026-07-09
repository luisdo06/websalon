"use client";

import { usePrefersReducedMotion } from "../hooks";

/* config estática (determinista → sin desajustes de hidratación).
   fall = duración de caída, delay = desfase (negativo), sway = vaivén, spin = giro. */
const LEAVES = [
  { left:  4, size: 22, fall: 13, delay:  0,  sway: 3.6, spin: 6.5, color: "#5a8a38", opacity: 0.60 },
  { left: 13, size: 16, fall: 17, delay:  6,  sway: 4.4, spin: 8.0, color: "#a06818", opacity: 0.50 },
  { left: 22, size: 26, fall: 11, delay:  9,  sway: 3.2, spin: 5.5, color: "#3d6e22", opacity: 0.55 },
  { left: 31, size: 15, fall: 16, delay:  2,  sway: 4.8, spin: 7.2, color: "#c48830", opacity: 0.45 },
  { left: 40, size: 20, fall: 14, delay: 11,  sway: 3.9, spin: 6.0, color: "#6aaa40", opacity: 0.58 },
  { left: 49, size: 18, fall: 18, delay:  4,  sway: 4.2, spin: 8.5, color: "#5a8a38", opacity: 0.52 },
  { left: 58, size: 24, fall: 12, delay:  8,  sway: 3.4, spin: 5.8, color: "#a06818", opacity: 0.55 },
  { left: 67, size: 14, fall: 15, delay:  1,  sway: 4.6, spin: 7.6, color: "#3d6e22", opacity: 0.48 },
  { left: 76, size: 21, fall: 13, delay: 10,  sway: 3.7, spin: 6.4, color: "#c48830", opacity: 0.55 },
  { left: 84, size: 17, fall: 17, delay:  5,  sway: 4.3, spin: 8.2, color: "#5a8a38", opacity: 0.50 },
  { left: 91, size: 25, fall: 11, delay:  7,  sway: 3.1, spin: 5.6, color: "#6aaa40", opacity: 0.57 },
  { left: 96, size: 16, fall: 16, delay:  3,  sway: 4.7, spin: 7.9, color: "#a06818", opacity: 0.46 },
  { left:  9, size: 19, fall: 15, delay: 12,  sway: 4.0, spin: 7.0, color: "#c48830", opacity: 0.52 },
  { left: 18, size: 14, fall: 18, delay:  3,  sway: 4.9, spin: 8.4, color: "#5a8a38", opacity: 0.44 },
  { left: 27, size: 23, fall: 12, delay:  6,  sway: 3.3, spin: 5.9, color: "#a06818", opacity: 0.56 },
  { left: 45, size: 17, fall: 16, delay: 13,  sway: 4.5, spin: 7.4, color: "#3d6e22", opacity: 0.50 },
  { left: 54, size: 21, fall: 13, delay:  2,  sway: 3.8, spin: 6.2, color: "#6aaa40", opacity: 0.55 },
  { left: 63, size: 15, fall: 17, delay:  9,  sway: 4.6, spin: 8.1, color: "#c48830", opacity: 0.47 },
  { left: 72, size: 24, fall: 11, delay:  5,  sway: 3.2, spin: 5.7, color: "#5a8a38", opacity: 0.58 },
  { left: 88, size: 18, fall: 14, delay: 10,  sway: 4.1, spin: 6.8, color: "#3d6e22", opacity: 0.51 },
];

function LeafShape() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
      <path fill="currentColor" d="M4 20c0-8 6-14 16-16-2 10-8 16-16 16Z" />
      <path d="M4 20C8 14 12 10 18 8" stroke="rgba(14,21,8,0.18)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export default function FallingLeaves() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {LEAVES.map((l, i) => (
        <span key={i} className="leaf" style={{ left: `${l.left}%`, animationDuration: `${l.fall}s`, animationDelay: `-${l.delay}s` }}>
          <span className="leaf-sway" style={{ animationDuration: `${l.sway}s` }}>
            <span className="leaf-spin" style={{ width: l.size, height: l.size, opacity: l.opacity, color: l.color, animationDuration: `${l.spin}s` }}>
              <LeafShape />
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
