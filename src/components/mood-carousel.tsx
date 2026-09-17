"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const AUTOPLAY_MS = 5000;

type Mood = {
  id: string;
  label: string;
  // `src` real: foto oficial de Muelle 3. Si es null, todavía no hay foto
  // real para ese mood y se muestra un fondo de color (nunca una foto de
  // stock bajada de internet) hasta que llegue la foto real.
  src: string | null;
  alt: string;
};

// Solo moods con foto real (nunca stock ni un fondo de color "de relleno" —
// eso se veía como un bache feo en el carousel). Cuando llegue una foto
// real de noche, se agrega un tercer mood acá.
const MOODS: Mood[] = [
  {
    id: "dia",
    label: "Día",
    src: "/images/muelle-aereo-hq.png",
    alt: "Vista aérea del muelle circular de Muelle 3 de día, Playa Mansa",
  },
  {
    id: "atardecer",
    label: "Atardecer",
    src: "/images/fachada-atardecer-hq.png",
    alt: "Fachada de Muelle 3 al atardecer, cartel retroiluminado contra el cielo",
  },
];

function SolIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
      </g>
    </svg>
  );
}

function LunaIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MoodCarousel() {
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
            // Crossfade de 800ms entre moods (antes eran 1000ms) — las dos
            // fotos quedan superpuestas, una entrando en opacidad mientras
            // la otra sale, así nunca hay un corte seco.
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

      {/* Switch de mood — antes eran dos barritas sin contexto (no se
          entendía que eran clickeables ni qué representaban). Ahora es un
          switch real con ícono sol/luna que se desliza de lado, y un label
          con el nombre del mood que aparece solo al pasar el mouse por
          encima, para no ensuciar la foto todo el tiempo con texto. */}
      <div className="group absolute bottom-28 left-1/2 z-10 -translate-x-1/2 sm:bottom-32">
        <span
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-navy/80 px-3 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden="true"
        >
          {activeMood.label}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={index === 1}
          aria-label={`Ver mood: ${MOODS[(index + 1) % MOODS.length].label}`}
          onClick={() => setIndex((i) => (i + 1) % MOODS.length)}
          className="relative flex h-8 w-16 items-center rounded-full border border-white/40 bg-navy/40 px-1 backdrop-blur-sm transition-colors hover:border-white/60"
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-navy shadow transition-transform duration-300 ${
              index === 1 ? "translate-x-8" : "translate-x-0"
            }`}
          >
            {index === 0 ? <SolIcon className="h-3.5 w-3.5" /> : <LunaIcon className="h-3.5 w-3.5" />}
          </span>
        </button>
      </div>
    </div>
  );
}
