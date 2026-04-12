import { useQuery } from "@tanstack/react-query";
import http from "@/lib/axios";
import type { ServerTheatersResponse, ServerTheaterList } from "@/lib/api/types";

// ── Query key ─────────────────────────────────────────────────────────────────

export const theaterKeys = {
  all: ["theaters"] as const,
};

// ── API function ──────────────────────────────────────────────────────────────

async function fetchTheaters(): Promise<ServerTheaterList[]> {
  const { data } = await http.get<ServerTheatersResponse>("/theaters");
  // Unwrap the { status, data } envelope the server sends
  return data.data;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/** Fetches all theaters with their seat lists. */
export function useTheaters() {
  return useQuery({
    queryKey: theaterKeys.all,
    queryFn: fetchTheaters,
    staleTime: 1000 * 60 * 5, // theaters change rarely — cache for 5 min
  });
}
