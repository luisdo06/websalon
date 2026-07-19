import { C } from "./theme";

/* ════════════════════════════════════════════════════════════════
   CONTENIDO DEL SITIO
   Los datos de aquí son reales. Lo que queda por confirmar o
   completar está listado en CONTENIDO-PENDIENTE.md.
════════════════════════════════════════════════════════════════ */

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

/* Galería de eventos — todas las fotos son reales, en /public/fotos. */
export interface GalleryItem { label: string; hint: string; src?: string; }
export const GALLERY: GalleryItem[] = [
  { label: "Salón principal",   hint: "Montaje para 200 personas",      src: "/fotos/salon-dia.jpg" },
  { label: "Ambiente nocturno", hint: "Iluminación cálida de noche",    src: "/fotos/salon-noche.jpg" },
  { label: "Mesa montada",      hint: "Vajilla y mantelería completa",  src: "/fotos/salon-mesa.jpg" },
  { label: "Banquete",          hint: "Comida en tres tiempos",         src: "/fotos/comida-menu.jpg" },
  { label: "Exterior del salón", hint: "Vista exterior",                src: "/fotos/salon-fuera-1.jpeg" },
  { label: "Exterior del salón", hint: "Vista exterior",                src: "/fotos/salon-fuera-2.jpeg" },
  { label: "Exterior del salón", hint: "Vista exterior",                src: "/fotos/salon-fuera-3.jpeg" },
  { label: "Exterior del salón", hint: "Vista exterior",                src: "/fotos/salon-fuera-4.jpeg" },
  { label: "Exterior del salón", hint: "Vista exterior",                src: "/fotos/salon-fuera-5.jpeg" },
  { label: "Montaje del evento",   hint: "Mesa lista para la celebración", src: "/fotos/IMG_4494.JPG.jpeg" },
  { label: "Mesa montada",         hint: "Detalles en rosa",               src: "/fotos/IMG_4495.JPG.jpeg" },
  { label: "Montaje del evento",   hint: "Montaje elegante",               src: "/fotos/IMG_4496.JPG.jpeg" },
  { label: "Decoración de XV años", hint: "Letras iluminadas",             src: "/fotos/IMG_4497.JPG.jpeg" },
  { label: "Platillo principal",   hint: "Del banquete del Chef Román",    src: "/fotos/IMG_4498.JPG.jpeg" },
  { label: "Pasta del banquete",   hint: "Uno de nuestros tiempos",        src: "/fotos/IMG_4499.JPG.jpeg" },
  { label: "Crema de entrada",     hint: "Primer tiempo del menú",         src: "/fotos/IMG_4500.JPG.jpeg" },
  { label: "Centro de mesa",       hint: "Arreglo floral",                 src: "/fotos/IMG_4501.JPG.jpeg" },
  { label: "Ambiente de fiesta",   hint: "Terraza decorada",               src: "/fotos/IMG_4502.JPG.jpeg" },
  { label: "Pista de baile",       hint: "Salón listo para bailar",        src: "/fotos/IMG_4503.JPG.jpeg" },
  { label: "Salón iluminado",      hint: "Ambiente nocturno",              src: "/fotos/IMG_4504.JPG.jpeg" },
  { label: "Montaje con globos",   hint: "Salón listo para una celebración", src: "/fotos/salon-evento-globos.jpg" },
];

/* Servicios y amenidades, agrupados por tema (tarjetas del CardSwap).
   'icon' mapea a un SVG en el componente Amenities.
   ⚠️ El aforo de 200 sigue sin confirmar (ver CONTENIDO-PENDIENTE.md). */
export interface ServiceCard { icon: string; title: string; items: string[]; }
export const SERVICE_CARDS: ServiceCard[] = [
  {
    icon: "users",
    title: "Espacio & entorno",
    items: [
      "Aforo hasta 200 invitados",
      "Clima agradable y ventilado",
      "Entorno natural de bosque",
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
      "Degustación sin costo al apartar tu fecha",
    ],
  },
];
