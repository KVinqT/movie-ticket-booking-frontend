"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User2 } from "lucide-react";
import React, { useState } from "react";
import { DataTable } from "../_components/data-table";
import { User, userColumns } from "../movies/_components/user.columns";

const STATUS = ["Booked", "Not Booked Yet"];
const Users = () => {
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
    <div className="min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-10">
        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center">
                <User2 className="w-4 h-4 text-black" />
              </div>
            </div>
            <h1 className="text-5xl font-bold leading-none tracking-tight">
              All Users
            </h1>
            <p className="text-md text-zinc-500 max-w-sm">
              Browse, filter, and manage users effectivel.
            </p>
          </div>
        </div>

        {/* ── Filters Row ── */}
        <div className="space-y-4">
          {/* Genre Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS.map((status) => (
              <Badge
                key={status}
                variant="outline"
                className="text-xs px-3 py-1 cursor-pointer tracking-wide font-normal border transition-colors bg-transparent border-zinc-800 hover:text-white hover:bg-black"
              >
                {status}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        {/* ── Table Slot ── */}
        <div>
          {/* Your table goes here */}
          <DataTable columns={userColumns} data={users ?? []} />
        </div>
      </div>
    </div>
  );
};

export default Users;
