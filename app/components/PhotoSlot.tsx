import Image from "next/image";
import { C } from "@/lib/theme";

/* ─── PhotoSlot: placeholder inline (galería interna) ─── */
export default function PhotoSlot({ label, wide = false, src }: { label: string; hint?: string; wide?: boolean; src?: string }) {
  return (
    <div className={`relative ${wide ? "aspect-[21/6]" : "aspect-[4/3]"} overflow-hidden group`}
      style={{ border: `1px dashed ${C.accent}35`, background: `linear-gradient(135deg, ${C.surface2}, ${C.surface})` }}>
      {src ? (
        <Image src={src} alt={label} fill style={{ objectFit: "cover", objectPosition: "center" }} sizes="25vw" />
      ) : (
        <>
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: `radial-gradient(${C.accent}12 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
          {[["top-2 left-2","border-t border-l"],["top-2 right-2","border-t border-r"],
            ["bottom-2 left-2","border-b border-l"],["bottom-2 right-2","border-b border-r"]].map(([p, cls]) => (
            <div key={p} className={`absolute ${p} w-4 h-4 ${cls}`} style={{ borderColor: `${C.accent}45` }} />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg" style={{ color: `${C.accent}60` }}>⬚</span>
          </div>
        </>
      )}
    </div>
  );
}
