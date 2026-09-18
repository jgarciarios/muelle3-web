"use client";

import { useRef, useState } from "react";
import { MEITRE_RESERVATION_URL } from "@/lib/meitre";

type ReservarButtonProps = {
  children: React.ReactNode;
  className?: string;
  /** Cuánto puede desplazarse el botón hacia el cursor, en px. Sutil a
      propósito — esto no es un botón que "persigue" el mouse por toda la
      pantalla, solo se inclina un poco hacia donde está el cursor. */
  magnetStrength?: number;
};

// Ícono de "se abre en otra pestaña" — pedido explícito de Juani porque el
// botón lleva a Meitre (otro dominio) sin ningún aviso previo. `currentColor`
// para que siga el color del texto del botón en cada estado (normal/hover).
function ExternalLinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M8.33 5.83H6.5a1.67 1.67 0 0 0-1.67 1.67v6.67A1.67 1.67 0 0 0 6.5 15.83h6.67a1.67 1.67 0 0 0 1.66-1.67v-1.83M11.67 4.17h4.16v4.17M15.5 4.5l-6.33 6.33"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Botón "Reservar" — envuelve el link real a Meitre (otro dominio, se abre
 * en pestaña nueva) con:
 *   1. un ícono de "abre en otra pestaña" al lado del texto, para que quede
 *      claro antes de hacer click que te saca del sitio;
 *   2. un efecto magnético sutil al hover: el botón entero se desplaza
 *      unos px hacia donde está el cursor dentro de él, siguiendo el mouse
 *      con `onMouseMove` — se siente más "premium" que un link plano.
 * `className` se pasa tal cual a cada estilo puntual (el del hero, borde
 * translúcido; el del CTA, sólido blanco), así que este componente no
 * define look propio, solo el comportamiento.
 */
export function ReservarButton({ children, className = "", magnetStrength = 8 }: ReservarButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // -0.5 a 0.5 según dónde está el cursor dentro del botón, multiplicado
    // por la fuerza magnética para dar el desplazamiento final en px.
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: relX * magnetStrength * 2, y: relY * magnetStrength * 2 });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  return (
    <a
      ref={ref}
      href={MEITRE_RESERVATION_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex items-center justify-center gap-2 motion-reduce:!transform-none ${className}`}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      {children}
      <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" />
    </a>
  );
}
