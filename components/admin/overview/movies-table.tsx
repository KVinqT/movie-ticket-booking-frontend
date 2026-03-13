"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { type Movie } from "@/lib/mock-data";

type MovieRow = {
  id: string;
  title: string;
  genre: string;
  duration: number;
  showtimes: number;
};

type MoviesTableProps = {
  movies: Movie[];
  selectedMovieId: string | null;
  onSelectMovie: (movieId: string) => void;
};

export function MoviesTable({
  movies,
  selectedMovieId,
  onSelectMovie,
}: MoviesTableProps) {
  const data: MovieRow[] = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    genre: movie.genre,
    duration: movie.durationMinutes,
    showtimes: movie.showtimes.length,
  }));

  const columns: ColumnDef<MovieRow>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "genre",
      header: "Genre",
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => `${row.original.duration} mins`,
    },
    {
      accessorKey: "showtimes",
      header: "Showtimes",
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/40 text-muted-foreground">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 font-medium">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectMovie(row.original.id)}
              className={`cursor-pointer border-t border-border transition hover:bg-muted/30 ${
                selectedMovieId === row.original.id ? "bg-primary/10" : ""
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
