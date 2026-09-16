"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getRestauranteId } from "@/lib/supabase/tenant";

export type EventQuoteFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<
    Record<"nombre" | "email" | "tipoEvento" | "cantidadPersonas", string>
  >;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TIPOS_EVENTO = [
  "cumpleanos",
  "corporativo",
  "casamiento",
  "privado",
  "otro",
] as const;

/**
 * Manda el aviso por mail de una nueva consulta de evento vía Resend, si
 * están cargadas las env vars necesarias (RESEND_API_KEY y
 * EVENTOS_NOTIFICATION_EMAIL). Si no están (todavía no se definieron),
 * no rompe el flujo: la consulta ya quedó guardada en la base, así que no
 * se pierde — solo no se manda el aviso por mail hasta que se carguen esas
 * dos variables. Se loguea para que quede visible en los logs de Vercel.
 */
async function sendNotificationEmail(data: {
  nombre: string;
  email: string;
  telefono: string;
  tipoEvento: string;
  fechaAproximada: string;
  cantidadPersonas: number;
  mensaje: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.EVENTOS_NOTIFICATION_EMAIL;

  if (!apiKey || !toEmail) {
    console.warn(
      "[eventos] Consulta guardada, pero no se mandó el aviso por mail: " +
        "falta RESEND_API_KEY y/o EVENTOS_NOTIFICATION_EMAIL en las env vars."
    );
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Dominio de envío por defecto de Resend, válido sin verificar
        // dominio propio. Se puede cambiar a un remitente @muelle3... el
        // día que se verifique el dominio en Resend.
        from: "Muelle 3 — Eventos <onboarding@resend.dev>",
        to: [toEmail],
        reply_to: data.email,
        subject: `Nueva consulta de evento — ${data.nombre}`,
        text: [
          `Nombre: ${data.nombre}`,
          `Email: ${data.email}`,
          `Teléfono: ${data.telefono || "(no informado)"}`,
          `Tipo de evento: ${data.tipoEvento}`,
          `Fecha aproximada: ${data.fechaAproximada || "(no informada)"}`,
          `Cantidad de personas: ${data.cantidadPersonas || "(no informada)"}`,
          "",
          "Mensaje:",
          data.mensaje || "(sin mensaje adicional)",
        ].join("\n"),
      }),
    });

    if (!res.ok) {
      console.error("[eventos] Resend respondió con error:", await res.text());
    }
  } catch (err) {
    console.error("[eventos] Error de red mandando el aviso por mail:", err);
  }
}

export async function createEventQuote(
  _prevState: EventQuoteFormState,
  formData: FormData
): Promise<EventQuoteFormState> {
  const nombre = String(formData.get("nombre") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const telefono = String(formData.get("telefono") || "").trim();
  const tipoEvento = String(formData.get("tipoEvento") || "").trim();
  const fechaAproximada = String(formData.get("fechaAproximada") || "").trim();
  const cantidadPersonas = Number(formData.get("cantidadPersonas") || 0);
  const mensaje = String(formData.get("mensaje") || "").trim();

  const fieldErrors: EventQuoteFormState["fieldErrors"] = {};
  if (!nombre) fieldErrors.nombre = "Contanos tu nombre.";
  if (!email || !EMAIL_RE.test(email)) fieldErrors.email = "Ingresá un email válido.";
  if (!tipoEvento || !TIPOS_EVENTO.includes(tipoEvento as typeof TIPOS_EVENTO[number])) {
    fieldErrors.tipoEvento = "Elegí el tipo de evento.";
  }
  if (cantidadPersonas && (cantidadPersonas < 1 || cantidadPersonas > 500)) {
    fieldErrors.cantidadPersonas = "Cantidad de personas inválida.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Revisá los datos marcados.", fieldErrors };
  }

  try {
    // Mismo patrón de seguridad que reservas: el restaurante lo define el
    // deploy (RESTAURANT_SLUG), nunca el formulario, y el insert corre con
    // el cliente admin (service_role) — ver src/lib/supabase/tenant.ts y
    // supabase/migrations/0004_eventos_consultas.sql para el porqué.
    const restauranteId = await getRestauranteId();
    const supabase = createAdminClient();

    const { error } = await supabase.from("eventos_consultas").insert({
      restaurante_id: restauranteId,
      nombre,
      email,
      telefono: telefono || null,
      tipo_evento: tipoEvento,
      fecha_aproximada: fechaAproximada || null,
      cantidad_personas: cantidadPersonas || null,
      mensaje: mensaje || null,
      estado: "pendiente",
    });

    if (error) {
      console.error("[eventos] Error al guardar la consulta:", error);
      return {
        status: "error",
        message: "No pudimos enviar tu consulta. Probá de nuevo en unos minutos.",
      };
    }

    await sendNotificationEmail({
      nombre,
      email,
      telefono,
      tipoEvento,
      fechaAproximada,
      cantidadPersonas,
      mensaje,
    });

    return {
      status: "success",
      message: "¡Listo! Recibimos tu consulta, te vamos a contactar a la brevedad.",
    };
  } catch (err) {
    console.error("[eventos] Error inesperado:", err);
    return {
      status: "error",
      message: "Hubo un problema técnico. Escribinos por WhatsApp mientras lo resolvemos.",
    };
  }
}
