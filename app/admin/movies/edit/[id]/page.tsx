"use client";

import { use } from "react";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMovie } from "@/lib/api/admin/movies";
import { MoviePoster } from "@/components/shared/MoviePoster";
import MovieForm from "../../_components/MovieForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditMoviePage({ params }: Props) {
  const { id } = use(params);
  const movieId = Number(id);
  const navigate = useRouter();

  const { data: movie, isLoading, isError } = useMovie(movieId);

  return (
    <div className="min-h-screen py-2">
      <div className="max-w-3xl mx-auto px-6">
        <button
          onClick={() => navigate.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <Undo2 className="w-5 h-5" />
          <span className="text-sm">Back to Movies</span>
        </button>

        {isLoading ? (
          <div className="mt-16 text-center text-zinc-400">Loading…</div>
        ) : isError || !movie ? (
          <div className="mt-16 text-center text-red-400">
            Movie not found or failed to load.
          </div>
        ) : (
          <>
            <div className="mt-6 flex items-start gap-5">
              <MoviePoster
                src={movie.movie_poster_url}
                alt={movie.movie_name}
                containerClassName="h-20 w-14 shrink-0"
              />
              <div className="space-y-0.5">
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">
                  Editing
                </p>
                <h1 className="text-4xl font-bold tracking-tight">
                  {movie.movie_name}
                </h1>
                <p className="text-zinc-500 text-sm">
                  Update movie details and add or adjust showtimes.
                </p>
              </div>
            </div>

            <MovieForm mode="edit" movieId={movieId} initialData={movie} />
          </>
        )}
      </div>
    </div>
  );
}
