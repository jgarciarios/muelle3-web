"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getRestauranteId } from "@/lib/supabase/tenant";

export type ReservationFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"nombre" | "telefono" | "fecha" | "hora" | "personas", string>>;
};

const PHONE_RE = /^[0-9+()\s-]{6,20}$/;

// Punta del Este / Montevideo no tiene horario de verano vigente: offset fijo -03:00.
const TIMEZONE_OFFSET = "-03:00";

export async function createReservation(
  _prevState: ReservationFormState,
  formData: FormData
): Promise<ReservationFormState> {
  const nombre = String(formData.get("nombre") || "").trim();
  const telefono = String(formData.get("telefono") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const fecha = String(formData.get("fecha") || "").trim();
  const hora = String(formData.get("hora") || "").trim();
  const personas = Number(formData.get("personas") || 0);
  const notas = String(formData.get("notas") || "").trim();

  const fieldErrors: ReservationFormState["fieldErrors"] = {};
  if (!nombre) fieldErrors.nombre = "Contanos tu nombre.";
  if (!telefono || !PHONE_RE.test(telefono)) fieldErrors.telefono = "Ingresá un teléfono válido.";
  if (!fecha) fieldErrors.fecha = "Elegí una fecha.";
  if (!hora) fieldErrors.hora = "Elegí un horario.";
  if (!personas || personas < 1 || personas > 30) fieldErrors.personas = "Cantidad de personas inválida.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Revisá los datos marcados.", fieldErrors };
  }

  // `reservas.fecha` es timestamptz: combinamos fecha + hora del form en un
  // único instante, con el offset fijo de Uruguay (el form no pide huso horario).
  const fechaHora = `${fecha}T${hora}:00${TIMEZONE_OFFSET}`;

  try {
    // El restaurante lo define el deploy (RESTAURANT_SLUG), nunca el formulario:
    // así este sitio solo puede escribir reservas de su propio tenant.
    //
    // Usamos el cliente admin (service_role) para el insert, no la anon key:
    // la anon key es pública (visible en el bundle) y es la MISMA para todos
    // los tenants del proyecto multi-tenant, así que darle permiso de insert
    // vía RLS habilitaría a cualquiera a escribir reservas de OTRO restaurante
    // pegándole directo a la API REST de Supabase. Con service_role (que
    // bypassea RLS) el único camino de escritura es este Server Action, que
    // ya garantiza el restaurante_id correcto — por eso `reservas` no tiene
    // ninguna policy de insert para anon (ver supabase/migrations/0002_*).
    const restauranteId = await getRestauranteId();
    const supabase = createAdminClient();

    const { error } = await supabase.from("reservas").insert({
      restaurante_id: restauranteId,
      nombre_cliente: nombre,
      telefono,
      email: email || null,
      fecha: fechaHora,
      personas,
      notas: notas || null,
      estado: "pendiente",
    });

    if (error) {
      console.error("Error al guardar la reserva:", error);
      return {
        status: "error",
        message: "No pudimos guardar tu reserva. Probá de nuevo en unos minutos.",
      };
    }

    return {
      status: "success",
      message: "¡Reserva recibida! Te confirmamos por teléfono o email a la brevedad.",
    };
  } catch (err) {
    console.error("Error inesperado al reservar:", err);
    return {
      status: "error",
      message: "Hubo un problema técnico. Escribinos por WhatsApp mientras lo resolvemos.",
    };
  }
}
