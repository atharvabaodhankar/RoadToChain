import Image from "next/image";

interface LessonImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

/**
 * LessonImage — renders educational diagram images inside MDX lessons.
 *
 * Usage in .mdx:
 *   <LessonImage
 *     src="/images/track-0/anatomy_of_a_block_1780492744872.png"
 *     alt="Anatomy of a Block"
 *     caption="A block is divided into a Header (metadata) and a Body (transactions)."
 *   />
 */
export default function LessonImage({
  src,
  alt,
  caption,
  width = 900,
  height = 500,
}: LessonImageProps) {
  return (
    <figure className="not-prose my-8">
      <div
        className="overflow-hidden rounded-xl border"
        style={{ borderColor: "var(--dg-border, #e5e7eb)" }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
          style={{ display: "block" }}
          unoptimized
        />
      </div>
      {caption && (
        <figcaption
          className="mt-2 text-center font-mono text-[11px] leading-relaxed px-4"
          style={{ color: "var(--dg-text-dim, #6b7280)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
