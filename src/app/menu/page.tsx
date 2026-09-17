import type { Metadata } from "next";
import Image from "next/image";
import { SiteNav } from "@/components/nav";
import { MenuCategoryNav } from "@/components/menu-category-nav";
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
      <section className="relative flex min-h-[40vh] flex-col items-center justify-center overflow-hidden bg-navy px-6 text-center">
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
        </div>
      </section>

      {/* NAV DE CATEGORÍAS (ancla) — tira scrolleable con degradé sutil en
          los bordes y el rubro activo resaltado a medida que se hace
          scroll por la página. Ver comentario completo en
          menu-category-nav.tsx: a pedido de Juani, no es un buscador. */}
      <MenuCategoryNav categorias={MENU.map(({ id, titulo }) => ({ id, titulo }))} />

      {/* CATEGORÍAS — nombres en mayúscula, color de marca, líneas
          divisorias finas y grilla de 3 columnas: mismo espíritu que la
          referencia, con la paleta celeste/mustard de Muelle 3 en vez de
          copiar sus colores. */}
      <div className="mx-auto max-w-6xl px-6 py-16 font-mono">
        {MENU.map((cat, i) => (
          <section key={cat.id} id={cat.id} className={`scroll-mt-16 ${i > 0 ? "mt-16" : ""}`}>
            <h2 className="text-2xl font-bold tracking-[0.04em] text-celeste-deep uppercase">
              {cat.titulo}
            </h2>
            <div className="mt-3 mb-8 h-px w-full bg-ink/15" />

            <ul className="grid gap-x-10 gap-y-8 lg:grid-cols-3">
              {cat.items.map((item) => (
                <li key={item.nombre}>
                  <p className="text-sm font-bold tracking-[0.03em] text-ink uppercase">
                    {item.nombre}
                  </p>
                  {item.descripcion && (
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted normal-case">
                      {item.descripcion}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            {cat.nota && (
              <p className="mt-8 text-xs leading-relaxed text-ink-muted normal-case italic">
                {cat.nota}
              </p>
            )}
          </section>
        ))}
      </div>

      <footer className="bg-navy py-10 text-center text-sm text-white/60">
        <p>Muelle 3 — Kitchen & Bar · Playa Mansa, Punta del Este</p>
      </footer>
    </main>
  );
}
