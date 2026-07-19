-- ════════════════════════════════════════════════════════════════════════════
-- Límite: una solicitud de cita cada 14 días por número de teléfono
-- ════════════════════════════════════════════════════════════════════════════
--
-- Contexto: la tabla `citas` acepta INSERT de la clave `anon` (el formulario
-- público lo necesita). Sin límite, cualquiera puede llenar el panel de
-- solicitudes falsas con un script, sin pasar siquiera por el sitio.
--
-- Por qué un TRIGGER y no una política RLS: una política `with check` que
-- consultara `citas` correría esa subconsulta con los permisos de `anon`, que
-- NO puede hacer SELECT sobre la tabla. Siempre vería cero filas y el límite
-- nunca se aplicaría. Una función `security definer` sí lee todas las filas.
--
-- Cómo aplicarlo: Supabase → SQL Editor → pegar y ejecutar.
-- Es idempotente: se puede volver a ejecutar sin romper nada.

-- ── 1. Índice para que la comprobación sea barata ──────────────────────────
-- Indexa el teléfono normalizado a dígitos, que es como compara el trigger.
create index if not exists citas_telefono_digitos_idx
  on public.citas ((regexp_replace(telefono, '\D', '', 'g')), created_at desc);

-- ── 2. La función que decide ───────────────────────────────────────────────
create or replace function public.citas_limite_quincenal()
returns trigger
language plpgsql
security definer            -- imprescindible: debe ver filas que `anon` no puede leer
set search_path = public    -- evita secuestro del search_path en funciones definer
as $$
begin
  if exists (
    select 1
    from public.citas
    where
      -- Comparar solo dígitos: si no, "722 123 4567" y "7221234567" se
      -- tomarían como personas distintas y el límite se saltaría con un espacio.
      regexp_replace(telefono, '\D', '', 'g')
        = regexp_replace(new.telefono, '\D', '', 'g')
      -- Las rechazadas/borradas no cuentan: si la dueña rechaza una solicitud
      -- por un detalle corregible, esa persona puede volver a pedir enseguida.
      and estado <> 'borrada'
      and created_at > now() - interval '14 days'
  ) then
    raise exception 'LIMITE_QUINCENAL'
      using
        errcode = 'P0001',
        hint    = 'Ya existe una solicitud de este teléfono en los últimos 14 días.';
  end if;

  return new;
end;
$$;

-- ── 3. El trigger ──────────────────────────────────────────────────────────
drop trigger if exists citas_limite_quincenal on public.citas;

create trigger citas_limite_quincenal
  before insert on public.citas
  for each row
  execute function public.citas_limite_quincenal();

-- ════════════════════════════════════════════════════════════════════════════
-- Comprobación
-- ════════════════════════════════════════════════════════════════════════════
-- El primer INSERT pasa; el segundo con el mismo teléfono falla con
-- 'LIMITE_QUINCENAL'. Ejecuta el bloque y luego borra la fila de prueba.
--
--   insert into public.citas (nombre, telefono, evento, personas, paquete,
--                             fecha_evento, fecha_visita, hora_visita,
--                             degustacion, estado)
--   values ('PRUEBA LIMITE', '7220000000', 'Boda', 10, 'Paquete Completo',
--           '2027-01-01', '2026-12-01', '10:00', false, 'pendiente');
--
--   -- este debe fallar:
--   insert into public.citas (nombre, telefono, evento, personas, paquete,
--                             fecha_evento, fecha_visita, hora_visita,
--                             degustacion, estado)
--   values ('PRUEBA LIMITE 2', '722 000 0000', 'Boda', 10, 'Paquete Completo',
--           '2027-01-01', '2026-12-01', '10:00', false, 'pendiente');
--
--   delete from public.citas where nombre like 'PRUEBA LIMITE%';
--
-- ── Para revertir ─────────────────────────────────────────────────────────
--   drop trigger if exists citas_limite_quincenal on public.citas;
--   drop function if exists public.citas_limite_quincenal();
--   drop index if exists citas_telefono_digitos_idx;
