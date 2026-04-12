"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { useAuth } from "@/components/providers/auth-provider";
import { type LoginFormValues, type SignupFormValues } from "@/lib/validation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const router = useRouter();
  const { currentUser, login, register } = useAuth();

  useEffect(() => {
    if (currentUser) router.replace("/");
  }, [currentUser, router]);

  const handleLogin = async (values: LoginFormValues) => {
    const ok = await login(values.email, values.password);
    if (ok) router.replace("/");
  };

  const handleSignup = async (values: SignupFormValues) => {
    const ok = await register(
      values.name,
      values.email,
      values.password,
      values.confirmPassword,
    );
    if (ok) router.replace("/");
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
            <LoginForm onSubmit={handleLogin} />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm onSubmit={handleSignup} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
