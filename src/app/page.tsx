import Link from "next/link";
import { SiteNav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { HeroExperience } from "@/components/mood-carousel";
import { GalleryPhoto } from "@/components/gallery-photo";
import { AmbienceGallery } from "@/components/ambience-gallery";
import { ReviewsCarousel } from "@/components/reviews-carousel";
import { Reveal } from "@/components/reveal";
import { ReservarButton } from "@/components/reservar-button";

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
        {/* HeroExperience (Foco 4, pedido de Juani 21/09/2026 -- NUEVO,
            pendiente de su aprobación antes de mergear a producción):
            selector "¿Cuándo pensás venir?" que deja elegir Día/Atardecer/
            Noche y cambia el hero completo (foto + acentos de color) para
            esa experiencia. Reemplaza al viejo MoodCarousel (que solo
            autoplayeaba el fondo) -- ahora vive todo junto porque el
            selector necesita recolorear también la marca/tagline/botón de
            acá abajo, y eso no se puede hacer desde un Server Component. */}
        <HeroExperience />
      </section>

      {/* INTRO — antes usaba el fade por defecto (opacity 0 → 100, 700ms):
          para un bloque de texto largo como este, arrancar en opacity 0 lo
          dejaba casi ilegible mientras se animaba. Arranca en 0.4 y con una
          transición más corta (400ms) para que siga siendo un efecto sutil
          pero legible desde el primer frame. */}
      <Reveal initialOpacity={0.4} duration={400}>
        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="font-serif text-3xl font-bold text-ink">
            Frente al mar, con vista al muelle
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
                sizes="(max-width: 640px) 100vw, 66vw"
              />
            </Reveal>
            <Reveal delay={100} className="aspect-[4/5]">
              <GalleryPhoto
                src="/images/platos/mila-del-muelle.jpg"
                alt="Mila del Muelle con papas fritas"
                caption="Mila del Muelle"
                className="h-full"
                sizes="(max-width: 640px) 100vw, 33vw"
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
                sizes="(max-width: 640px) 100vw, 33vw"
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
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </Reveal>
            {/* Pese al nombre de archivo ("cheesecake-frutos-rojos.jpg"),
                esta foto es un plato de ñoquis con estofado -- reportado
                por Juani 20/09/2026, verificado abriendo la imagen. */}
            <Reveal delay={90} className="aspect-[4/5]">
              <GalleryPhoto
                src="/images/platos/cheesecake-frutos-rojos.jpg"
                alt="Ñoquis caseros con estofado"
                caption="Ñoquis con estofado"
                className="h-full"
                sizes="(max-width: 640px) 50vw, 25vw"
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
                sizes="(max-width: 640px) 50vw, 25vw"
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
                sizes="(max-width: 640px) 50vw, 25vw"
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

      {/* AMBIENTE — galería inmersiva pedida por Juani para vender el lugar,
          no solo la comida: la terraza, la fachada de día y de atardecer.
          Grid asimétrico (una foto grande + dos chicas) con reveal on
          scroll vía Framer Motion (ver ambience-gallery.tsx). Todavía
          faltan dos fotos reales para completar esta idea — el mural de
          Carlos Páez Vilaró (mencionado en /historia) y una vista al
          muelle desde adentro del salón — pendientes de pedirle a Juani,
          anotado en PLAN.md. */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-mustard uppercase">
            El lugar
          </p>
          <h2 className="font-serif text-3xl font-bold text-ink">Un lugar con alma propia</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-muted">
            Atardeceres frente al mar, la terraza de siempre y cada rincón con su propia historia.
          </p>
        </div>

        <AmbienceGallery />
      </section>

      {/* La galería "La terraza / El muelle de día / Nuestro equipo" que
          estaba acá antes se sacó por pedido de Juani (quedaba redundante
          justo debajo de "Nuestra Cocina") — reemplazada por la sección
          AMBIENTE de arriba. Fotos del lugar por dentro y de la cava van a
          ir en la página de Eventos; una foto del personal trabajando va a
          ir en Contacto/Horarios — pendiente, ver PLAN.md. */}

      {/* RESEÑAS (vista previa — ver comentario en reviews-carousel.tsx) */}
      <Reveal>
        <ReviewsCarousel placeId={process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID} />
      </Reveal>

      {/* CTA RESERVAS */}
      <Reveal>
        <section className="bg-celeste-deep py-16 text-center text-white">
          <h2 className="font-serif text-3xl font-bold">¿Nos hacemos un lugar?</h2>
          <p className="mt-3 text-celeste-pale">Reservá tu mesa en menos de un minuto.</p>
          <ReservarButton className="mt-6 rounded-md bg-white px-7 py-3 font-semibold text-celeste-deep transition hover:bg-celeste-pale">
            Reservar ahora
          </ReservarButton>
        </section>
      </Reveal>

      <SiteFooter />
    </main>
  );
}
