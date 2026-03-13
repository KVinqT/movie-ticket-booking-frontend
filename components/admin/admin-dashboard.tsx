"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Booking, type Movie } from "@/lib/mock-data";
import {
  type MovieFormValues,
  movieSchema,
  type ShowtimeFormValues,
  showtimeSchema,
} from "@/lib/validation";
import { AdminOverview } from "@/components/admin/overview/admin-overview";

type AdminDashboardProps = {
  movies: Movie[];
  bookings: Booking[];
  onAddMovie: (values: MovieFormValues) => void;
  onAddShowtime: (values: ShowtimeFormValues) => void;
};

export function AdminDashboard({
  movies,
  bookings,
  onAddMovie,
  onAddShowtime,
}: AdminDashboardProps) {
  const addMovieForm = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: "",
      genre: "",
      durationMinutes: 120,
      description: "",
      posterUrl: "",
    },
  });

  const addShowtimeForm = useForm<ShowtimeFormValues>({
    resolver: zodResolver(showtimeSchema),
    defaultValues: {
      movieId: movies[0]?.id ?? "",
      time: "",
      price: 8,
      seatCount: 40,
    },
  });

  return (
    <Tabs defaultValue="manage-movies">
      <TabsList>
        <TabsTrigger value="manage-movies">Manage Movies</TabsTrigger>
        <TabsTrigger value="manage-showtimes">Manage Showtimes</TabsTrigger>
        <TabsTrigger value="overview">Overview</TabsTrigger>
      </TabsList>

      <TabsContent value="manage-movies">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Create Movie</CardTitle>
              <CardDescription>
                Add a new movie into listings (mock data only).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={addMovieForm.handleSubmit((values) => {
                  onAddMovie(values);
                  addMovieForm.reset({
                    title: "",
                    genre: "",
                    durationMinutes: 120,
                    description: "",
                    posterUrl: "",
                  });
                })}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...addMovieForm.register("title")} />
                    <p className="text-xs text-red-400">
                      {addMovieForm.formState.errors.title?.message}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Input id="genre" {...addMovieForm.register("genre")} />
                    <p className="text-xs text-red-400">
                      {addMovieForm.formState.errors.genre?.message}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                  <Input
                    id="durationMinutes"
                    type="number"
                    {...addMovieForm.register("durationMinutes", {
                      valueAsNumber: true,
                    })}
                  />
                  <p className="text-xs text-red-400">
                    {addMovieForm.formState.errors.durationMinutes?.message}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    {...addMovieForm.register("description")}
                  />
                  <p className="text-xs text-red-400">
                    {addMovieForm.formState.errors.description?.message}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posterUrl">Poster URL</Label>
                  <Input
                    id="posterUrl"
                    {...addMovieForm.register("posterUrl")}
                  />
                  <p className="text-xs text-red-400">
                    {addMovieForm.formState.errors.posterUrl?.message}
                  </p>
                </div>
                <Button type="submit">Add Movie</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Movies</CardTitle>
              <CardDescription>Total: {movies.length}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="rounded-lg border border-border bg-muted/20 p-3"
                >
                  <p className="font-semibold">{movie.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {movie.genre} • {movie.durationMinutes} mins •{" "}
                    {movie.showtimes.length} showtimes
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="manage-showtimes">
        <Card>
          <CardHeader>
            <CardTitle>Create Showtime & Seats</CardTitle>
            <CardDescription>
              Admin can define available seat slots for each movie schedule.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={addShowtimeForm.handleSubmit((values) => {
                onAddShowtime(values);
                addShowtimeForm.reset({
                  movieId: values.movieId,
                  time: "",
                  price: values.price,
                  seatCount: values.seatCount,
                });
              })}
            >
              <div className="space-y-2">
                <Label htmlFor="movieId">Movie</Label>
                <select
                  id="movieId"
                  className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm"
                  {...addShowtimeForm.register("movieId")}
                >
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-red-400">
                  {addShowtimeForm.formState.errors.movieId?.message}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Date & Time</Label>
                <Input
                  id="time"
                  type="datetime-local"
                  {...addShowtimeForm.register("time")}
                />
                <p className="text-xs text-red-400">
                  {addShowtimeForm.formState.errors.time?.message}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (MMK)</Label>
                <Input
                  id="price"
                  type="number"
                  min={1}
                  {...addShowtimeForm.register("price", {
                    valueAsNumber: true,
                  })}
                />
                <p className="text-xs text-red-400">
                  {addShowtimeForm.formState.errors.price?.message}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seatCount">Seat Slots</Label>
                <Input
                  id="seatCount"
                  type="number"
                  min={8}
                  max={80}
                  {...addShowtimeForm.register("seatCount", {
                    valueAsNumber: true,
                  })}
                />
                <p className="text-xs text-red-400">
                  {addShowtimeForm.formState.errors.seatCount?.message}
                </p>
              </div>
              <div className="md:col-span-2">
                <Button type="submit">Create Showtime</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="overview">
        <AdminOverview movies={movies} bookings={bookings} />
      </TabsContent>
    </Tabs>
  );
}
