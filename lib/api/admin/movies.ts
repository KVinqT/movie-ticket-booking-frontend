import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/lib/axios";
import type {
  AdminMovie,
  CreateMoviePayload,
  EditMoviePayload,
  Movie,
  ServerMovieDetail,
} from "@/lib/api/types";

// ── Query keys ────────────────────────────────────────────────────────────────

export const adminMovieKeys = {
  all: ["admin", "movies"] as const,
  // Shared between admin detail page, client detail page, and edit page
  detail: (id: number) => ["movies", "detail", id] as const,
};

// ── API functions ─────────────────────────────────────────────────────────────

async function fetchMovies(): Promise<AdminMovie[]> {
  const { data } = await http.get<AdminMovie[]>("/movies");
  return data;
}

async function fetchMovie(id: number): Promise<ServerMovieDetail> {
  const { data } = await http.get<ServerMovieDetail>(`/movies/${id}`);
  return data;
}

async function createMovie(payload: CreateMoviePayload): Promise<Movie> {
  const { data } = await http.post<Movie>("/movies", payload);
  return data;
}

async function updateMovie(id: number, payload: EditMoviePayload): Promise<Movie> {
  const { data } = await http.patch<Movie>(`/movies/${id}`, payload);
  return data;
}

async function deleteMovie(id: number): Promise<void> {
  await http.delete(`/movies/${id}`);
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useMovies() {
  return useQuery({
    queryKey: adminMovieKeys.all,
    queryFn: fetchMovies,
  });
}

export function useMovie(id: number) {
  return useQuery<ServerMovieDetail>({
    queryKey: adminMovieKeys.detail(id),
    queryFn: () => fetchMovie(id),
    enabled: id > 0,
  });
}

export function useCreateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMovieKeys.all });
    },
    onError: (err: Error) => {
      toast.error("Failed to create movie", { description: err.message });
    },
  });
}

export function useUpdateMovie(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EditMoviePayload) => updateMovie(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMovieKeys.all });
      queryClient.invalidateQueries({ queryKey: adminMovieKeys.detail(id) });
    },
    onError: (err: Error) => {
      toast.error("Failed to update movie", { description: err.message });
    },
  });
}

export function useDeleteMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMovieKeys.all });
      toast.success("Movie deleted successfully.");
    },
    onError: (err: Error) => {
      toast.error("Failed to delete movie", { description: err.message });
    },
  });
}
