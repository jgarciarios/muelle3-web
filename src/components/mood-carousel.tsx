"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {MOODS.map((mood, i) => (
        <div
          key={mood.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
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

      {/* Indicador sutil del mood actual — pensado para sumar, más adelante,
          un botón que deje elegir el mood a mano en vez de solo autoplay. */}
      <div className="absolute bottom-28 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-32">
        {MOODS.map((mood, i) => (
          <button
            key={mood.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ver mood: ${mood.label}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-amber" : "w-4 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
