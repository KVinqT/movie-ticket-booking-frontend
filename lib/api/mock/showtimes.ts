import type { Showtime } from "../types";
import { mockMovies } from "./movies";
import { mockTheaters } from "./theaters";

export const mockShowtimes: Showtime[] = [
  // Movie 1 — Spider-Man (Theater 1)
  {
    id: 1,
    movie_id: 1,
    theater_id: 1,
    show_datetime: "2026-04-15T14:30:00Z", //ISO string UTC
    status: "scheduled",
    created_at: "2026-03-01T00:00:00Z",
    movie: mockMovies[0],
    theater: mockTheaters[0],
  },
  {
    id: 2,
    movie_id: 1,
    theater_id: 1,
    show_datetime: "2026-04-15T18:30:00Z",
    status: "scheduled",
    created_at: "2026-03-01T00:00:00Z",
    movie: mockMovies[0],
    theater: mockTheaters[0],
  },
  {
    id: 3,
    movie_id: 1,
    theater_id: 2,
    show_datetime: "2026-04-16T21:00:00Z",
    status: "scheduled",
    created_at: "2026-03-01T00:00:00Z",
    movie: mockMovies[0],
    theater: mockTheaters[1],
  },
  // Movie 2 — The Dark Knight (Theater 1)
  {
    id: 4,
    movie_id: 2,
    theater_id: 1,
    show_datetime: "2026-04-16T14:00:00Z",
    status: "scheduled",
    created_at: "2026-03-05T00:00:00Z",
    movie: mockMovies[1],
    theater: mockTheaters[0],
  },
  {
    id: 5,
    movie_id: 2,
    theater_id: 2,
    show_datetime: "2026-04-16T19:00:00Z",
    status: "scheduled",
    created_at: "2026-03-05T00:00:00Z",
    movie: mockMovies[1],
    theater: mockTheaters[1],
  },
  // Movie 3 — Demon Slayer (Theater 2)
  {
    id: 6,
    movie_id: 3,
    theater_id: 2,
    show_datetime: "2026-04-17T15:00:00Z",
    status: "scheduled",
    created_at: "2026-03-10T00:00:00Z",
    movie: mockMovies[2],
    theater: mockTheaters[1],
  },
  {
    id: 7,
    movie_id: 3,
    theater_id: 2,
    show_datetime: "2026-04-17T20:00:00Z",
    status: "scheduled",
    created_at: "2026-03-10T00:00:00Z",
    movie: mockMovies[2],
    theater: mockTheaters[1],
  },
  // Movie 4 — Catch Me If You Can (Theater 1)
  {
    id: 8,
    movie_id: 4,
    theater_id: 1,
    show_datetime: "2026-04-18T10:30:00Z",
    status: "scheduled",
    created_at: "2026-03-15T00:00:00Z",
    movie: mockMovies[3],
    theater: mockTheaters[0],
  },
  // Movie 5 — Wolf of Wall Street (Theater 1)
  {
    id: 9,
    movie_id: 5,
    theater_id: 1,
    show_datetime: "2026-04-18T21:00:00Z",
    status: "scheduled",
    created_at: "2026-03-20T00:00:00Z",
    movie: mockMovies[4],
    theater: mockTheaters[0],
  },
];
