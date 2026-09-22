import Image from "next/image";
import { Reveal } from "@/components/reveal";

// Bloques alternados "texto + foto" para Historia (rediseño 21/09/2026,
// pedido de Juani sobre el layout anterior: "mucho texto" y "las imágenes
// quedan raras en ese sector"). Antes había un único párrafo largo seguido
// de un collage con las 3 fotos apiladas y rotadas tipo polaroid -- en
// mobile las fotos rotadas/superpuestas se apilaban una debajo de otra sin
// espacio para la rotación, y se veían torcidas sin motivo aparente.
//
// Ahora cada foto va con su propio bloque de texto corto (no un muro único),
// alternando foto izquierda/derecha en desktop para dar ritmo, y foto
// simple sin rotación ni superposición -- mismo tratamiento visual que ya
// usa el resto del sitio (borde redondeado + sombra, sin marco polaroid).
// En mobile todos los bloques caen a una columna: foto arriba, texto abajo.
type HistoriaSectionProps = {
  eyebrow?: string;
  title?: string;
  text: string;
  image: { src: string; alt: string };
  reverse?: boolean;
};

export function HistoriaSection({ eyebrow, title, text, image, reverse = false }: HistoriaSectionProps) {
  return (
    <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal className={reverse ? "lg:order-2" : undefined}>
        <div>
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-mustard uppercase">{eyebrow}</p>
          )}
          {title && (
            <h3 className="mb-4 font-serif text-2xl font-semibold text-navy italic sm:text-3xl">{title}</h3>
          )}
          <p className="text-lg leading-relaxed text-ink-muted">{text}</p>
        </div>
      </Reveal>
      <Reveal className={reverse ? "lg:order-1" : undefined} distance={28} delay={100}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </Reveal>
    </div>
  );
}
