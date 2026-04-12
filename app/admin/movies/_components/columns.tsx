"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { SquarePen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MoviePoster } from "@/components/shared/MoviePoster";
import { DeleteDialog } from "./deleteDialog";
import type { AdminMovie } from "@/lib/api/types";
import { formatDate } from "@/lib/date";

export const columns: ColumnDef<AdminMovie>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-zinc-400 text-xs">#{row.original.id}</span>
    ),
  },
  {
    accessorKey: "movie_name",
    header: "Movie",
    cell: ({ row }) => {
      const { movie_poster_url, movie_name, id } = row.original;
      return (
        <div className="flex items-center gap-3">
          <MoviePoster
            src={movie_poster_url}
            alt={movie_name}
            containerClassName="h-16 w-12"
          />
          <Link href={`/admin/movies/${id}`} className="hover:underline">
            <span className="font-medium text-foreground leading-none">
              {movie_name}
            </span>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "director",
    header: "Director",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.director}</span>
    ),
  },
  {
    accessorKey: "genre",
    header: "Genre",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs font-normal">
        {row.original.genre}
      </Badge>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <p className="text-zinc-500 text-sm max-w-xs truncate">
        {row.original.description}
      </p>
    ),
  },
  {
    id: "creator",
    header: "Added by",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-500">{row.original.creator.name}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Added",
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
      const movie = row.original;
      return (
        <div className="flex items-center gap-2">
          <Link href={`/admin/movies/edit/${movie.id}`}>
            <SquarePen className="w-5 h-5 text-zinc-500 hover:text-zinc-900 transition-colors" />
          </Link>
          <DeleteDialog
            id={movie.id}
            entityName={movie.movie_name}
            confirmContext="Delete Movie"
          />
        </div>
      );
    },
  },
];
