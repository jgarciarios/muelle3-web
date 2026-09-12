"use server";

import { createClient } from "@/lib/supabase/server";

export type ReservationFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"nombre" | "telefono" | "fecha" | "hora" | "personas", string>>;
};

const PHONE_RE = /^[0-9+()\s-]{6,20}$/;

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

  try {
    const supabase = createClient();
    const { error } = await supabase.from("reservations").insert({
      nombre,
      telefono,
      email: email || null,
      fecha,
      hora,
      personas,
      notas: notas || null,
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
