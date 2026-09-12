import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/menu", label: "Menú" },
  { href: "/historia", label: "Nuestra Historia" },
  { href: "/eventos", label: "Eventos" },
  { href: "/resenas", label: "Reseñas" },
  { href: "/reservas", label: "Reservas" },
];

export function SiteNav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded bg-white p-1.5">
            <Image
              src="/images/logo-real.png"
              alt="Muelle 3 — Kitchen & Bar"
              width={110}
              height={48}
              className="h-9 w-auto"
              priority
            />
          </div>
        </Link>
        <nav className="hidden gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/90 transition hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/reservas"
          className="rounded-md bg-mustard px-4 py-2 text-sm font-semibold text-navy transition hover:brightness-95 md:hidden"
        >
          Reservar
        </Link>
      </div>
    </header>
  );
}
