/* ─── datos del negocio (fuente única) ─── */
export const SITE = {
  name: "Salón del Bosque",
  tagline: "Salón de eventos en Toluca",
  description:
    "Salón del Bosque — salón de eventos en Toluca, Estado de México. Bodas, XV años, " +
    "cumpleaños, bautizos, corporativos y más, con banquete y mobiliario completo.",
  // URL de producción (Vercel). Cambiar si conectas un dominio propio.
  url: "https://websalon.vercel.app",
  city: "Toluca",
  region: "Estado de México",
  country: "MX",
  contactName: "Evelia Mendoza Hernández",
  capacity: 200, // ⚠️ aforo a confirmar
  geo: { lat: 19.2779057, lng: -99.619061 },
  maps: "https://maps.app.goo.gl/YZwtrZ7VSL3aCEz88",
  // Redes sociales. Las vacías no se muestran en navbar/footer ni entran al SEO (sameAs).
  social: {
    instagram: "", // el salón no tiene cuenta de Instagram
    facebook: "https://www.facebook.com/profile.php?id=100065608868207",
  },
} as const;

/* ─── teléfono en sus distintos formatos ─── */
export const PHONE = {
  display: "722 592 6512",
  tel: "7225926512", // href="tel:"
  whatsapp: "527225926512", // wa.me (México: 52 + número)
} as const;
