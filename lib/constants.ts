/** Canonical genre list used across admin and client views. */
export const MOVIE_GENRES = [
  "All",
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
] as const;

export type MovieGenre = (typeof MOVIE_GENRES)[number];
