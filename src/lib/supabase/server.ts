import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client. Uses the publishable (anon) key — safe for
 * inserts guarded by row-level security policies (see supabase/migrations).
 * Do not use the service role key here.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan las variables de entorno NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    );
  }

  return createSupabaseClient(url, key);
}
