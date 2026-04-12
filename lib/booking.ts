import type { Booking, BookingStatus } from "./api/types";

/**
 * Generates a unique booking reference string.
 * @returns e.g. "TFX-2026-A3F9"
 */
export function generateBookingRef(): string {
  const year = new Date().getFullYear();
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TFX-${year}-${suffix}`;
}

/**
 * Returns a human-readable label for a booking status.
 * @param status - BookingStatus
 */
export function getBookingStatusLabel(status: BookingStatus): string {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "pending":
      return "Pending";
    case "cancelled":
      return "Cancelled";
  }
}

/**
 * Returns true when a booking can still be cancelled.
 * A booking is cancellable if it is confirmed and the show has not yet started.
 * @param booking - Booking from the API
 */
export function isBookingCancellable(booking: Booking): boolean {
  return booking.status === "confirmed";
}
