"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ReservarButton } from "@/components/reservar-button";

const AUTOPLAY_MS = 6000;

type Mood = {
  id: string;
  label: string;
  // `src` real: foto oficial de Muelle 3. Si es null, todavía no hay foto
  // real para ese mood y se muestra un fondo de color (nunca una foto de
  // stock bajada de internet) hasta que llegue la foto real.
  src: string | null;
  alt: string;
  // Acentos de color por mood (Foco 4, pedido de Juani 21/09/2026: "el
  // hero completo -- foto + acentos de color -- cambia para mostrar esa
  // experiencia"). Usa SOLO tokens de marca ya definidos en globals.css
  // (celeste de día, mustard/amber de atardecer, navy+amber de noche) --
  // no se inventa paleta nueva.
  accentText: string;
  accentLine: string;
  accentBorder: string;
};

// Solo moods con foto real entran acá si `src` no es null (nunca stock).
// "Noche" no tiene foto real todavía -- ver PLAN.md, pendiente del Drive
// de Juani -- así que usa el fondo de color de marca (navy + resplandor
// ámbar) que ya estaba resuelto para ese caso.
const MOODS: Mood[] = [
  {
    id: "dia",
    label: "Día",
    src: "/images/muelle-aereo-hq.png",
    alt: "Vista aérea del muelle circular de Muelle 3 de día, Playa Mansa",
    accentText: "text-celeste-pale",
    accentLine: "bg-celeste/70",
    accentBorder: "border-celeste/70 hover:bg-celeste/15",
  },
  {
    id: "atardecer",
    label: "Atardecer",
    src: "/images/fachada-atardecer-hq.png",
    alt: "Fachada de Muelle 3 al atardecer, cartel retroiluminado contra el cielo",
    accentText: "text-amber",
    accentLine: "bg-amber/70",
    accentBorder: "border-amber/70 hover:bg-amber/15",
  },
  {
    id: "noche",
    label: "Noche",
    src: null,
    alt: "Muelle 3 de noche",
    accentText: "text-amber",
    accentLine: "bg-amber/50",
    accentBorder: "border-amber/50 hover:bg-amber/15",
  },
];

/**
 * Hero completo del Home: fondo con crossfade entre moods (día/atardecer/
 * noche), marca + CTA de reserva encima, y el selector "¿Cuándo pensás
 * venir?" que deja al visitante elegir el momento del día en vez de solo
 * mirar el autoplay -- pedido de Juani 21/09/2026 (Foco 4): "que alguien
 * que nunca fue al lugar entienda, antes de reservar, qué se siente estar
 * ahí". Antes esto vivía repartido entre `page.tsx` (marca, texto, botón)
 * y este componente (solo el fondo) -- se unifica acá porque el selector
 * necesita cambiar el color de ESOS elementos según el mood activo, y
 * `page.tsx` es un Server Component que no puede tener ese estado.
 *
 * NUEVO, pendiente de aprobación de Juani antes de mergear a producción
 * (así lo pidió explícitamente) -- no es un fix, es funcionalidad nueva.
 */
export function HeroExperience() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MOODS.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused]);

  // Parallax sutil: el fondo se desplaza a ~0.35x la velocidad del scroll de
  // la página (más lento que el contenido de encima), como pidió Juani. Se
  // mide contra el scroll global de la ventana — alcanza porque el efecto
  // solo se nota mientras el hero sigue a la vista, cerca del top (scrollY
  // chico todavía). La capa de la imagen mide más que el contenedor
  // (-inset-y-[15%]) para que ese desplazamiento nunca deje un borde vacío;
  // el `overflow-hidden` del contenedor recorta el excedente.
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => v * 0.35);

  const activeMood = MOODS[index];

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div className="absolute inset-x-0 -top-[15%] -bottom-[15%]" style={{ y }}>
        {MOODS.map((mood, i) => (
          <div
            key={mood.id}
            // Crossfade de 800ms entre moods -- las dos fotos quedan
            // superpuestas, una entrando en opacidad mientras la otra
            // sale, así nunca hay un corte seco.
            className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            {mood.src ? (
              <Image
                src={mood.src}
                alt={mood.alt}
                fill
                sizes="100vw"
                priority={i === 0}
                className="animate-ken-burns object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-navy">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:26px_26px]" />
                <div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-amber/15 blur-3xl" />
              </div>
            )}
          </div>
        ))}
      </motion.div>

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

      {/* CONTENIDO -- marca, tagline y CTA. Los acentos (líneas a los
          costados del logo, color de la tagline, borde del botón)
          cambian de color según `activeMood`, con una transición suave en
          vez de un salto seco. */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-9 flex w-full items-center justify-center gap-5 sm:gap-8">
          <span
            className={`hidden h-px flex-1 transition-colors duration-700 sm:block ${activeMood.accentLine}`}
          />
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
          <span
            className={`hidden h-px flex-1 transition-colors duration-700 sm:block ${activeMood.accentLine}`}
          />
        </div>

        <p
          className={`mb-8 text-xs font-semibold tracking-[0.3em] uppercase transition-colors duration-700 sm:text-sm ${activeMood.accentText}`}
        >
          Playa Mansa · Punta del Este
        </p>

        <ReservarButton className="border border-white/80 px-10 py-3.5 text-xs font-semibold tracking-[0.25em] text-white uppercase transition hover:bg-white hover:text-navy sm:text-sm">
          Reservar
        </ReservarButton>

        {/* Selector "¿Cuándo pensás venir?" -- Foco 4. Reemplaza el switch
            sol/luna anterior (pensado para 2 moods nada más) por algo que
            se banca los 3 y deja explícito qué está eligiendo el
            visitante, en vez de un ícono que hay que adivinar. */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-[11px] font-medium tracking-[0.15em] text-white/70 uppercase">
            ¿Cuándo pensás venir?
          </p>
          <div className="flex gap-2">
            {MOODS.map((mood, i) => (
              <button
                key={mood.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-pressed={i === index}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.08em] uppercase backdrop-blur-sm transition-colors duration-300 ${
                  i === index
                    ? `${activeMood.accentBorder} bg-white/10 text-white`
                    : "border-white/30 text-white/60 hover:border-white/60 hover:text-white"
                }`}
              >
                {mood.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
