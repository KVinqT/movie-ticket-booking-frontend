"use client";

import { useRouter } from "next/navigation";
import { Undo2, User2, Mail, CalendarDays, Ticket } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MoviePoster } from "@/components/shared/MoviePoster";
import EditProfileDialog from "@/components/shared/EditProfileDialog";
import { useAuth } from "@/components/providers/auth-provider";
import { useUserProfile } from "@/lib/api/client/users";
import { formatShowtime, formatDate } from "@/lib/date";
import { formatPrice } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const navigate = useRouter();

  const {
    data: profile,
    isLoading,
    isError,
  } = useUserProfile(currentUser?.id ?? 0);

  if (!currentUser) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-4 space-y-8">
      <button
        onClick={() => navigate.back()}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors w-fit"
      >
        <Undo2 className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </button>

      {/* ── User Card ── */}
      <div className="border rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white shadow-sm">
        {/* Avatar + info */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-zinc-100 border flex items-center justify-center shrink-0">
            <User2 className="w-7 h-7 text-zinc-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{currentUser.name}</h1>
            <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
              <Mail className="w-3.5 h-3.5" />
              {currentUser.email}
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <CalendarDays className="w-3 h-3" />
              Member since {formatDate(currentUser.created_at)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <EditProfileDialog />
          <Badge className="capitalize">{currentUser.role}</Badge>
        </div>
      </div>

      <Separator />

      {/* ── Bookings ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-zinc-500" />
          <h2 className="text-xl font-semibold">Your Bookings</h2>
          {profile && (
            <span className="text-xs text-zinc-400 ml-1">
              ({profile.bookings.filter((b) => !!b.showtime?.movie).length})
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-zinc-400">Loading…</div>
        ) : isError ? (
          <div className="py-10 text-center text-red-400">
            Failed to load bookings.
          </div>
        ) : (() => {
          // Only keep bookings that have valid movie data
          const validBookings = profile?.bookings.filter(
            (b) => !!b.showtime?.movie,
          ) ?? [];

          if (validBookings.length === 0) {
            return <p className="text-zinc-400 text-sm">No bookings yet.</p>;
          }

          return (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {validBookings.map((booking) => {
              const movie = booking.showtime!.movie!;
              const theater = booking.showtime?.theater ?? null;
              const showDatetime = booking.showtime?.show_datetime ?? null;
              const seatNames = booking.seats
                .map((bs) => bs.seat?.seat_name)
                .filter((n): n is string => Boolean(n));

              return (
                <div
                  key={booking.id}
                  className="group border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white"
                >
                  {/* Poster */}
                  <div className="relative w-full h-44 bg-zinc-900 overflow-hidden">
                    <MoviePoster
                      src={movie.movie_poster_url}
                      alt={movie.movie_name}
                      containerClassName="absolute inset-0 w-full h-full rounded-none border-none"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-base leading-tight">
                      {movie?.movie_name ?? "Unknown Movie"}
                    </h3>

                    <div className="text-xs text-zinc-500 space-y-1">
                      {showDatetime && (
                        <p>
                          Showtime:{" "}
                          <span className="font-medium text-zinc-700">
                            {formatShowtime(showDatetime)}
                          </span>
                        </p>
                      )}
                      {theater && (
                        <p>
                          Theater:{" "}
                          <span className="font-medium text-zinc-700">
                            {theater.name}
                          </span>
                        </p>
                      )}
                      <p>
                        Ref:{" "}
                        <span className="font-mono font-medium text-zinc-700">
                          {booking.booking_ref}
                        </span>
                      </p>
                    </div>

                    {/* Seats */}
                    {seatNames.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2 border-t">
                        {seatNames.map((name) => (
                          <span
                            key={name}
                            className="px-2 py-0.5 text-xs rounded bg-zinc-100 font-mono border border-zinc-200"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-xs text-zinc-500">Total paid</span>
                      <span className="font-semibold text-sm">
                        {formatPrice(booking.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          );
        })()}
      </div>
    </div>
  );
}
