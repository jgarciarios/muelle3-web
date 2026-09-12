-- Tabla de reservas para el sitio de Muelle 3 (v1: sin integración a Meitre todavía)
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null,
  telefono text not null,
  email text,
  fecha date not null,
  hora time not null,
  personas int not null check (personas > 0 and personas <= 30),
  notas text,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'confirmada', 'cancelada'))
);

alter table public.reservations enable row level security;

-- Cualquier visitante del sitio puede crear una reserva (insert-only).
create policy "Cualquiera puede crear una reserva"
  on public.reservations
  for insert
  to anon
  with check (true);

-- Nadie puede leer, editar ni borrar reservas con la clave pública.
-- Para el futuro panel de administrador se usará la service role key desde el backend.
