import type { Metadata } from "next";
import { SiteNav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { HistoriaCollage } from "@/components/historia-collage";

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

      {/* CONTENIDO — antes era una serie de bloques con su propia card
          (fondo blanco, borde, sombra, padding) apilados sobre fondo
          blanco liso, así que se leía como partes sueltas en vez de una
          sola narrativa. Ahora todo el texto (intro, mural, bienvenida,
          CTA) vive en un único contenedor continuo (max-w-3xl) con un
          ritmo vertical fijo entre bloques -- 21/09/2026, pedido de Juani.
          El padding-top extra (pt-20/pt-24, en vez del py-16 de antes)
          también ayuda a que la transición del hero se sienta con más
          aire. */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 sm:pt-24">
        <div className="space-y-16 sm:space-y-20">
          <p className="text-lg leading-relaxed text-ink-muted">
            En la Parada 3 de La Mansa en Punta del Este, nace Muelle 3. Un restaurante que
            combina la esencia de la vieja cantina del Club de Pesca con un toque contemporáneo,
            respetando su legado en cada detalle arquitectónico y culinario. Muelle 3 es un
            restaurante lleno de secretos y detalles únicos. Cada rincón guarda la magia del mar,
            la creatividad de nuestra cocina, el diseño de nuestros arquitectos, la inspiración
            del arte y postales únicas a las playas de Punta del Este, el muelle de La Pastora y
            la Isla Gorriti.
          </p>

          {/* Collage editorial: texto del mural + fotos apiladas, integrado
              como bloque de dos columnas (texto izq. / fotos ocupando toda
              la altura a la derecha en desktop, apiladas en mobile) dentro
              del mismo flujo narrativo -- HistoriaCollage ya no dibuja su
              propia card (fondo/borde/sombra/padding), eso se sacó de ahí
              para que se sienta parte del mismo bloque narrativo. */}
          <HistoriaCollage />

          <p className="text-lg leading-relaxed text-ink-muted">
            A nuestros amigos de siempre, nos alegra tenerlos de vuelta; y a quienes nos visitan
            por primera vez, bienvenidos a su nueva casa frente al mar. Te invitamos a disfrutar
            del Muelle en todas sus versiones. Desayunos, almuerzos, atardeceres y cenas bajo las
            estrellas se convierten en una experiencia mágica para los sentidos.
          </p>

          {/* CTA: mantiene fondo diferenciado a propósito (está bien que se
              destaque, es un llamado a la acción) pero ahora respeta el
              mismo max-width y alineación a la izquierda que el resto del
              contenido, en vez de quedar centrado con proporciones propias
              distintas al resto. Separador sutil (border-t) en vez de
              margen grande para que se sienta el siguiente bloque de la
              misma narrativa, no una card aparte. */}
          <div className="border-t border-ink/10 pt-16 sm:pt-20">
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
      </section>

      <SiteFooter />
    </main>
  );
}
