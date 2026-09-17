import Image from "next/image";

type GalleryPhotoProps = {
  src: string;
  alt: string;
  caption: string;
  className?: string;
};

// Foto de galería con overlay + caption, y un leve zoom al hover — pensado
// para que la sección de fotos de la home tenga jerarquía editorial en vez
// de ser un grid plano de imágenes sueltas.
export function GalleryPhoto({ src, alt, caption, className = "" }: GalleryPhotoProps) {
  return (
    <div className={`group relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/0 to-navy/0 opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
      <p className="absolute bottom-4 left-4 font-serif text-lg font-semibold text-white">
        {caption}
      </p>
    </div>
  );
}
