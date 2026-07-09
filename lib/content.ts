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

/* Amenidades. 'icon' mapea a un SVG en el componente Amenities.
   ⚠️ Los valores con "(confirmar)" son placeholders a precisar por el dueño. */
export interface Amenity { icon: string; label: string; note: string; }
export const AMENITIES: Amenity[] = [
  { icon: "users",   label: "Aforo amplio",       note: "Hasta 200 invitados (confirmar)" },
  { icon: "parking", label: "Estacionamiento",    note: "Con personal cuidando autos" },
  { icon: "climate", label: "Clima agradable",    note: "Espacio ventilado / A. A. (confirmar)" },
  { icon: "access",  label: "Accesibilidad",      note: "Acceso a planta baja (confirmar)" },
  { icon: "chair",   label: "Mobiliario incluido", note: "Mesas redondas + sillas Tiffany" },
  { icon: "waiter",  label: "Meseros",            note: "Servicio durante todo el evento" },
  { icon: "dish",    label: "Banquete propio",    note: "Cocina del Chef Román Hernández" },
  { icon: "leaf",    label: "Entorno de bosque",  note: "Ambiente natural y tranquilo" },
];

/* Preguntas frecuentes. ⚠️ Las respuestas con "(definir)" son políticas a confirmar por el dueño. */
export interface FaqItem { q: string; a: string; }
export const FAQ: FaqItem[] = [
  { q: "¿Cómo aparto mi fecha?", a: "Llena el formulario de reserva y te contactamos por WhatsApp en menos de 1 hora para confirmar disponibilidad y los siguientes pasos." },
  { q: "¿Cuánto es el anticipo?", a: "Se requiere un anticipo para apartar la fecha. (Definir % y monto)." },
  { q: "¿Cuál es la política de cancelación?", a: "(Definir política de cancelación y reembolso)." },
  { q: "¿Qué incluye cada paquete?", a: "El Paquete Completo incluye banquete, mobiliario, meseros y más; el Sencillo incluye mobiliario completo sin comida. Revisa el detalle en la sección Paquetes." },
  { q: "¿Puedo llevar mi propio banquete o proveedores?", a: "Sí, con el Paquete Sencillo puedes traer tu catering. (Confirmar reglas para proveedores externos)." },
  { q: "¿Cuál es el horario del evento?", a: "La renta es de 8 horas. Lunes a viernes 9:00–19:00 y sábados 9:00–17:00; domingos cerrado." },
  { q: "¿Hay degustación antes del evento?", a: "Sí. Al agendar tu primera visita puedes incluir una degustación sin costo con el chef." },
];
