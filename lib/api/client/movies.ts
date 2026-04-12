import { useQuery } from "@tanstack/react-query";
import http from "@/lib/axios";
import type { AdminMovie } from "@/lib/api/types";

// ── Query keys ────────────────────────────────────────────────────────────────

export const clientMovieKeys = {
  all: ["client", "movies"] as const,
  detail: (id: number) => ["client", "movies", id] as const,
};

// ── API function ──────────────────────────────────────────────────────────────

async function fetchMovies(): Promise<AdminMovie[]> {
  const { data } = await http.get<AdminMovie[]>("/movies");
  return data;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/** Fetches the full movie catalogue for the client-facing browse page. */
export function useClientMovies() {
  return useQuery({
    queryKey: clientMovieKeys.all,
    queryFn: fetchMovies,
  });
}
