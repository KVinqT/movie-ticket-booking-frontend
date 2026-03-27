"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

/* ---------------- MOVIE DATA ---------------- */

const movies = [
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
];

/* ---------------- COMPONENT ---------------- */

const MoviesPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Showing 🎬</h1>
        <p className="text-muted-foreground">
          Browse movies and book your seats
        </p>
      </div>

      {/* GRID */}
      <div
        className="
    grid
    justify-center
    gap-6
    grid-cols-[repeat(auto-fill,minmax(220px,220px))]
  "
      >
        {movies.map((movie) => {
          return (
            <Link key={movie.id} href={`/client/movies/${movie.id}`}>
              <div className="group relative w-[220px] h-[320px] rounded-xl overflow-hidden border shadow-sm cursor-pointer">
                {/* Poster */}
                <Image
                  src={movie.moviePoster}
                  alt={movie.movieName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300" />

                {/* Hover Content */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-4 text-white
                          opacity-0 translate-y-6
                          group-hover:opacity-100 group-hover:translate-y-0
                          transition-all duration-300"
                >
                  <h2 className="font-semibold text-sm line-clamp-1">
                    {movie.movieName}
                  </h2>

                  <p className="text-xs text-white/80">{movie.genre}</p>

                  <p className="text-xs mt-1 line-clamp-3 text-white/80">
                    {movie.description}
                  </p>

                  <span className="text-xs font-medium mt-2">
                    🎬 {new Date(movie.showDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MoviesPage;
