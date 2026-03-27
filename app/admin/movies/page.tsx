"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clapperboard } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "../_components/data-table";
import { columns, Movie } from "./_components/columns";
import { useState } from "react";
import { useRouter } from "next/navigation";

const GENRES = [
  "All",
  "Action",
  "Drama",
  "Comedy",
  "Thriller",
  "Sci-Fi",
  "Horror",
  "Romance",
];

const Movies = () => {
  const navigate = useRouter();
  const [movies, setMovies] = useState<
    Omit<Movie, "showTimes" | "casts" | "slots">[]
  >([
    {
      id: "1",
      movieName: "Spider Man",
      director: "Christopher Nolan",
      moviePoster:
        "https://cdn1.epicgames.com/offer/f696430be718494fac1d6542cfb22542/EGS_MarvelsSpiderManMilesMorales_InsomniacGamesNixxesSoftware_S2_1200x1600-58989e7116de3f70a2ae6ea56ee202c6",
      genre: "Sci-Fi",
      description:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      showDate: "2026-04-15T18:30:00Z",
    },
    {
      id: "2",
      movieName: "Bat Man",
      director: "Wes Anderson",
      moviePoster:
        "https://play-lh.googleusercontent.com/FrlpHqOdNtyOcuHeoPrRXbsXMg_lzoSazxb3i9ewKFouTmUTn1nv5zm4VuhomETvOAIHrcfu3sjgk05rYaAS",
      genre: "Comedy/Drama",
      description:
        "A writer encounters the owner of a high-class hotel, who tells him of his early years as a lobby boy.",
      showDate: "2026-04-16T14:00:00Z",
    },
    {
      id: "3",
      movieName: "Demon Slayer",
      director: "Bong Joon-ho",
      moviePoster:
        "https://image.api.playstation.com/vulcan/ap/rnd/202504/1707/0e5cfd44d28684cc12f2abc131f309a93a2165fd9f76e403.jpg",
      genre: "Thriller",
      description:
        "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy family and the destitute clan.",
      showDate: "2026-04-17T20:00:00Z",
    },
    {
      id: "4",
      movieName: "Catch Me If You Can",
      director: "Hayao Miyazaki",
      moviePoster:
        "https://cdn2.penguin.com.au/covers/original/9781742747231.jpg",
      genre: "Animation",
      description:
        "A young girl wanders into a world ruled by gods, witches, and spirits.",
      showDate: "2026-04-18T10:30:00Z",
    },
    {
      id: "5",
      movieName: "Wolf Of Wallstreet",
      director: "Christopher Nolan",
      moviePoster:
        "https://upload.wikimedia.org/wikipedia/en/thumb/d/d8/The_Wolf_of_Wall_Street_%282013%29.png/250px-The_Wolf_of_Wall_Street_%282013%29.png",
      genre: "Action",
      description:
        "Batman must accept one of the greatest psychological and physical tests to fight the Joker.",
      showDate: "2026-04-18T21:00:00Z",
    },
  ]);
  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-10">
        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center">
                <Clapperboard className="w-4 h-4 text-black" />
              </div>
            </div>
            <h1 className="text-5xl font-bold leading-none tracking-tight">
              Movies
            </h1>
            <p className="text-md text-zinc-500 max-w-sm">
              Browse, filter, and manage your entire film catalogue in one
              place.
            </p>
          </div>

          <Button
            className="font-semibold text-sm px-5 h-10"
            onClick={() => navigate.push("/admin/movies/create")}
          >
            + Add Movie
          </Button>
        </div>

        {/* ── Filters Row ── */}
        <div className="space-y-4">
          {/* Genre Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {GENRES.map((genre, i) => (
              <Badge
                key={genre}
                variant="outline"
                className="text-xs px-3 py-1 cursor-pointer tracking-wide font-normal border transition-colors bg-transparent border-zinc-800 hover:text-white hover:bg-black"
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        {/* ── Table Slot ── */}
        <div>
          {/* Your table goes here */}
          <DataTable columns={columns} data={movies ?? []} />
        </div>
      </div>
    </div>
  );
};

export default Movies;
