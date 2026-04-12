"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SeatAvailability } from "@/lib/api/types";
import {
  groupSeatsByRow,
  isSeatAvailable,
  seatTypeClass,
  seatTypeLabel,
} from "@/lib/seats";
import { formatPrice, calculateTotal } from "@/lib/currency";

type Props = {
  seats: SeatAvailability[];
  onBook: (selectedSeatIds: number[]) => void | Promise<void>;
  isBooking?: boolean;
};

const Slots = ({ seats, onBook, isBooking = false }: Props) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSeat = (seatId: number) => {
    setSelectedIds((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };

  const rowMap = groupSeatsByRow(seats);
  const rowLabels = Object.keys(rowMap).sort();

  const selectedSeats = seats.filter((s) => selectedIds.includes(s.id));
  const total = calculateTotal(selectedSeats.map((s) => s.base_price));

  const seatTypes = [
    { type: "standard", label: "Standard" },
    { type: "vip", label: "VIP" },
    { type: "premium", label: "Premium" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header + Legend */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <h2 className="text-lg font-bold">Select Seats</h2>

        <div className="flex items-center gap-4 text-sm">
          {seatTypes.map(({ type, label }) => {
            const sample = seats.find((s) => s.seat_type === type);
            return (
              <div key={type} className="flex flex-col gap-1 items-center">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-4 h-4 rounded ${seatTypeClass(type)}`}
                  />
                  <span>{label}</span>
                </div>
                {sample && (
                  <span className="text-zinc-500">
                    {formatPrice(sample.base_price)}
                  </span>
                )}
              </div>
            );
          })}
          <div className="flex flex-col gap-1 items-center">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-zinc-100 opacity-40 border border-zinc-300" />
              <span>Booked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col gap-3">
          {rowLabels.map((row) => (
            <div key={row} className="flex items-center gap-2">
              <span className="w-5 text-xs font-bold text-zinc-400 text-right">
                {row}
              </span>
              <div className="flex gap-2">
                {rowMap[row].map((seat) => {
                  const available = isSeatAvailable(seat);
                  const selected = selectedIds.includes(seat.id);

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      disabled={!available}
                      onClick={() => available && toggleSeat(seat.id)}
                      title={`${seat.seat_name} · ${seatTypeLabel(seat.seat_type)} · ${formatPrice(seat.base_price)}`}
                      className={[
                        "relative w-11 h-11 rounded text-[11px] font-semibold transition-all duration-150 overflow-hidden",
                        selected
                          ? "bg-zinc-900 text-white ring-2 ring-zinc-900 scale-110"
                          : available
                            ? `${seatTypeClass(seat.seat_type)} hover:scale-105`
                            : "bg-zinc-100 text-zinc-300 cursor-not-allowed opacity-40",
                      ].join(" ")}
                    >
                      {seat.seat_name}
                      {!available && (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50">
                          <Lock className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Screen bar */}
        <div className="w-full max-w-lg">
          <div className="bg-zinc-800 text-white py-2 rounded text-xs tracking-widest text-center">
            SCREEN
          </div>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="w-full max-w-lg border rounded-xl p-5 space-y-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base">Selected Seats</h3>
          <span className="text-sm text-zinc-500">
            {selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 min-h-10">
          {selectedSeats.length === 0 ? (
            <p className="text-sm text-zinc-400">No seats selected yet.</p>
          ) : (
            selectedSeats.map((seat) => (
              <button
                key={seat.id}
                type="button"
                onClick={() => toggleSeat(seat.id)}
                className={`w-11 h-11 rounded text-[11px] font-semibold ${seatTypeClass(seat.seat_type)}`}
              >
                {seat.seat_name}
              </button>
            ))
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <p className="font-semibold text-sm">
            Total:{" "}
            <span className="text-base">{formatPrice(total)}</span>
          </p>

          <Button
            disabled={selectedSeats.length === 0 || isBooking}
            onClick={() => onBook(selectedIds)}
          >
            {isBooking ? "Booking…" : "Book Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Slots;
