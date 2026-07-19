# Salón del Bosque

Sitio web del **Salón del Bosque**, salón de eventos en Toluca. Next.js 16 (App Router) +
React 19 + Tailwind 4 + Supabase. Una sola página con hero, secciones (Nosotros, Ubicación,
Cotizaciones, Reserva), formulario de reserva que termina en WhatsApp, calendario de fechas
ocupadas y un panel `/admin` para bloquear fechas.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # rellena con tus credenciales de Supabase
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Variables de entorno (`.env.local`)

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase (Settings → API). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública `anon` del proyecto. |

`.env.local` está en `.gitignore`; nunca lo subas al repositorio.

## Supabase

### Tabla `blocked_dates`

```sql
create table public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  reason text,
  created_at timestamptz default now()
);
```

### Row Level Security (IMPORTANTE)

El sitio usa la clave `anon` desde el navegador. Para que **cualquiera no pueda** crear o borrar
fechas, activa RLS y deja la escritura solo para usuarios autenticados:

```sql
alter table public.blocked_dates enable row level security;

-- Lectura pública (el calendario del formulario la necesita)
create policy "blocked_dates lectura pública"
  on public.blocked_dates for select
  to anon, authenticated using (true);

-- Escritura solo para administradores autenticados
create policy "blocked_dates escritura admin"
  on public.blocked_dates for all
  to authenticated using (true) with check (true);
```

### Tabla `citas`

Guarda las solicitudes de **primera visita** que llegan del formulario. Columnas: `nombre`,
`telefono`, `evento`, `personas`, `paquete`, `fecha_evento`, `fecha_visita`, `hora_visita`,
`degustacion`, `estado` (`pendiente` | `aceptada` | `borrada`) y `deleted_at`. El tipo
TypeScript está en `lib/supabase.ts`.

Sus políticas RLS se crearon directamente en el panel de Supabase y no están versionadas aquí.
Este es el comportamiento **verificado** con la clave `anon` desde el navegador:

| Operación | `anon` | Por qué |
| --- | --- | --- |
| `SELECT` | ❌ bloqueado | Los nombres y teléfonos de los clientes no son públicos. |
| `INSERT` | ✅ permitido | El formulario público lo necesita. Tiene un `with check` que exige los campos completos. |
| `UPDATE` | ❌ bloqueado | Solo el panel `/admin`, ya autenticado. |
| `DELETE` | ❌ bloqueado | Solo el panel `/admin`, ya autenticado. |

> Al comprobarlo, ten en cuenta que un `DELETE` bloqueado por RLS devuelve **204** igual que uno
> exitoso: solo cambia el número de filas afectadas. Usa `Prefer: return=representation` para
> distinguirlos, o concluirás que se borró algo que sigue ahí.

### Límite de solicitudes (`supabase/01-limite-citas.sql`)

Como `anon` puede insertar, cualquiera podría llenar el panel de solicitudes falsas con un script,
sin pasar por el sitio. Un trigger limita a **una solicitud cada 14 días por teléfono**
(comparando solo los dígitos, para que un espacio de más no lo esquive). Las citas en estado
`borrada` no cuentan, así que si rechazas una solicitud esa persona puede volver a pedir enseguida.

Aplícalo en **Supabase → SQL Editor** pegando el contenido de
[`supabase/01-limite-citas.sql`](./supabase/01-limite-citas.sql). Es idempotente.

### Usuario administrador

El panel `/admin` usa **Supabase Auth** (correo + contraseña), no una contraseña en el código.
Crea el usuario en el panel de Supabase: **Authentication → Users → Add user** (email + password).
Inicia sesión en `/admin` con esas credenciales.

## Estructura

- `app/page.tsx` — página principal (componentes de UI y secciones).
- `app/admin/page.tsx` — panel de administración de fechas.
- `app/layout.tsx` — metadata, Open Graph y JSON-LD (`EventVenue`).
- `app/sitemap.ts`, `app/robots.ts`, `app/icon.svg` — SEO.
- `lib/theme.ts` — paleta de color (fuente única).
- `lib/site.ts` — datos del negocio y teléfono.
- `lib/content.ts` — textos, paquetes, testimonios y stats.
- `lib/supabase.ts` — cliente de Supabase.

## Contenido pendiente

Hay datos de ejemplo (testimonios, chef, premios, fotos) que deben reemplazarse con información
real. Ver [`CONTENIDO-PENDIENTE.md`](./CONTENIDO-PENDIENTE.md).
