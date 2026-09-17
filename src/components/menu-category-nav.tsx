"use client";

import { useEffect, useRef, useState } from "react";

type Categoria = {
  id: string;
  titulo: string;
};

/**
 * Nav de categorías del menú.
 *
 * Antes era una lista de anchors en una sola fila con `overflow-x-auto`,
 * pero como los 11 rubros no entran en una pantalla, se cortaban en el
 * borde derecho sin ningún indicio de que había más — parecía roto, no
 * una lista scrolleable a propósito.
 *
 * Pedido explícito de Juani: mejorar esto pero SIN que se vea como un
 * buscador (nada de input, dropdown ni lupa). La solución es que siga
 * siendo la misma tira de texto en mayúscula/mono ya usada en el resto
 * del menú, pero:
 *   1. un degradé sutil en los bordes que insinúa que hay más contenido
 *      para deslizar (se desvanece cuando ya no queda nada de ese lado),
 *   2. el rubro visible en pantalla se resalta solo a medida que se hace
 *      scroll por la página (subrayado + color de marca), en vez de que
 *      el usuario tenga que adivinar dónde está parado,
 *   3. la tira se desliza sola un poco para mantener el rubro activo a
 *      la vista, sin sacar el control de las manos del usuario.
 * Nada de esto agrega un campo de búsqueda ni cambia el aspecto general.
 */
export function MenuCategoryNav({ categorias }: { categorias: Categoria[] }) {
  const [activo, setActivo] = useState(categorias[0]?.id ?? "");
  const navRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const secciones = categorias
      .map((cat) => document.getElementById(cat.id))
      .filter((el): el is HTMLElement => el !== null);

    if (secciones.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // De todas las secciones que cruzan la línea de referencia, la más
        // cercana a la parte de arriba del viewport es la "activa" — así
        // no salta si dos rubros cortos entran a la vez en pantalla.
        const visibles = entries.filter((e) => e.isIntersecting);
        if (visibles.length === 0) return;
        const masCercana = visibles.reduce((a, b) =>
          Math.abs(a.boundingClientRect.top) < Math.abs(b.boundingClientRect.top) ? a : b,
        );
        setActivo(masCercana.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    secciones.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categorias]);

  // Cuando cambia el rubro activo, desliza la tira lo justo para que ese
  // link quede visible dentro de la barra (sin forzarlo siempre al centro,
  // para que el gesto se note sutil y no como un salto brusco).
  useEffect(() => {
    const link = linkRefs.current[activo];
    const nav = navRef.current;
    if (!link || !nav) return;

    const linkLeft = link.offsetLeft;
    const linkRight = linkLeft + link.offsetWidth;
    const viewLeft = nav.scrollLeft;
    const viewRight = viewLeft + nav.clientWidth;

    if (linkLeft < viewLeft) {
      nav.scrollTo({ left: linkLeft - 24, behavior: "smooth" });
    } else if (linkRight > viewRight) {
      nav.scrollTo({ left: linkRight - nav.clientWidth + 24, behavior: "smooth" });
    }
  }, [activo]);

  return (
    <nav className="sticky top-0 z-10 border-b border-ink/10 bg-white/95 backdrop-blur">
      <div className="relative mx-auto max-w-6xl">
        {/* Degradés en los bordes: sutil pista de que la tira sigue para
            ese lado, sin flechas ni botones que llamen la atención. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent" />

        <ul
          ref={navRef}
          className="flex gap-8 overflow-x-auto scroll-smooth px-6 py-4 font-mono whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categorias.map((cat) => (
            <li key={cat.id}>
              <a
                ref={(el) => {
                  linkRefs.current[cat.id] = el;
                }}
                href={`#${cat.id}`}
                aria-current={activo === cat.id}
                className={`inline-block border-b-2 pb-1 text-xs font-semibold tracking-[0.1em] uppercase transition-colors ${
                  activo === cat.id
                    ? "border-celeste-deep text-celeste-deep"
                    : "border-transparent text-ink-muted hover:text-celeste-deep"
                }`}
              >
                {cat.titulo}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
