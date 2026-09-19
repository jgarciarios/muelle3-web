"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

// React tira un warning si `useLayoutEffect` corre durante el render en el
// servidor ("does nothing on the server"). Como este componente sí se
// renderiza en el servidor (aunque sea "use client", Next lo prerenderiza),
// usamos la versión normal (`useEffect`) ahí y la de layout solo en el
// navegador, que es donde importa que corra antes del primer paint.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SESSION_KEY = "muelle3-splash-shown";
// Cuánto se mantiene el logo en pantalla antes de empezar a disolverse.
const HOLD_MS = 500;
// Duración de la disolución final hacia el hero.
const EXIT_MS = 300;

/**
 * Pantalla de carga breve al entrar por primera vez al sitio en una pestaña
 * (sessionStorage, no localStorage: cada pestaña/sesión nueva la vuelve a
 * ver una vez, pero navegar entre páginas internas no la repite). Fondo
 * navy, logo con fade-in + scale sutil, y se disuelve hacia el hero.
 * Duración total ~800ms (HOLD_MS + EXIT_MS), dentro del rango de 600-900ms
 * pedido.
 *
 * `show` arranca en `true` tanto en el server como en el primer render del
 * cliente (sessionStorage no existe en el server) para que no haya mismatch
 * de hidratación. El chequeo real pasa en `useLayoutEffect`, que corre
 * antes de que el navegador pinte el primer frame — así, si ya se mostró
 * en esta sesión, se saca sin que llegue a verse un flash.
 */
export function SplashScreen() {
  const [show, setShow] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  // `useReducedMotion` puede cambiar de valor después del mount (arranca en
  // `null` hasta que confirma el matchMedia, y sigue escuchando si el
  // usuario lo cambia en el sistema operativo en caliente). Si lo tuviéramos
  // como dependencia del efecto de abajo, cada cambio de ese valor volvería
  // a correr el efecto — reprogramando/cancelando el timer a mitad de
  // camino. Lo leemos desde un ref en vez de como dependencia, así el
  // efecto que decide mostrar/ocultar el splash corre UNA sola vez al
  // montar y su ciclo de vida (mostrar → timer → desmontar del todo vía
  // AnimatePresence) queda completamente determinista.
  const prefersReducedMotionRef = useRef(prefersReducedMotion);
  useEffect(() => {
    prefersReducedMotionRef.current = prefersReducedMotion;
  }, [prefersReducedMotion]);

  useIsomorphicLayoutEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      setShow(false);
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");

    // Alguien con "reducir movimiento" activado en el sistema: mejor no
    // mostrar nada animado, se saca directo.
    if (prefersReducedMotionRef.current) {
      setShow(false);
      return;
    }

    const hideTimer = setTimeout(() => setShow(false), HOLD_MS);
    return () => clearTimeout(hideTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intencional:
    // correr solo al montar, ver comentario arriba.
  }, []);

  // Mientras está visible, bloquea el scroll del body — es tan breve que
  // no debería notarse, pero evita que un scroll accidental quede "debajo"
  // de la pantalla de carga.
  useIsomorphicLayoutEffect(() => {
    if (!show) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          data-testid="splash-screen"
          // z-40: por debajo del overlay del menú mobile (z-50, ver nav.tsx)
          // a propósito. Antes era z-[100] — más alto que TODO, así que si
          // este splash coincidía en pantalla con el menú mobile abierto (o
          // abriéndose) quedaba tapándolo, generando la franja gris y el
          // botón "cerrar" mal ubicado que reportó Juani. z-40 sigue
          // arriba del header (z-20) para cubrir toda la página en la
          // primera carga, pero nunca gana contra el menú.
          className="fixed inset-0 z-40 flex items-center justify-center bg-navy"
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_MS / 1000, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-md bg-white p-4 shadow-2xl"
          >
            <Image
              src="/images/logo-cropped.png"
              alt="Muelle 3 — Kitchen & Bar"
              width={180}
              height={180}
              className="h-20 w-20 sm:h-24 sm:w-24"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
