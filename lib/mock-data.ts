import { Slot } from "@/app/admin/movies/_components/columns";

export type Role = "admin" | "user";

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

export type User = {
  id: string;
  userName: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: Role;
  bookedInfo?: Array<{
    movieName: string;
    moviePoster: string;
    bookTime: string;
    showDate: string;
    slots: Slot;
  }>;
};

export const mockUsers: User[] = [
  {
    id: "u-admin",
    userName: "Cinema Admin",
    email: "admin@movie.com",
    phoneNumber: "097823737",
    password: "admin123",
    role: "admin",
  },
  {
    id: "u-user",
    userName: "May Phyu",
    email: "user@movie.com",
    phoneNumber: "0923723733",
    password: "user123",
    role: "user",
    bookedInfo: [
      {
        movieName: "Spider Man",
        moviePoster:
          "https://cdn1.epicgames.com/offer/f696430be718494fac1d6542cfb22542/EGS_MarvelsSpiderManMilesMorales_InsomniacGamesNixxesSoftware_S2_1200x1600-58989e7116de3f70a2ae6ea56ee202c6",
        bookTime: "16:30PM",
        showDate: "2026-04-15T18:30:00Z",
        slots: {
          id: "1",
          slotName: "A-01",
          slotType: "Normal Seat",
          slotPrice: "7000 MMK",
          movieId: "1",
          isReserved: true,
        },
      },
    ],
  },
];
