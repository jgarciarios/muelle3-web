"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Retraso en ms antes de animar, para escalonar varios Reveal seguidos. */
  delay?: number;
  /** Distancia inicial en px desde la que entra el contenido. */
  distance?: number;
  /** Opacidad de arranque antes de hacerse visible (0-1). Por defecto 0
      (arranca invisible del todo). Para texto largo, un fade total se ve
      demasiado brusco — subir esto deja el contenido legible desde el
      primer frame. */
  initialOpacity?: number;
  /** Duración de la transición en ms. Por defecto 700. */
  duration?: number;
};

/**
 * Envoltorio simple para el efecto "aparece con fade + slide al hacer
 * scroll" que pidió el cliente (visto en gardiner.com.ar). Sin librería
 * externa: un IntersectionObserver que agrega las clases finales una sola
 * vez, la primera vez que la sección entra en pantalla.
 *
 * Si el usuario tiene "reducir movimiento" activado en el sistema, el CSS
 * de abajo (ver globals.css) anula la transición y todo aparece directo,
 * sin animar.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  distance = 24,
  initialOpacity = 0,
  duration = 700,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : ""
      } ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: visible ? `${delay}ms` : "0ms",
        transform: visible ? undefined : `translateY(${distance}px)`,
        opacity: visible ? undefined : initialOpacity,
      }}
    >
      {children}
    </div>
  );
}
