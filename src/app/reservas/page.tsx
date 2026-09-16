import { redirect } from "next/navigation";
import { MEITRE_RESERVATION_URL } from "@/lib/meitre";

/**
 * Ya no hay página propia de reservas: todos los botones "Reservar" del
 * sitio linkean directo a Meitre (ver src/lib/meitre.ts). Esta ruta queda
 * solo como red de seguridad por si algo viejo (un bookmark, un link
 * compartido) todavía apunta a /reservas.
 */
export default function ReservasPage() {
  redirect(MEITRE_RESERVATION_URL);
}
