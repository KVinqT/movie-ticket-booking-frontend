import type { Booking, BookingSeat } from "../types";

export const mockBookings: Booking[] = [
  // User 2 (May Phyu) — showtime 1 (Spider-Man, 14:30)
  {
    id: 1,
    user_id: 2,
    showtime_id: 1,
    booking_ref: "TFX-2026-0001",
    total_amount: 14000,
    status: "confirmed",
    booked_at: "2026-04-01T10:00:00Z",
  },
  // User 3 (Htet Aung Lin) — showtime 1 (Spider-Man, 14:30)
  {
    id: 2,
    user_id: 3,
    showtime_id: 1,
    booking_ref: "TFX-2026-0002",
    total_amount: 7000,
    status: "confirmed",
    booked_at: "2026-04-01T11:00:00Z",
  },
  // User 2 (May Phyu) — showtime 4 (Dark Knight)
  {
    id: 3,
    user_id: 2,
    showtime_id: 4,
    booking_ref: "TFX-2026-0003",
    total_amount: 10000,
    status: "confirmed",
    booked_at: "2026-04-02T09:00:00Z",
  },
  // User 4 (Sarah Jenkins) — showtime 6 (Demon Slayer)
  {
    id: 4,
    user_id: 4,
    showtime_id: 6,
    booking_ref: "TFX-2026-0004",
    total_amount: 25000,
    status: "confirmed",
    booked_at: "2026-04-03T14:00:00Z",
  },
  // User 5 (Min Khant Zaw) — showtime 2 (Spider-Man, 18:30)
  {
    id: 5,
    user_id: 5,
    showtime_id: 2,
    booking_ref: "TFX-2026-0005",
    total_amount: 7000,
    status: "pending",
    booked_at: "2026-04-05T16:00:00Z",
  },
];

// Each entry maps a booking to the seats that were reserved
export const mockBookingSeats: BookingSeat[] = [
  // Booking 1: seats A-01 (id=1) and A-02 (id=2) in theater 1
  { id: 1, booking_id: 1, seat_id: 1, price_at_booking: 7000 },
  { id: 2, booking_id: 1, seat_id: 2, price_at_booking: 7000 },
  // Booking 2: seat A-03 (id=3) in theater 1
  { id: 3, booking_id: 2, seat_id: 3, price_at_booking: 7000 },
  // Booking 3: seat D-01 (id=25) in theater 1 (vip)
  { id: 4, booking_id: 3, seat_id: 25, price_at_booking: 10000 },
  // Booking 4: seats E-01 (id=33) and E-02 (id=34) in theater 1 (premium)
  { id: 5, booking_id: 4, seat_id: 41, price_at_booking: 7000 },
  { id: 6, booking_id: 4, seat_id: 53, price_at_booking: 10000 },
  { id: 7, booking_id: 4, seat_id: 59, price_at_booking: 15000 },
  // Booking 5: seat A-04 (id=4) in theater 1
  { id: 8, booking_id: 5, seat_id: 4, price_at_booking: 7000 },
];
