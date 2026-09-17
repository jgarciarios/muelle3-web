import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Tipografía manuscrita/casual para títulos grandes (decisión de Juani,
// 17/09/2026, en base a una referencia visual que mandó). Reemplaza a
// Fraunces. El cuerpo de texto sigue en Inter para mantener legibilidad.
const caveat = Caveat({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Muelle 3 — Kitchen & Bar | Playa Mansa, Punta del Este",
  description:
    "Muelle 3 Kitchen & Bar en Playa Mansa, Punta del Este. Reservá tu mesa, conocé el lugar y sumate a la comunidad del muelle.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
