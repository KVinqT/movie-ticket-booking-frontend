"use client";

import { useMemo, useState } from "react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { type Booking, type Movie } from "@/lib/mock-data";

import { MoviesTable } from "./movies-table";
import { ShowtimesTable } from "./showtimes-table";
import { ShowtimeDetails } from "./showtime-details";

type AdminOverviewProps = {
  movies: Movie[];
  bookings: Booking[];
};

export function AdminOverview({ movies, bookings }: AdminOverviewProps) {
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(
    movies[0]?.id ?? null,
  );
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(
    movies[0]?.showtimes[0]?.id ?? null,
  );

  const selectedMovie = useMemo(
    () => movies.find((movie) => movie.id === selectedMovieId) ?? movies[0],
    [movies, selectedMovieId],
  );

  const selectedShowtime = useMemo(
    () =>
      selectedMovie?.showtimes.find(
        (showtime) => showtime.id === selectedShowtimeId,
      ) ?? selectedMovie?.showtimes[0],
    [selectedMovie, selectedShowtimeId],
  );

  const totalShowtimes = movies.reduce(
    (count, movie) => count + movie.showtimes.length,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Movies</CardTitle>
            <p className="text-3xl font-bold text-primary">{movies.length}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Showtimes</CardTitle>
            <p className="text-3xl font-bold text-primary">{totalShowtimes}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Bookings</CardTitle>
            <p className="text-3xl font-bold text-primary">{bookings.length}</p>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Movie List</CardTitle>
          </CardHeader>
          <div className="px-6 pb-6">
            <MoviesTable
              movies={movies}
              selectedMovieId={selectedMovie?.id ?? null}
              onSelectMovie={(movieId) => {
                const nextMovie = movies.find((movie) => movie.id === movieId);
                setSelectedMovieId(movieId);
                setSelectedShowtimeId(nextMovie?.showtimes[0]?.id ?? null);
              }}
            />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Showtimes</CardTitle>
          </CardHeader>
          <div className="px-6 pb-6">
            {selectedMovie ? (
              <ShowtimesTable
                showtimes={selectedMovie.showtimes}
                selectedShowtimeId={selectedShowtime?.id ?? null}
                onSelectShowtime={setSelectedShowtimeId}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                No movie selected.
              </p>
            )}
          </div>
        </Card>
      </div>

      {selectedMovie && selectedShowtime ? (
        <ShowtimeDetails
          movie={selectedMovie}
          showtime={selectedShowtime}
          bookings={bookings}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Showtime Details</CardTitle>
            <p className="text-sm text-muted-foreground">
              Select a movie and showtime to see seat slots and booking data.
            </p>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
