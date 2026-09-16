/**
 * Reviews de EJEMPLO — no son reales.
 *
 * Se usan solo para mostrarle a los dueños cómo va a quedar el carrusel de
 * reseñas en el Home, antes de conectar la Places API (que requiere un
 * proyecto de Google Cloud con billing activo — todavía no existe).
 *
 * Nombres, fechas y textos son inventados a propósito. Cuando se conecte la
 * Places API real, este archivo deja de usarse (ver `src/components/reviews-carousel.tsx`).
 * No reemplazar estos datos por nombres de clientes reales ni mostrarlos como
 * si fueran reseñas genuinas fuera de esta preview.
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
