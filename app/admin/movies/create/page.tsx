"use client";

import { Undo2 } from "lucide-react";
import React from "react";
import MovieForm from "../_components/MovieForm";
import { useRouter } from "next/navigation";

const CreateMovie = () => {
  const navigate = useRouter();
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Undo2 className="w-6 h-6" onClick={() => navigate.back()} />
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create New Movie
          </h1>
          <p className="text-lg text-gray-600">
            Add a new movie and configure its show times and seat availability
          </p>
        </div>

        <MovieForm />
      </div>
    </div>
  );
};

export default CreateMovie;
