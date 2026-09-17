import type { Metadata } from "next";
import Image from "next/image";
import { SiteNav } from "@/components/nav";
import { MENU } from "@/lib/menu-data";

export const metadata: Metadata = {
  title: "Menú — Muelle 3",
};

export default function MenuPage() {
  return (
    <main className="flex-1 bg-white">
      {/* HERO — foto real de la terraza de fondo (mismo criterio que el
          Home: nunca fotos de stock, solo fotos reales ya confirmadas).
          Cuando lleguen fotos de platos, esta sección puede sumar una
          galería propia; por ahora usa lo que ya tenemos. */}
      <section className="relative flex min-h-[45vh] flex-col items-center justify-center overflow-hidden bg-navy px-6 text-center">
        <SiteNav />
        <Image
          src="/images/terraza.png"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30" />
        <div className="relative z-10 max-w-xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-mustard uppercase">
            Kitchen & Bar
          </p>
          <h1 className="font-serif text-4xl leading-tight font-semibold text-white sm:text-6xl">
            Nuestro menú
          </h1>
          <p className="mt-4 text-celeste-pale">
            Cocina con identidad, ingredientes frescos y locales, frente al mar.
          </p>
        </div>
      </section>

      {/* NAV DE CATEGORÍAS (ancla) */}
      <nav className="sticky top-0 z-10 overflow-x-auto border-b border-ink/10 bg-white/95 backdrop-blur">
        <ul className="mx-auto flex max-w-6xl gap-6 px-6 py-3 whitespace-nowrap">
          {MENU.map((cat) => (
            <li key={cat.id}>
              <a
                href={`#${cat.id}`}
                className="text-sm font-semibold text-ink-muted transition hover:text-celeste-deep"
              >
                {cat.titulo}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* CATEGORÍAS */}
      <div className="mx-auto max-w-5xl px-6 py-16">
        {MENU.map((cat, i) => (
          <section
            key={cat.id}
            id={cat.id}
            className={`scroll-mt-16 ${i > 0 ? "mt-16 border-t border-ink/10 pt-16" : ""}`}
          >
            <h2 className="mb-8 font-serif text-3xl font-bold text-ink">{cat.titulo}</h2>
            <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {cat.items.map((item) => (
                <li key={item.nombre} className="border-b border-ink/5 pb-4">
                  <p className="font-semibold text-ink">{item.nombre}</p>
                  {item.descripcion && (
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.descripcion}</p>
                  )}
                </li>
              ))}
            </ul>
            {cat.nota && <p className="mt-6 text-sm italic text-ink-muted">{cat.nota}</p>}
          </section>
        ))}
      </div>

      <footer className="bg-navy py-10 text-center text-sm text-white/60">
        <p>Muelle 3 — Kitchen & Bar · Playa Mansa, Punta del Este</p>
      </footer>
    </main>
  );
}
