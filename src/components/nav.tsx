"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MEITRE_RESERVATION_URL } from "@/lib/meitre";

const links = [
  { href: "/menu", label: "Menú" },
  { href: "/historia", label: "Nuestra Historia" },
  { href: "/eventos", label: "Eventos" },
  { href: "/resenas", label: "Reseñas" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  // Bloquea el scroll del body mientras el overlay está abierto, y permite
  // cerrarlo con Escape.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
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

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-label="Abrir menú"
          className="rounded-full border border-white/50 px-4 py-2 text-xs font-bold tracking-[0.2em] text-white uppercase transition hover:bg-white/10"
        >
          Menú
        </button>
      </div>

      {/* Overlay de navegación a pantalla completa */}
      <div
        className={`fixed inset-0 z-50 flex flex-col justify-center bg-navy px-8 transition-transform duration-500 ease-[cubic-bezier(.6,0,.3,1)] ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
          className="absolute right-6 top-6 text-3xl leading-none text-white transition hover:text-amber"
        >
          ✕
        </button>

        <ul className="mx-auto w-full max-w-md space-y-4">
          {links.map((l, i) => (
            <li
              key={l.href}
              className={`transition-all duration-400 ease-out ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
            >
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-serif text-4xl font-semibold italic text-white transition hover:text-amber sm:text-5xl"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li
            className={`transition-all duration-400 ease-out ${
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: open ? `${80 + links.length * 60}ms` : "0ms" }}
          >
            <a
              href={MEITRE_RESERVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="font-serif text-4xl font-semibold italic text-amber transition hover:text-white sm:text-5xl"
            >
              Reservas
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
