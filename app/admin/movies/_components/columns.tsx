"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { SquarePen } from "lucide-react";
import { DeleteDialog } from "./deleteDialog";

export type Slot = {
  id: string;
  slotName: string;
  slotType: string;
  slotPrice: string;
  movieId: string;
  isReserved: boolean;
};

export type Movie = {
  id: string;
  movieName: string;
  director: string;
  moviePoster: string;
  genre: string;
  description: string;
  showDate: string; //UTC format ISO string
  casts?: string[];
  showTimes?: string[];
  slots?: Slot[];
};

export const columns: ColumnDef<Movie>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "movieName",
    header: "Movie Name",
    cell: ({ row }) => {
      const moviePoster = row.original.moviePoster;
      const movieName = row.original.movieName;

      return (
        <div className="flex items-center gap-3">
          {/* Poster Image */}
          <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted">
            <Image
              src={moviePoster}
              alt={movieName}
              className="h-full w-full object-cover"
              width={50}
              height={50}
            />
          </div>
          <Link
            href={`/admin/movies/${row.original.id}`}
            className="hover:underline"
          >
            <span className="font-medium text-foreground leading-none">
              {movieName}
            </span>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "director",
    header: "Director",
  },
  {
    accessorKey: "genre",
    header: "Genre",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original.description.slice(0, 25) + "....";
      return <div>{description ?? "-"}</div>;
    },
  },
  {
    accessorKey: "showDate",
    header: "Date of show",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const movie = row.original;

      return (
        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <Link
            href={`/admin/movies/edit/${movie.id}`}
            className="cursor-pointer"
          >
            <SquarePen className="w-5 h-5" />
          </Link>

          <DeleteDialog
            id={movie.id}
            entityName={movie.movieName}
            confirmContext="Delete Movie"
          />
        </div>
      );
    },
  },
];
