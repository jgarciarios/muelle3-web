-- Tabla para las solicitudes de cotización de eventos (formulario público
-- de /eventos). Misma arquitectura multi-tenant y mismo criterio de
-- seguridad que `reservas` (ver 0002_reservas_contacto_y_alta_publica.sql):
-- correr en el SQL Editor de jg-ventures-db.

create table if not exists public.eventos_consultas (
  id uuid primary key default gen_random_uuid(),
  restaurante_id uuid not null references public.restaurantes(id),
  nombre text not null,
  email text not null,
  telefono text,
  tipo_evento text not null,
  fecha_aproximada date,
  cantidad_personas int,
  mensaje text,
  estado text not null default 'pendiente',
  created_at timestamptz not null default now()
);

alter table public.eventos_consultas enable row level security;

-- NO se agrega ninguna policy de RLS para "anon" en esta tabla (ni select
-- ni insert) — misma decisión deliberada que en `reservas`:
--
-- La anon key de Supabase es pública y es la MISMA para todos los tenants
-- de este proyecto multi-tenant. Si "anon" pudiera insertar acá, cualquiera
-- con esa clave podría crear consultas de eventos para CUALQUIER
-- restaurante pegándole directo a la API REST de Supabase, sin pasar por
-- ningún sitio.
--
-- El único camino de escritura es el Server Action de cada sitio
-- (src/app/eventos/actions.ts), que usa el cliente con `service_role key`
-- después de resolver `restaurante_id` desde RESTAURANT_SLUG (env var fija
-- por deploy, ver src/lib/supabase/tenant.ts) — nunca desde el usuario.
--
-- La lectura (para un futuro panel de administrador) queda para más
-- adelante, con una policy scoped a `usuario_restaurante` igual que
-- `reservas` en 0001_multi_tenant_core.sql — no se agrega ahora porque no
-- hay panel todavía.
