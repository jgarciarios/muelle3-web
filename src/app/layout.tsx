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
      // suppressHydrationWarning: el script de abajo le agrega la clase
      // "splash-skip" a este <html> ANTES de que React hidrate (ver
      // comentario completo junto al <script>), así que en una recarga
      // repetida el marcado real del DOM no coincide con lo que React
      // renderizó en el servidor para este atributo puntual. Sin esto,
      // React tira un warning de mismatch de hidratación por una
      // diferencia que es intencional y no afecta nada más del árbol.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        {/* Fix del "pantalla negra sólida" al navegar/recargar (Foco 1,
            pedido de Juani 21/09/2026): SplashScreen ya se muestra solo
            una vez por pestaña (sessionStorage), pero esa lectura pasa
            DENTRO de un useLayoutEffect de React -- recién corre después
            de que el JS de la página se descargó, parseó e hidrató. En
            una recarga completa (no una navegación interna por Link) el
            HTML que manda el servidor ya trae el splash con su fondo navy
            pintado (es una clase de Tailwind, no depende de JS), así que
            hasta que React hidrata se ve navy sólido y vacío -- en
            producción, con la conexión que tarde en bajar el bundle, eso
            es el bug reportado.

            Este script corre de forma síncrona, ANTES de que el navegador
            pinte nada del body (bloquea el parseo hasta terminar), y hace
            la MISMA lectura de sessionStorage que SplashScreen -- pero le
            agrega la clase "splash-skip" al <html> de una, sin esperar a
            React. La regla CSS en globals.css (`html.splash-skip
            [data-splash-screen] { display: none !important }`) saca el
            splash del render antes de que llegue a pintarse un solo
            frame. SplashScreen igual se monta y hace su propio chequeo
            (por si esta clase no se pudo aplicar por algún motivo), así
            que esto es un refuerzo por CSS puro, no un reemplazo de esa
            lógica. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(sessionStorage.getItem("muelle3-splash-shown")){document.documentElement.classList.add("splash-skip")}}catch(e){}',
          }}
        />
        <SplashScreen />
        <PageTransition>{children}</PageTransition>
        <WhatsAppButton />
      </body>
    </html>
  );
}
