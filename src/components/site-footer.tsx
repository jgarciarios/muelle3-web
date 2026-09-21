import { MapPin } from "lucide-react";
import { ADDRESS_TEXT, googleMapsSearchUrl } from "@/lib/site-info";

/**
 * Footer compartido. Antes estaba duplicado igual en Home, Menú e Historia
 * (src/app/page.tsx, menu/page.tsx, historia/page.tsx) — se unificó acá
 * para agregar el link a Maps en un solo lugar. Pedido por Juani 21/09/2026.
 *
 * Si ADDRESS_TEXT todavía no estuviera confirmado (ver site-info.ts),
 * googleMapsSearchUrl() devuelve null y se muestra el texto plano sin
 * link, en vez de armar una URL con datos inventados.
 */
export function SiteFooter() {
  const mapsUrl = googleMapsSearchUrl();

  return (
    <footer className="bg-navy py-10 text-center text-sm text-white/60">
      <p>Muelle 3 — Kitchen & Bar · Playa Mansa, Punta del Este</p>
      {ADDRESS_TEXT && (
        <p className="mt-2">
          {mapsUrl ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white/60 underline decoration-white/30 underline-offset-2 transition hover:text-white"
            >
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              {ADDRESS_TEXT}
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              {ADDRESS_TEXT}
            </span>
          )}
        </p>
      )}
    </footer>
  );
}
