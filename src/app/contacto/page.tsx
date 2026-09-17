import { SiteNav } from "@/components/nav";
import {
  ADDRESS_TEXT,
  GOOGLE_MAPS_EMBED_URL,
  HORARIOS,
  WHATSAPP_NUMBER,
  whatsappLink,
} from "@/lib/site-info";

export default function ContactoPage() {
  const wa = whatsappLink("Hola! Quería consultar por Muelle 3.");

  return (
    <main className="flex-1">
      <section className="relative flex min-h-[40vh] flex-col items-center justify-center overflow-hidden bg-navy px-6 text-center">
        <SiteNav />
        <div className="relative z-10 max-w-xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-mustard uppercase">
            Contacto
          </p>
          <h1 className="font-serif text-5xl font-semibold text-white sm:text-6xl">
            Te esperamos en el muelle
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">Ubicación</h2>
          <p className="mt-2 text-ink-muted">
            {ADDRESS_TEXT ?? "Playa Mansa, Punta del Este — dirección exacta a confirmar."}
          </p>

          {WHATSAPP_NUMBER && wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-md bg-mustard px-6 py-3 font-semibold text-navy transition hover:brightness-95"
            >
              Escribinos por WhatsApp
            </a>
          )}

          {HORARIOS && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold tracking-[0.15em] text-ink uppercase">
                Horarios
              </h3>
              <p className="mt-1 text-ink-muted">{HORARIOS}</p>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border border-ink-muted/20">
          <iframe
            src={GOOGLE_MAPS_EMBED_URL}
            width="100%"
            height="320"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Muelle 3 en Google Maps"
          />
        </div>
      </section>
    </main>
  );
}
