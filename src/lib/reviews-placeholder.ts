/**
 * PLACEHOLDER TEMPORAL -- pendiente de reemplazo por Juani (21/09/2026).
 *
 * El badge "Vista previa" que marcaba esto como reseñas de ejemplo ya se
 * saco del carrusel (ver reviews-carousel.tsx), asi que estos datos NO
 * deben quedar en produccion como estan: son inventados, no reseñas reales.
 *
 * Reemplazar este array por 3-5 reseñas reales (texto, nombre, rating,
 * fecha aproximada) que Juani va a pasar, o por el resultado de la Places
 * API si se conecta esa integracion en su lugar.
 */
export type ReviewItem = {
  autor: string;
  estrellas: 1 | 2 | 3 | 4 | 5;
  fecha: string;
  texto: string;
};

export const PLACEHOLDER_REVIEWS: ReviewItem[] = [
  {
    autor: "Lucía R.",
    estrellas: 5,
    fecha: "hace 2 semanas",
    texto:
      "La vista al muelle es increíble y la comida acompaña. Pedimos el pescado del día y no falló. Volvemos seguro.",
  },
  {
    autor: "Martín G.",
    estrellas: 5,
    fecha: "hace 1 mes",
    texto:
      "Buenísima atención, nos ubicaron en la terraza justo para el atardecer. Ambiente relajado, ideal para una cena en pareja.",
  },
  {
    autor: "Sofía B.",
    estrellas: 4,
    fecha: "hace 1 mes",
    texto:
      "Muy buen lugar frente al mar. La carta de tragos está a la altura. Un poco de espera un sábado a la noche, pero vale.",
  },
  {
    autor: "Diego A.",
    estrellas: 5,
    fecha: "hace 2 meses",
    texto:
      "De los mejores lugares de Playa Mansa. Fuimos con toda la familia y hubo opciones para todos. Excelente relación calidad-precio.",
  },
  {
    autor: "Valentina P.",
    estrellas: 5,
    fecha: "hace 3 meses",
    texto:
      "Reservamos por la web y todo perfecto. El lugar tiene una identidad propia, no es un restaurante más de la playa.",
  },
];
