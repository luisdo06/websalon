# Contenido pendiente de reemplazar

Lista de datos placeholder o sin confirmar que siguen en el sitio, con su ubicación exacta.
Revisada el 2026-07-18.

## 1. Fotos

- **Equipo culinario** (`app/page.tsx` → `CULINARIA_FOTOS`): hay **3 huecos** marcados con
  `{ placeholder: true }`. Se ven como recuadros vacíos en el bento. Ideas: retrato del
  Chef Román Hernández, equipo de cocina trabajando, foto grupal del equipo.
- **Imagen para redes (Open Graph)**: hoy se reusa `salon-noche.jpg` (`app/layout.tsx`).
  Idealmente una imagen dedicada de 1200×630 px con logo/nombre.

La galería (`lib/content.ts` → `GALLERY`, 20 fotos) y las fotos de "Nuestra historia" y
"Ubicación" ya son todas reales — no falta nada ahí.

## 2. Aforo — `lib/site.ts` → `SITE.capacity`

Dice **200** y ese número se muestra en tres lugares: el límite del formulario de reserva,
la tarjeta "Espacio & entorno" (`lib/content.ts` → `SERVICE_CARDS`) y el JSON-LD.
Confirmar que el aforo real es ése.

## 3. Dirección — `lib/site.ts` y `app/layout.tsx`

- **Dirección exacta**: hoy solo se dice "Toluca, Estado de México". Falta calle y número.
  Al tenerla, agregar también `streetAddress` al `PostalAddress` del JSON-LD
  (`app/layout.tsx`), que hoy solo lleva ciudad/estado/país.
- **Coordenadas** (`SITE.geo`) y el `iframe` del mapa en la sección Ubicación: verificar que
  apuntan al lugar correcto.

## 4. Horarios de atención — `app/layout.tsx` → `openingHoursSpecification`

Hoy declara lunes a viernes 9:00–19:00 y sábado 9:00–17:00, sin domingo. Confirmar que son
los horarios reales de atención a clientes (no los del evento).

## 5. Dominio — `lib/site.ts` → `SITE.url`

Apunta a `https://websalon.vercel.app`. Cambiarlo si se conecta un dominio propio.

## 6. Mantenimiento anual — `lib/content.ts` → `STATS`

El stat de años está en **15** (el salón abrió en 2011). Hay que subirlo cada año, junto con
el título de la sección "Nuestra historia" en `app/page.tsx`.

---

## Resuelto

- ~~Estadísticas de "2000+ clientes" y "98% satisfacción"~~ — eran cifras inventadas, se quitaron.
- ~~Años de operación inconsistentes~~ — el título decía "20 años", el párrafo "desde 2011" y el
  stat 20 (desde 2005). Unificado a 2011 → 15 años.
- ~~Instagram~~ — el salón no tiene cuenta. `SITE.social.instagram` queda vacío a propósito y el
  ícono no se muestra. Facebook sí está puesto.
- ~~Fotos de galería (Terraza / Sala VIP)~~ — reemplazadas por fotos reales.

## Ideas, no pendientes

- **Preguntas frecuentes**: el sitio **no tiene** sección de FAQ. Si se quiere agregar, los temas
  que faltarían definir son el anticipo para apartar fecha, la política de cancelación/reembolso
  y las reglas para proveedores externos (catering, música).
