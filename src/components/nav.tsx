"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { MEITRE_RESERVATION_URL } from "@/lib/meitre";
import { ADDRESS_TEXT, GOOGLE_MAPS_EMBED_URL, HORARIOS } from "@/lib/site-info";

// Renombrado 21/09/2026 (pedido de Juani, accesibilidad): antes este link
// decía "Menú", igual que el botón que abre este mismo overlay -- dos cosas
// distintas con el mismo nombre confundía (¿"Menú" abre/cierra la
// navegación, o es la carta del restaurante?). Pasa a "Carta", que es el
// término que ya usa el cliente (ver "Carta 2026.pdf" en PLAN.md, no es un
// término inventado). El botón que abre el overlay se queda como "Menú"
// (convención estándar de navegación, no cambia).
//
// Se suma "Inicio" como primer ítem: antes la única forma de volver al Home
// desde el overlay era tocar el logo, sin ningún link explícito -- no es
// obvio para todos los usuarios (ej. una persona mayor).
const links = [
  { href: "/", label: "Inicio" },
  { href: "/menu", label: "Carta" },
  { href: "/historia", label: "Historia" },
  { href: "/eventos", label: "Eventos" },
  { href: "/resenas", label: "Reseñas" },
  { href: "/contacto", label: "Contacto" },
];

// Stagger de entrada de los links del overlay (pedido por Juani,
// 21/09/2026): cada uno entra con ~60ms de delay respecto al anterior, en
// vez del salto brusco de antes (todos aparecían casi juntos). delayChildren
// deja un pequeño respiro después de que el overlay ya terminó de deslizar
// hacia abajo (duration-500 del contenedor) antes de arrancar el stagger.
const navContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const navItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

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
    <>
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
        </header>

      {/* Overlay de navegación a pantalla completa. Cerrado, queda arriba
          de la pantalla vía -translate-y-full — pero por defecto un div
          fixed inset-0 sigue ocupando (y capturando clicks de) toda la
          ventana aunque esté visualmente fuera de vista, tape o no algo
          debajo. Antes eso pasaba con pointer-events en "auto" siempre,
          así que un click en, por ejemplo, el botón "Reservar" del hero
          (que cae dentro de ese mismo rectángulo fixed inset-0) podía ser
          interceptado por este overlay "cerrado" en vez de llegar al botón
          real. pointer-events-none cuando aria-hidden lo saca del todo del
          flujo de eventos mientras está cerrado.

          Layout (21/09/2026, pedido de Juani): antes era una sola columna
          de links pegada a la izquierda-centro, dejando mucho vacío a la
          derecha en desktop. De md: en adelante pasa a dos columnas --
          links a la izquierda, info del lugar (zona, horario, mini mapa) a
          la derecha separada por un borde sutil -- así el overlay se siente
          diseñado para el ancho completo en vez de descentrado. En mobile
          se mantiene la columna única de siempre. */}
      <div
        // text-left (21/09/2026, bug real reportado en mobile): este overlay
        // es `fixed`, así que su posición en pantalla no depende de dónde
        // vive en el árbol de React -- pero `text-align` SÍ se hereda por el
        // árbol de React/DOM, no por la posición visual. Varias páginas
        // (Historia, Menú, Eventos, Contacto) envuelven <SiteNav /> en su
        // propio <section> de hero con `text-center` (para centrar su
        // título), y sin este reset explícito ese `text-center` se colaba
        // acá adentro -- por eso el overlay aparecía centrado al abrirlo
        // desde esas páginas, pero alineado a la izquierda desde el Home
        // (cuyo hero no tiene `text-center`). El layout interno ya se
        // maneja con flex/items-*, nunca dependió de text-align a propósito
        // -- este reset lo deja siempre igual sin importar desde qué página
        // se abra.
        className={`fixed inset-0 z-50 flex flex-col bg-navy px-8 text-left transition-transform duration-500 ease-[cubic-bezier(.6,0,.3,1)] ${
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

        <motion.div
          initial="hidden"
          animate={open ? "show" : "hidden"}
          variants={navContainer}
          className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-10 md:flex-row md:items-stretch md:justify-center md:gap-16"
        >
          {/* Columna izquierda: links, centrados verticalmente en su
              columna (antes lo estaban en toda la pantalla, ahora en el
              ancho que le toca junto a la columna de info). */}
          <div className="flex w-full flex-col justify-center md:w-auto md:flex-1 md:items-end">
            <ul className="w-full max-w-md space-y-3 sm:space-y-4 md:space-y-5">
              {links.map((l) => (
                <motion.li key={l.href} variants={navItem}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-serif text-3xl leading-none font-semibold text-white transition hover:text-amber sm:text-4xl md:text-5xl"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                variants={navItem}
                className="mt-2 border-t border-white/10 pt-4 sm:mt-3 sm:pt-5"
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
              </motion.li>
            </ul>
          </div>

          {/* Columna derecha: info del lugar. Solo desktop -- en mobile no
              hay espacio para esto sin apretar los links, y ahí el overlay
              ya funcionaba bien tal cual estaba. */}
          <motion.div
            variants={navItem}
            className="hidden w-full max-w-xs flex-col justify-center gap-6 border-l border-white/10 pl-16 md:flex"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-mustard uppercase">
                Dónde estamos
              </p>
              <p className="mt-2 font-serif text-xl text-white">Playa Mansa, Punta del Este</p>
              {ADDRESS_TEXT && <p className="mt-1 text-sm text-white/60">{ADDRESS_TEXT}</p>}
            </div>

            {HORARIOS && (
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-mustard uppercase">
                  Horario
                </p>
                <p className="mt-2 text-sm text-white/70">{HORARIOS}</p>
              </div>
            )}

            <div className="overflow-hidden rounded-md border border-white/10">
              <iframe
                src={GOOGLE_MAPS_EMBED_URL}
                width="100%"
                height="140"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Muelle 3 en Google Maps"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
