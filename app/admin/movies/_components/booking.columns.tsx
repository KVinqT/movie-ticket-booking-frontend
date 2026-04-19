"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { ServerBookingDetail } from "@/lib/api/types";
import { formatDate } from "@/lib/date";
import { formatPrice } from "@/lib/currency";

export const bookingColumns: ColumnDef<ServerBookingDetail>[] = [
  {
    accessorKey: "booking_ref",
    header: "Ref",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.booking_ref}</span>
    ),
  },
  {
    id: "user",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">{row.original.user.name}</p>
        <p className="text-xs text-zinc-500">{row.original.user.email}</p>
      </div>
    ),
  },
  {
    id: "seats",
    header: "Seats",
    cell: ({ row }) => {
      const names = row.original.seats
        .map((bs) => bs.seat?.seat_name)
        .filter(Boolean) as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {names.map((name) => (
            <span
              key={name}
              className="px-2 py-0.5 text-xs rounded bg-zinc-100 font-mono border border-zinc-200"
            >
              {name}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-medium text-sm">
        {formatPrice(row.original.total_amount)}
      </span>
    ),
  },
  {
    accessorKey: "booked_at",
    header: "Booked",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-500">
        {formatDate(row.original.booked_at)}
      </span>
    ),
  },
];
