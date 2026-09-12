import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Arquitectura multi-tenant de JG Ventures: un solo proyecto Supabase
 * (`jg-ventures-db`) sirve a todos los sitios de clientes. Cada tabla de
 * negocio (reservas, etc.) tiene una columna `restaurante_id` que la separa
 * por cliente, más RLS scoped por tenant.
 *
 * Este sitio SOLO administra reservas para su propio restaurante. El slug
 * que lo identifica sale de una env var (`RESTAURANT_SLUG`), NUNCA de un
 * valor que mande el usuario final — así un formulario nunca puede escribir
 * (ni por error, ni con intención) datos de otro restaurante.
 *
 * El lookup usa el cliente admin (service_role) porque `restaurantes` no
 * tiene (ni necesita) una policy de RLS que le dé select a `anon` — este
 * lookup es enteramente server-side y de solo confianza en RESTAURANT_SLUG,
 * nunca en input del usuario final.
 */

let cachedRestauranteId: string | null = null;

export async function getRestauranteId(): Promise<string> {
  if (cachedRestauranteId) return cachedRestauranteId;

  const slug = process.env.RESTAURANT_SLUG;
  if (!slug) {
    throw new Error(
      "Falta la variable de entorno RESTAURANT_SLUG (ej: 'muelle-3'). Cada sitio de cliente debe definirla."
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("restaurantes")
    .select("id")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    throw new Error(
      `No se encontró un restaurante con slug "${slug}" en la tabla restaurantes.`
    );
  }

  cachedRestauranteId = data.id as string;
  return cachedRestauranteId;
}
