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
