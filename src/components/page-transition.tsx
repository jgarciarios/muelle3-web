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
// `mode="popLayout"` (antes "wait", cambiado 21/09/2026 a pedido de Juani
// -- "el movimiento de la página está lento"): la página nueva entra al
// mismo tiempo que la vieja termina de salir, en vez de esperarla. La
// saliente se saca del flujo con `position: absolute` mientras anima (eso
// es lo que hace "popLayout"), así que se sigue viendo el mismo fade +
// slide de las dos, pero sin los ~350ms muertos de esperar antes de
// arrancar a mostrar la página nueva.
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="popLayout" initial={false}>
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
