-- Bug encontrado corriendo el test de aislamiento (supabase/tests/tenant-isolation.mjs)
-- contra jg-ventures-db, ANTES de que existiera esta migración:
--
-- `usuario_restaurante` tenía RLS habilitado pero CERO policies. Eso no solo
-- bloqueaba a extraños (correcto) — bloqueaba a CUALQUIER usuario autenticado
-- de leer su propia fila de mapeo, incluido su dueño legítimo. Como la policy
-- de `reservas`/`restaurantes` depende de un subquery contra
-- `usuario_restaurante` (`... where usuario_id = auth.uid()`), y ese subquery
-- corre con los privilegios del que pregunta (no del dueño de la policy), sin
-- esta policy el subquery siempre devolvía 0 filas — para todo el mundo. En
-- la práctica, el futuro panel de administrador iba a estar roto para
-- cualquier admin real, no solo aislado entre tenants.
--
-- Ya aplicada a mano en jg-ventures-db el 2026-09-12, tras confirmarse el bug
-- con el test. Se deja acá versionada para referencia.

create policy "Un usuario ve su propia fila de usuario_restaurante"
  on public.usuario_restaurante
  for select
  to authenticated
  using (usuario_id = auth.uid());

-- Insert/update/delete de esta tabla siguen sin ninguna policy para
-- "authenticated" (a propósito): asignar qué usuario administra qué
-- restaurante es una operación de gestión de la agencia, no algo que un
-- usuario final deba poder hacer sobre sí mismo. Eso se gestiona con
-- `service_role` desde una herramienta interna, cuando exista.
