import { SITE } from "@/lib/site";

/* Muestra solo las redes que tengan URL configurada en lib/site.ts.
   Mientras estén vacías no se renderiza nada (evita enlaces rotos). */
export default function SocialLinks({ className = "", size = 18 }: { className?: string; size?: number }) {
  const sp = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  };
  const items = [
    {
      url: SITE.social.instagram, label: "Instagram",
      icon: <svg {...sp}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg>,
    },
    {
      url: SITE.social.facebook, label: "Facebook",
      icon: <svg {...sp}><path d="M15 4h-2.5A3.5 3.5 0 0 0 9 7.5V10H6.5v3H9v8h3v-8h2.5l.5-3H12V7.5a.5.5 0 0 1 .5-.5H15z" /></svg>,
    },
  ].filter((i) => i.url);

  if (items.length === 0) return null;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {items.map((i) => (
        <a key={i.label} href={i.url} target="_blank" rel="noopener noreferrer" aria-label={i.label}
          className="transition-opacity duration-300 hover:opacity-70">
          {i.icon}
        </a>
      ))}
    </div>
  );
}
