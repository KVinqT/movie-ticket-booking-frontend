"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

const FALLBACK_POSTER = "/moviesBg.jpg";

type MoviePosterProps = {
  src: string;
  alt: string;
  className?: string;
  /** Tailwind size classes applied to the wrapping container, e.g. "h-16 w-12" */
  containerClassName?: string;
};

/**
 * Renders a movie poster using Next.js Image.
 * Falls back to a placeholder when the URL is invalid or the request fails.
 */
export function MoviePoster({
  src,
  alt,
  containerClassName = "h-16 w-12",
}: MoviePosterProps) {
  const isValidUrl = src.startsWith("http://") || src.startsWith("https://");
  const [errored, setErrored] = useState(!isValidUrl);

  return (
    <div
      className={`relative overflow-hidden rounded border bg-zinc-100 shrink-0 ${containerClassName}`}
    >
      {errored ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-zinc-100">
          <ImageOff className="w-5 h-5 text-zinc-400" />
          <span className="text-[9px] text-zinc-400 text-center px-1 leading-tight">
            No poster
          </span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setErrored(true)}
          unoptimized
        />
      )}
    </div>
  );
}
