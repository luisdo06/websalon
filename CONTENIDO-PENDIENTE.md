# Contenido pendiente de reemplazar

El sitio tiene datos de ejemplo (placeholder) marcados en el código. Antes de promocionarlo fuerte,
reemplázalos con información real. Aquí está la lista con su ubicación exacta.

## 1. Fotos reales
Sube las imágenes a `public/fotos/` y actualiza las rutas donde corresponda.
- **Galería de eventos** (`lib/content.ts` → `GALLERY`): faltan **Terraza exterior** y **Sala VIP**
  (hoy son marcadores). Las otras 4 ya usan fotos reales.
- **Equipo culinario** (`app/page.tsx`, sección Nosotros): **Chef Román Hernández** (retrato),
  **Equipo de cocina**, **Preparación**, y la **foto grupal** del equipo.
- **Ubicación**: **vista exterior / aérea del salón** (panel izquierdo de esa sección).
- **Imagen para redes (Open Graph)**: hoy se usa `salon-noche.jpg`; idealmente una 1200×630 px con
  logo/nombre.

## 2. Estadísticas — `lib/content.ts` → `STATS`
- "Años": **20** — ✅ (desde 2005).
- "Clientes": **2000+** — confirmar cifra real.
- "Satisfacción": **98%** — confirmar o quitar.

## 3. Amenidades — `lib/content.ts` → `AMENITIES`
Confirmar/precisar los que dicen "(confirmar)": **aforo exacto**, si hay **aire acondicionado**,
y el nivel de **accesibilidad** (rampas, baño accesible, etc.).

## 4. Preguntas frecuentes — `lib/content.ts` → `FAQ`
Definir las respuestas marcadas con "(definir)":
- **Anticipo**: porcentaje y monto para apartar la fecha.
- **Política de cancelación** y reembolso.
- Reglas para **proveedores externos** (catering, música).

## 5. Redes sociales — `lib/site.ts` → `SITE.social`
Pegar las URLs reales de **Instagram** y **Facebook** (hoy están vacías, por eso no se muestran los
íconos en navbar/footer). Al completarlas aparecen solas y se añaden al SEO (`sameAs`).

## 6. Datos de contacto y ubicación — `lib/site.ts` y `app/page.tsx`
- **Dirección exacta**: hoy solo dice "Toluca, Estado de México"; añadir calle y número.
- **Coordenadas** (`SITE.geo`) y el `iframe` del mapa: verificar que apuntan al lugar real.
- **Horarios** (JSON-LD en `app/layout.tsx` y sección Ubicación): confirmar.
- **Dominio**: `SITE.url` ya apunta a `https://websalon.vercel.app`; cambiarlo si conectas un
  dominio propio.
