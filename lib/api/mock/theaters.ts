import type { Theater, TheaterSeat, SeatType } from "../types";

export const mockTheaters: Theater[] = [
  { id: 1, name: "Grand Hall 1", total_rows: 5, total_columns: 8 },
  { id: 2, name: "Grand Hall 2", total_rows: 4, total_columns: 6 },
];

function buildSeats(
  theaterId: number,
  idOffset: number,
  rows: { label: string; type: SeatType; price: number }[],
  columns: number,
): TheaterSeat[] {
  const seats: TheaterSeat[] = [];
  let id = idOffset;
  for (const row of rows) {
    for (let col = 1; col <= columns; col++) {
      seats.push({
        id: id++,
        theater_id: theaterId,
        row_label: row.label,
        column_number: col,
        seat_name: `${row.label}-${String(col).padStart(2, "0")}`,
        seat_type: row.type,
        base_price: row.price,
        is_active: true,
      });
    }
  }
  return seats;
}

export const mockTheaterSeats: TheaterSeat[] = [
  // Theater 1 — 5 rows × 8 cols = 40 seats (ids 1-40)
  ...buildSeats(
    1,
    1,
    [
      { label: "A", type: "standard", price: 7000 },
      { label: "B", type: "standard", price: 7000 },
      { label: "C", type: "standard", price: 7000 },
      { label: "D", type: "vip", price: 10000 },
      { label: "E", type: "premium", price: 15000 },
    ],
    8,
  ),
  // Theater 2 — 4 rows × 6 cols = 24 seats (ids 41-64)
  ...buildSeats(
    2,
    41,
    [
      { label: "A", type: "standard", price: 7000 },
      { label: "B", type: "standard", price: 7000 },
      { label: "C", type: "vip", price: 10000 },
      { label: "D", type: "premium", price: 15000 },
    ],
    6,
  ),
];
