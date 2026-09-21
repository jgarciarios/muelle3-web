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
// Duración de la animación de entrada del logo (opacity + scale). Pedido
// explícito de Juani (21/09/2026): 0.8s ease-out.
const ENTER_MS = 800;
// Cuánto se mantiene el logo en pantalla, ya animado, antes de empezar a
// disolverse. No lo tocamos en este pedido, solo se corrió para arrancar
// después de ENTER_MS en vez de en paralelo (ver más abajo).
const HOLD_MS = 200;
// Duración de la disolución final hacia el hero. Pedido explícito de Juani
// (21/09/2026): 0.6s.
const EXIT_MS = 600;
// El logo se apaga primero (rápido) y el fondo navy recién arranca su fade
// después de esta fracción de EXIT_MS. Así, cuando el navy se vuelve
// transparente, el logo del splash ya desapareció del todo y no queda
// superpuesto -- ni "fantasma" -- con el logo del hero que ya está
// renderizado debajo en (casi) la misma posición. Ver comentario en el JSX.
const BG_EXIT_DELAY_MS = EXIT_MS * 0.35;

/**
 * Pantalla de carga breve al entrar por primera vez al sitio en una pestaña
 * (sessionStorage, no localStorage: cada pestaña/sesión nueva la vuelve a
 * ver una vez, pero navegar entre páginas internas no la repite). Fondo
 * navy, logo con fade-in + scale sutil, y se disuelve hacia el hero.
 *
 * Duración total: ENTER_MS + HOLD_MS + EXIT_MS.
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

    // Arranca el timer de ocultamiento después de que termina la animación
    // de entrada (ENTER_MS), no en paralelo -- si no, con ENTER_MS más
    // largo que antes, el fade-out podía llegar a pisar la animación de
    // entrada a mitad de camino.
    const hideTimer = setTimeout(() => setShow(false), ENTER_MS + HOLD_MS);
    return () => clearTimeout(hideTimer);
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
          // a propósito. z-40 sigue arriba del header (z-20) para cubrir
          // toda la página en la primera carga, pero nunca gana contra el
          // menú.
          className="fixed inset-0 z-40 flex items-center justify-center bg-navy"
          exit={{ opacity: 0 }}
          transition={{
            duration: EXIT_MS / 1000,
            ease: "easeInOut",
            // El fondo espera a que el logo (abajo) ya haya terminado de
            // desvanecerse antes de empezar a volverse transparente.
            delay: BG_EXIT_DELAY_MS / 1000,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            // Transition va DENTRO de animate/exit (no como prop compartida
            // del componente) a propósito: así entrada y salida del logo
            // usan duraciones distintas en vez de heredar la misma.
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: ENTER_MS / 1000, ease: "easeOut" },
            }}
            // El logo se apaga rápido (primera fracción de EXIT_MS, sin
            // delay), ANTES de que el fondo navy (motion.div de afuera)
            // empiece a hacerse transparente. Esto es lo que evita el bug
            // del logo "fantasma" superpuesto: si fondo y logo se
            // desvanecieran juntos con la misma transición, mientras el
            // navy se vuelve transparente todavía se llegaría a ver el
            // logo del splash semi-transparente superpuesto al logo real
            // del hero (que ya está montado debajo, en casi la misma
            // posición).
            exit={{
              opacity: 0,
              transition: { duration: BG_EXIT_DELAY_MS / 1000, ease: "easeInOut" },
            }}
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
