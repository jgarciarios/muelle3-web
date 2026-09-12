import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase con la `service_role key` — bypassea RLS por completo.
 *
 * SOLO para usar dentro de Server Actions / código que corre en el server
 * (nunca en un Client Component ni en nada que termine en el bundle del
 * navegador). El import "server-only" de arriba hace que el build de
 * Next.js falle si este archivo se importa, aunque sea indirectamente,
 * desde código de cliente — es una red de seguridad, no reemplaza la
 * disciplina de no importarlo mal.
 *
 * Se usa para: (1) resolver restaurante_id a partir de RESTAURANT_SLUG
 * (tenant.ts) y (2) insertar la reserva (reservas/actions.ts). Ambos casos
 * son server-only por diseño — el sitio nunca hace estas operaciones desde
 * el cliente — así que no hace falta (ni conviene) que `anon` tenga permiso
 * de select/insert en `restaurantes`/`reservas` vía RLS.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan las variables de entorno NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
