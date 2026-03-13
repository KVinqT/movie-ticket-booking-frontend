"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar, Clock3, Film } from "lucide-react";

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
import { formatDateTime } from "@/lib/format";
import { type Booking, type Movie } from "@/lib/mock-data";
import {
  type BookingCustomerFormValues,
  bookingCustomerSchema,
} from "@/lib/validation";

type UserDashboardProps = {
  movies: Movie[];
  userBookings: Booking[];
  selectedMovieId: string;
  selectedShowtimeId: string;
  selectedSeatId: string;
  onSelectMovie: (movieId: string) => void;
  onSelectShowtime: (showtimeId: string) => void;
  onSelectSeat: (seatId: string) => void;
  onBookSeat: (values: BookingCustomerFormValues) => string | null;
};

export function UserDashboard({
  movies,
  userBookings,
  selectedMovieId,
  selectedShowtimeId,
  selectedSeatId,
  onSelectMovie,
  onSelectShowtime,
  onSelectSeat,
  onBookSeat,
}: UserDashboardProps) {
  const [toastMessage, setToastMessage] = useState<string>("");

  const bookingForm = useForm<BookingCustomerFormValues>({
    resolver: zodResolver(bookingCustomerSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
    },
  });

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(""), 5000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const selectedMovie =
    movies.find((movie) => movie.id === selectedMovieId) ?? movies[0];
  const selectedShowtime = selectedMovie?.showtimes.find(
    (showtime) => showtime.id === selectedShowtimeId,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film size={18} />
            Movies
          </CardTitle>
          <CardDescription>
            Select movie and showtime to book seats.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {movies.map((movie) => (
            <button
              key={movie.id}
              type="button"
              onClick={() => onSelectMovie(movie.id)}
              className={`w-full rounded-lg border p-3 text-left transition ${
                selectedMovieId === movie.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-muted/20 hover:border-primary/50"
              }`}
            >
              <p className="font-semibold">{movie.title}</p>
              <p className="text-xs text-muted-foreground">
                {movie.genre} • {movie.durationMinutes} mins
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{selectedMovie?.title}</CardTitle>
            <CardDescription>{selectedMovie?.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {selectedMovie?.showtimes.map((showtime) => (
                <Button
                  key={showtime.id}
                  variant={
                    selectedShowtimeId === showtime.id ? "default" : "secondary"
                  }
                  onClick={() => onSelectShowtime(showtime.id)}
                >
                  <Clock3 className="mr-1" size={14} />
                  {formatDateTime(showtime.time)}
                </Button>
              ))}
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="mb-3 text-sm text-muted-foreground">Screen</p>
              <div className="mb-4 h-2 w-full rounded bg-primary/40" />
              <div className="grid grid-cols-8 gap-2">
                {selectedShowtime?.seats.map((seat) => (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={seat.isBooked}
                    onClick={() => onSelectSeat(seat.id)}
                    className={`rounded-md px-2 py-2 text-xs font-medium ${
                      seat.isBooked
                        ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
                        : selectedSeatId === seat.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-primary/70"
                    }`}
                  >
                    {seat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">
                  <Calendar className="mr-1 inline" size={14} />
                  {selectedShowtime
                    ? formatDateTime(selectedShowtime.time)
                    : "No showtime selected"}
                </p>
                <p className="font-semibold text-primary">
                  Price: ${selectedShowtime?.price ?? 0} / ticket
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/10 p-4">
              <p className="mb-3 text-sm font-semibold">Booking Information</p>
              <form
                className="grid gap-3 md:grid-cols-2"
                onSubmit={bookingForm.handleSubmit((values) => {
                  const policyMessage = onBookSeat(values);
                  if (!policyMessage) return;

                  setToastMessage(policyMessage);
                  bookingForm.reset({
                    customerName: "",
                    customerEmail: "",
                    customerPhone: "",
                  });
                })}
              >
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="customerName">Booking Name</Label>
                  <Input
                    id="customerName"
                    {...bookingForm.register("customerName")}
                  />
                  <p className="text-xs text-red-400">
                    {bookingForm.formState.errors.customerName?.message}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    {...bookingForm.register("customerEmail")}
                  />
                  <p className="text-xs text-red-400">
                    {bookingForm.formState.errors.customerEmail?.message}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    {...bookingForm.register("customerPhone")}
                  />
                  <p className="text-xs text-red-400">
                    {bookingForm.formState.errors.customerPhone?.message}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <Button type="submit" disabled={!selectedSeatId}>
                    Book Selected Seat
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Booking History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {userBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings yet.</p>
            ) : (
              userBookings.map((booking) => {
                const movie = movies.find(
                  (item) => item.id === booking.movieId,
                );
                const showtime = movie?.showtimes.find(
                  (item) => item.id === booking.showtimeId,
                );
                return (
                  <div
                    key={booking.id}
                    className="rounded-lg border border-border bg-muted/20 p-3 text-sm"
                  >
                    <p className="font-semibold">{movie?.title}</p>
                    <p className="text-muted-foreground">
                      Seat {booking.seatLabel} •{" "}
                      {showtime ? formatDateTime(showtime.time) : "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.customerName} • {booking.customerPhone}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Booked at: {formatDateTime(booking.bookedAt)}
                    </p>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {toastMessage ? (
        <div className="fixed right-4 bottom-4 z-50 max-w-sm rounded-lg border border-primary/50 bg-card p-4 text-sm shadow-lg">
          <p className="font-semibold text-primary">Booking Policy Notice</p>
          <p className="mt-1 text-muted-foreground">{toastMessage}</p>
        </div>
      ) : null}
    </div>
  );
}
