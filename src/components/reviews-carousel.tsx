"use client";

import { useEffect, useRef, useState } from "react";
import { PLACEHOLDER_REVIEWS, type ReviewItem } from "@/lib/reviews-placeholder";

/** Cada cuántos ms avanza solo el carrusel. */
const AUTOPLAY_MS = 3000;

function Stars({ cantidad }: { cantidad: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${cantidad} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < cantidad ? "fill-mustard" : "fill-ink-muted/20"}`}
        >
          <path d="M10 1.5l2.6 5.6 6 .7-4.4 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.4 7.8l6-.7L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewItem }) {
  const inicial = review.autor.charAt(0).toUpperCase();
  return (
    <div className="flex h-full flex-col justify-between rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
      <div>
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-celeste-deep font-serif text-lg font-bold text-white">
            {inicial}
          </div>
          <div>
            <p className="font-semibold text-ink">{review.autor}</p>
            <p className="text-xs text-ink-muted">{review.fecha}</p>
          </div>
        </div>
        <Stars cantidad={review.estrellas} />
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{review.texto}</p>
      </div>
    </div>
  );
}

/**
 * Carrusel de reseñas del Home.
 *
 * De momento muestra reviews de EJEMPLO (`PLACEHOLDER_REVIEWS`) — todavía no
 * hay un proyecto de Google Cloud con la Places API + billing activo para
 * traer las reviews reales de Google. Por eso el badge "Vista previa" es
 * visible: no hay que sacarlo hasta reemplazar esto por datos reales.
 *
 * Cuando esté la Places API conectada: reemplazar `reviews` por el resultado
 * real (server-side, cacheado) y sacar el badge de vista previa.
 */
export function ReviewsCarousel({
  reviews = PLACEHOLDER_REVIEWS,
  placeId,
}: {
  reviews?: ReviewItem[];
  placeId?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = reviews.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  // Autoplay: avanza solo cada AUTOPLAY_MS, salvo que el mouse esté encima
  // (o el usuario esté en otra pestaña) para que se pueda leer sin que se
  // mueva solo. Se pausa también un toque si el usuario ya lo movió a mano
  // no hace falta: cualquier click en flechas/puntos ya resetea el timer al
  // cambiar `index`.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (paused || total <= 1) return;
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, total, index]);

  const reviewUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : undefined;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <span className="rounded-full bg-amber/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-wood">
          Vista previa · reseñas de ejemplo
        </span>
        <h2 className="font-serif text-3xl font-bold text-ink">Lo que dicen de nosotros</h2>
        <p className="max-w-lg text-ink-muted">
          Así se va a ver el carrusel con las últimas reseñas reales de Google una vez que
          conectemos la Places API.
        </p>
      </div>

      {/* Una tarjeta a la vez, a todos los anchos de pantalla. Antes cada
          tarjeta ocupaba 100%/50%/33% del contenedor según el breakpoint,
          pero el desplazamiento siempre se calculaba como "índice × 100%"
          — pensado para una sola tarjeta por pantalla. En desktop (3
          tarjetas visibles de 33% cada una) eso corría el carrusel mucho
          más de lo que medía su contenido real: al llegar a la última
          reseña quedaba todo desplazado fuera de la vista, dejando un
          hueco en blanco donde deberían verse las tarjetas. Con una sola
          tarjeta por vez el cálculo "índice × 100%" es siempre correcto,
          sin importar el ancho de pantalla. */}
      <div
        className="relative mx-auto max-w-xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {reviews.map((review, i) => (
              <div key={i} className="w-full shrink-0 px-2">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={prev}
          aria-label="Reseña anterior"
          className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-2 text-ink shadow-md transition hover:bg-celeste-pale"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Siguiente reseña"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-white p-2 text-ink shadow-md transition hover:bg-celeste-pale"
        >
          ›
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {reviews.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ir a la reseña ${i + 1}`}
            className={`h-2 w-2 rounded-full transition ${
              i === index ? "bg-celeste-deep" : "bg-ink/15"
            }`}
          />
        ))}
      </div>

      {reviewUrl && (
        <div className="mt-10 text-center">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-mustard px-6 py-3 font-semibold text-navy transition hover:brightness-95"
          >
            Dejá tu reseña en Google
          </a>
        </div>
      )}
    </section>
  );
}
