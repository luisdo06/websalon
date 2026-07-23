"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks";
import { C } from "@/lib/theme";
import "./HistoriaSlideshow.css";

export interface SlidePhoto {
  src: string;
  alt?: string;
  label?: string;
}

const INTERVALO_MS = 4500;

/* Slideshow cinematográfico para "Nuestra historia" en celular: una foto grande a la vez,
   crossfade + zoom lento (Ken Burns), auto-avance, puntos y swipe. En escritorio se usa el
   abanico (BounceCards), no este componente. */
export default function HistoriaSlideshow({ photos }: { photos: SlidePhoto[] }) {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const swipeStartX = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = photos.length;
  const go = (i: number) => setIndex(((i % total) + total) % total);

  /* auto-avance: se reinicia cada vez que cambia el índice (así al tocar un punto o
     deslizar, el temporizador vuelve a empezar). No corre con reduced-motion. */
  useEffect(() => {
    if (reduced || total <= 1) return;
    const tick = () => setIndex((i) => (i + 1) % total);
    const start = () => { timerRef.current = setTimeout(function loop() { tick(); timerRef.current = setTimeout(loop, INTERVALO_MS); }, INTERVALO_MS); };
    const stop = () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } };
    start();
    /* pausa cuando la pestaña está oculta */
    const onVis = () => { if (document.hidden) stop(); else if (!timerRef.current) start(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
  }, [reduced, total, index]);

  return (
    <div
      className="hs-frame"
      onTouchStart={(e) => { swipeStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (swipeStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - swipeStartX.current;
        swipeStartX.current = null;
        if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      {photos.map((photo, i) => (
        <div key={photo.src} className={`hs-slide ${i === index ? "is-active" : ""} ${reduced ? "" : "hs-slide--anim"}`} aria-hidden={i !== index}>
          {/* Ken Burns transforma este contenedor; se usa <img> como en BounceCards/PhotoBento */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hs-img" src={photo.src} alt={photo.alt || photo.label || ""} draggable={false} /> {/* react-doctor-disable-line react-doctor/nextjs-no-img-element */}
        </div>
      ))}

      {/* etiqueta de la foto actual (key por índice para re-animar el fade al cambiar) */}
      {photos[index]?.label && (
        <div className="hs-caption" key={index}>
          <span>{photos[index].label}</span>
        </div>
      )}

      {/* puntos indicadores */}
      {total > 1 && (
        <div className="hs-dots">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              className={`hs-dot ${i === index ? "is-active" : ""}`}
              style={i === index ? { background: C.accent } : undefined}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
