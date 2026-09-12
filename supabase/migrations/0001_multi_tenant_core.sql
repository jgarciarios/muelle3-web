-- Arquitectura multi-tenant de JG Ventures: un solo proyecto Supabase
-- (jg-ventures-db) sirve a todos los clientes de la agencia, separados por
-- restaurante_id + RLS por tenant. Muelle 3 es el primer restaurante.
--
-- NOTA: este archivo documenta el schema tal como fue creado a mano en el
-- SQL Editor del dashboard de Supabase (organización jg-ventures). Se deja
-- versionado acá para referencia y para futuras migraciones, no para
-- correrlo de nuevo sobre jg-ventures-db.

create table if not exists public.restaurantes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre text not null,
  plan text,
  created_at timestamptz not null default now()
);

create table if not exists public.usuario_restaurante (
  usuario_id uuid not null references auth.users (id) on delete cascade,
  restaurante_id uuid not null references public.restaurantes (id) on delete cascade,
  rol text not null default 'admin',
  primary key (usuario_id, restaurante_id)
);

create table if not exists public.reservas (
  id uuid primary key default gen_random_uuid(),
  restaurante_id uuid not null references public.restaurantes (id) on delete cascade,
  nombre_cliente text not null,
  telefono text not null,
  fecha timestamptz not null,
  personas int not null check (personas > 0 and personas <= 30),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'confirmada', 'cancelada')),
  created_at timestamptz not null default now()
);

alter table public.restaurantes enable row level security;
alter table public.usuario_restaurante enable row level security;
alter table public.reservas enable row level security;

-- Un usuario autenticado solo ve los restaurantes que administra.
create policy "Ver solo los restaurantes que administro"
  on public.restaurantes
  for select
  to authenticated
  using (
    id in (
      select restaurante_id from public.usuario_restaurante
      where usuario_id = auth.uid()
    )
  );

-- Un usuario autenticado solo puede leer/escribir reservas de los
-- restaurantes que administra (futuro panel de administrador).
create policy "Leer y escribir reservas del restaurante que administro"
  on public.reservas
  for all
  to authenticated
  using (
    restaurante_id in (
      select restaurante_id from public.usuario_restaurante
      where usuario_id = auth.uid()
    )
  )
  with check (
    restaurante_id in (
      select restaurante_id from public.usuario_restaurante
      where usuario_id = auth.uid()
    )
  );

-- Registro inicial: Muelle 3.
insert into public.restaurantes (slug, nombre)
values ('muelle-3', 'Muelle 3 — Kitchen & Bar')
on conflict (slug) do nothing;
