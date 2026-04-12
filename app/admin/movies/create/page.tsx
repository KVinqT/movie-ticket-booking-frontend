"use client";

import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import MovieForm from "../_components/MovieForm";

export default function CreateMoviePage() {
  const navigate = useRouter();

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

        <div className="mt-6 space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">
            Create New Movie
          </h1>
          <p className="text-zinc-500 text-sm">
            Fill in the movie details and schedule one or more showtimes.
            Showtimes are grouped by theater and submitted together.
          </p>
        </div>

        <MovieForm mode="create" />
      </div>
    </div>
  );
}
