"use client";

import { formatDateTime } from "@/lib/format";
import { type Booking, type Movie, type Showtime } from "@/lib/mock-data";

type ShowtimeDetailsProps = {
  movie: Movie;
  showtime: Showtime;
  bookings: Booking[];
};

export function ShowtimeDetails({
  movie,
  showtime,
  bookings,
}: ShowtimeDetailsProps) {
  const totalSeats = showtime.seats.length;
  const bookedSeats = showtime.seats.filter((seat) => seat.isBooked).length;
  const availableSeats = totalSeats - bookedSeats;
  const showtimeBookings = bookings.filter(
    (booking) =>
      booking.movieId === movie.id && booking.showtimeId === showtime.id,
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-xs text-muted-foreground">Movie</p>
          <p className="font-semibold">{movie.title}</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-xs text-muted-foreground">Showtime</p>
          <p className="font-semibold">{formatDateTime(showtime.time)}</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-xs text-muted-foreground">Seat Slots</p>
          <p className="font-semibold text-primary">{totalSeats}</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-xs text-muted-foreground">Booked Count</p>
          <p className="font-semibold text-primary">{bookedSeats}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="mb-3 text-sm text-muted-foreground">Seat Map</p>
        <div className="mb-4 h-2 w-full rounded bg-primary/40" />
        <div className="grid grid-cols-8 gap-2">
          {showtime.seats.map((seat) => (
            <div
              key={seat.id}
              className={`rounded-md px-2 py-2 text-center text-xs font-medium ${
                seat.isBooked
                  ? "bg-zinc-700 text-zinc-300"
                  : "bg-muted text-foreground"
              }`}
            >
              {seat.label}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>Total: {totalSeats}</span>
          <span>Booked: {bookedSeats}</span>
          <span>Available: {availableSeats}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="border-b border-border bg-muted/30 px-4 py-3">
          <p className="text-sm font-semibold">
            Booking Records (from mock session)
          </p>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/20 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Booking ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Seat</th>
              <th className="px-4 py-3 font-medium">Policy</th>
              <th className="px-4 py-3 font-medium">Expires At</th>
              <th className="px-4 py-3 font-medium">Booked At</th>
            </tr>
          </thead>
          <tbody>
            {showtimeBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-muted-foreground">
                  No booking records yet for this showtime.
                </td>
              </tr>
            ) : (
              showtimeBookings.map((booking) => (
                <tr key={booking.id} className="border-t border-border">
                  <td className="px-4 py-3">{booking.id}</td>
                  <td className="px-4 py-3">{booking.customerName}</td>
                  <td className="px-4 py-3">
                    <div>{booking.customerEmail}</div>
                    <div className="text-xs text-muted-foreground">
                      {booking.customerPhone}
                    </div>
                  </td>
                  <td className="px-4 py-3">{booking.seatLabel}</td>
                  <td className="px-4 py-3">
                    {booking.policyType === "cancel-24h"
                      ? "Cancel after 24h"
                      : "Expire after 2h"}
                  </td>
                  <td className="px-4 py-3">
                    {formatDateTime(booking.expiresAt)}
                  </td>
                  <td className="px-4 py-3">
                    {formatDateTime(booking.bookedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
