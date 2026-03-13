"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AppHeader } from "@/components/dashboard/app-header";
import { useAuth } from "@/components/providers/auth-provider";
import { UserDashboard } from "@/components/user/user-dashboard";
import { type Booking, initialMovies, type Movie } from "@/lib/mock-data";
import {
  type BookingCustomerFormValues,
  type MovieFormValues,
  type ShowtimeFormValues,
} from "@/lib/validation";

const createSeats = (count: number) => {
  return Array.from({ length: count }, (_, index) => {
    const row = String.fromCharCode(65 + Math.floor(index / 8));
    const col = (index % 8) + 1;
    return {
      id: `seat-${crypto.randomUUID()}`,
      label: `${row}${col}`,
      isBooked: false,
    };
  });
};

export default function Home() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<string>(
    initialMovies[0]?.id ?? "",
  );
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string>(
    initialMovies[0]?.showtimes[0]?.id ?? "",
  );
  const [selectedSeatId, setSelectedSeatId] = useState<string>("");

  const selectedMovie = useMemo(
    () => movies.find((movie) => movie.id === selectedMovieId) ?? movies[0],
    [movies, selectedMovieId],
  );
  const selectedShowtime = useMemo(
    () =>
      selectedMovie?.showtimes.find(
        (showtime) => showtime.id === selectedShowtimeId,
      ),
    [selectedMovie, selectedShowtimeId],
  );

  const userBookings = useMemo(() => {
    if (!currentUser) return [];
    return bookings.filter((booking) => booking.userId === currentUser.id);
  }, [bookings, currentUser]);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  const onAddMovie = (values: MovieFormValues) => {
    const newMovie: Movie = {
      id: `m-${crypto.randomUUID()}`,
      title: values.title,
      genre: values.genre,
      durationMinutes: values.durationMinutes,
      description: values.description,
      posterUrl: values.posterUrl,
      showtimes: [],
    };

    setMovies((prev) => [...prev, newMovie]);
  };

  const onAddShowtime = (values: ShowtimeFormValues) => {
    const newShowtime = {
      id: `s-${crypto.randomUUID()}`,
      time: new Date(values.time).toISOString(),
      price: values.price,
      seats: createSeats(values.seatCount),
    };

    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === values.movieId
          ? { ...movie, showtimes: [...movie.showtimes, newShowtime] }
          : movie,
      ),
    );
  };

  const handleBookSeat = (values: BookingCustomerFormValues) => {
    if (!selectedMovie || !selectedShowtime || !selectedSeatId) {
      return null;
    }

    const seat = selectedShowtime.seats.find(
      (item) => item.id === selectedSeatId,
    );
    if (!seat || seat.isBooked) {
      return null;
    }

    const bookedAt = new Date();
    const showtimeAt = new Date(selectedShowtime.time);
    const gapHours =
      (showtimeAt.getTime() - bookedAt.getTime()) / (1000 * 60 * 60);
    const policyType = gapHours >= 24 ? "cancel-24h" : "expire-2h";
    const expiresAt = new Date(
      bookedAt.getTime() +
        (policyType === "cancel-24h" ? 24 : 2) * 60 * 60 * 1000,
    ).toISOString();

    setMovies((prev) =>
      prev.map((movie) => {
        if (movie.id !== selectedMovie.id) return movie;
        return {
          ...movie,
          showtimes: movie.showtimes.map((showtime) => {
            if (showtime.id !== selectedShowtime.id) return showtime;
            return {
              ...showtime,
              seats: showtime.seats.map((existingSeat) =>
                existingSeat.id === selectedSeatId
                  ? { ...existingSeat, isBooked: true }
                  : existingSeat,
              ),
            };
          }),
        };
      }),
    );

    setBookings((prev) => [
      ...prev,
      {
        id: `b-${crypto.randomUUID()}`,
        userId: currentUser.id,
        movieId: selectedMovie.id,
        showtimeId: selectedShowtime.id,
        seatId: seat.id,
        seatLabel: seat.label,
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        policyType,
        expiresAt,
        bookedAt: bookedAt.toISOString(),
      },
    ]);
    setSelectedSeatId("");

    if (policyType === "cancel-24h") {
      return "Booking successful. This booking might be canceled after 24 hours if not confirmed.";
    }

    return "Booking successful. This booking might expire after 2 hours because showtime is within 24 hours.";
  };

  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AppHeader currentUser={currentUser} onLogout={logout} />

        {currentUser.role === "admin" ? (
          <AdminDashboard
            movies={movies}
            bookings={bookings}
            onAddMovie={onAddMovie}
            onAddShowtime={onAddShowtime}
          />
        ) : (
          <UserDashboard
            movies={movies}
            userBookings={userBookings}
            selectedMovieId={selectedMovieId}
            selectedShowtimeId={selectedShowtimeId}
            selectedSeatId={selectedSeatId}
            onSelectMovie={(movieId) => {
              const movie = movies.find((item) => item.id === movieId);
              setSelectedMovieId(movieId);
              setSelectedShowtimeId(movie?.showtimes[0]?.id ?? "");
              setSelectedSeatId("");
            }}
            onSelectShowtime={(showtimeId) => {
              setSelectedShowtimeId(showtimeId);
              setSelectedSeatId("");
            }}
            onSelectSeat={setSelectedSeatId}
            onBookSeat={handleBookSeat}
          />
        )}
      </div>
    </main>
  );
}
