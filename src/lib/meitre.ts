/**
 * Reservas de Muelle 3: no tienen sistema propio, se manejan por Meitre
 * (https://meitre.com), el sistema que ya usan los dueños. No hay API
 * pública ni forma de embeber esa página (probamos con un iframe y el
 * navegador la bloquea), así que la integración es un link directo a la
 * página de Meitre — no un formulario propio.
 *
 * El sistema de reservas que habíamos armado sobre Supabase (tabla
 * `reservas`, `reservation-form.tsx`, `actions.ts`, el test de
 * aislamiento) queda en el repo sin usar, por si otro cliente de la
 * agencia sí lo necesita — no se borró, solo se desconectó de este sitio.
 */
export const MEITRE_RESERVATION_URL = "https://muelle3.meitre.com/";
