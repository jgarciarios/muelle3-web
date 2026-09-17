import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/nav";
import { MoodCarousel } from "@/components/mood-carousel";
import { GalleryPhoto } from "@/components/gallery-photo";
import { ReviewsCarousel } from "@/components/reviews-carousel";
import { Reveal } from "@/components/reveal";
import { MEITRE_RESERVATION_URL } from "@/lib/meitre";

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* HERO — pedido explícito del cliente: layout centrado tipo
          gardiner.com.ar / kansasgrillandbar.com.ar (foto de fondo a pantalla
          completa, marca centrada con líneas a los costados, botón
          "Reservar" con solo borde, sin relleno). El isotipo real de Muelle 3
          es texto negro sobre fondo blanco semi-transparente (no una marca
          blanca de líneas como la de esas referencias), así que va sobre una
          tarjeta blanca opaca para que se lea bien contra cualquier foto —
          nunca inventamos una versión "en blanco" del logo que no existe. */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-navy">
        <SiteNav hideLogo />
        <MoodCarousel />
        {/* Oscurece un poco toda la foto para que la marca y la línea blanca
            tengan contraste parejo, más un viñeteado suave centrado detrás
            del contenido — las fotos reales siguen siendo protagonistas, no
            se tapan con una capa oscura plana como antes. */}
        <div className="absolute inset-0 bg-navy/25" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 52%, rgba(13,26,38,0.55) 0%, rgba(13,26,38,0.18) 60%, transparent 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center px-6 text-center">
          <div className="mb-9 flex w-full items-center justify-center gap-5 sm:gap-8">
            <span className="hidden h-px flex-1 bg-white/50 sm:block" />
            <div className="shrink-0 rounded-sm bg-white p-3 shadow-2xl sm:p-4">
              <Image
                src="/images/logo-cropped.png"
                alt="Muelle 3 — Kitchen & Bar"
                width={220}
                height={220}
                className="h-24 w-24 sm:h-32 sm:w-32"
                priority
              />
            </div>
            <span className="hidden h-px flex-1 bg-white/50 sm:block" />
          </div>

          <p className="mb-8 text-xs font-semibold tracking-[0.3em] text-white/85 uppercase sm:text-sm">
            Playa Mansa · Punta del Este
          </p>

          <a
            href={MEITRE_RESERVATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/80 px-10 py-3.5 text-xs font-semibold tracking-[0.25em] text-white uppercase transition hover:bg-white hover:text-navy sm:text-sm"
          >
            Reservar
          </a>
        </div>
      </section>

      {/* INTRO */}
      <Reveal>
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
      </Reveal>

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
      {/* Cada foto entra con su propio fade + slide, escalonada (delay
          creciente) a medida que aparece en pantalla — antes todo el
          bloque tenía un solo Reveal, así que las fotos "aparecían" todas
          juntas de golpe apenas se cargaba la sección y no se notaba como
          un efecto sobre las fotos en sí. Así sí se ve, foto por foto. */}
      <section className="bg-navy py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-mustard uppercase">
                De nuestra cocina
              </p>
              <h2 className="font-serif text-3xl font-bold text-white">Platos que hablan solos</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-2">
            <Reveal delay={0} className="aspect-[4/5] sm:col-span-2 sm:row-span-2 sm:aspect-auto">
              <GalleryPhoto
                src="/images/platos/pasta-mariscos.jpg"
                alt="Fettuccine Gorriti con langostinos y mejillones"
                caption="Fettuccine Gorriti"
                className="h-full"
              />
            </Reveal>
            <Reveal delay={100} className="aspect-[4/5]">
              <GalleryPhoto
                src="/images/platos/mila-del-muelle.jpg"
                alt="Mila del Muelle con papas fritas"
                caption="Mila del Muelle"
                className="h-full"
              />
            </Reveal>
            {/* Pese al nombre de archivo ("cheesecake-detalle.jpg"), esta foto
                es el costillar con puré — verificado abriendo la imagen. */}
            <Reveal delay={200} className="aspect-[4/5]">
              <GalleryPhoto
                src="/images/platos/cheesecake-detalle.jpg"
                alt="Costillar angus braseado con puré"
                caption="Costillar angus braseado"
                className="h-full"
              />
            </Reveal>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Reveal delay={0} className="aspect-[4/5]">
              <GalleryPhoto
                src="/images/platos/flan-dulce-de-leche.jpg"
                alt="Flan de dulce de leche con pochoclo caramelizado"
                caption="Flan de dulce de leche"
                className="h-full"
              />
            </Reveal>
            <Reveal delay={90} className="aspect-[4/5]">
              <GalleryPhoto
                src="/images/platos/cheesecake-frutos-rojos.jpg"
                alt="Cheesecake con frutos rojos"
                caption="Cheesecake de frutos rojos"
                className="h-full"
              />
            </Reveal>
            {/* Pese al nombre de archivo ("cheesecake-plato.jpg"), esta foto
                es un risotto de hongos — verificado abriendo la imagen. */}
            <Reveal delay={180} className="aspect-[4/5]">
              <GalleryPhoto
                src="/images/platos/cheesecake-plato.jpg"
                alt="Risotto de hongos"
                caption="Risotto de hongos"
                className="h-full"
              />
            </Reveal>
            {/* Foto real de la mesa con varios platos a la vez — por eso el
                caption genérico "Para compartir" en vez de nombrar un plato
                puntual de la carta. */}
            <Reveal delay={270} className="aspect-[4/5]">
              <GalleryPhoto
                src="/images/platos/costillar-angus.jpg"
                alt="Mesa con variedad de platos de Muelle 3"
                caption="Para compartir"
                className="h-full"
              />
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-10 text-center">
              <Link
                href="/menu"
                className="inline-block rounded-md border border-white/30 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Ver el menú completo
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* La galería "La terraza / El muelle de día / Nuestro equipo" que
          estaba acá se sacó por pedido de Juani (quedaba redundante justo
          debajo de "Nuestra Cocina"). Fotos del lugar por dentro y de la
          cava van a ir en la página de Eventos; una foto del personal
          trabajando va a ir en Contacto/Horarios — pendiente, ver PLAN.md. */}

      {/* RESEÑAS (vista previa — ver comentario en reviews-carousel.tsx) */}
      <Reveal>
        <ReviewsCarousel placeId={process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID} />
      </Reveal>

      {/* CTA RESERVAS */}
      <Reveal>
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
      </Reveal>

      <footer className="bg-navy py-10 text-center text-sm text-white/60">
        <p>Muelle 3 — Kitchen & Bar · Playa Mansa, Punta del Este</p>
      </footer>
    </main>
  );
}
