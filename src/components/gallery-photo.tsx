"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";

// Mismo motivo que en splash-screen.tsx: `useLayoutEffect` tira warning si
// corre en el servidor. Este componente se prerenderiza ahí también.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type GalleryPhotoProps = {
  src: string;
  alt: string;
  caption: string;
  // Descripción corta opcional del plato (ej. ingredientes principales).
  // Ninguna de las fotos actuales la tiene todavía -- son datos reales que
  // tiene que pasar Juani, nunca se inventa una acá. Si no viene, el
  // overlay muestra solo el nombre.
  description?: string;
  className?: string;
  // Ancho real que ocupa la imagen en pantalla en cada breakpoint, para que
  // next/image no sirva siempre la versión más pesada (ver PLAN.md, fix de
  // performance 19/09/2026). Cada lugar que usa GalleryPhoto pasa su propio
  // valor según el grid en el que vive; este es un fallback conservador.
  sizes?: string;
};

// Easing pedido por Juani (21/09/2026) para el hover de las cards del menú
// -- mismo valor para el zoom de la imagen y para el overlay/caption, así
// entran sincronizados.
const EASE = [0.22, 1, 0.36, 1] as const;
const HOVER_DURATION = 0.5;

const imageVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: HOVER_DURATION, ease: EASE } },
};

const overlayVariants: Variants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: HOVER_DURATION, ease: EASE } },
};

const captionVariants: Variants = {
  rest: { opacity: 0, y: 12 },
  hover: { opacity: 1, y: 0, transition: { duration: HOVER_DURATION, ease: EASE } },
};

// Foto de galería con overlay + caption que aparecen al hacer hover: zoom
// sutil de la imagen (scale 1 → 1.05), degradé oscuro de abajo hacia
// arriba y el nombre del plato con un slide-up. En touch/mobile no hay
// hover real, así que ahí el overlay queda visible siempre por defecto
// (se detecta con matchMedia("(hover: none)"), más confiable que
// "ontouchstart" para cubrir también notebooks con pantalla táctil).
export function GalleryPhoto({
  src,
  alt,
  caption,
  description,
  className = "",
  sizes = "(max-width: 640px) 100vw, 33vw",
}: GalleryPhotoProps) {
  const [isTouch, setIsTouch] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(hover: none)");
    setIsTouch(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => setIsTouch(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className={`group relative overflow-hidden rounded-lg ${className}`}>
      <motion.div
        initial="rest"
        // En touch, el estado queda fijo en "hover" (overlay visible) en vez
        // de depender de whileHover, que ahí nunca se dispara.
        animate={isTouch ? "hover" : "rest"}
        whileHover={isTouch ? undefined : "hover"}
        className="relative h-full w-full"
      >
        <motion.div variants={imageVariants} className="relative h-full w-full">
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
        </motion.div>

        {/* Degradé oscuro de abajo hacia arriba, invisible en reposo y que
            aparece con el hover (o siempre, en touch). */}
        <motion.div
          variants={overlayVariants}
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
        />

        {/* El nombre del plato (y descripción corta, si existe) acompaña al
            overlay: entra con un translate-y sutil (de 12px a 0) a la vez
            que aparece. */}
        <motion.div
          variants={captionVariants}
          className="pointer-events-none absolute right-4 bottom-4 left-4"
        >
          <p className="font-serif text-lg font-semibold text-white">{caption}</p>
          {description && <p className="mt-1 text-sm font-normal text-white/80">{description}</p>}
        </motion.div>
      </motion.div>
    </div>
  );
}
