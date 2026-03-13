"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { mockUsers, type User } from "@/lib/mock-data";

type AuthContextType = {
  currentUser: User | null;
  login: (
    email: string,
    password: string,
  ) => { success: boolean; message?: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const value = useMemo<AuthContextType>(
    () => ({
      currentUser,
      login: (email, password) => {
        const matched = mockUsers.find(
          (user) => user.email === email.trim() && user.password === password,
        );

        if (!matched) {
          return {
            success: false,
            message: "Invalid credentials. Use one of the demo accounts below.",
          };
        }

        setCurrentUser(matched);
        return { success: true };
      },
      logout: () => {
        setCurrentUser(null);
      },
    }),
    [currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
