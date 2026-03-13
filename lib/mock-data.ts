export type Role = "admin" | "user";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
};

export type Seat = {
  id: string;
  label: string;
  isBooked: boolean;
};

export type Showtime = {
  id: string;
  time: string;
  price: number;
  seats: Seat[];
};

export type Movie = {
  id: string;
  title: string;
  genre: string;
  durationMinutes: number;
  description: string;
  posterUrl: string;
  showtimes: Showtime[];
};

export type Booking = {
  id: string;
  userId: string;
  movieId: string;
  showtimeId: string;
  seatId: string;
  seatLabel: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  policyType: "cancel-24h" | "expire-2h";
  expiresAt: string;
  bookedAt: string;
};

const createSeats = (
  count: number,
  bookedSeatIndexes: number[] = [],
): Seat[] => {
  return Array.from({ length: count }, (_, index) => {
    const row = String.fromCharCode(65 + Math.floor(index / 8));
    const col = (index % 8) + 1;
    return {
      id: `seat-${index + 1}`,
      label: `${row}${col}`,
      isBooked: bookedSeatIndexes.includes(index),
    };
  });
};

export const mockUsers: User[] = [
  {
    id: "u-admin",
    name: "Cinema Admin",
    email: "admin@movie.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "u-user",
    name: "May Phyu",
    email: "user@movie.com",
    password: "user123",
    role: "user",
  },
];

export const initialMovies: Movie[] = [
  {
    id: "m1",
    title: "Shadow Protocol",
    genre: "Action",
    durationMinutes: 125,
    description: "A fast-paced action thriller with world-class stunts.",
    posterUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80",
    showtimes: [
      {
        id: "s1",
        time: "2026-03-15T13:30:00",
        price: 8,
        seats: createSeats(40, [2, 6, 10, 11, 14]),
      },
      {
        id: "s2",
        time: "2026-03-15T18:00:00",
        price: 10,
        seats: createSeats(40, [0, 1, 8, 9, 16, 17]),
      },
    ],
  },
  {
    id: "m2",
    title: "Green Horizon",
    genre: "Sci-Fi",
    durationMinutes: 118,
    description: "A futuristic journey to save humanity from climate collapse.",
    posterUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1000&q=80",
    showtimes: [
      {
        id: "s3",
        time: "2026-03-15T15:45:00",
        price: 9,
        seats: createSeats(32, [3, 4, 18, 19]),
      },
    ],
  },
];
