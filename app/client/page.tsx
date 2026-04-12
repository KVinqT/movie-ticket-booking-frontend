"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Clapperboard } from "lucide-react";
import { useClientMovies } from "@/lib/api/client/movies";
import { MOVIE_GENRES } from "@/lib/constants";
import { filterMoviesByGenre, searchMovies } from "@/lib/movies";
import { MovieCard } from "./_components/MovieCard";

export default function ClientMoviesPage() {
  const { data: allMovies = [], isLoading, isError } = useClientMovies();
  const [genre, setGenre] = useState<string>("All");
  const [query, setQuery] = useState("");

  // Merge hardcoded genres with any extra genres returned by the server
  const genreOptions = useMemo(() => {
    const serverGenres = allMovies.map((m) => m.genre).filter(Boolean);
    const extra = serverGenres.filter(
      (g) => !MOVIE_GENRES.includes(g as (typeof MOVIE_GENRES)[number]),
    );
    return [...MOVIE_GENRES, ...Array.from(new Set(extra))];
  }, [allMovies]);

  const movies = useMemo(() => {
    const byGenre = filterMoviesByGenre(allMovies, genre);
    return searchMovies(byGenre, query);
  }, [allMovies, genre, query]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-4 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Clapperboard className="w-5 h-5 text-zinc-500" />
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">
            Now Showing
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Browse Movies</h1>
        <p className="text-zinc-500 text-sm">
          Pick a genre, search by title or director, then book your seats.
        </p>
      </div>

      {/* Search + genre filters */}
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies or directors…"
            className="pl-9"
          />
        </div>

        {/* Genre pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {genreOptions.map((g) => (
            <Badge
              key={g}
              variant="outline"
              onClick={() => setGenre(g)}
              className={[
                "text-xs px-3 py-1.5 cursor-pointer tracking-wide font-normal border transition-colors",
                genre === g
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-transparent border-zinc-300 hover:border-zinc-700 hover:bg-zinc-50",
              ].join(" ")}
            >
              {g}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!isLoading && !isError && (
        <p className="text-xs text-zinc-400">
          {movies.length === 0
            ? "No movies found"
            : `${movies.length} movie${movies.length === 1 ? "" : "s"} found`}
        </p>
      )}

      {/* Movie grid */}
      {isLoading ? (
        <div className="py-20 text-center text-zinc-400">Loading…</div>
      ) : isError ? (
        <div className="py-20 text-center text-red-400">
          Failed to load movies. Please try again.
        </div>
      ) : movies.length === 0 ? (
        <div className="py-20 text-center text-zinc-400">
          No movies match your search.
        </div>
      ) : (
        <div className="grid justify-center gap-6 grid-cols-[repeat(auto-fill,minmax(200px,200px))]">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
