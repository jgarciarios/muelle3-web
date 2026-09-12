import Link from "next/link";
import { SiteNav } from "@/components/nav";

export function ComingSoon({ title }: { title: string }) {
  return (
    <main className="flex-1">
      <div className="relative flex min-h-[70vh] flex-col items-center justify-center bg-navy px-6 text-center">
        <SiteNav />
        <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-amber uppercase">
          Muy pronto
        </p>
        <h1 className="font-serif text-4xl font-bold italic text-white">{title}</h1>
        <p className="mt-3 max-w-md text-white/70">
          Esta sección está en construcción. Mientras tanto, reservá tu mesa o volvé al inicio.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/reservas"
            className="rounded-md bg-mustard px-6 py-3 font-semibold text-navy transition hover:brightness-95"
          >
            Reservar una mesa
          </Link>
          <Link
            href="/"
            className="rounded-md border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
