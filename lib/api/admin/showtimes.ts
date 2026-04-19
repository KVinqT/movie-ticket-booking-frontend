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

// ── API functions ─────────────────────────────────────────────────────────────

async function createShowtimes(
  payload: CreateUpdateShowtimesPayload,
): Promise<void> {
  await http.post("/showtimes/create_update", payload);
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * Mutation for creating or updating a batch of showtimes via
 * POST /showtimes/create_update.
 *
 * In edit mode pass ALL showtimes for the theater (existing ids + new id=0
 * entries). The server replaces the existing set with the incoming payload.
 * Call once per distinct theater_id.
 */
export function useCreateUpdateShowtimes() {
  return useMutation({
    mutationFn: createShowtimes,
  });
}
