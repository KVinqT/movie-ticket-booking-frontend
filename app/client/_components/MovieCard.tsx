"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import type { AdminMovie } from "@/lib/api/types";

type MovieCardProps = {
  movie: AdminMovie;
};

export function MovieCard({ movie }: MovieCardProps) {
  const isValidUrl =
    movie.movie_poster_url.startsWith("http://") ||
    movie.movie_poster_url.startsWith("https://");

  const [imgErrored, setImgErrored] = useState(!isValidUrl);

  return (
    <Link href={`/client/movies/${movie.id}`}>
      <div className="group relative w-50 h-75 rounded-xl overflow-hidden border shadow-sm cursor-pointer bg-zinc-900">
        {imgErrored ? (
          /* ── Fallback poster ── */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br from-zinc-800 to-zinc-900 p-4">
            <ImageOff className="w-10 h-10 text-zinc-600" />
            <p className="text-white/80 text-xs font-semibold text-center leading-snug line-clamp-3">
              {movie.movie_name}
            </p>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
              {movie.genre}
            </span>
          </div>
        ) : (
          <Image
            src={movie.movie_poster_url}
            alt={movie.movie_name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgErrored(true)}
            unoptimized
          />
        )}

        {/* ── Hover overlay (shown for both valid and fallback) ── */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300" />
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <h2 className="font-semibold text-sm line-clamp-2 leading-tight">
            {movie.movie_name}
          </h2>
          <p className="text-[11px] text-white/70 mt-1">{movie.genre}</p>
          <p className="text-[11px] mt-1 line-clamp-2 text-white/60">
            {movie.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
