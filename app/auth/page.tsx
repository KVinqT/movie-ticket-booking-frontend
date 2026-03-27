"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { useAuth } from "@/components/providers/auth-provider";
import { type LoginFormValues, type SignupFormValues } from "@/lib/validation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, login } = useAuth();
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  useEffect(() => {
    if (currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  const handleLogin = (values: LoginFormValues) => {
    const result = login(values.email, values.password);
    if (!result.success) {
      setLoginError(result.message ?? "Invalid credentials");
      return;
    }

    setLoginError("");
    router.replace("/");
  };

  const handleSignup = (values: SignupFormValues) => {
    // For now, we'll use the same login function with the provided credentials
    // In a real app, you would call a signup API endpoint first
    const result = login(values.email, values.password);
    if (!result.success) {
      setSignupError(result.message ?? "Signup failed");
      return;
    }

    setSignupError("");
    router.replace("/");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-foreground">
      <Image
        src="/moviesBg.jpg"
        alt="Cinema background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-md items-center px-4 sm:px-6">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onSubmit={handleLogin} error={loginError} />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm onSubmit={handleSignup} error={signupError} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
