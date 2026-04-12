"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clapperboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "../_components/data-table";
import { columns } from "./_components/columns";
import { useMovies } from "@/lib/api/admin/movies";
import { MOVIE_GENRES } from "@/lib/constants";

export default function MoviesPage() {
  const navigate = useRouter();
  const { data: movies = [], isLoading, isError } = useMovies();
  const [genre, setGenre] = useState<string>("All");

  // Collect any genres from the server that aren't in the hardcoded list
  const genreOptions = useMemo(() => {
    const serverGenres = movies.map((m) => m.genre).filter(Boolean);
    const extra = serverGenres.filter(
      (g) => !MOVIE_GENRES.includes(g as (typeof MOVIE_GENRES)[number]),
    );
    return [...MOVIE_GENRES, ...Array.from(new Set(extra))];
  }, [movies]);

  const filtered = useMemo(
    () => (genre === "All" ? movies : movies.filter((m) => m.genre === genre)),
    [movies, genre],
  );

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clapperboard className="w-5 h-5 text-zinc-500" />
              <span className="text-sm text-zinc-500 font-medium uppercase tracking-widest">
                Catalogue
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Movies</h1>
            <p className="text-sm text-zinc-500">
              Browse, filter, and manage your entire film catalogue.
            </p>
          </div>

          <Button onClick={() => navigate.push("/admin/movies/create")}>
            + Add Movie
          </Button>
        </div>

        {/* Genre filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {genreOptions.map((g) => (
            <Badge
              key={g}
              variant="outline"
              onClick={() => setGenre(g)}
              className={[
                "text-xs px-3 py-1 cursor-pointer tracking-wide font-normal border transition-colors",
                genre === g
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-transparent border-zinc-300 hover:border-zinc-700 hover:bg-zinc-50",
              ].join(" ")}
            >
              {g}
            </Badge>
          ))}
        </div>

        <Separator />

        {isLoading ? (
          <div className="py-20 text-center text-zinc-400">Loading…</div>
        ) : isError ? (
          <div className="py-20 text-center text-red-400">
            Failed to load movies. Please try again.
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            searchableColumn="movie_name"
            searchPlaceholder="Search movies…"
          />
        )}
      </div>
    </div>
  );
}
