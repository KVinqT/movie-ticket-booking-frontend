"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type SignupFormValues, signupSchema } from "@/lib/validation";

type SignupFormProps = {
  onSubmit: (values: SignupFormValues) => void | Promise<void>;
};

function PasswordInput({
  id,
  autoComplete,
  registration,
}: {
  id: string;
  autoComplete: string;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        className="pr-10"
        {...registration}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

export function SignupForm({ onSubmit }: SignupFormProps) {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const { isSubmitting } = form.formState;

  return (
    <Card className="border-primary/40 bg-card/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Sign up for Movie Ticket Booking and start booking tickets today.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              autoComplete="name"
              {...form.register("name")}
            />
            <p className="text-xs text-red-400">
              {form.formState.errors.name?.message}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...form.register("email")}
            />
            <p className="text-xs text-red-400">
              {form.formState.errors.email?.message}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <PasswordInput
              id="signup-password"
              autoComplete="new-password"
              registration={form.register("password")}
            />
            <p className="text-xs text-red-400">
              {form.formState.errors.password?.message}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <PasswordInput
              id="confirm-password"
              autoComplete="new-password"
              registration={form.register("confirmPassword")}
            />
            <p className="text-xs text-red-400">
              {form.formState.errors.confirmPassword?.message}
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
