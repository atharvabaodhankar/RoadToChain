"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface LessonImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

/**
 * LessonImage — renders educational diagram images inside MDX lessons with full-screen lightbox functionality.
 */
export default function LessonImage({
  src,
  alt,
  caption,
  width = 900,
  height = 500,
}: LessonImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <figure className="not-prose my-8">
        <div
          onClick={() => setIsOpen(true)}
          className="overflow-hidden rounded-xl border cursor-zoom-in transition-transform duration-250 hover:scale-[1.01] hover:shadow-md"
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

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 p-4 animate-fade-in cursor-zoom-out"
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors cursor-pointer text-sm font-mono"
            aria-label="Close full screen view"
          >
            ✕ Close [Esc]
          </button>
          
          <div className="relative max-w-[95vw] max-h-[85vh] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg border border-white/10 shadow-2xl select-none"
            />
          </div>

          {caption && (
            <p className="mt-4 text-center text-white/80 font-mono text-xs max-w-2xl px-6 leading-relaxed select-none">
              {caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
