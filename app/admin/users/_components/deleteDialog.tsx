"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useDeleteUser } from "@/lib/api/admin/users";

type Props = {
  id: number;
  entityName: string;
  confirmContext: string;
};

export function DeleteDialog({ id, entityName, confirmContext }: Props) {
  const { mutate: deleteUser, isPending } = useDeleteUser();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2 className="w-5 h-5 cursor-pointer text-zinc-400 hover:text-zinc-900 transition-colors" />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmContext}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-semibold">{entityName}</span>? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => deleteUser(id)}
          >
            {isPending ? "Removing…" : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
