import Image from "next/image";

type GalleryPhotoProps = {
  src: string;
  alt: string;
  caption: string;
  className?: string;
};

// Foto de galería con overlay + caption que aparecen recién al hacer hover
// (antes el overlay estaba siempre presente a media opacidad) — pensado
// para que la foto se vea limpia en reposo y la jerarquía editorial
// (zoom + degradé + nombre del plato) sea un gesto que el usuario
// "descubre" al pasar el mouse, no algo que está siempre encima de la foto.
export function GalleryPhoto({ src, alt, caption, className = "" }: GalleryPhotoProps) {
  return (
    <div className={`group relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      {/* Degradé oscuro de abajo hacia arriba, invisible en reposo y que
          aparece con el hover. */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {/* El nombre del plato acompaña al overlay: entra con un translate-y
          sutil (de 8px a 0) a la vez que aparece. */}
      <p className="absolute bottom-4 left-4 translate-y-2 font-serif text-lg font-semibold text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        {caption}
      </p>
    </div>
  );
}
