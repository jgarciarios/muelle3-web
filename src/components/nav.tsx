"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MEITRE_RESERVATION_URL } from "@/lib/meitre";

const links = [
  { href: "/menu", label: "Menú" },
  { href: "/historia", label: "Historia" },
  { href: "/eventos", label: "Eventos" },
  { href: "/resenas", label: "Reseñas" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteNav({ hideLogo = false }: { hideLogo?: boolean }) {
  const [open, setOpen] = useState(false);
  // Antes el header era `absolute` — quedaba pegado arriba del hero y
  // se iba de la vista con el resto de la página al scrollear. Pasa a
  // `fixed` (siempre visible) y arranca transparente sobre la foto del
  // hero; después de 100px de scroll se pone sólido con blur + sombra,
  // como pidió Juani. `scrolled` maneja ese cambio de estilo.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll(); // por si la página ya carga scrolleada (ej. al volver con el botón "atrás")
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del body mientras el overlay está abierto, y permite
  // cerrarlo con Escape.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 shadow-md backdrop-blur-md"
          : "bg-transparent shadow-none"
      }`}
    >
      {/* Franja de sombra sutil para que logo y botón siempre tengan contraste
          contra la foto del hero — solo hace falta mientras el header sigue
          transparente; una vez que se pone sólido, se desvanece (ya no hace
          falta, y se vería como una segunda sombra encima del blur). */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy/60 to-transparent transition-opacity duration-300 ${
          scrolled ? "opacity-0" : "opacity-100"
        }`}
      />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        {/* En el Home la marca ya aparece grande y centrada en el hero
            (ver page.tsx) — repetirla acá arriba a la izquierda se veía
            duplicada, por eso ahí se pasa hideLogo. En el resto de las
            páginas (que no tienen ese hero centrado) sigue haciendo falta
            acá para que quede algo de marca en el header. */}
        {hideLogo ? (
          <span />
        ) : (
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            {/* El archivo original (logo-real.png) tiene el isotipo cuadrado
                centrado en un lienzo 2:1 con muchísimo margen transparente a
                los costados — al mostrarlo con width/height fijos ese margen
                se veía como parte del logo, achicándolo hasta ser illegible.
                logo-cropped.png es el mismo isotipo real, recortado a ese
                cuadrado. El fondo blanco es necesario: el PNG es transparente
                y sin respaldo se mezcla con la foto de atrás. */}
            <div className="rounded-md bg-white p-2 shadow-md">
              <Image
                src="/images/logo-cropped.png"
                alt="Muelle 3 — Kitchen & Bar"
                width={116}
                height={116}
                className="h-11 w-11 sm:h-12 sm:w-12"
                priority
              />
            </div>
          </Link>
        )}

        {/* Botón de alto contraste contra la foto del hero (blanco sobre
            fondo transparente). Una vez que el header se pone sólido
            blanco, ese mismo blanco se perdería — pasa a navy sobre
            blanco en ese estado. */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-label="Abrir menú"
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold tracking-[0.2em] uppercase shadow-lg transition-colors duration-300 ${
            scrolled ? "bg-navy text-white hover:bg-celeste-deep-2" : "bg-white text-navy hover:bg-mustard"
          }`}
        >
          <span className="flex flex-col gap-[3px]">
            <span className={`h-[2px] w-4 transition-colors duration-300 ${scrolled ? "bg-white" : "bg-navy"}`} />
            <span className={`h-[2px] w-4 transition-colors duration-300 ${scrolled ? "bg-white" : "bg-navy"}`} />
          </span>
          Menú
        </button>
      </div>

      {/* Overlay de navegación a pantalla completa. Cerrado, queda arriba
          de la pantalla vía -translate-y-full — pero por defecto un div
          fixed inset-0 sigue ocupando (y capturando clicks de) toda la
          ventana aunque esté visualmente fuera de vista, tape o no algo
          debajo. Antes eso pasaba con pointer-events en "auto" siempre,
          así que un click en, por ejemplo, el botón "Reservar" del hero
          (que cae dentro de ese mismo rectángulo fixed inset-0) podía ser
          interceptado por este overlay "cerrado" en vez de llegar al botón
          real. pointer-events-none cuando aria-hidden lo saca del todo del
          flujo de eventos mientras está cerrado. */}
      <div
        className={`fixed inset-0 z-50 flex flex-col justify-center bg-navy px-8 transition-transform duration-500 ease-[cubic-bezier(.6,0,.3,1)] ${
          open ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
          className="absolute right-6 top-6 text-3xl leading-none text-white transition hover:text-amber"
        >
          ✕
        </button>

        <ul className="mx-auto w-full max-w-md space-y-3 sm:space-y-4 md:space-y-5">
          {links.map((l, i) => (
            <li
              key={l.href}
              className={`transition-all duration-400 ease-out ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
            >
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-serif text-3xl leading-none font-semibold text-white transition hover:text-amber sm:text-4xl md:text-5xl"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li
            className={`mt-2 border-t border-white/10 pt-4 transition-all duration-400 ease-out sm:mt-3 sm:pt-5 ${
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: open ? `${80 + links.length * 60}ms` : "0ms" }}
          >
            <a
              href={MEITRE_RESERVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="font-serif text-3xl leading-none font-semibold text-amber transition hover:text-white sm:text-4xl md:text-5xl"
            >
              Reservas
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
