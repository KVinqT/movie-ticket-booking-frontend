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
import { useDeleteMovie } from "@/lib/api/admin/movies";

type Props = {
  id: number;
  entityName: string;
  confirmContext: string;
};

export function DeleteDialog({ id, entityName, confirmContext }: Props) {
  const { mutate: deleteMovie, isPending } = useDeleteMovie();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2 className="w-5 h-5 cursor-pointer text-zinc-400 hover:text-zinc-900 transition-colors" />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmContext}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{entityName}</span>? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => deleteMovie(id)}
          >
            {isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
