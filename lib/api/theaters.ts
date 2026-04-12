import { delay } from "./mock/_delay";
import { mockTheaters, mockTheaterSeats } from "./mock/theaters";
import type { Theater, TheaterSeat } from "./types";

export async function getTheaters(): Promise<Theater[]> {
  await delay();
  return [...mockTheaters];
}

export async function getTheaterSeats(theaterId: number): Promise<TheaterSeat[]> {
  await delay();
  return mockTheaterSeats.filter(
    (s) => s.theater_id === theaterId && s.is_active,
  );
}
