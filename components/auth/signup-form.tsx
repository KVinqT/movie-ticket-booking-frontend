"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  onSubmit: (values: SignupFormValues) => void;
  error: string;
};

export function SignupForm({ onSubmit, error }: SignupFormProps) {
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Card className="border-primary/40 bg-card/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Sign up for Movie Ticket Booking and start booking tickets today.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={signupForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...signupForm.register("name")}
            />
            <p className="text-xs text-red-400">
              {signupForm.formState.errors.name?.message}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              placeholder="user@movie.com"
              {...signupForm.register("email")}
            />
            <p className="text-xs text-red-400">
              {signupForm.formState.errors.email?.message}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              {...signupForm.register("password")}
            />
            <p className="text-xs text-red-400">
              {signupForm.formState.errors.password?.message}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              {...signupForm.register("confirmPassword")}
            />
            <p className="text-xs text-red-400">
              {signupForm.formState.errors.confirmPassword?.message}
            </p>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
