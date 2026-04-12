"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { User, UserRole } from "@/lib/api/types";
import { formatDate } from "@/lib/date";
import { DeleteDialog } from "./deleteDialog";

function roleBadgeVariant(role: UserRole) {
  return role === "admin" ? "default" : "secondary";
}

export const allUserColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-zinc-400 text-xs">#{row.original.id}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-zinc-600">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={roleBadgeVariant(row.original.role)}>
        {row.original.role.toUpperCase()}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-500">
        {formatDate(row.original.created_at)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <DeleteDialog
            id={user.id}
            entityName={user.name}
            confirmContext="Remove User"
          />
        </div>
      );
    },
  },
];
