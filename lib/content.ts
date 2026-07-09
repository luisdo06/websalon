import { C } from "./theme";

/* ════════════════════════════════════════════════════════════════
   CONTENIDO DEL SITIO
   ⚠️  Los bloques marcados con "EJEMPLO" contienen datos ficticios
       (placeholder). Reemplázalos con información real del salón.
       Ver CONTENIDO-PENDIENTE.md.
════════════════════════════════════════════════════════════════ */

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

/* ⚠️ EJEMPLO PARCIAL — "Años" = 20 (desde 2005); Clientes/Satisfacción son cifras a confirmar. */
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

/* ⚠️ EJEMPLO — galería de eventos. Reemplazar por fotos reales en /public/fotos. */
export interface GalleryItem { label: string; hint: string; src?: string; wide?: boolean; }
export const GALLERY: GalleryItem[] = [
  { label: "Salón principal",   hint: "Montaje para 200 personas",      src: "/fotos/salon-dia.jpg" },
  { label: "Ambiente nocturno", hint: "Iluminación cálida de noche",    src: "/fotos/salon-noche.jpg" },
  { label: "Mesa montada",      hint: "Vajilla y mantelería completa",  src: "/fotos/salon-mesa.jpg" },
  { label: "Banquete",          hint: "Comida en tres tiempos",         src: "/fotos/comida-menu.jpg" },
  { label: "Terraza exterior",  hint: "Vista al jardín · foto pendiente" },
  { label: "Sala VIP",          hint: "Eventos íntimos · foto pendiente" },
];

/* Servicios y amenidades, agrupados por tema (tarjetas del CardSwap).
   'icon' mapea a un SVG en el componente Amenities.
   ⚠️ Los valores con "(confirmar)" son placeholders a precisar por el dueño. */
export interface ServiceCard { icon: string; title: string; items: string[]; }
export const SERVICE_CARDS: ServiceCard[] = [
  {
    icon: "users",
    title: "Espacio & entorno",
    items: [
      "Aforo hasta 200 invitados (confirmar)",
      "Clima agradable y ventilado",
      "Entorno natural de bosque",
      "Acceso en planta baja (confirmar)",
    ],
  },
  {
    icon: "chair",
    title: "Mobiliario & montaje",
    items: [
      "Mesas redondas + sillas Tiffany",
      "Mantelería completa",
      "Loza y cristalería completas",
    ],
  },
  {
    icon: "waiter",
    title: "Servicio",
    items: [
      "Meseros durante todo el evento",
      "Estacionamiento con personal",
      "Atención personalizada",
    ],
  },
  {
    icon: "dish",
    title: "Gastronomía",
    items: [
      "Banquete del Chef Román Hernández",
      "Menú en tres tiempos",
      "Degustación previa sin costo",
    ],
  },
];
