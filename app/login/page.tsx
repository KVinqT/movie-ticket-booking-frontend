"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/components/providers/auth-provider";
import { type LoginFormValues } from "@/lib/validation";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, login } = useAuth();
  const [loginError, setLoginError] = useState("");

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
        <LoginForm onSubmit={handleLogin} error={loginError} />
      </div>
    </main>
  );
}
