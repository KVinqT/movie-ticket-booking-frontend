import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Enter a valid email."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/** Matches the server Movie entity fields exactly */
export const movieSchema = z.object({
  movie_name: z.string().min(1, "Movie name is required."),
  director: z.string().min(1, "Director is required."),
  movie_poster_url: z.string().min(1, "Poster URL is required."),
  genre: z.string().min(1, "Genre is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
});

/**
 * A single showtime row inside the movie form.
 * id = 0  → new showtime (server will INSERT)
 * id > 0  → existing showtime (server will UPDATE)
 */
export const showtimeEntrySchema = z.object({
  id: z.number().default(0),
  theater_id: z.number().min(1, "Select a theater"),
  show_datetime: z
    .string()
    .min(1, "Pick a date and time")
    .refine(
      (v) => !isNaN(new Date(v).getTime()),
      "Enter a valid date and time",
    ),
});

/** Full form schema for the Create Movie page */
export const createMovieFormSchema = movieSchema.extend({
  showtimes: z
    .array(showtimeEntrySchema)
    .min(1, "Add at least one showtime before saving."),
});

/**
 * Relaxed showtime row for edit mode.
 * - Completely blank rows are valid (they will be ignored on submit).
 * - Partially filled rows (only theater OR only datetime) are rejected.
 */
export const editShowtimeEntrySchema = z
  .object({
    id: z.number().default(0),
    theater_id: z.number().default(0),
    show_datetime: z.string().default(""),
  })
  .superRefine((val, ctx) => {
    const hasTheater = val.theater_id > 0;
    const hasDatetime = val.show_datetime.trim() !== "";
    if (hasTheater && !hasDatetime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pick a date and time",
        path: ["show_datetime"],
      });
    }
    if (!hasTheater && hasDatetime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a theater",
        path: ["theater_id"],
      });
    }
  });

/**
 * Edit movie form — poster is optional so the admin can leave it unchanged.
 * Showtimes are optional: blank rows are ignored, partially filled rows error.
 */
export const editMovieFormSchema = movieSchema.extend({
  movie_poster_url: z.string().optional(),
  showtimes: z.array(editShowtimeEntrySchema),
});

export const editProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type MovieFormValues = z.infer<typeof movieSchema>;
export type ShowtimeEntryValues = z.infer<typeof showtimeEntrySchema>;
export type EditShowtimeEntryValues = z.infer<typeof editShowtimeEntrySchema>;
export type CreateMovieFormValues = z.infer<typeof createMovieFormSchema>;
export type EditMovieFormValues = z.infer<typeof editMovieFormSchema>;
export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
