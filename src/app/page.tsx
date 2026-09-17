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
        {/* Un solo scrim, solo abajo, donde está el texto — las fotos reales
            (atardecer, aéreo del muelle) son buenas y no hay que apagarlas
            con capas de oscuro encima. */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/25 to-transparent" />
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

      {/* NUESTRA COCINA — fotos reales de platos (fotógrafo profesional del
          cliente), primera vez que el sitio muestra comida. Los captions con
          nombre exacto de la carta son solo para los platos donde el archivo
          coincide sin ambigüedad con `menu-data.ts`; el resto lleva una
          descripción genérica en vez de inventar a qué plato de la carta
          corresponde.

          IMPORTANTE: los nombres de archivo en public/images/platos NO son
          confiables como descripción del contenido — varios quedaron mal
          etiquetados al copiarlos (por ejemplo "tiramisu.jpg" es en realidad
          un ñoqui con estofado, un plato salado). Antes de usar cualquiera
          de estos archivos hay que abrirlo y mirar la foto real, nunca
          confiar en el nombre. */}
      <section className="bg-navy py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-mustard uppercase">
              De nuestra cocina
            </p>
            <h2 className="font-serif text-3xl font-bold text-white">Platos que hablan solos</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-2">
            <GalleryPhoto
              src="/images/platos/pasta-mariscos.jpg"
              alt="Fettuccine Gorriti con langostinos y mejillones"
              caption="Fettuccine Gorriti"
              className="aspect-[4/5] sm:col-span-2 sm:row-span-2 sm:aspect-auto"
            />
            <GalleryPhoto
              src="/images/platos/mila-del-muelle.jpg"
              alt="Mila del Muelle con papas fritas"
              caption="Mila del Muelle"
              className="aspect-[4/5]"
            />
            {/* Pese al nombre de archivo ("cheesecake-detalle.jpg"), esta foto
                es el costillar con puré — verificado abriendo la imagen. */}
            <GalleryPhoto
              src="/images/platos/cheesecake-detalle.jpg"
              alt="Costillar angus braseado con puré"
              caption="Costillar angus braseado"
              className="aspect-[4/5]"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <GalleryPhoto
              src="/images/platos/flan-dulce-de-leche.jpg"
              alt="Flan de dulce de leche con pochoclo caramelizado"
              caption="Flan de dulce de leche"
              className="aspect-[4/5]"
            />
            <GalleryPhoto
              src="/images/platos/cheesecake-frutos-rojos.jpg"
              alt="Cheesecake con frutos rojos"
              caption="Cheesecake de frutos rojos"
              className="aspect-[4/5]"
            />
            {/* Pese al nombre de archivo ("cheesecake-plato.jpg"), esta foto
                es un risotto de hongos — verificado abriendo la imagen. */}
            <GalleryPhoto
              src="/images/platos/cheesecake-plato.jpg"
              alt="Risotto de hongos"
              caption="Risotto de hongos"
              className="aspect-[4/5]"
            />
            {/* Foto real de la mesa con varios platos a la vez — por eso el
                caption genérico "Para compartir" en vez de nombrar un plato
                puntual de la carta. */}
            <GalleryPhoto
              src="/images/platos/costillar-angus.jpg"
              alt="Mesa con variedad de platos de Muelle 3"
              caption="Para compartir"
              className="aspect-[4/5]"
            />
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/menu"
              className="inline-block rounded-md border border-white/30 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Ver el menú completo
            </Link>
          </div>
        </div>
      </section>

      {/* GALERÍA REAL — el lugar. Cada foto con caption y overlay al hover,
          en vez de un grid plano sin jerarquía. */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 py-20 sm:grid-cols-3 sm:grid-rows-2">
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
