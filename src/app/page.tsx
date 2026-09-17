import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/nav";
import { MoodCarousel } from "@/components/mood-carousel";
import { ReviewsCarousel } from "@/components/reviews-carousel";
import { MEITRE_RESERVATION_URL } from "@/lib/meitre";

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* HERO */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-navy">
        <SiteNav />
        <MoodCarousel />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16">
          <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-amber uppercase">
            Kitchen & Bar · Playa Mansa, Punta del Este
          </p>
          <h1 className="max-w-2xl font-serif text-4xl leading-tight font-semibold text-white sm:text-6xl md:text-7xl">
            Frente al mar, con los pies en la arena.
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={MEITRE_RESERVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-mustard px-6 py-3 font-semibold text-navy transition hover:brightness-95"
            >
              Reservar una mesa
            </a>
            <Link
              href="/menu"
              className="rounded-md border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Ver el menú
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-ink">
          Un lugar con los pies en la arena y la vista al muelle
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted">
          Muelle 3 es un restaurante y bar frente al mar en Playa Mansa, a metros del icónico
          muelle circular de Punta del Este. Cocina con identidad, buena mesa y un lugar que
          la gente ya eligió miles de veces — ahora también tiene un sitio propio.
        </p>
      </section>

      {/* GALERÍA REAL */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 pb-20 sm:grid-cols-3">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg sm:col-span-2 sm:row-span-2 sm:aspect-auto">
          <Image
            src="/images/terraza.png"
            alt="Terraza de Muelle 3"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src="/images/fachada-dia-hq.png"
            alt="Fachada de Muelle 3 de día"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src="/images/equipo-real.png"
            alt="El equipo de Muelle 3"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* RESEÑAS (vista previa — ver comentario en reviews-carousel.tsx) */}
      <ReviewsCarousel placeId={process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID} />

      {/* CTA RESERVAS */}
      <section className="bg-celeste-deep py-16 text-center text-white">
        <h2 className="font-serif text-3xl font-bold">¿Nos hacemos un lugar?</h2>
        <p className="mt-3 text-celeste-pale">Reservá tu mesa en menos de un minuto.</p>
        <a
          href={MEITRE_RESERVATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-md bg-white px-7 py-3 font-semibold text-celeste-deep transition hover:bg-celeste-pale"
        >
          Reservar ahora
        </a>
      </section>

      <footer className="bg-navy py-10 text-center text-sm text-white/60">
        <p>Muelle 3 — Kitchen & Bar · Playa Mansa, Punta del Este</p>
      </footer>
    </main>
  );
}
