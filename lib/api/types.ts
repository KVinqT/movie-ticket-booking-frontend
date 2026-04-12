// lib/api/types.ts
// Single source of truth for all API entity types.
// Rule: always import from here — never redefine shapes inline in components.

// ── Primitive union types ──────────────────────────────────────────────────

export type UserRole = "admin" | "client";
export type ShowtimeStatus = "scheduled" | "cancelled" | "completed";
export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type SeatType = "standard" | "vip" | "premium";
export type SeatAvailabilityStatus = "available" | "booked";

// ── Base entity interfaces (mirror the DB schema exactly) ──────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Movie {
  id: number;
  movie_name: string;
  director: string;
  movie_poster_url: string;
  genre: string;
  description: string;
  created_by: number;
  created_at: string;
}

// GET /admin/movies — includes the joined creator (admin user who added the movie)
export interface AdminMovie extends Movie {
  creator: User;
}

export interface Theater {
  id: number;
  name: string;
  total_rows: number;
  total_columns: number;
}

export interface TheaterSeat {
  id: number;
  theater_id: number;
  row_label: string;
  column_number: number;
  seat_name: string;
  seat_type: SeatType;
  base_price: number;
  is_active: boolean;
}

export interface Showtime {
  id: number;
  movie_id: number;
  theater_id: number;
  show_datetime: string;
  status: ShowtimeStatus;
  created_at: string;
  // optionally joined
  movie?: Movie;
  theater?: Theater;
}

export interface Booking {
  id: number;
  user_id: number;
  showtime_id: number;
  booking_ref: string; // generate a booking ref format --> (TFX-2026-0001)
  total_amount: number;
  status: BookingStatus;
  booked_at: string;
}

export interface BookingSeat {
  id: number;
  booking_id: number;
  seat_id: number;
  price_at_booking: number;
}

// ── Derived / computed shapes ──────────────────────────────────────────────

// to get the status of the seat, first we need to query the bookings by the showtime id
// and then we will get the booking_id and then we need to query the booking seats by that booking id
// if the seat_id is found inside booking_seats table, then the seat is booked, otherwise it is available
export interface SeatAvailability extends TheaterSeat {
  status: SeatAvailabilityStatus;
}

// ── Admin-side composed response types ────────────────────────────────────

// GET /admin/movies/:id
// response: AdminMovieDetail
//
// AdminMovieDetail extends Movie and composes the nested joins like this:
//
// Movie
// └── showtimes[]          (query showtimes by movie_id)
//     ├── theater          (query theater by theater_id)
//     ├── capacity         (theater.total_rows × theater.total_columns)
//     ├── available_seats  (capacity − count of booked seats for this showtime)
//     ├── revenue          (sum of confirmed booking total_amounts)
//     └── bookings[]       (query bookings by showtime_id)
//         ├── user         (query user by user_id)
//         └── booked_seats[]  (query booking_seats by booking_id)
//             └── seat     (query theater_seat by seat_id)

// query the booked seats by the booking id
export interface AdminBookingDetail extends Booking {
  // query user by user_id
  user: User;
  // query the booked seats by the booking id
  booked_seats: (BookingSeat & {
    // query the seat by the seat_id
    seat: TheaterSeat;
  })[];
}

// query the bookings by the showtime id
export interface AdminShowtimeDetail extends Omit<Showtime, "theater"> {
  // query theater by the theater_id — always present on this response (not optional)
  theater: Theater;
  // calculate based on the total rows and total columns
  capacity: number;
  // calculate based on the total rows and total columns minus the booked seats
  available_seats: number;
  // calculate based on the base price of the seats in confirmed bookings
  revenue: number;
  // query the bookings by the showtime id
  bookings: AdminBookingDetail[];
}

// query showtimes by the movie_id
export interface AdminMovieDetail extends Movie {
  showtimes: AdminShowtimeDetail[];
}

// ── Client-side composed response types ───────────────────────────────────

// GET /client/movies/:id
// response: ClientMovieDetail
//
// ClientMovieDetail extends Movie and composes the nested joins like this:
//
// Movie
// └── showtimes[]   (query showtimes by movie_id, status = "scheduled")
//     ├── theater   (query theater by theater_id)
//     └── seats[]   (query theater_seats by theater_id)
//         └── status  (available | booked — derived from booking_seats)

// query the seats by the theater id
export interface ClientShowtimeDetail extends Omit<Showtime, "theater"> {
  // query theater by the theater_id — always present on this response (not optional)
  theater: Theater;
  // query the seats by the theater_id
  // to get the status of the seat, first we need to query the bookings by the showtime id
  // and then we will get the booking_id and then we need to query the booking seats by that booking id
  // if the seat_id is found inside booking_seats table, then the seat is booked, otherwise it is available
  seats: SeatAvailability[];
}

// query showtimes by the movie_id (only upcoming / scheduled ones)
export interface ClientMovieDetail extends Movie {
  showtimes: ClientShowtimeDetail[];
}

// ── Client profile page ───────────────────────────────────────────────────

// GET /client/profile
// method: GET
// response: UserProfileResponse
//
// UserProfileResponse composes the nested joins like this:
//
// User
// └── bookings[]           (query bookings by user_id)
//     ├── booking_ref      (TFX-2026-0001)
//     ├── status           (pending | confirmed | cancelled)
//     ├── total_amount
//     ├── booked_at
//     ├── booked_seats[]   (query booking_seats by booking_id)
//     │   └── seat         (query theater_seat by seat_id → seat_name, seat_type, price_at_booking)
//     └── showtime         (query showtime by showtime_id)
//         ├── show_datetime
//         ├── status
//         ├── movie        (query movie by movie_id → movie_name, movie_poster_url, genre)
//         └── theater      (query theater by theater_id → name)

// query the booked seats by the booking id
export interface ClientBookingDetail extends Booking {
  // query the booked seats by the booking id
  booked_seats: (BookingSeat & {
    // query the seat by the seat_id
    seat: TheaterSeat;
  })[];
  // query showtime by the showtime_id
  showtime: Omit<Showtime, "movie" | "theater"> & {
    // query movie by the movie_id
    movie: Movie;
    // query theater by the theater_id
    theater: Theater;
  };
}

// query bookings by the user_id
export interface UserProfileResponse {
  // query user by the user_id (from auth token / session)
  user: User;
  bookings: ClientBookingDetail[];
}

// endpoint: PATCH /client/profile
// method: PATCH
// payload: UpdateProfilePayload
// response: User
export interface UpdateProfilePayload {
  name: string;
  email: string;
}

// ── Admin edit movie ──────────────────────────────────────────────────────

// endpoint: PATCH /admin/movies/:id
// method: PATCH
// payload: EditMoviePayload  (only the fields the admin wants to change)
// response: Movie
export interface EditMoviePayload {
  movie_name?: string;
  director?: string;
  movie_poster_url?: string;
  genre?: string;
  description?: string;
}

// ── Admin manage users page ───────────────────────────────────────────────

// GET /admin/users
// method: GET
// response: AdminUsersResponse
//
// AdminUsersResponse composes the data needed for the user management page:
//
// Stats (computed from the users table)
// ├── total_count    (count of all users)
// ├── clients_count  (count of users where role = "client")
// └── admins_count   (count of users where role = "admin")
//
// Users[]  (query all users from the users table)
// └── User  (id, name, email, role, created_at)

// stats computed from the users table
export interface AdminUsersStats {
  total_count: number; // count of all users
  clients_count: number; // count of users where role = "client"
  admins_count: number; // count of users where role = "admin"
}

// query all users
export interface AdminUsersResponse {
  stats: AdminUsersStats;
  // query all users from the users table
  users: User[];
}

// endpoint: DELETE /admin/users/:id
// method: DELETE
// response: { deleted_id: number }
export interface DeleteUserResponse {
  deleted_id: number;
}

// ── Auth types ────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// ── Query params ──────────────────────────────────────────────────────────

// endpoint: GET /movie/movies  (for both client and admin)
// method: GET
// response: PaginatedResponse<Movie>
export interface MovieQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  genre?: string;
}

// ── Payload types (request bodies) ───────────────────────────────────────

// endpoint: POST /movie/create
// method: POST
// response: Movie
export interface CreateMoviePayload {
  movie_name: string;
  director: string;
  movie_poster_url: string;
  genre: string;
  description: string;
}

// a showtime is created when a movie is created
// endpoint: POST /showtime/create
// method: POST
// payload is an array: Array<CreateShowtimePayload>
// response: Showtime[]
export interface CreateShowtimePayload {
  movie_id: number;
  theater_id: number;
  show_datetime: string;
}

// payload for create booking (from client side)
// endpoint: POST /booking/create
// method: POST
// payload: CreateBookingPayload
// response: Booking
export interface CreateBookingPayload {
  showtime_id: number;
  seat_ids: number[];
}

// ── Generic response wrappers ─────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

// ── Dashboard ─────────────────────────────────────────────────────────────

// endpoint: GET /admin/dashboard
// method: GET
// response: DashboardResponse
// 1. get all bookings count
// 2. get all showtimes count
// 3. get all theaters count
export interface DashboardResponse {
  bookings_count: number;
  showtimes_count: number;
  theaters_count: number;
}

// ── Legacy alias kept for internal mock-layer compatibility ───────────────

// @deprecated Use AdminBookingDetail instead.
// Kept so existing mock assembler code does not break during the real-API migration.
export interface BookingDetail extends Booking {
  user: User;
  booking_seats: (BookingSeat & { seat: TheaterSeat })[];
  showtime: Showtime & { movie: Movie; theater: Theater };
}

// ── Server raw response types (exact shapes returned by the real API) ─────────
//
// The server sends decimal strings for money ("10000.00") and 0/1 for booleans.
// These types mirror the wire format exactly; normalise to canonical types at
// the API layer before passing data into components.

/** Raw seat as returned by the server inside movie detail */
export interface ServerSeat {
  id: number;
  theater_id: number;
  row_label: string;
  column_number: number;
  seat_name: string;
  seat_type: SeatType;
  base_price: string;   // decimal string e.g. "10000.00"
  is_active: 0 | 1;    // integer, not boolean
  created_at: string;
  updated_at: string;
}

/** Raw booking-seat join row as returned by the server */
export interface ServerBookingSeat {
  id: number;
  booking_id: number;
  seat_id: number;
  price_at_booking: string;
  seat: ServerSeat;
  created_at: string;
  updated_at: string;
}

/**
 * Booking as returned inside GET /movies/:id
 * Uses `seats` (not `booking_seats`) and string money fields.
 */
export interface ServerBookingDetail {
  id: number;
  user_id: number;
  showtime_id: number;
  booking_ref: string;
  total_amount: string;
  status: BookingStatus;
  booked_at: string;
  created_at: string;
  updated_at: string;
  seats: ServerBookingSeat[];
  user: User;
}

/** Theater with seat list and server-computed seat counts */
export interface ServerTheaterWithSeats extends Theater {
  total_seats: number;
  active_seats: number;
  booked_seats: number;
  seats: ServerSeat[];
}

/** Showtime with embedded theater+seats and booking list */
export interface ServerShowtime {
  id: number;
  movie_id: number;
  theater_id: number;
  show_datetime: string;
  status: ShowtimeStatus;
  created_at: string;
  updated_at: string;
  theater: ServerTheaterWithSeats;
  bookings: ServerBookingDetail[];
}

/** Full movie detail returned by GET /movies/:id */
export interface ServerMovieDetail extends AdminMovie {
  showtimes: ServerShowtime[];
}

/** Payload for POST /bookings */
export interface CreateBookingPayloadV2 {
  user_id: number;
  showtime_id: number;
  seats: number[];
}

/**
 * Derives SeatAvailability[] from a ServerShowtime.
 * Seats appearing in any non-cancelled booking are marked "booked".
 */
export function deriveSeatsFromShowtime(
  showtime: ServerShowtime,
): SeatAvailability[] {
  const bookedIds = new Set(
    showtime.bookings
      .filter((b) => b.status !== "cancelled")
      .flatMap((b) => b.seats.map((s) => s.seat_id)),
  );

  return showtime.theater.seats.map((s) => ({
    id: s.id,
    theater_id: s.theater_id,
    row_label: s.row_label,
    column_number: s.column_number,
    seat_name: s.seat_name,
    seat_type: s.seat_type,
    base_price: parseFloat(s.base_price),
    is_active: s.is_active === 1,
    status: bookedIds.has(s.id) ? "booked" : "available",
  }));
}

// ── Theater list response ─────────────────────────────────────────────────────

/** Theater from GET /theaters — includes seat list, no computed counts */
export interface ServerTheaterList extends Theater {
  seats: ServerSeat[];
}

/** Wrapper returned by GET /theaters */
export interface ServerTheatersResponse {
  status: string;
  data: ServerTheaterList[];
}

// ── User profile response ─────────────────────────────────────────────────────

/** A single booking as embedded in GET /users/:id */
export interface ServerUserBooking {
  id: number;
  user_id: number;
  showtime_id: number;
  booking_ref: string;
  total_amount: string;
  status: BookingStatus;
  booked_at: string;
  created_at: string;
  updated_at: string;
  showtime: {
    id: number;
    movie_id: number;
    theater_id: number;
    show_datetime: string;
    status: ShowtimeStatus;
    theater: Theater;
    movie: Movie;
  };
  seats: ServerBookingSeat[];
}

/** Full user profile returned by GET /users/:id */
export interface ServerUserProfile {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  bookings: ServerUserBooking[];
}

/** Payload for PUT /users/:id */
export interface UpdateProfilePayloadV2 {
  name: string;
  email: string;
}
