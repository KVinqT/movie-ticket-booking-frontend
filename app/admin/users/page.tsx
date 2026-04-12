"use client";

import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";
import { DataTable } from "../_components/data-table";
import { allUserColumns } from "./_components/allUser.columns";
import { useUsers } from "@/lib/api/admin/users";

export default function UsersPage() {
  const { data: users = [], isLoading, isError } = useUsers();

  const clientCount = users.filter((u) => u.role === "client").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-zinc-500" />
            <span className="text-sm text-zinc-500 font-medium uppercase tracking-widest">
              Management
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">All Users</h1>
          <p className="text-sm text-zinc-500">
            View and manage registered accounts.
          </p>
        </div>

        {/* Summary cards */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-3 gap-4 max-w-sm">
            {[
              { label: "Total", value: users.length },
              { label: "Clients", value: clientCount },
              { label: "Admins", value: adminCount },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col p-4 rounded-xl border">
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                  {label}
                </span>
                <span className="text-2xl font-semibold mt-1">{value}</span>
              </div>
            ))}
          </div>
        )}

        <Separator />

        {isLoading ? (
          <div className="py-20 text-center text-zinc-400">Loading…</div>
        ) : isError ? (
          <div className="py-20 text-center text-red-400">
            Failed to load users. Please try again.
          </div>
        ) : (
          <DataTable
            columns={allUserColumns}
            data={users}
            searchableColumn="name"
            searchPlaceholder="Search by name or email…"
          />
        )}
      </div>
    </div>
  );
}
