"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Transición de página pedida por Juani: Historia, Eventos y Contacto (y de
// paso el resto del sitio) cargaban con corte seco entre una página y la
// siguiente. Con `key={pathname}` en el motion.div, AnimatePresence detecta
// el cambio de ruta como un "unmount" de la página vieja + "mount" de la
// nueva, y anima ambos (fade + slide sutil, 350ms) en vez de que Next
// pinte la página nueva de golpe.
//
// `mode="wait"` espera a que termine la animación de salida antes de
// mostrar la página que entra — se ve más prolijo que superponer las dos,
// al costo de ~350ms extra antes de ver la página nueva, que es
// justamente el efecto de "transición" que se pidió.
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="flex min-h-full flex-1 flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
