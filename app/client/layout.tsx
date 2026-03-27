"use client";

import { AppHeader } from "@/components/dashboard/app-header";
import { useAuth } from "@/components/providers/auth-provider";
import React from "react";

export default function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { currentUser } = useAuth();
  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {currentUser && <AppHeader currentUser={currentUser} />}
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
