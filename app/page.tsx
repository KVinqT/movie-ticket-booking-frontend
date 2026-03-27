"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 2. Check the user role and redirect
    if (currentUser?.role === "admin") {
      router.replace("/admin");
    } else if (currentUser) {
      router.replace("/client");
    }
  }, [currentUser, router]);

  return null;
}
