import { SiteNav } from "@/components/nav";
import { EventQuoteForm } from "./quote-form";

export default function EventosPage() {
  return (
    <main className="flex-1">
      {/* HERO */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden bg-navy px-6 text-center">
        <SiteNav />

        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-celeste/25 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-celeste-deep/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[length:22px_22px]" />
        </div>

        <div className="relative z-10 max-w-xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-celeste uppercase">
            Para ocasiones especiales
          </p>
          <h1 className="font-serif text-4xl font-bold italic text-white sm:text-5xl">
            Eventos en Muelle 3
          </h1>
          <p className="mt-4 text-white/70">
            Cumpleaños, corporativos, casamientos o el muelle entero para vos. Contanos qué
            tenés en mente y te armamos una propuesta a medida.
          </p>
        </div>
      </section>

      {/* FORMULARIO */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <h2 className="font-serif text-2xl font-bold text-ink">Pedí tu cotización</h2>
        <p className="mt-2 text-ink-muted">
          Completá el formulario y te contactamos a la brevedad para coordinar los detalles.
        </p>
        <div className="mt-8">
          <EventQuoteForm />
        </div>
      </section>
    </main>
  );
}
