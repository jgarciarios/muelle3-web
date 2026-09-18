"use client";

import { motion, type Variants } from "framer-motion";
import { GalleryPhoto } from "@/components/gallery-photo";

type AmbientePhoto = {
  src: string;
  alt: string;
  caption: string;
  className: string;
};

// Fotos reales de ambiente (nunca stock). Ojo con lo que falta todavía:
// no tenemos una foto puntual del mural de Carlos Páez Vilaró (mencionado
// en /historia) ni una que muestre la vista al muelle desde adentro del
// restaurante — quedó pendiente pedírselas a Juani (ver PLAN.md). Por eso
// esta galería usa las 3 fotos de ambiente que sí están confirmadas:
// la terraza, y la fachada de día/atardecer.
const FOTOS: AmbientePhoto[] = [
  {
    src: "/images/terraza.png",
    alt: "Terraza de Muelle 3 con mesas de madera y lámparas de mimbre",
    caption: "La terraza",
    className: "sm:col-span-2 sm:row-span-2 aspect-[4/5] sm:aspect-auto",
  },
  {
    src: "/images/fachada-atardecer-hq.png",
    alt: "Fachada de Muelle 3 al atardecer, cartel retroiluminado contra el cielo",
    caption: "Atardecer en Muelle 3",
    className: "aspect-[4/5]",
  },
  {
    src: "/images/fachada-dia-hq.png",
    alt: "Entrada de Muelle 3 de día",
    caption: "La entrada",
    className: "aspect-[4/5]",
  },
];

// Reveal on scroll pedido explícitamente con Framer Motion (opacity + y:20,
// stagger de 0.1s) — distinto del `Reveal` con IntersectionObserver que ya
// usa el resto del Home, porque acá lo pidieron puntualmente así.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function AmbienceGallery() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-2"
    >
      {FOTOS.map((foto) => (
        <motion.div key={foto.src} variants={item} className={foto.className}>
          <GalleryPhoto src={foto.src} alt={foto.alt} caption={foto.caption} className="h-full" />
        </motion.div>
      ))}
    </motion.div>
  );
}
