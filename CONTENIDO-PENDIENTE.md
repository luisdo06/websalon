# Contenido pendiente de reemplazar

El sitio contiene datos de ejemplo (placeholder) heredados de una plantilla. Antes de publicar,
reemplázalos con información real del salón. Aquí está la lista completa con su ubicación.

## 1. Testimonios — `lib/content.ts` → `TESTIMONIALS`
⚠️ Son ficticios **y además hablan de una peluquería** ("corte", "color"). Reemplazar por reseñas
reales de clientes (nombre, año/relación, texto).

## 2. Estadísticas — `lib/content.ts` → `STATS`
- "Años": **25** — correcto (desde 1999).
- "Clientes": **2000+** — confirmar cifra real.
- "Premios": **15** — confirmar o eliminar si no aplica.
- "Satisfacción": **98%** — confirmar o eliminar.

## 3. Equipo culinario — `app/page.tsx`, sección "El alma de nuestra cocina"
- Chef **Román Hernández** (40 años de experiencia en La Finca de Adobe) — ✅ dato real.
- Foto del chef (sigue como placeholder, pendiente de imagen real).

## 4. Fotos placeholder — `app/page.tsx`
Slots que hoy muestran un marcador en vez de foto real:
- Nosotros / Espacios: **Salón principal**, **Terraza exterior**, **Sala VIP**.
- Equipo culinario: **Chef Andrés Morales**, **Equipo de cocina**, **Preparación**.
- **Foto grupal del equipo completo** (panorámica).
- Ubicación: **Vista exterior / aérea del salón** (panel izquierdo de la sección).

Fotos ya reales (en `public/fotos/`): `salon-noche.jpg`, `salon-dia.jpg`, `salon-mesa.jpg`,
`comida-menu.jpg`.

## 5. Datos de contacto y ubicación — `lib/site.ts` y `app/page.tsx`
- Dirección exacta: hoy solo dice "Toluca, Estado de México". Añadir calle y número.
- Coordenadas (`SITE.geo`) y el `iframe` del mapa: verificar que apuntan a la ubicación real.
- Dominio (`SITE.url`): cambiar `https://salondelbosque.com` por el dominio definitivo
  (afecta metadata, Open Graph, sitemap y robots).
- Horarios en el JSON-LD (`app/layout.tsx`) y en la sección Ubicación: confirmar.

## 6. Imagen para compartir (Open Graph)
Hoy se usa `public/fotos/salon-noche.jpg`. Idealmente una imagen 1200×630 px diseñada para
redes (con logo/nombre).
