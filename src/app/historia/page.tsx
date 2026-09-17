import type { Metadata } from "next";
import { SiteNav } from "@/components/nav";

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
          <h1 className="font-serif text-4xl font-bold italic text-white sm:text-5xl">
            Nuestra Historia
          </h1>
        </div>
      </section>

      {/* TEXTO */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="space-y-6 text-lg leading-relaxed text-ink-muted">
          <p>
            En la Parada 3 de La Mansa en Punta del Este, nace Muelle 3. Un restaurante que
            combina la esencia de la vieja cantina del Club de Pesca con un toque contemporáneo,
            respetando su legado en cada detalle arquitectónico y culinario. Muelle 3 es un
            restaurante lleno de secretos y detalles únicos. Cada rincón guarda la magia del mar,
            la creatividad de nuestra cocina, el diseño de nuestros arquitectos, la inspiración
            del arte y postales únicas a las playas de Punta del Este, el muelle de La Pastora y
            la Isla Gorriti.
          </p>
          <p>
            Nuestro interior cobra vida con el mural de Carlos Páez Vilaró, una sirena que desde
            1996 nada en las profundidades del océano, restaurada con amor para nuestra
            inauguración. La esencia de Muelle 3 también vive en cada plato, con ingredientes
            frescos, locales y orgánicos que rinden homenaje al antiguo Club de Pesca y a Punta
            del Este.
          </p>
          <p>
            A nuestros amigos de siempre, nos alegra tenerlos de vuelta; y a quienes nos visitan
            por primera vez, bienvenidos a su nueva casa frente al mar. Te invitamos a disfrutar
            del Muelle en todas sus versiones. Desayunos, almuerzos, atardeceres y cenas bajo las
            estrellas se convierten en una experiencia mágica para los sentidos.
          </p>
        </div>

        <div className="mt-12 rounded-lg border border-ink/10 bg-celeste-pale/40 p-6 text-center">
          <p className="font-serif text-xl font-semibold text-ink">
            ¿Organizás un cumpleaños, casamiento o evento?
          </p>
          <p className="mt-2 text-ink-muted">
            Escribinos a{" "}
            <a href="mailto:muelle3pde@gmail.com" className="font-semibold text-celeste-deep underline">
              muelle3pde@gmail.com
            </a>{" "}
            y lo organizamos juntos.
          </p>
        </div>
      </section>

      <footer className="bg-navy py-10 text-center text-sm text-white/60">
        <p>Muelle 3 — Kitchen & Bar · Playa Mansa, Punta del Este</p>
      </footer>
    </main>
  );
}
