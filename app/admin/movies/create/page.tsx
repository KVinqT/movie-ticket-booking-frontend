"use client";

import { Undo2 } from "lucide-react";
import React from "react";
import MovieForm from "../_components/MovieForm";
import { useRouter } from "next/navigation";

const CreateMovie = () => {
  const navigate = useRouter();
  return (
    <div>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center">
              <Undo2
                className="w-7 h-7 text-black cursor-pointer"
                onClick={() => navigate.back()}
              />
            </div>
          </div>
          <h1 className="text-5xl font-bold leading-none tracking-tight">
            Add Movies
          </h1>
          <p className="text-md text-zinc-500 max-w-sm">
            Create and publish new movie and their respective slots
          </p>
        </div>
      </div>
      <MovieForm />
    </div>
  );
};

export default CreateMovie;
