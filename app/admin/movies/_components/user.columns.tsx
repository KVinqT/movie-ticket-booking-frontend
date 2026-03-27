"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DeleteDialog } from "./deleteDialog";
import { Slot } from "./columns";

export type User = {
  id: string;
  userName: string;
  phoneNumber: string;
  email: string;
  slot: Slot;
};

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "userName",
    header: "Booked User Name",
  },
  {
    accessorKey: "slot",
    header: "Slot Name",
    cell: ({ row }) => {
      const slotName = row.original.slot.slotName;
      return <p>{slotName}</p>;
    },
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
