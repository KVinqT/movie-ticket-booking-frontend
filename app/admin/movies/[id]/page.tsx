"use client";

import { useState } from "react";
import Image from "next/image";
import { Movie } from "../_components/columns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "../../_components/data-table";
import { User, userColumns } from "../_components/user.columns";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

const EachMovie = ({
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
  ],
}: Partial<Movie>) => {
  const navigate = useRouter();
  const [users, setUsers] = useState<User[]>([
    {
      id: "user_01J8K",
      userName: "Htet Aung Lin",
      phoneNumber: "+95 9 771234567",
      email: "htet.aunglin@example.com",
      slot: {
        id: "1",
        slotName: "A-01",
        slotType: "Normal Seat",
        slotPrice: "7000 MMK",
        movieId: "1",
        isReserved: false,
      },
    },
    {
      id: "user_02M9P",
      userName: "Sarah Jenkins",
      phoneNumber: "+1 202-555-0143",
      email: "s.jenkins@provider.net",
      slot: {
        id: "2",
        slotName: "A-02",
        slotType: "Normal Seat",
        slotPrice: "7000 MMK",
        movieId: "1",
        isReserved: false,
      },
    },
    {
      id: "user_03L2W",
      userName: "Min Khant Zaw",
      phoneNumber: "+95 9 440987654",
      email: "minkhant.dev@gmail.com",
      slot: {
        id: "3",
        slotName: "A-03",
        slotType: "Normal Seat",
        slotPrice: "7000 MMK",
        movieId: "1",
        isReserved: false,
      },
    },
    {
      id: "user_04X7B",
      userName: "Elena Rodriguez",
      phoneNumber: "+34 912 345 678",
      email: "elena.rod@techcorp.es",
      slot: {
        id: "4",
        slotName: "A-04",
        slotType: "Normal Seat",
        slotPrice: "7000 MMK",
        movieId: "1",
        isReserved: false,
      },
    },
    {
      id: "user_05Q4Z",
      userName: "Thae Nu San",
      phoneNumber: "+95 9 250112233",
      email: "thaenusan.work@outlook.com",
      slot: {
        id: "5",
        slotName: "B-01",
        slotType: "Premium Seat",
        slotPrice: "10000 MMK",
        movieId: "1",
        isReserved: false,
      },
    },
    {
      id: "user_06R1V",
      userName: "David Chen",
      phoneNumber: "+65 8123 4567",
      email: "d.chen@asia-logistics.sg",
      slot: {
        id: "6",
        slotName: "B-02",
        slotType: "Premium Seat",
        slotPrice: "10000 MMK",
        movieId: "1",
        isReserved: false,
      },
    },
    {
      id: "user_07T9M",
      userName: "Kyaw Zayar Phyo",
      phoneNumber: "+95 9 967334455",
      email: "kyawzayar.p@example.com",
      slot: {
        id: "7",
        slotName: "B-03",
        slotType: "Premium Seat",
        slotPrice: "10000 MMK",
        movieId: "1",
        isReserved: false,
      },
    },
    {
      id: "user_08G3H",
      userName: "Amara Williams",
      phoneNumber: "+44 7700 900123",
      email: "amara.w@uk-designs.co.uk",
      slot: {
        id: "8",
        slotName: "B-04",
        slotType: "Premium Seat",
        slotPrice: "10000 MMK",
        movieId: "1",
        isReserved: false,
      },
    },
    {
      id: "user_09K2F",
      userName: "Zun Pwint Phyu",
      phoneNumber: "+95 9 788556677",
      email: "zunpwint.p@gmail.com",
      slot: {
        id: "9",
        slotName: "C-01",
        slotType: "Couple Seat",
        slotPrice: "15000 MMK",
        movieId: "1",
        isReserved: false,
      },
    },
    {
      id: "user_10J5N",
      userName: "Marcus Thorne",
      phoneNumber: "+1 415-555-2671",
      email: "m.thorne@startup.io",
      slot: {
        id: "10",
        slotName: "C-02",
        slotType: "Couple Seat",
        slotPrice: "15000 MMK",
        movieId: "1",
        isReserved: false,
      },
    },
  ]);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-1">
        <div className="flex flex-col p-4 rounded-xl border">
          <span className="text-[10px] font-bold tracking-widest uppercase">
            Total Booked
          </span>
          <span className="text-2xl font-semibold">
            {users.length}
            <span className="text-sm font-normal text-zinc-500 ml-2">
              Users
            </span>
          </span>
        </div>

        <div className="flex flex-col p-4 rounded-xl border">
          <span className="text-[10px] font-bold tracking-widest uppercase">
            Available Slots
          </span>
          <span className="text-2xl font-semibold">
            {slots.length - users.length}
            <span className="text-sm font-normal text-zinc-500 ml-2">Left</span>
          </span>
        </div>

        <div className="flex flex-col p-4 rounded-xl border">
          <span className="text-[10px] font-bold tracking-widest uppercase">
            Capacity
          </span>
          <span className="text-2xl font-semibold">{slots.length}</span>
        </div>

        <div className="flex flex-col p-4 rounded-xl border">
          <span className="text-[10px] font-bold tracking-widest uppercase">
            Occupancy
          </span>
          <span className="text-2xl font-semibold">
            {((users.length / slots.length) * 100).toFixed(0)}%
          </span>
        </div>
      </div>
      <Separator className="bg-zinc-800" />
      <DataTable columns={userColumns} data={users ?? []} />
    </div>
  );
};

export default EachMovie;
