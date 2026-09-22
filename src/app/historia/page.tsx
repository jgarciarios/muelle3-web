import type { Metadata } from "next";
import { SiteNav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { HistoriaSection } from "@/components/historia-collage";

export const metadata: Metadata = {
  title: "Nuestra Historia — Muelle 3",
};

export default function HistoriaPage() {
  return (
    <main className="flex-1 bg-white">
      {/* HERO */}
      <section className="relative flex min-h-[45vh] flex-col items-center justify-center overflow-hidden bg-navy px-6 text-center">
        <SiteNav />
        <div className="relative z-10 max-w-xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-mustard uppercase">
            Desde el muelle
          </p>
          <h1 className="font-serif text-4xl leading-tight font-semibold text-white sm:text-6xl">
            Nuestra Historia
          </h1>
        </div>
        {/* Degradé de transición hacia el contenido (21/09/2026, pedido de
            Juani): antes el salto de navy sólido a blanco sólido era
            abrupto. Este overlay hace que el navy se disuelva hacia blanco
            en los últimos px del hero, en vez de cortar en seco. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-white sm:h-28" />
      </section>

      {/* CONTENIDO — rediseño 21/09/2026 (pedido de Juani sobre la versión
          anterior: "mucho texto" y "las imágenes quedan raras en ese
          sector"). Antes: un párrafo largo único, después un collage con
          las 3 fotos apiladas y rotadas tipo polaroid, después otro párrafo
          largo. Ahora: el texto original (no se inventó ni se sacó
          contenido, solo se repartió) se divide en 3 bloques cortos, cada
          uno con su propia foto real al lado (HistoriaSection, en
          historia-collage.tsx) alternando foto izq./der. para dar ritmo --
          sin rotación ni superposición, que era lo que se veía raro sobre
          todo en mobile. */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 sm:pt-24">
        <div className="space-y-16 sm:space-y-24">
          <HistoriaSection
            text="En la Parada 3 de La Mansa en Punta del Este, nace Muelle 3. Un restaurante que combina la esencia de la vieja cantina del Club de Pesca con un toque contemporáneo, respetando su legado en cada detalle arquitectónico y culinario."
            image={{ src: "/images/fachada-dia-hq.png", alt: "Fachada de Muelle 3 de día" }}
          />

          <HistoriaSection
            eyebrow="Desde 1996"
            title="El mural de Páez Vilaró"
            text="Nuestro interior cobra vida con el mural de Carlos Páez Vilaró, una sirena que desde 1996 nada en las profundidades del océano, restaurada con amor para nuestra inauguración. La esencia de Muelle 3 también vive en cada plato, con ingredientes frescos, locales y orgánicos que rinden homenaje al antiguo Club de Pesca y a Punta del Este."
            image={{ src: "/images/equipo-real.png", alt: "Equipo de Muelle 3 en el salón" }}
            reverse
          />

          <HistoriaSection
            text="Muelle 3 es un restaurante lleno de secretos y detalles únicos. Cada rincón guarda la magia del mar, la creatividad de nuestra cocina, el diseño de nuestros arquitectos, la inspiración del arte y postales únicas a las playas de Punta del Este, el muelle de La Pastora y la Isla Gorriti."
            image={{ src: "/images/terraza.png", alt: "Terraza de Muelle 3" }}
          />

          <div className="mx-auto max-w-3xl">
            <p className="text-lg leading-relaxed text-ink-muted">
              A nuestros amigos de siempre, nos alegra tenerlos de vuelta; y a quienes nos visitan
              por primera vez, bienvenidos a su nueva casa frente al mar. Te invitamos a disfrutar
              del Muelle en todas sus versiones. Desayunos, almuerzos, atardeceres y cenas bajo las
              estrellas se convierten en una experiencia mágica para los sentidos.
            </p>

            {/* CTA: mismo tratamiento que antes (fondo diferenciado a
                propósito, mismo max-width y alineación que el resto). */}
            <div className="mt-16 border-t border-ink/10 pt-16 sm:mt-20 sm:pt-20">
              <div className="rounded-lg bg-celeste-pale/40 p-8 sm:p-10">
                <p className="font-serif text-xl font-semibold text-ink">
                  ¿Organizás un cumpleaños, casamiento o evento?
                </p>
                <p className="mt-2 text-ink-muted">
                  Escribinos a{" "}
                  <a
                    href="mailto:muelle3pde@gmail.com"
                    className="font-semibold text-celeste-deep underline"
                  >
                    muelle3pde@gmail.com
                  </a>{" "}
                  y lo organizamos juntos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
