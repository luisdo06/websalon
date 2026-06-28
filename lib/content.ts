import { C } from "./theme";

/* ════════════════════════════════════════════════════════════════
   CONTENIDO DEL SITIO
   ⚠️  Los bloques marcados con "EJEMPLO" contienen datos ficticios
       (placeholder). Reemplázalos con información real del salón.
       Ver CONTENIDO-PENDIENTE.md.
════════════════════════════════════════════════════════════════ */

export interface Testimonial { name: string; role: string; text: string; }
export interface Stat { value: number; suffix: string; label: string; }
export interface MenuItem { curso: string; detalle: string; }
export interface Package {
  id: string;
  name: string;
  tag: string;
  price: string;
  priceNote: string;
  highlight: string;
  noIncluye: string[];
  incluye: string[];
  menu: MenuItem[];
  color: string;
}

/* ⚠️ EJEMPLO — testimonios ficticios (además con texto de peluquería). Reemplazar con reseñas reales. */
export const TESTIMONIALS: Testimonial[] = [
  { name: "Valentina M.", role: "Cliente desde 2021", text: "Una experiencia que va mucho más allá del corte. Salí transformada y con una confianza que no esperaba." },
  { name: "Isabela R.",   role: "Cliente desde 2020", text: "El mejor salón que he visitado. La atención es impecable y el resultado, absolutamente sublime." },
  { name: "Carolina P.",  role: "Cliente desde 2022", text: "Mi color nunca había lucido tan natural y brillante. El equipo entiende exactamente lo que quieres." },
];

/* ⚠️ EJEMPLO PARCIAL — "Años" = 20 (desde 2005); Clientes/Premios/Satisfacción son cifras a confirmar. */
export const STATS: Stat[] = [
  { value: 20,   suffix: "",  label: "Años"        },
  { value: 2000, suffix: "+", label: "Clientes"    },
  { value: 98,   suffix: "%", label: "Satisfacción"},
];

/* Paquetes y precios — datos reales del salón. */
export const PACKAGES: Package[] = [
  {
    id: "01",
    name: "Paquete Completo",
    tag: "Con banquete incluido",
    price: "$350 por persona",
    priceNote: "Niños pequeños mitad de precio",
    highlight: "Ideal para bodas, XV años y eventos especiales",
    noIncluye: ["Música", "Pastel", "Centros de mesa"],
    incluye: [
      "Renta de salón (8 hrs)",
      "Mesas redondas + sillas Tiffany con cojín",
      "Mantelería completa (mantel, cubre mantel o camino de mesa, cintas, servilletas de tela individual)",
      "Loza completa",
      "Meseros (llegan 2 hrs antes · 6 hrs de servicio después)",
      "2 personas cuidando autos (5 hrs)",
      "Refrescos, agua de jamaica, agua natural, hielos y café",
      "Comida en tres tiempos:",
    ],
    menu: [
      { curso: "Entrada", detalle: "Crema a elegir" },
      { curso: "Segundo", detalle: "Pasta (fusilli, fettuccine o espagueti) preparada en varias formas + pan baguette individual con ajonjolí y rajas caseras del chef" },
      { curso: "Plato fuerte", detalle: "Pechuga de pollo fresco (200 g) horneada y rellena — opciones: jamón con queso · espinacas con queso — bañada en salsa a elegir (pimiento morrón, ciruela pasa, tamarindo, chipotle, etc.) + ensalada de tres lechugas con frutos rojos o verduras al vapor" },
    ],
    color: C.accent,
  },
  {
    id: "02",
    name: "Paquete Sencillo",
    tag: "Sin comida · mobiliario completo",
    price: "$19,800 total",
    priceNote: "Para hasta 150 invitados",
    highlight: "Perfecto para quienes traen su propio catering",
    noIncluye: ["Comida"],
    incluye: [
      "Renta de salón (8 hrs + 1 hr para retirarse)",
      "Mesas redondas + sillas Tiffany",
      "Mantelería completa (mantel, cubre mantel, cojines para sillas, servilletas de tela individual)",
      "Loza completa (plato trinche, plato arrocero o hondo, cubiertos, vaso cubero de cristal)",
      "5 meseros (llegan 2 hrs antes · 6 hrs de servicio después)",
      "2 personas cuidando autos (5 hrs)",
      "Cestos para tortillas, hieleras, jarras de cristal, tazones, cucharas y charolas para servir",
    ],
    menu: [],
    color: C.amber,
  },
];
