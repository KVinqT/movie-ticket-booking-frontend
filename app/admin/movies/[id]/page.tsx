"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Undo2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "../../_components/data-table";
import { bookingColumns } from "../_components/booking.columns";
import { MoviePoster } from "@/components/shared/MoviePoster";
import { useMovie } from "@/lib/api/admin/movies";
import type { ServerShowtime } from "@/lib/api/types";
import { formatShowtime, formatDate } from "@/lib/date";
import { formatPrice } from "@/lib/currency";

type Props = { params: Promise<{ id: string }> };

export default function AdminMovieDetail({ params }: Props) {
  const { id } = use(params);
  const navigate = useRouter();
  const movieId = Number(id);

  const { data: movie, isLoading, isError } = useMovie(movieId);
  const [selectedShowtime, setSelectedShowtime] = useState<ServerShowtime | null>(null);

  // Auto-select first showtime once data arrives
  const activeShowtime =
    selectedShowtime ?? (movie?.showtimes?.[0] ?? null);

  if (isLoading) {
    return <div className="py-20 text-center text-zinc-400">Loading…</div>;
  }
  if (isError || !movie) {
    return <div className="py-20 text-center text-red-400">Movie not found.</div>;
  }

  // Stats computed from the selected showtime
  const theater = activeShowtime?.theater;
  const bookings = activeShowtime?.bookings ?? [];
  const revenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + parseFloat(b.total_amount), 0);

  return (
    <div className="flex flex-col gap-8">
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
                { label: "Added by", value: movie.creator.name },
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
      {movie.showtimes.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-500">
            Showtimes
          </h2>
          <div className="flex flex-wrap gap-2">
            {movie.showtimes.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedShowtime(st)}
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
        <p className="text-zinc-400 text-sm">No showtimes scheduled yet.</p>
      )}

      {/* ── Stats for selected showtime ── */}
      {activeShowtime && theater && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Bookings", value: bookings.length },
            { label: "Booked Seats", value: theater.booked_seats },
            {
              label: "Available Seats",
              value: theater.active_seats - theater.booked_seats,
            },
            { label: "Revenue", value: formatPrice(revenue) },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col p-4 rounded-xl border">
              <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                {label}
              </span>
              <span className="text-2xl font-semibold mt-1">{value}</span>
            </div>
          ))}
        </div>
      )}

      <Separator />

      {/* ── Bookings Table ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Bookings</h2>
          {activeShowtime && (
            <Badge variant="outline" className="font-normal text-zinc-500">
              {formatShowtime(activeShowtime.show_datetime)} ·{" "}
              {activeShowtime.theater.name}
            </Badge>
          )}
        </div>
        <DataTable
          columns={bookingColumns}
          data={bookings}
          searchableColumn="booking_ref"
          searchPlaceholder="Search by ref or customer…"
        />
      </div>
    </div>
  );
}
