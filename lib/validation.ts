import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const movieSchema = z.object({
  title: z.string().min(2, "Movie title is required."),
  genre: z.string().min(2, "Genre is required."),
  durationMinutes: z.number().min(60, "Duration must be at least 60 minutes."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  posterUrl: z.string().url("Poster must be a valid URL."),
});

export const showtimeSchema = z.object({
  movieId: z.string().min(1, "Select a movie."),
  time: z.string().min(1, "Showtime is required."),
  price: z.number().min(1, "Price must be at least 1."),
  seatCount: z
    .number()
    .min(8, "Need at least 8 seats.")
    .max(80, "Max 80 seats."),
});

export const bookingCustomerSchema = z.object({
  customerName: z.string().min(2, "Name is required."),
  customerEmail: z.string().email("Enter a valid email."),
  customerPhone: z
    .string()
    .min(7, "Phone number is too short.")
    .max(20, "Phone number is too long."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type MovieFormValues = z.infer<typeof movieSchema>;
export type ShowtimeFormValues = z.infer<typeof showtimeSchema>;
export type BookingCustomerFormValues = z.infer<typeof bookingCustomerSchema>;
