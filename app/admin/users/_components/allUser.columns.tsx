"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DeleteDialog } from "../../movies/_components/deleteDialog";

export type User = {
  id: string;
  userName: string;
  phoneNumber: string;
  email: string;
};

export const allUserColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "userName",
    header: "Booked User Name",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const bookedUser = row.original;

      return (
        <div className="flex items-center gap-2">
          <DeleteDialog
            id={bookedUser.id}
            entityName={bookedUser.userName}
            confirmContext="Cancel Booked User"
          />
        </div>
      );
    },
  },
];
