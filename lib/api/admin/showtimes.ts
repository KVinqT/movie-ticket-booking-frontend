import { useMutation } from "@tanstack/react-query";
import http from "@/lib/axios";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ShowtimeEntry {
  /** 0 = new showtime (INSERT); positive id = existing showtime (UPDATE) */
  id: number;
  /** Format expected by server: "2026-04-12 10:00:00" */
  show_datetime: string;
}

export interface CreateUpdateShowtimesPayload {
  movie_id: number;
  theater_id: number;
  showtimes: ShowtimeEntry[];
}

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * Converts a datetime-local input value ("2026-04-12T10:00")
 * to the format the server expects ("2026-04-12 10:00:00").
 */
export function toServerDatetime(localDatetime: string): string {
  return localDatetime.replace("T", " ") + ":00";
}

// ── API function ──────────────────────────────────────────────────────────────

async function createUpdateShowtimes(
  payload: CreateUpdateShowtimesPayload,
): Promise<void> {
  await http.post("/showtimes/create_update", payload);
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Mutation for creating or updating a batch of showtimes for a single theater.
 * Call once per distinct theater_id when the form has multiple theaters.
 */
export function useCreateUpdateShowtimes() {
  return useMutation({
    mutationFn: createUpdateShowtimes,
  });
}
