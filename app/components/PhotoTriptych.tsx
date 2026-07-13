"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { C } from "@/lib/theme";
import { getLenis } from "@/lib/lenisStore";

interface Photo {
  src: string;
  alt: string;
}

/* Tríptico de fotos con lightbox: al hacer clic, la imagen se abre a su tamaño
   normal (calidad original) con una transición de menor a mayor; al cerrar, de
   mayor a menor. */
export default function PhotoTriptych({ images }: { images: Photo[] }) {
  const [active, setActive] = useState<number | null>(null);

  /* pausa el scroll suave y permite cerrar con Escape mientras está abierto */
  useEffect(() => {
    if (active === null) return;
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <>
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Ampliar: ${img.alt}`}
            className="relative aspect-square overflow-hidden group cursor-pointer"
            style={{ border: `1px solid ${C.accent}20`, boxShadow: `0 10px 30px ${C.text}14` }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              quality={90}
              sizes="(max-width:768px) 33vw, 260px"
              style={{ objectFit: "cover", objectPosition: "center" }}
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-[950] flex items-center justify-center p-6"
            style={{ background: `${C.text}e6` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActive(null)}
          >
            {/* imagen a tamaño normal y calidad original (archivo directo) */}
            <motion.img
              src={images[active].src}
              alt={images[active].alt}
              className="max-w-[92vw] max-h-[88vh] object-contain"
              style={{ boxShadow: `0 30px 80px ${C.text}80` }}
              initial={{ scale: 0.55, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.55, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              onClick={(e) => e.stopPropagation()}
            />

            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Cerrar"
              className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center text-2xl transition-transform duration-300 hover:scale-110"
              style={{ color: C.bg }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
