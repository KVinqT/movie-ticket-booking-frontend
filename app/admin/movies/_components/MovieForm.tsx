"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent } from "@/components/ui/card";
import { useState, useRef } from "react";
import Image from "next/image";

/* ---------------- SCHEMA ---------------- */

const slotSchema = z.object({
  slotName: z.string(),
  slotType: z.string(),
  slotPrice: z.string(),
});

const movieSchema = z.object({
  movieName: z.string().min(1, "Movie name required"),
  director: z.string().min(1, "Director required"),
  moviePoster: z.string().min(1, "Movie poster required"),
  genre: z.string().min(1, "Genre required"),
  description: z.string().min(1, "Description required"),
  showDate: z.string().min(1, "Show date required"),
  casts: z.array(z.string()).optional(),
  showTimes: z.array(z.string()).optional(),
  slots: z.array(slotSchema).optional(),
});

type MovieFormValues = z.infer<typeof movieSchema>;

/* ---------------- COMPONENT ---------------- */

export default function MovieForm() {
  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      movieName: "",
      director: "",
      moviePoster: "",
      genre: "",
      description: "",
      showDate: "",
      casts: [],
      showTimes: [],
      slots: [],
    },
  });

  const { control, register, handleSubmit, formState, setValue, watch } = form;
  const { errors } = formState;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterImage = watch("moviePoster");

  /* ---------- arrays ---------- */

  const castArrayMethods = useFieldArray({
    control: control as never,
    name: "casts",
  });
  const showTimesArrayMethods = useFieldArray({
    control: control as never,
    name: "showTimes",
  });
  const slotsArrayMethods = useFieldArray({
    control: control as never,
    name: "slots",
  });

  // For easier access, create aliases
  const casts = castArrayMethods;
  const showTimes = showTimesArrayMethods;
  const slots = slotsArrayMethods;

  /* ---------- IMAGE UPLOAD ---------- */

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("moviePoster", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setValue("moviePoster", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ---------- SLOT BUILDER ---------- */

  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const [slotType, setSlotType] = useState("Normal Seat");
  const [slotPrice, setSlotPrice] = useState("7000 MMK");

  const generateSlots = () => {
    const generated = [];

    for (let r = 0; r < rows; r++) {
      const rowLetter = String.fromCharCode(65 + r);

      for (let c = 1; c <= cols; c++) {
        generated.push({
          slotName: `${rowLetter}-${String(c).padStart(2, "0")}`,
          slotType,
          slotPrice,
        });
      }
    }

    slots.replace(generated);
  };

  const onSubmit = (data: MovieFormValues) => {
    console.log(data);
  };

  /* ------------------------------------------------ */

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
      {/* ================= BASIC INFO ================= */}

      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <FieldSet>
            <FieldTitle className="text-lg font-semibold text-gray-900 mb-6">
              Basic Information
            </FieldTitle>

            <FieldGroup className="space-y-6">
              {/* Movie Poster Upload */}
              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700 mb-2">
                  Movie Poster
                </FieldLabel>
                <FieldContent>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {posterImage ? (
                    <div className="relative w-full">
                      <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
                        <Image
                          width={100}
                          height={100}
                          src={posterImage}
                          alt="Movie poster preview"
                          className="w-full h-64 object-cover"
                        />
                        <button
                          title="clear-image"
                          type="button"
                          onClick={clearImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
                      >
                        Change Poster
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Click to upload poster
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 10MB
                      </span>
                    </button>
                  )}
                </FieldContent>
                <FieldError>{errors.moviePoster?.message}</FieldError>
              </Field>

              {/* Movie Name */}
              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700 mb-2">
                  Movie Name
                </FieldLabel>
                <FieldContent>
                  <Input
                    {...register("movieName")}
                    placeholder="Enter movie name"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </FieldContent>
                <FieldError className="text-sm text-red-600 mt-1">
                  {errors.movieName?.message}
                </FieldError>
              </Field>

              {/* Director */}
              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700 mb-2">
                  Director
                </FieldLabel>
                <FieldContent>
                  <Input
                    {...register("director")}
                    placeholder="Enter director name"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  />
                </FieldContent>
                <FieldError className="text-sm text-red-600 mt-1">
                  {errors.director?.message}
                </FieldError>
              </Field>

              {/* Genre */}
              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700 mb-2">
                  Genre
                </FieldLabel>

                <Controller
                  control={control}
                  name="genre"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="border border-gray-300 rounded-lg focus:ring-2">
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Action">Action</SelectItem>
                        <SelectItem value="Drama">Drama</SelectItem>
                        <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                        <SelectItem value="Comedy">Comedy</SelectItem>
                        <SelectItem value="Horror">Horror</SelectItem>
                        <SelectItem value="Romance">Romance</SelectItem>
                        <SelectItem value="Thriller">Thriller</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError className="text-sm text-red-600 mt-1">
                  {errors.genre?.message}
                </FieldError>
              </Field>

              {/* Description */}
              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700 mb-2">
                  Description
                </FieldLabel>
                <FieldContent>
                  <Textarea
                    {...register("description")}
                    placeholder="Enter movie description"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    rows={4}
                  />
                </FieldContent>
                <FieldError className="text-sm text-red-600 mt-1">
                  {errors.description?.message}
                </FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>

      {/* ================= SCHEDULE ================= */}

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <FieldSet>
            <FieldTitle className="text-lg font-semibold text-gray-900 mb-6">
              Schedule
            </FieldTitle>

            <FieldGroup className="space-y-6">
              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700 mb-2">
                  Show Date
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="datetime-local"
                    {...register("showDate")}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </FieldContent>
                <FieldError className="text-sm text-red-600 mt-1">
                  {errors.showDate?.message}
                </FieldError>
              </Field>

              {/* ShowTimes */}
              <Field>
                <FieldLabel className="text-sm font-medium text-gray-700 mb-2">
                  Show Times
                </FieldLabel>

                <FieldContent className="space-y-3">
                  {showTimes.fields.length === 0 ? (
                    <p className="text-sm text-gray-500 py-2">
                      No show times added yet
                    </p>
                  ) : (
                    showTimes.fields.map((item, index) => (
                      <div key={item.id} className="flex gap-2">
                        <Input
                          type="time"
                          {...register(`showTimes.${index}`)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => showTimes.remove(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => showTimes.append("")}
                    className="w-full text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    + Add Show Time
                  </Button>
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>

      {/* ================= CASTS ================= */}

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <FieldSet>
            <FieldTitle className="text-lg font-semibold text-gray-900 mb-6">
              Casts
            </FieldTitle>

            <FieldContent className="space-y-3">
              {casts.fields.length === 0 ? (
                <p className="text-sm text-gray-500 py-2">No casts added yet</p>
              ) : (
                casts.fields.map((item, index) => (
                  <div key={item.id} className="flex gap-2">
                    <Input
                      placeholder="Actor name"
                      {...register(`casts.${index}`)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => casts.remove(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => casts.append("")}
                className="w-full text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                + Add Cast
              </Button>
            </FieldContent>
          </FieldSet>
        </CardContent>
      </Card>

      {/* ================= SLOT BUILDER ================= */}

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6 space-y-6">
          <FieldTitle className="text-lg font-semibold text-gray-900">
            Seat / Slot Builder
          </FieldTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Number of Rows
              </label>
              <Input
                type="number"
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                min="1"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Seats per Row
              </label>
              <Input
                type="number"
                value={cols}
                onChange={(e) => setCols(Number(e.target.value))}
                min="1"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Seat Type
              </label>
              <Select value={slotType} onValueChange={setSlotType}>
                <SelectTrigger className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select seat type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal Seat">Normal Seat</SelectItem>
                  <SelectItem value="Premium Seat">Premium Seat</SelectItem>
                  <SelectItem value="Couple Seat">Couple Seat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Seat Price
              </label>
              <Input
                value={slotPrice}
                onChange={(e) => setSlotPrice(e.target.value)}
                placeholder="e.g., 7000 MMK"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={generateSlots}
              className="flex-1 bg-black text-white hover:bg-gray-800 font-medium py-2 rounded-lg transition-colors"
            >
              Generate Slots ({rows} × {cols} = {rows * cols} seats)
            </Button>
          </div>

          {slots.fields.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium">
                ✓ {slots.fields.length} seats generated successfully
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= SUBMIT ================= */}

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-black text-white hover:bg-gray-800 font-medium py-3 rounded-lg transition-colors"
        >
          Create Movie
        </Button>
      </div>
    </form>
  );
}
