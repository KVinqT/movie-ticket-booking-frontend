"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { formatDateTime } from "@/lib/format";
import { type Showtime } from "@/lib/mock-data";

type ShowtimeRow = {
  id: string;
  time: string;
  price: number;
  totalSeats: number;
  bookedSeats: number;
};

type ShowtimesTableProps = {
  showtimes: Showtime[];
  selectedShowtimeId: string | null;
  onSelectShowtime: (showtimeId: string) => void;
};

export function ShowtimesTable({
  showtimes,
  selectedShowtimeId,
  onSelectShowtime,
}: ShowtimesTableProps) {
  const data: ShowtimeRow[] = showtimes.map((showtime) => {
    const bookedSeats = showtime.seats.filter((seat) => seat.isBooked).length;
    return {
      id: showtime.id,
      time: showtime.time,
      price: showtime.price,
      totalSeats: showtime.seats.length,
      bookedSeats,
    };
  });

  const columns: ColumnDef<ShowtimeRow>[] = [
    {
      accessorKey: "time",
      header: "Showtime",
      cell: ({ row }) => formatDateTime(row.original.time),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `${row.original.price} MMK`,
    },
    {
      accessorKey: "bookedSeats",
      header: "Booked",
      cell: ({ row }) =>
        `${row.original.bookedSeats} / ${row.original.totalSeats}`,
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/40 text-muted-foreground">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 font-medium">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectShowtime(row.original.id)}
              className={`cursor-pointer border-t border-border transition hover:bg-muted/30 ${
                selectedShowtimeId === row.original.id ? "bg-primary/10" : ""
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
