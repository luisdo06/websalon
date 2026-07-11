import Image from "next/image";
import { C } from "@/lib/theme";

/* ─── SectionPhoto: panel izquierdo sticky con foto real o placeholder ─── */
export default function SectionPhoto({ label, src, priority = false }: { label: string; hint?: string; src?: string; priority?: boolean }) {
  return (
    <div className="relative h-64 md:h-auto md:self-stretch flex-shrink-0 md:w-1/2 overflow-hidden">
      {src ? (
        <Image src={src} alt={label} fill style={{ objectFit: "cover", objectPosition: "center" }} sizes="50vw" priority={priority} loading={priority ? undefined : "lazy"} />
      ) : (
        <>
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(160deg, ${C.surface2} 0%, ${C.surface} 60%, ${C.bg} 100%)` }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: `radial-gradient(${C.accent}18 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ border: `1px dashed ${C.accent}50`, background: `${C.accent}10` }}>
              <span className="text-2xl" style={{ color: `${C.accent}70` }}>⬚</span>
            </div>
          </div>
        </>
      )}
      {/* fundido lateral → crema (hacia el panel de texto, desktop) */}
      <div className="absolute inset-0 pointer-events-none hidden md:block"
        style={{ background: `linear-gradient(to right, transparent 55%, ${C.bg} 94%)` }} />
      {/* fundido inferior más marcado → crema (móvil, hacia el contenido) */}
      <div className="absolute inset-0 pointer-events-none md:hidden"
        style={{ background: `linear-gradient(to bottom, transparent 55%, ${C.bg} 96%)` }} />
      {/* fundido superior e inferior → crema (ambos, quita el borde duro entre secciones) */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, ${C.bg} 0%, transparent 12%, transparent 88%, ${C.bg} 100%)` }} />
    </div>
  );
}
