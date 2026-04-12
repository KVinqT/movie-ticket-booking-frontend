import { delay } from "./mock/_delay";
import { mockMovies } from "./mock/movies";
import type { Movie, MovieQueryParams, PaginatedResponse } from "./types";

export async function getMovies(
  params?: MovieQueryParams,
): Promise<PaginatedResponse<Movie>> {
  await delay();
  let data = [...mockMovies];

  if (params?.search) {
    const q = params.search.toLowerCase();
    data = data.filter(
      (m) =>
        m.movie_name.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q),
    );
  }

  if (params?.genre && params.genre !== "All") {
    data = data.filter((m) => m.genre === params.genre);
  }

  const page = params?.page ?? 1;
  const per_page = params?.per_page ?? 10;
  const start = (page - 1) * per_page;

  return {
    data: data.slice(start, start + per_page),
    total: data.length,
    page,
    per_page,
  };
}

export async function getMovieById(id: number): Promise<Movie> {
  await delay();
  const movie = mockMovies.find((m) => m.id === id);
  if (!movie) throw { status: 404, message: "Movie not found" };
  return movie;
}

export async function createMovie(
  payload: Omit<Movie, "id" | "created_at" | "created_by">,
  createdBy = 1,
): Promise<Movie> {
  await delay();
  const newMovie: Movie = {
    ...payload,
    id: mockMovies.length + 1,
    created_by: createdBy,
    created_at: new Date().toISOString(),
  };
  mockMovies.push(newMovie);
  return newMovie;
}

export async function deleteMovie(id: number): Promise<void> {
  await delay();
  const idx = mockMovies.findIndex((m) => m.id === id);
  if (idx === -1) throw { status: 404, message: "Movie not found" };
  mockMovies.splice(idx, 1);
}
