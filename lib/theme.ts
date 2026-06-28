/* ─── paleta del salón (fuente única, antes duplicada en page.tsx y admin) ─── */
export const C = {
  bg:       "#f5f0e8",
  surface:  "#ede7d8",
  surface2: "#e4dccc",
  accent:   "#5a8a38", // musgo / helecho
  amber:    "#a06818", // ámbar cálido
  rust:     "#8b4a22", // tierra / óxido
  text:     "#0e1508", // verde casi negro
} as const;

export type Palette = typeof C;
