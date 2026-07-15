"use client";

import { LazyMotion, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/* Carga perezosa de las features de animación de Motion: los componentes `m.*`
   sólo descargan el subconjunto `domAnimation` (animaciones, variantes, exit y
   gestos), en vez del bundle completo de `motion.*`. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
