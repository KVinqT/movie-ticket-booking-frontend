"use client";

import { useRef, useState } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Upload, X, ImageOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { Separator } from "@/components/ui/separator";

import {
  createMovieFormSchema,
  editMovieFormSchema,
  type CreateMovieFormValues,
  type EditMovieFormValues,
} from "@/lib/validation";
import { MOVIE_GENRES } from "@/lib/constants";
import { useTheaters } from "@/lib/api/admin/theaters";
import { useCreateMovie, useUpdateMovie } from "@/lib/api/admin/movies";
import {
  useCreateUpdateShowtimes,
  toServerDatetime,
} from "@/lib/api/admin/showtimes";
import type { AdminMovie } from "@/lib/api/types";

// ── Types ─────────────────────────────────────────────────────────────────────

type CreateMode = { mode: "create" };
type EditMode = { mode: "edit"; movieId: number; initialData: AdminMovie };
type MovieFormProps = CreateMode | EditMode;

type FormValues = CreateMovieFormValues | EditMovieFormValues;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Placeholder sent to the server while real Cloudinary upload is not yet wired. */
const MOCK_POSTER_URL =
  "https://placehold.co/400x600/18181b/ffffff?text=Poster";

function blankShowtime() {
  return { id: 0, theater_id: 0, show_datetime: "" };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MovieForm(props: MovieFormProps) {
  const isEdit = props.mode === "edit";
  const navigate = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [posterPreview, setPosterPreview] = useState<string>(
    isEdit ? (props as EditMode).initialData.movie_poster_url : ""
  );

  // Use the correct schema for each mode
  const schema = isEdit ? editMovieFormSchema : createMovieFormSchema;

  const defaultValues: FormValues = isEdit
    ? {
        movie_name: (props as EditMode).initialData.movie_name,
        director: (props as EditMode).initialData.director,
        movie_poster_url: (props as EditMode).initialData.movie_poster_url,
        genre: (props as EditMode).initialData.genre,
        description: (props as EditMode).initialData.description,
        showtimes: [blankShowtime()],
      }
    : {
        movie_name: "",
        director: "",
        movie_poster_url: "",
        genre: "",
        description: "",
        showtimes: [blankShowtime()],
      };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "showtimes",
  });

  const posterUrlField = watch("movie_poster_url");

  // Real theater list from API
  const { data: theaters = [] } = useTheaters();

  // Mutations
  const { mutateAsync: createMovie } = useCreateMovie();
  const { mutateAsync: updateMovie } = useUpdateMovie(
    isEdit ? (props as EditMode).movieId : 0
  );
  const { mutateAsync: createUpdateShowtimes } = useCreateUpdateShowtimes();

  // ── Poster handlers ──────────────────────────────────────────────────────────

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show a local preview using object URL
    const localUrl = URL.createObjectURL(file);
    setPosterPreview(localUrl);
    // Send a mock URL to the server (Cloudinary upload comes later)
    setValue("movie_poster_url", MOCK_POSTER_URL, { shouldValidate: true });
  };

  const clearPoster = () => {
    setPosterPreview("");
    setValue("movie_poster_url", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Submit ───────────────────────────────────────────────────────────────────

  const onSubmit = async (data: FormValues) => {
    try {
      let movieId: number;

      if (isEdit) {
        const updated = await updateMovie({
          movie_name: data.movie_name,
          director: data.director,
          genre: data.genre,
          description: data.description,
          ...(data.movie_poster_url
            ? { movie_poster_url: data.movie_poster_url }
            : {}),
        });
        movieId = updated.id;
        toast.success("Movie updated successfully!");
      } else {
        const created = await createMovie({
          movie_name: data.movie_name,
          director: data.director,
          movie_poster_url: data.movie_poster_url ?? MOCK_POSTER_URL,
          genre: data.genre,
          description: data.description,
        });
        movieId = created.id;
      }

      // Group showtimes by theater_id — one API call per theater
      const grouped = data.showtimes.reduce<
        Record<number, { id: number; show_datetime: string }[]>
      >((acc, st) => {
        if (!st.theater_id) return acc; // skip unselected rows
        acc[st.theater_id] ??= [];
        acc[st.theater_id].push({
          id: st.id ?? 0,
          show_datetime: toServerDatetime(st.show_datetime),
        });
        return acc;
      }, {});

      await Promise.all(
        Object.entries(grouped).map(([theaterId, showtimes]) =>
          createUpdateShowtimes({
            movie_id: movieId,
            theater_id: Number(theaterId),
            showtimes,
          })
        )
      );

      if (!isEdit) toast.success("Movie & showtimes created successfully!");

      navigate.push("/admin/movies");
    } catch {
      // Individual mutation errors are already toasted by the hooks
      // Only catch unexpected failures here
      toast.error("Something went wrong. Please try again.");
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const showtimeErrors = (
    errors as { showtimes?: { message?: string; root?: { message?: string } } }
  ).showtimes;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
      {/* ── CARD 1: Movie Details ── */}
      <Card>
        <CardContent className="p-6">
          <FieldSet>
            <FieldTitle className="text-lg font-semibold mb-6">
              Movie Details
            </FieldTitle>

            <FieldGroup className="space-y-6">
              {/* Poster */}
              <Field>
                <FieldLabel>Poster Image</FieldLabel>
                <FieldContent>
                  <input
                    title="Upload poster"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  {posterPreview ? (
                    <div className="relative w-full">
                      <div className="relative overflow-hidden rounded-lg border-2 border-zinc-200 h-64">
                        <Image
                          src={posterPreview}
                          alt="Poster preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          title="Remove poster"
                          onClick={clearPoster}
                          className="absolute top-2 right-2 p-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-700 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 w-full"
                      >
                        Change Poster
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center px-6 py-10 border-2 border-dashed border-zinc-300 rounded-lg hover:border-zinc-500 hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                      <span className="text-sm font-medium text-zinc-600">
                        Click to upload poster
                      </span>
                      <span className="text-xs text-zinc-400 mt-1">
                        PNG, JPG up to 10 MB
                      </span>
                    </button>
                  )}

                  {/* Also allow pasting a direct URL */}
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-zinc-500">
                      Or paste an image URL directly:
                    </p>
                    <Input
                      {...register("movie_poster_url")}
                      placeholder="https://example.com/poster.jpg"
                      onChange={(e) => {
                        register("movie_poster_url").onChange(e);
                        const val = e.target.value;
                        setPosterPreview(val.startsWith("http") ? val : "");
                      }}
                      value={posterUrlField ?? ""}
                    />
                  </div>

                  {isEdit && !posterUrlField && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                      <ImageOff className="w-3.5 h-3.5" />
                      Leave blank to keep the existing poster.
                    </div>
                  )}
                </FieldContent>
                <FieldError>
                  {
                    (errors as { movie_poster_url?: { message?: string } })
                      .movie_poster_url?.message
                  }
                </FieldError>
              </Field>

              {/* Movie Name */}
              <Field>
                <FieldLabel>Movie Name</FieldLabel>
                <FieldContent>
                  <Input
                    {...register("movie_name")}
                    placeholder="e.g. Avengers: Endgame"
                  />
                </FieldContent>
                <FieldError>{errors.movie_name?.message}</FieldError>
              </Field>

              {/* Director */}
              <Field>
                <FieldLabel>Director</FieldLabel>
                <FieldContent>
                  <Input
                    {...register("director")}
                    placeholder="e.g. Anthony Russo, Joe Russo"
                  />
                </FieldContent>
                <FieldError>{errors.director?.message}</FieldError>
              </Field>

              {/* Genre */}
              <Field>
                <FieldLabel>Genre</FieldLabel>
                <Controller
                  control={control}
                  name="genre"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOVIE_GENRES.filter((g) => g !== "All").map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.genre?.message}</FieldError>
              </Field>

              {/* Description */}
              <Field>
                <FieldLabel>Description</FieldLabel>
                <FieldContent>
                  <Textarea
                    {...register("description")}
                    placeholder="Write a short synopsis…"
                    rows={4}
                  />
                </FieldContent>
                <FieldError>{errors.description?.message}</FieldError>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>

      {/* ── CARD 2: Showtimes ── */}
      <Card>
        <CardContent className="p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold">Showtimes</h2>
            <p className="text-sm text-zinc-500 mt-0.5">
              {isEdit
                ? "Add new showtimes (id = 0) or update existing ones by entering their id."
                : "Schedule one or more showtimes across different theaters."}
            </p>
          </div>

          <Separator />

          {/* Theater info cards */}
          {theaters.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {theaters.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border bg-zinc-50 text-sm"
                >
                  <span className="font-medium">{t.name}</span>
                  <span className="text-zinc-500">
                    {t.total_rows} rows × {t.total_columns} cols
                    <span className="ml-1 font-medium text-zinc-700">
                      ({t.total_rows * t.total_columns} seats)
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Showtime rows */}
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-start p-4 rounded-lg border bg-white"
              >
                {/* Showtime ID (visible in edit mode) */}
                {isEdit && (
                  <Field>
                    <FieldLabel className="text-xs text-zinc-500 uppercase tracking-wider">
                      ID
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        type="number"
                        className="w-20"
                        placeholder="0"
                        {...register(`showtimes.${index}.id`, {
                          valueAsNumber: true,
                        })}
                      />
                    </FieldContent>
                  </Field>
                )}

                {/* Theater selector */}
                <Field>
                  <FieldLabel className="text-xs text-zinc-500 uppercase tracking-wider">
                    Theater
                  </FieldLabel>
                  <Controller
                    control={control}
                    name={`showtimes.${index}.theater_id`}
                    render={({ field: f }) => (
                      <Select
                        value={f.value ? String(f.value) : ""}
                        onValueChange={(v) => f.onChange(Number(v))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select hall…" />
                        </SelectTrigger>
                        <SelectContent>
                          {theaters.map((t) => (
                            <SelectItem key={t.id} value={String(t.id)}>
                              <span className="font-medium">{t.name}</span>
                              <span className="ml-2 text-zinc-400 text-xs">
                                {t.total_rows * t.total_columns} seats
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError>
                    {
                      (
                        errors.showtimes as
                          | {
                              [key: number]: {
                                theater_id?: { message?: string };
                              };
                            }
                          | undefined
                      )?.[index]?.theater_id?.message
                    }
                  </FieldError>
                </Field>

                {/* Date + time */}
                <Field>
                  <FieldLabel className="text-xs text-zinc-500 uppercase tracking-wider">
                    Date &amp; Time
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      type="datetime-local"
                      {...register(`showtimes.${index}.show_datetime`)}
                    />
                  </FieldContent>
                  <FieldError>
                    {
                      (
                        errors.showtimes as
                          | {
                              [key: number]: {
                                show_datetime?: { message?: string };
                              };
                            }
                          | undefined
                      )?.[index]?.show_datetime?.message
                    }
                  </FieldError>
                </Field>

                {/* Remove row */}
                <div className="pt-6">
                  <button
                    type="button"
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                    title="Remove showtime"
                    className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add row */}
          <Button
            type="button"
            variant="outline"
            onClick={() => append(blankShowtime())}
            className="w-full gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Another Showtime
          </Button>

          {showtimeErrors?.root?.message && (
            <p className="text-sm text-red-500">
              {showtimeErrors.root.message}
            </p>
          )}
          {typeof showtimeErrors?.message === "string" && (
            <p className="text-sm text-red-500">{showtimeErrors.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 pb-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate.back()}
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting
            ? isEdit
              ? "Saving…"
              : "Creating…"
            : isEdit
            ? "Save Changes"
            : "Create Movie & Showtimes"}
        </Button>
      </div>
    </form>
  );
}
