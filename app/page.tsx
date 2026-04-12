"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

export default function WelcomePage() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  // Auto-redirect if already signed in
  useEffect(() => {
    if (!isLoading && currentUser) {
      router.replace(currentUser.role === "admin" ? "/admin" : "/client");
    }
  }, [currentUser, isLoading, router]);

  const handleContinue = () => {
    if (!currentUser) {
      router.push("/auth");
    } else {
      router.push(currentUser.role === "admin" ? "/admin" : "/client");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <Image
        src="/moviesBg.jpg"
        alt="Cinema background"
        fill
        priority
        className="object-cover opacity-50"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-end pb-24 px-6 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-widest uppercase backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          Now Showing
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none">
          Ticket<span className="text-red-500">Flix</span>
        </h1>
        <p className="mt-4 max-w-md text-base text-white/60 leading-relaxed">
          Your seats are waiting. Browse the latest films, pick your showtime,
          and book in seconds.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <Button
            size="lg"
            className="min-w-48 rounded-full text-base font-semibold"
            onClick={handleContinue}
            disabled={isLoading}
          >
            {isLoading
              ? "Loading…"
              : currentUser
                ? `Go to ${currentUser.role === "admin" ? "Dashboard" : "Movies"}`
                : "Get Started"}
          </Button>

          {!currentUser && !isLoading && (
            <Button
              size="lg"
              variant="outline"
              className="min-w-48 rounded-full border-white/30 bg-white/5 text-white text-base backdrop-blur hover:bg-white/15"
              onClick={() => router.push("/auth")}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
