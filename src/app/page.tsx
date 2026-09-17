import Link from "next/link";
import { SiteNav } from "@/components/nav";
import { MoodCarousel } from "@/components/mood-carousel";
import { GalleryPhoto } from "@/components/gallery-photo";
import { ReviewsCarousel } from "@/components/reviews-carousel";
import { MEITRE_RESERVATION_URL } from "@/lib/meitre";

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* HERO */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-navy">
        <SiteNav />
        <MoodCarousel />
        {/* Doble scrim: vertical para que el texto siempre se lea contra el
            cielo/mar, y un halo radial abajo a la izquierda que refuerza el
            contraste justo detrás del título sin importar qué foto esté
            activa. */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_100%,rgba(13,26,38,0.75),transparent)]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20">
          <p className="mb-4 text-sm font-semibold tracking-[0.25em] text-amber uppercase">
            Kitchen & Bar · Playa Mansa, Punta del Este
          </p>
          <h1 className="max-w-xl font-serif text-5xl leading-[1.05] font-semibold text-white sm:text-6xl md:text-7xl">
            Frente al mar,
            <br />
            con los pies en la arena.
          </h1>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={MEITRE_RESERVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-mustard px-7 py-3.5 font-semibold text-navy shadow-lg shadow-mustard/20 transition hover:brightness-95"
            >
              Reservar una mesa
            </a>
            <Link
              href="/menu"
              className="rounded-md bg-white/10 px-7 py-3.5 font-semibold text-white ring-1 ring-white/50 backdrop-blur-sm transition hover:bg-white hover:text-navy"
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

      {/* GALERÍA REAL — cada foto con caption y overlay al hover, en vez de
          un grid plano sin jerarquía. */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 pb-20 sm:grid-cols-3 sm:grid-rows-2">
        <GalleryPhoto
          src="/images/terraza.png"
          alt="Terraza de Muelle 3"
          caption="La terraza"
          className="aspect-[4/5] sm:col-span-2 sm:row-span-2 sm:aspect-auto"
        />
        <GalleryPhoto
          src="/images/fachada-dia-hq.png"
          alt="Fachada de Muelle 3 de día"
          caption="El muelle, de día"
          className="aspect-[4/3]"
        />
        <GalleryPhoto
          src="/images/equipo-real.png"
          alt="El equipo de Muelle 3"
          caption="Nuestro equipo"
          className="aspect-[4/3]"
        />
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
