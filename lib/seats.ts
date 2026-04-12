import type { SeatAvailability, TheaterSeat, SeatType } from "./api/types";

/**
 * Groups a flat seat array into rows keyed by row_label.
 * @param seats - flat SeatAvailability[] from the API
 * @returns Record<string, SeatAvailability[]> — each value sorted by column_number
 */
export function groupSeatsByRow(
  seats: SeatAvailability[],
): Record<string, SeatAvailability[]> {
  const groups: Record<string, SeatAvailability[]> = {};
  for (const seat of seats) {
    if (!groups[seat.row_label]) groups[seat.row_label] = [];
    groups[seat.row_label].push(seat);
  }
  for (const row of Object.keys(groups)) {
    groups[row].sort((a, b) => a.column_number - b.column_number);
  }
  return groups;
}

/**
 * Returns true when a seat can be selected.
 * @param seat - SeatAvailability from the API
 */
export function isSeatAvailable(seat: SeatAvailability): boolean {
  return seat.status === "available" && seat.is_active;
}

/**
 * Returns the display label for a seat (e.g. "A-01").
 * @param seat - any TheaterSeat
 */
export function getSeatLabel(seat: TheaterSeat): string {
  return seat.seat_name;
}

/**
 * Returns a Tailwind background class for a seat type.
 * Uses only neutral shades per the project colour system.
 * @param type - SeatType
 */
export function seatTypeClass(type: SeatType): string {
  switch (type) {
    case "vip":
      return "bg-zinc-400 text-zinc-900";
    case "premium":
      return "bg-zinc-700 text-white";
    default:
      return "bg-zinc-200 text-zinc-900";
  }
}

/**
 * Returns a human-readable seat type label.
 * @param type - SeatType
 */
export function seatTypeLabel(type: SeatType): string {
  switch (type) {
    case "vip":
      return "VIP";
    case "premium":
      return "Premium";
    default:
      return "Standard";
  }
}
