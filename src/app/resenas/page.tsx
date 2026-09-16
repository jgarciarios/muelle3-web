import type { Metadata } from "next";
import { SiteNav } from "@/components/nav";
import { ReviewsCarousel } from "@/components/reviews-carousel";

export const metadata: Metadata = {
  title: "Reseñas — Muelle 3",
};

export default function ResenasPage() {
  return (
    <main className="flex-1 bg-white">
      <div className="relative bg-navy py-16">
        <SiteNav />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-amber uppercase">
            Reseñas
          </p>
        </div>
      </div>

      <ReviewsCarousel placeId={process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID} />
    </main>
  );
}
