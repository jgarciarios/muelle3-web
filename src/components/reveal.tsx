"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Retraso en ms antes de animar, para escalonar varios Reveal seguidos. */
  delay?: number;
  /** Distancia inicial en px desde la que entra el contenido. */
  distance?: number;
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
export function Reveal({ children, className = "", delay = 0, distance = 24 }: RevealProps) {
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
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "opacity-0"
      } ${className}`}
      style={{
        transitionDelay: visible ? `${delay}ms` : "0ms",
        transform: visible ? undefined : `translateY(${distance}px)`,
      }}
    >
      {children}
    </div>
  );
}
