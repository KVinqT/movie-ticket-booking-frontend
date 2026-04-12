import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/lib/axios";
import type { User } from "@/lib/api/types";

// ── Query keys ────────────────────────────────────────────────────────────────

export const adminUserKeys = {
  all: ["admin", "users"] as const,
  detail: (id: number) => ["admin", "users", id] as const,
};

// ── API functions ─────────────────────────────────────────────────────────────

async function fetchUsers(): Promise<User[]> {
  const { data } = await http.get<User[]>("/users");
  return data;
}

async function deleteUser(id: number): Promise<void> {
  await http.delete(`/users/${id}`);
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useUsers() {
  return useQuery({
    queryKey: adminUserKeys.all,
    queryFn: fetchUsers,
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Invalidate the users list so it refetches automatically
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      toast.success("User removed successfully.");
    },
    onError: (err: Error) => {
      toast.error("Failed to remove user", { description: err.message });
    },
  });
}
