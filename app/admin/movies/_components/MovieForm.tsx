"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useState } from "react";

/* ---------------- SCHEMA ---------------- */

const slotSchema = z.object({
  slotName: z.string(),
  slotType: z.string(),
  slotPrice: z.string(),
});

const movieSchema = z.object({
  movieName: z.string().min(1, "Movie name required"),
  director: z.string(),
  moviePoster: z.string(),
  genre: z.string(),
  description: z.string(),
  showDate: z.string(),
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
      casts: [],
      showTimes: [],
      slots: [],
    },
  });

  const { control, register, handleSubmit, formState } = form;
  const { errors } = formState;

  /* ---------- arrays ---------- */

  const casts = useFieldArray({ control, name: "slots" });
  const showTimes = useFieldArray({ control, name: "slots" });
  const slots = useFieldArray({ control, name: "slots" });

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-8">
      {/* ================= BASIC INFO ================= */}

      <Card>
        <CardContent className="p-6">
          <FieldSet>
            <FieldTitle>Basic Info</FieldTitle>

            <FieldGroup>
              {/* Movie Name */}
              <Field>
                <FieldLabel>Movie Name</FieldLabel>
                <FieldContent>
                  <Input {...register("movieName")} />
                </FieldContent>
                <FieldError>{errors.movieName?.message}</FieldError>
              </Field>

              {/* Director */}
              <Field>
                <FieldLabel>Director</FieldLabel>
                <FieldContent>
                  <Input {...register("director")} />
                </FieldContent>
              </Field>

              {/* Genre (Controller required) */}
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
                        <SelectItem value="Action">Action</SelectItem>
                        <SelectItem value="Drama">Drama</SelectItem>
                        <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                        <SelectItem value="Comedy">Comedy</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              {/* Description */}
              <Field>
                <FieldLabel>Description</FieldLabel>
                <FieldContent>
                  <Textarea {...register("description")} />
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>

      {/* ================= SCHEDULE ================= */}

      <Card>
        <CardContent className="p-6">
          <FieldSet>
            <FieldTitle>Schedule</FieldTitle>

            <Field>
              <FieldLabel>Show Date</FieldLabel>
              <FieldContent>
                <Input type="datetime-local" {...register("showDate")} />
              </FieldContent>
            </Field>

            {/* ShowTimes */}
            <Field>
              <FieldLabel>Show Times</FieldLabel>

              <FieldContent className="space-y-2">
                {showTimes.fields.map((item, index) => (
                  <Input
                    key={item.id}
                    type="time"
                    {...register(`showTimes.${index}`)}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  // onClick={() => showTimes.append("")}
                >
                  + Add Time
                </Button>
              </FieldContent>
            </Field>
          </FieldSet>
        </CardContent>
      </Card>

      {/* ================= CASTS ================= */}

      <Card>
        <CardContent className="p-6">
          <FieldSet>
            <FieldTitle>Casts</FieldTitle>

            <FieldContent className="space-y-2">
              {casts.fields.map((item, index) => (
                <Input
                  key={item.id}
                  placeholder="Actor name"
                  {...register(`casts.${index}`)}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                // onClick={() => casts.append("")}
              >
                + Add Cast
              </Button>
            </FieldContent>
          </FieldSet>
        </CardContent>
      </Card>

      {/* ================= SLOT BUILDER ================= */}

      <Card>
        <CardContent className="p-6 space-y-4">
          <FieldTitle>Seat / Slot Builder</FieldTitle>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Input
              type="number"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
            />

            <Input
              type="number"
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
            />

            <Select onValueChange={setSlotType}>
              <SelectTrigger>
                <SelectValue placeholder="Seat Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Normal Seat">Normal</SelectItem>
                <SelectItem value="Premium Seat">Premium</SelectItem>
                <SelectItem value="Couple Seat">Couple</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={slotPrice}
              onChange={(e) => setSlotPrice(e.target.value)}
            />
          </div>

          <Button type="button" onClick={generateSlots}>
            Generate Slots
          </Button>

          <p className="text-sm text-muted-foreground">
            Generated: {slots.fields.length} seats
          </p>
        </CardContent>
      </Card>

      {/* ================= SUBMIT ================= */}

      <Button type="submit" className="w-full">
        Create Movie
      </Button>
    </form>
  );
}
