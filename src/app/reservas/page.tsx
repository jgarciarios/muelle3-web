import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/nav";
import { ReservationForm } from "./reservation-form";

export const metadata: Metadata = {
  title: "Reservá tu mesa — Muelle 3",
};

export default function ReservasPage() {
  return (
    <main className="flex-1 bg-white">
      <div className="relative bg-navy py-24">
        <SiteNav />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-amber uppercase">
            Reservas
          </p>
          <h1 className="font-serif text-4xl font-bold italic text-white">Reservá tu mesa</h1>
          <p className="mt-3 text-white/70">
            Elegí día, horario y cantidad de personas. Te confirmamos por teléfono o email.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-14 md:grid-cols-[1.3fr_1fr]">
        <div className="rounded-xl border border-ink-muted/15 p-6 shadow-sm sm:p-8">
          <ReservationForm />
        </div>

        <aside className="space-y-8">
          <div>
            <h2 className="font-serif text-lg font-bold text-ink">Horarios</h2>
            <p className="mt-1 text-ink-muted">Todos los días, 10:00 a 00:00</p>
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-ink">Dónde estamos</h2>
            <p className="mt-1 text-ink-muted">Playa Mansa, Punta del Este</p>
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-ink">¿Grupos grandes o eventos?</h2>
            <p className="mt-1 text-ink-muted">
              Para cumpleaños, corporativos o el muelle entero, escribinos por{" "}
              <Link href="/eventos" className="underline decoration-celeste-deep">
                Eventos
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
