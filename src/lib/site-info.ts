/**
 * Datos de contacto confirmados de Muelle 3. Todo lo que no esté confirmado
 * queda como `null`/vacío a propósito — NUNCA se inventa un número de
 * WhatsApp, una dirección o un horario. La página de Contacto
 * (src/app/contacto/page.tsx) oculta cada bloque cuyo dato todavía no está
 * cargado acá, en vez de mostrar un placeholder inventado.
 *
 * Pendiente de Juani (ver PLAN.md sección 13):
 * - WHATSAPP_NUMBER: número real de WhatsApp del restaurante.
 * - ADDRESS_TEXT: dirección textual (hoy solo tenemos coordenadas, que sí
 *   están confirmadas — ver GOOGLE_MAPS_COORDS).
 * - HORARIOS: horario de atención real.
 */

// Confirmado: extraído de la URL pública de Google Maps del lugar
// (Playa Mansa, Punta del Este) y verificado visualmente contra el pin real.
export const GOOGLE_MAPS_COORDS = {
  lat: -34.9518613,
  lng: -54.9407932,
};

export const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps?q=${GOOGLE_MAPS_COORDS.lat},${GOOGLE_MAPS_COORDS.lng}&output=embed`;

// Pendiente — no inventar. Completar cuando Juani lo confirme.
export const WHATSAPP_NUMBER: string | null = null;
export const ADDRESS_TEXT: string | null = null;
export const HORARIOS: string | null = null;

export function whatsappLink(message?: string): string | null {
  if (!WHATSAPP_NUMBER) return null;
  const base = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
