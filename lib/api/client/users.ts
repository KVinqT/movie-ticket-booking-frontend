import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/lib/axios";
import type {
  ServerUserProfile,
  UpdateProfilePayloadV2,
  User,
} from "@/lib/api/types";

// ── Query keys ────────────────────────────────────────────────────────────────

export const clientUserKeys = {
  profile: (id: number) => ["client", "user", id] as const,
};

// ── API functions ─────────────────────────────────────────────────────────────

async function fetchUserProfile(id: number): Promise<ServerUserProfile> {
  const { data } = await http.get<ServerUserProfile>(`/users/${id}`);
  return data;
}

async function updateProfile(
  id: number,
  payload: UpdateProfilePayloadV2,
): Promise<User> {
  const { data } = await http.put<User>(`/users/${id}`, payload);
  return data;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Fetches the current user's profile with embedded bookings. */
export function useUserProfile(id: number) {
  return useQuery({
    queryKey: clientUserKeys.profile(id),
    queryFn: () => fetchUserProfile(id),
    enabled: id > 0,
  });
}

/**
 * Mutation for updating name + email.
 * Calls `onSuccess(updatedUser)` so the caller can sync the auth context.
 */
export function useUpdateProfile(
  id: number,
  onSuccess: (updatedUser: User) => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayloadV2) => updateProfile(id, payload),
    onSuccess: (updatedUser) => {
      // Invalidate the profile cache so the page re-fetches fresh data
      queryClient.invalidateQueries({ queryKey: clientUserKeys.profile(id) });
      onSuccess(updatedUser);
    },
  });
}
