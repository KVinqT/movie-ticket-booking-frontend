import { delay } from "./mock/_delay";
import { mockBookings, mockBookingSeats } from "./mock/bookings";
import { mockUsers } from "./mock/users";
import { mockShowtimes } from "./mock/showtimes";
import { mockMovies } from "./mock/movies";
import { mockTheaters, mockTheaterSeats } from "./mock/theaters";
import type { Booking, BookingDetail, CreateBookingPayload } from "./types";
import { generateBookingRef } from "../booking";

function assembleDetail(booking: Booking): BookingDetail {
  const user = mockUsers.find((u) => u.id === booking.user_id)!;
  const showtime = mockShowtimes.find((s) => s.id === booking.showtime_id)!;
  const movie = mockMovies.find((m) => m.id === showtime.movie_id)!;
  const theater = mockTheaters.find((t) => t.id === showtime.theater_id)!;

  const bSeats = mockBookingSeats
    .filter((bs) => bs.booking_id === booking.id)
    .map((bs) => ({
      ...bs,
      seat: mockTheaterSeats.find((s) => s.id === bs.seat_id)!,
    }));

  return {
    ...booking,
    user,
    booking_seats: bSeats,
    showtime: { ...showtime, movie, theater },
  };
}

export async function getBookingsByShowtime(
  showtimeId: number
): Promise<BookingDetail[]> {
  await delay();
  return mockBookings
    .filter((b) => b.showtime_id === showtimeId)
    .map(assembleDetail);
}

export async function getMyBookings(userId: number): Promise<BookingDetail[]> {
  await delay();
  return mockBookings.filter((b) => b.user_id === userId).map(assembleDetail);
}

export async function createBooking(
  payload: CreateBookingPayload,
  userId: number
): Promise<Booking> {
  await delay();

  const seats = mockTheaterSeats.filter((s) => payload.seat_ids.includes(s.id));
  const total_amount = seats.reduce((sum, s) => sum + s.base_price, 0);

  const newBooking: Booking = {
    id: mockBookings.length + 1,
    user_id: userId,
    showtime_id: payload.showtime_id,
    booking_ref: generateBookingRef(),
    total_amount,
    status: "confirmed",
    booked_at: new Date().toISOString(),
  };

  const newBookingSeats = payload.seat_ids.map((seatId, i) => ({
    id: mockBookingSeats.length + 1 + i,
    booking_id: newBooking.id,
    seat_id: seatId,
    price_at_booking: seats.find((s) => s.id === seatId)?.base_price ?? 0,
  }));

  mockBookings.push(newBooking);
  mockBookingSeats.push(...newBookingSeats);

  return newBooking;
}

export async function cancelBooking(bookingId: number): Promise<Booking> {
  await delay();
  const booking = mockBookings.find((b) => b.id === bookingId);
  if (!booking) throw { status: 404, message: "Booking not found" };
  booking.status = "cancelled";
  return { ...booking };
}
