-- Suma campos de contacto opcionales al formulario público de reservas.
--
-- Correr en el SQL Editor de jg-ventures-db.

alter table public.reservas
  add column if not exists email text,
  add column if not exists notas text;

-- NO se agrega ninguna policy de RLS para "anon" en esta tabla (ni select
-- ni insert). Decisión deliberada, no un olvido:
--
-- La anon key de Supabase es pública (se puede sacar del bundle de JS de
-- cualquiera de los sitios) y es la MISMA para todos los tenants de este
-- proyecto multi-tenant. Si "anon" pudiera hacer insert en `reservas` (aunque
-- la policy exigiera "el restaurante tiene que existir"), cualquiera con esa
-- clave podría escribir reservas para CUALQUIER restaurante pegándole directo
-- a la API REST de Supabase, sin pasar por ningún sitio — exactamente la fuga
-- entre tenants que la arquitectura multi-tenant tiene que evitar.
--
-- En cambio, el único camino de escritura pública es el Server Action de
-- cada sitio (src/app/reservas/actions.ts), que usa el cliente con
-- `service_role key` (bypassea RLS, nunca sale del server) después de
-- resolver `restaurante_id` desde una env var fija por deploy
-- (RESTAURANT_SLUG, ver src/lib/supabase/tenant.ts) — nunca desde el usuario.
-- Sin policy de insert para anon, esa vía queda cerrada por RLS por default.
--
-- Sin RLS para anon en `restaurantes` tampoco: el lookup de restaurante_id
-- por slug también corre server-side con service_role (ver tenant.ts).
--
-- Nadie puede leer, editar ni borrar reservas con la clave pública. Eso
-- queda para el futuro panel de administrador (policy "authenticated" de
-- 0001_multi_tenant_core.sql) o para el backend con service role key.
--
-- Verificado con supabase/tests/tenant-isolation.mjs.
