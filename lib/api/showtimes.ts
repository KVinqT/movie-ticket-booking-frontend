import { delay } from "./mock/_delay";
import { mockShowtimes } from "./mock/showtimes";
import { mockTheaterSeats, mockTheaters } from "./mock/theaters";
import { mockBookings, mockBookingSeats } from "./mock/bookings";
import type { Showtime, SeatAvailability, CreateShowtimePayload } from "./types";

export async function getShowtimesByMovie(movieId: number): Promise<Showtime[]> {
  await delay();
  return mockShowtimes.filter((s) => s.movie_id === movieId);
}

export async function getSeatsByShowtime(
  showtimeId: number,
): Promise<SeatAvailability[]> {
  await delay();

  const showtime = mockShowtimes.find((s) => s.id === showtimeId);
  if (!showtime) throw { status: 404, message: "Showtime not found" };

  const theaterSeats = mockTheaterSeats.filter(
    (seat) => seat.theater_id === showtime.theater_id && seat.is_active,
  );

  const bookedSeatIds = new Set<number>();
  const bookingsForShowtime = mockBookings.filter(
    (b) => b.showtime_id === showtimeId && b.status !== "cancelled",
  );
  for (const booking of bookingsForShowtime) {
    const bSeats = mockBookingSeats.filter(
      (bs) => bs.booking_id === booking.id,
    );
    for (const bs of bSeats) bookedSeatIds.add(bs.seat_id);
  }

  return theaterSeats.map((seat) => ({
    ...seat,
    status: bookedSeatIds.has(seat.id) ? "booked" : "available",
  }));
}

export async function createShowtime(
  payload: CreateShowtimePayload,
): Promise<Showtime> {
  await delay();

  const theater = mockTheaters.find((t) => t.id === payload.theater_id);
  if (!theater) throw { status: 404, message: "Theater not found" };

  const newShowtime: Showtime = {
    id: mockShowtimes.length + 1,
    movie_id: payload.movie_id,
    theater_id: payload.theater_id,
    show_datetime: payload.show_datetime,
    status: "scheduled",
    created_at: new Date().toISOString(),
    theater,
  };

  mockShowtimes.push(newShowtime);
  return newShowtime;
}

export async function deleteShowtime(id: number): Promise<void> {
  await delay();
  const idx = mockShowtimes.findIndex((s) => s.id === id);
  if (idx === -1) throw { status: 404, message: "Showtime not found" };
  mockShowtimes.splice(idx, 1);
}
