/**
 * Datos de contacto confirmados de Muelle 3. Todo lo que no esté confirmado
 * queda como `null`/vacío a propósito — NUNCA se inventa un número de
 * WhatsApp, una dirección o un horario. La página de Contacto
 * (src/app/contacto/page.tsx), el botón flotante de WhatsApp y el link de
 * Maps del footer ocultan cada bloque cuyo dato todavía no está cargado
 * acá, en vez de mostrar un placeholder inventado o un link roto.
 *
 * WHATSAPP_NUMBER (21/09/2026): se lee de NEXT_PUBLIC_WHATSAPP_NUMBER —
 * Juani lo completa en .env.local (formato internacional sin "+" ni
 * espacios, ej. 59899123456). Mientras esa var no esté seteada, el número
 * queda en null y el botón flotante de WhatsApp no se renderiza.
 *
 * Confirmados por Juani el 17/09/2026: ADDRESS_TEXT y HORARIOS.
 */

// Confirmado: extraído de la URL pública de Google Maps del lugar
// (Playa Mansa, Punta del Este) y verificado visualmente contra el pin real.
export const GOOGLE_MAPS_COORDS = {
  lat: -34.9518613,
  lng: -54.9407932,
};

export const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps?q=${GOOGLE_MAPS_COORDS.lat},${GOOGLE_MAPS_COORDS.lng}&output=embed`;

// Pendiente — no inventar. Se completa vía env var (ver comentario arriba),
// nunca hardcodeado acá.
export const WHATSAPP_NUMBER: string | null =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null;

// Confirmado por Juani el 17/09/2026.
export const ADDRESS_TEXT: string | null =
  "Rbla. Dr. Claudio Williman 22, 20100 Punta del Este, Departamento de Maldonado, Uruguay";

// Confirmado por Juani el 17/09/2026.
export const HORARIOS: string | null =
  "Invierno: de 10:00 a 00:00. Verano: horario extendido, hasta las 2:00.";

export function whatsappLink(message?: string): string | null {
  if (!WHATSAPP_NUMBER) return null;
  const base = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Google Place ID (público, no es secreto) — ya lo usa el botón "Dejá tu
// reseña" del carrusel de Home. Se reutiliza acá para armar un link de
// Maps más preciso que uno armado solo con la dirección en texto.
export const GOOGLE_PLACE_ID: string | null =
  process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || null;

// Link de búsqueda de Google Maps para la dirección del local, para usar
// en el footer. Si no hay ADDRESS_TEXT confirmado, no hay link (mismo
// criterio que el resto del archivo: nunca armar un link con datos
// inventados). Con GOOGLE_PLACE_ID disponible, se agrega para que Maps
// apunte exacto al pin del lugar y no a una búsqueda genérica por texto.
export function googleMapsSearchUrl(): string | null {
  if (!ADDRESS_TEXT) return null;
  const query = encodeURIComponent(ADDRESS_TEXT);
  const placeIdParam = GOOGLE_PLACE_ID ? `&query_place_id=${GOOGLE_PLACE_ID}` : "";
  return `https://www.google.com/maps/search/?api=1&query=${query}${placeIdParam}`;
}
