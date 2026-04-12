import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/lib/axios";
import { adminMovieKeys } from "@/lib/api/admin/movies";
import type { CreateBookingPayloadV2 } from "@/lib/api/types";

// ── API function ──────────────────────────────────────────────────────────────

async function createBooking(payload: CreateBookingPayloadV2): Promise<void> {
  await http.post("/bookings", payload);
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Mutation for booking seats.
 * On success, invalidates the movie detail cache so the seat grid refreshes
 * automatically to reflect newly booked seats.
 */
export function useCreateBooking(movieId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      // Refetch the movie detail so seat availability updates
      queryClient.invalidateQueries({
        queryKey: adminMovieKeys.detail(movieId),
      });
      toast.success("Booking confirmed!", {
        description: "Your seats have been reserved successfully.",
      });
    },
    onError: (err: Error) => {
      toast.error("Booking failed", { description: err.message });
    },
  });
}
