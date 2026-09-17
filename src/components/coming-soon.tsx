import Link from "next/link";
import { SiteNav } from "@/components/nav";
import { MEITRE_RESERVATION_URL } from "@/lib/meitre";

type Accent = "mustard" | "celeste" | "wood";

const ACCENT_STYLES: Record<Accent, { bg: string; text: string; glow: string }> = {
  mustard: { bg: "bg-mustard", text: "text-mustard", glow: "bg-mustard/25" },
  celeste: { bg: "bg-celeste", text: "text-celeste", glow: "bg-celeste/25" },
  wood: { bg: "bg-amber", text: "text-amber", glow: "bg-amber/25" },
};

function SectionIcon({ icon }: { icon: "menu" | "historia" | "eventos" | "resenas" }) {
  const common = "h-7 w-7";
  switch (icon) {
    case "menu":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path
            d="M6 3v7a2 2 0 0 0 2 2v9M6 3v6M6 3v0M9 3v7a2 2 0 0 1-2 2M18 3c-1.5 0-3 1.5-3 5s1.5 5 3 5v8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "historia":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path
            d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5c.8 0 1.5-.7 1.5-1.5v-13Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "eventos":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <rect x="4" y="5.5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 9.5h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "resenas":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path
            d="M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.8L12 3.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function ComingSoon({
  title,
  kicker,
  teaser,
  accent = "mustard",
  icon = "menu",
}: {
  title: string;
  kicker?: string;
  teaser?: string;
  accent?: Accent;
  icon?: "menu" | "historia" | "eventos" | "resenas";
}) {
  const styles = ACCENT_STYLES[accent];

  return (
    <main className="flex-1">
      <div className="relative flex min-h-[86vh] flex-col items-center justify-center overflow-hidden bg-navy px-6 text-center">
        <SiteNav />

        {/* Fondo decorativo: sin fotos, solo color y forma */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className={`absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl ${styles.glow}`}
          />
          <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-celeste-deep/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[length:22px_22px]" />
        </div>

        <div className="relative z-10 flex max-w-lg flex-col items-center">
          <div
            className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 ${styles.text}`}
          >
            <SectionIcon icon={icon} />
          </div>

          <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-amber uppercase">
            Muy pronto
          </p>
          {kicker && (
            <p className={`mb-1 text-xs font-semibold tracking-[0.15em] uppercase ${styles.text}`}>
              {kicker}
            </p>
          )}
          <h1 className="font-serif text-4xl leading-tight font-semibold text-white sm:text-6xl">{title}</h1>
          <p className="mt-4 max-w-md text-white/70">
            {teaser ??
              "Esta sección está en construcción. Mientras tanto, reservá tu mesa o volvé al inicio."}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={MEITRE_RESERVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-mustard px-6 py-3 font-semibold text-navy transition hover:brightness-95"
            >
              Reservar una mesa
            </a>
            <Link
              href="/"
              className="rounded-md border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
