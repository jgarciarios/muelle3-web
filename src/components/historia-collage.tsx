import Image from "next/image";
import { Reveal } from "@/components/reveal";

// Collage editorial "texto + fotos apiladas" para Historia. Juani mostro una
// referencia (pagina institucional de otro restaurante) con esta misma
// estructura pero tratamiento tipo polaroid de los 2000 (marco blanco grueso,
// inclinacion fuerte, paleta roja/crema). Esto reinterpreta la idea con la
// marca real de Muelle 3: borde fino + sombra suave en vez de marco polaroid,
// rotacion apenas perceptible (1.5-3deg), Fraunces italica, paleta navy/
// celeste/mustard. Fotos reales del proyecto (equipo-real.png, fachada-dia,
// terraza), sin editar. Aprobado por Juani 21/09/2026 sobre un mockup previo.
//
// Cada foto entra escalonada al hacer scroll con el mismo <Reveal> que ya
// usa la galeria de platos del Home (fade + slide, delay creciente) -- la
// rotacion final vive en el wrapper posicionado (afuera del Reveal) para no
// pisar la animacion de entrada, que solo anima opacidad + traslacion.
export function HistoriaCollage() {
  return (
    <div className="grid grid-cols-1 items-center gap-10 sm:gap-16 lg:grid-cols-2">
      <Reveal>
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-mustard uppercase">
            Desde 1996
          </p>
          <h3 className="mb-4 font-serif text-2xl font-semibold text-navy italic sm:text-3xl">
            El mural de Páez Vilaró
          </h3>
          <p className="text-lg leading-relaxed text-ink-muted">
            Nuestro interior cobra vida con el mural de Carlos Páez Vilaró, una sirena que desde
            1996 nada en las profundidades del océano, restaurada con amor para nuestra
            inauguración. La esencia de Muelle 3 también vive en cada plato, con ingredientes
            frescos, locales y orgánicos que rinden homenaje al antiguo Club de Pesca y a Punta
            del Este.
          </p>
        </div>
      </Reveal>

      <div className="relative aspect-[6/5] w-full">
        <div className="absolute top-[8%] left-[2%] z-[2] w-[56%] -rotate-[2.5deg]">
          <Reveal distance={28}>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-white/60 shadow-xl outline outline-1 outline-ink/10">
              <Image
                src="/images/equipo-real.png"
                alt="Equipo de Muelle 3 en el salón"
                fill
                sizes="(max-width: 1024px) 55vw, 20vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </Reveal>
        </div>

        <div className="absolute top-[2%] right-[2%] z-[3] w-[40%] rotate-[3deg]">
          <Reveal delay={140} distance={28}>
            <div className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-white/60 shadow-xl outline outline-1 outline-ink/10">
              <Image
                src="/images/fachada-dia-hq.png"
                alt="Fachada de Muelle 3 de día"
                fill
                sizes="(max-width: 1024px) 40vw, 14vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </Reveal>
        </div>

        <div className="absolute right-[8%] bottom-[2%] z-[1] w-[44%] -rotate-[1.5deg]">
          <Reveal delay={280} distance={28}>
            <div className="group relative aspect-[16/11] overflow-hidden rounded-sm border border-white/60 shadow-xl outline outline-1 outline-ink/10">
              <Image
                src="/images/terraza.png"
                alt="Terraza de Muelle 3"
                fill
                sizes="(max-width: 1024px) 44vw, 15vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
