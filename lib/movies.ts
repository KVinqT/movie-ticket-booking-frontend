import type { Movie } from "./api/types";

/**
 * Filters movies to those matching the given genre.
 * Pass "All" to return all movies.
 * Generic so it preserves subtypes like AdminMovie.
 */
export function filterMoviesByGenre<T extends Movie>(
  movies: T[],
  genre: string,
): T[] {
  if (!genre || genre === "All") return movies;
  return movies.filter((m) => m.genre === genre);
}

/**
 * Returns movies sorted by their creation date, newest first.
 * Generic so it preserves subtypes like AdminMovie.
 */
export function sortMoviesByNewest<T extends Movie>(movies: T[]): T[] {
  return [...movies].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

/**
 * Returns movies whose name or director contains the query (case-insensitive).
 * Generic so it preserves subtypes like AdminMovie.
 */
export function searchMovies<T extends Movie>(movies: T[], query: string): T[] {
  const q = query.toLowerCase().trim();
  if (!q) return movies;
  return movies.filter(
    (m) =>
      m.movie_name.toLowerCase().includes(q) ||
      m.director.toLowerCase().includes(q),
  );
}

/**
 * Returns the unique set of genres present in the provided movies array.
 */
export function getGenres(movies: Movie[]): string[] {
  return Array.from(new Set(movies.map((m) => m.genre))).sort();
}
