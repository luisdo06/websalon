/* ─── datos del negocio (fuente única) ─── */
export const SITE = {
  name: "Salón del Bosque",
  tagline: "Salón de eventos en Toluca",
  description:
    "Salón del Bosque — salón de eventos en Toluca, Estado de México. Bodas, XV años, " +
    "cumpleaños, bautizos, corporativos y más, con banquete y mobiliario completo.",
  // Cambiar por el dominio real al desplegar.
  url: "https://salondelbosque.com",
  city: "Toluca",
  region: "Estado de México",
  country: "MX",
  contactName: "Evelia Mendoza Hernández",
  geo: { lat: 19.2779057, lng: -99.619061 },
  maps: "https://maps.app.goo.gl/YZwtrZ7VSL3aCEz88",
} as const;

/* ─── teléfono en sus distintos formatos ─── */
export const PHONE = {
  display: "722 592 6512",
  tel: "7225926512", // href="tel:"
  whatsapp: "527225926512", // wa.me (México: 52 + número)
} as const;
