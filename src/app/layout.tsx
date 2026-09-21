import type { Metadata } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { PageTransition } from "@/components/page-transition";
import { SplashScreen } from "@/components/splash-screen";
import { WhatsAppButton } from "@/components/whatsapp-button";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Serif editorial para títulos grandes (decisión de Juani, 18/09/2026:
// se probó una cursiva manuscrita y no funcionó para frases largas —
// se vuelve a un serif fuerte, sin itálica, look "restaurante de autor").
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
});

// Tipografía monoespaciada para el contenido del Menú (platos/tragos),
// inspirada en la referencia que mandó Juani (tucsonrestaurante.com,
// 17/09/2026): nombres en mayúscula, look prolijo tipo "ficha técnica".
// Se usa SOLO dentro de /menu, no reemplaza a Inter en el resto del sitio.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
      className={`${inter.variable} ${fraunces.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SplashScreen />
        <PageTransition>{children}</PageTransition>
        <WhatsAppButton />
      </body>
    </html>
  );
}
