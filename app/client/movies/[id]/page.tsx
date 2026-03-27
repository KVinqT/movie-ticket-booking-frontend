"use client";

import { Separator } from "@/components/ui/separator";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import React from "react";
import { Movie } from "@/app/admin/movies/_components/columns";
import { Badge } from "@/components/ui/badge";
import Slots from "@/components/shared/Slots";

const BookMovie = ({
  id = "1",
  movieName = "Spider Man",
  director = "Christopher Nolan",
  moviePoster = "https://cdn1.epicgames.com/offer/f696430be718494fac1d6542cfb22542/EGS_MarvelsSpiderManMilesMorales_InsomniacGamesNixxesSoftware_S2_1200x1600-58989e7116de3f70a2ae6ea56ee202c6",
  genre = "Sci-Fi",
  showTimes = ["16:30PM", "10:00AM"],
  description = "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  showDate = "2026-04-15T18:30:00Z",
  slots = [
    {
      id: "1",
      slotName: "A-01",
      slotType: "Normal Seat",
      slotPrice: "7000 MMK",
      movieId: "1",
      isReserved: false,
    },
    {
      id: "2",
      slotName: "A-02",
      slotType: "Normal Seat",
      slotPrice: "7000 MMK",
      movieId: "1",
      isReserved: false,
    },
    {
      id: "3",
      slotName: "A-03",
      slotType: "Normal Seat",
      slotPrice: "7000 MMK",
      movieId: "1",
      isReserved: false,
    },
    {
      id: "4",
      slotName: "A-04",
      slotType: "Normal Seat",
      slotPrice: "7000 MMK",
      movieId: "1",
      isReserved: false,
    },
    {
      id: "5",
      slotName: "B-01",
      slotType: "Premium Seat",
      slotPrice: "10000 MMK",
      movieId: "1",
      isReserved: false,
    },
    {
      id: "6",
      slotName: "B-02",
      slotType: "Premium Seat",
      slotPrice: "10000 MMK",
      movieId: "1",
      isReserved: false,
    },
    {
      id: "7",
      slotName: "B-03",
      slotType: "Premium Seat",
      slotPrice: "10000 MMK",
      movieId: "1",
      isReserved: false,
    },
    {
      id: "8",
      slotName: "B-04",
      slotType: "Premium Seat",
      slotPrice: "10000 MMK",
      movieId: "1",
      isReserved: false,
    },
    {
      id: "9",
      slotName: "C-01",
      slotType: "Couple Seat",
      slotPrice: "15000 MMK",
      movieId: "1",
      isReserved: false,
    },
    {
      id: "10",
      slotName: "C-02",
      slotType: "Couple Seat",
      slotPrice: "15000 MMK",
      movieId: "1",
      isReserved: false,
    },
    {
      id: "11",
      slotName: "C-02",
      slotType: "Couple Seat",
      slotPrice: "15000 MMK",
      movieId: "1",
      isReserved: false,
    },
    {
      id: "12",
      slotName: "C-03",
      slotType: "Couple Seat",
      slotPrice: "15000 MMK",
      movieId: "1",
      isReserved: true,
    },
    {
      id: "13",
      slotName: "A-05",
      slotType: "Normal Seat",
      slotPrice: "7000 MMK",
      movieId: "1",
      isReserved: false,
    },
    {
      id: "14",
      slotName: "B-05",
      slotType: "Premium Seat",
      slotPrice: "7000 MMK",
      movieId: "1",
      isReserved: false,
    },
    {
      id: "15",
      slotName: "B-06",
      slotType: "Premium Seat",
      slotPrice: "7000 MMK",
      movieId: "1",
      isReserved: true,
    },
  ],
}: Partial<Movie>) => {
  const navigate = useRouter();
  return (
    <div className="flex flex-col gap-8">
      <Undo2
        className="w-7 h-7 text-black cursor-pointer"
        onClick={() => navigate.back()}
      />
      <div className="relative w-full overflow-hidden rounded-xl min-h-55">
        <div className="absolute inset-0">
          {/* dark gradient left-to-right */}
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-[#0a0e1e]/35" />
          {/* subtle bottom fade */}
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0e1e]/60 to-transparent" />
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-7 px-7 py-8">
          {/* Poster */}
          <div className="relative shrink-0 w-38 h-48 rounded-lg shadow-[0_8px_40px_rgba(0,0,0,0.7)] overflow-hidden border">
            <Image
              src={moviePoster}
              alt={movieName}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3 min-w-0">
            {/* Title */}
            <h1 className="text-white leading-tight font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter">
              {movieName}
            </h1>

            {/* Overview */}
            <p className="text-sm leading-relaxed max-w-xl text-[#b4bedc]/85">
              {description}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-start gap-10 pt-2">
              {[
                { label: "Director", value: director },
                { label: "Casts", value: showTimes },
                { label: "Genre", value: genre },
                { label: "To Show Date", value: showDate },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#96a5c8]/70">
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
      <div className="flex items-center gap-2 flex-wrap">
        {showTimes.map((showTime) => (
          <Badge
            key={showTime}
            variant="outline"
            className="text-xs px-3 py-1 cursor-pointer tracking-wide font-normal border transition-colors bg-transparent border-zinc-800 hover:text-white hover:bg-black"
          >
            {showTime}
          </Badge>
        ))}
      </div>
      <Separator className="bg-zinc-800" />
      <Slots slots={slots} />
    </div>
  );
};

export default BookMovie;
