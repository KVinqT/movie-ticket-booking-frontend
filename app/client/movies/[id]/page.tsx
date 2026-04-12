"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Undo2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Slots from "@/components/shared/Slots";
import { MoviePoster } from "@/components/shared/MoviePoster";
import { useMovie } from "@/lib/api/admin/movies";
import { useCreateBooking } from "@/lib/api/client/bookings";
import { useAuth } from "@/components/providers/auth-provider";
import { deriveSeatsFromShowtime } from "@/lib/api/types";
import type { ServerShowtime } from "@/lib/api/types";
import { formatShowtime, formatDate } from "@/lib/date";

type Props = { params: Promise<{ id: string }> };

export default function BookMoviePage({ params }: Props) {
  const { id } = use(params);
  const navigate = useRouter();
  const { currentUser } = useAuth();
  const movieId = Number(id);

  const { data: movie, isLoading, isError } = useMovie(movieId);
  const { mutateAsync: book, isPending: isBooking } = useCreateBooking(movieId);

  const [selectedShowtime, setSelectedShowtime] = useState<ServerShowtime | null>(null);
  // Incremented after each booking to reset the Slots component's internal state
  const [slotsKey, setSlotsKey] = useState(0);

  // Only show scheduled showtimes to clients
  const scheduledShowtimes = useMemo(
    () => movie?.showtimes.filter((st) => st.status === "scheduled") ?? [],
    [movie],
  );

  const activeShowtime = selectedShowtime ?? scheduledShowtimes[0] ?? null;

  // Derive seat availability from the embedded theater + booking data
  const seats = useMemo(
    () => (activeShowtime ? deriveSeatsFromShowtime(activeShowtime) : []),
    [activeShowtime],
  );

  const handleBook = async (seatIds: number[]) => {
    if (!activeShowtime || !currentUser) return;
    await book({
      user_id: currentUser.id,
      showtime_id: activeShowtime.id,
      seats: seatIds,
    });
    // Bump key to reset selected-seats state inside Slots
    setSlotsKey((k) => k + 1);
  };

  if (isLoading) {
    return <div className="py-20 text-center text-zinc-400">Loading…</div>;
  }
  if (isError || !movie) {
    return <div className="py-20 text-center text-red-400">Movie not found.</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto px-6">
      <button
        onClick={() => navigate.back()}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors w-fit"
      >
        <Undo2 className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </button>

      {/* ── Movie Hero ── */}
      <div className="relative w-full overflow-hidden rounded-xl min-h-52 bg-zinc-900">
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-black/30" />
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-7 px-7 py-8">
          <MoviePoster
            src={movie.movie_poster_url}
            alt={movie.movie_name}
            containerClassName="shrink-0 w-32 h-44 rounded-lg shadow-xl"
          />

          <div className="flex flex-col gap-3 min-w-0">
            <h1 className="text-white font-bold text-4xl md:text-5xl tracking-tight">
              {movie.movie_name}
            </h1>
            <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
              {movie.description}
            </p>
            <div className="flex flex-wrap items-start gap-8 pt-1">
              {[
                { label: "Director", value: movie.director },
                { label: "Genre", value: movie.genre },
                { label: "Added", value: formatDate(movie.created_at) },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                    {label}
                  </span>
                  <span className="text-white text-sm font-semibold">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Showtime Selector ── */}
      {scheduledShowtimes.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-500">
            Select Showtime
          </h2>
          <div className="flex flex-wrap gap-2">
            {scheduledShowtimes.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedShowtime(st);
                  setSlotsKey((k) => k + 1);
                }}
                className={[
                  "px-4 py-2 rounded-lg text-sm font-medium border transition-all text-left",
                  activeShowtime?.id === st.id
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "border-zinc-200 bg-white hover:border-zinc-400",
                ].join(" ")}
              >
                <span className="block">{formatShowtime(st.show_datetime)}</span>
                <span className="block text-xs opacity-60 mt-0.5">
                  {st.theater.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-zinc-400 text-sm">No upcoming showtimes available.</p>
      )}

      <Separator />

      {/* ── Seat Grid ── */}
      {activeShowtime ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-semibold text-lg">Choose Your Seats</h2>
            <Badge variant="outline" className="text-zinc-500 font-normal">
              {formatDate(activeShowtime.show_datetime)} ·{" "}
              {activeShowtime.theater.name}
            </Badge>
          </div>

          {seats.length === 0 ? (
            <div className="py-10 text-center text-zinc-400">
              No seats configured for this showtime.
            </div>
          ) : (
            <Slots
              key={slotsKey}
              seats={seats}
              onBook={handleBook}
              isBooking={isBooking}
            />
          )}
        </div>
      ) : (
        <p className="text-zinc-400 text-sm">
          Select a showtime to see available seats.
        </p>
      )}
    </div>
  );
}
