"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { apiLogin, apiRegister, type RegisterRequest } from "@/lib/api/auth";
import type { User } from "@/lib/api/types";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

type AuthContextType = {
  currentUser: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<boolean>;
  logout: () => void;
  /** Syncs an updated user object into context + localStorage (e.g. after profile edit). */
  updateCurrentUser: (updated: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // true until we've read localStorage on first mount
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate session from localStorage once on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (savedUser && savedToken) {
        setCurrentUser(JSON.parse(savedUser) as User);
        setToken(savedToken);
      }
    } catch {
      // corrupt storage — clear it
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = (user: User, tok: string) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, tok);
    setCurrentUser(user);
    setToken(tok);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      currentUser,
      token,
      isLoading,

      login: async (email, password) => {
        try {
          const res = await apiLogin({ email, password });
          persist(res.user, res.token);
          toast.success("Welcome back!", {
            description: `Signed in as ${res.user.name}`,
          });
          return true;
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Login failed. Please try again.";
          toast.error("Login failed", { description: message });
          return false;
        }
      },

      register: async (name, email, password, confirmPassword) => {
        const req: RegisterRequest = {
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        };
        try {
          const res = await apiRegister(req);
          persist(res.user, res.token);
          toast.success("Account created!", {
            description: `Welcome, ${res.user.name}! You are now signed in.`,
          });
          return true;
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Registration failed. Please try again.";
          toast.error("Sign up failed", { description: message });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        setCurrentUser(null);
        setToken(null);
        toast.success("Signed out successfully.");
      },

      updateCurrentUser: (updated: User) => {
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
        setCurrentUser(updated);
      },
    }),
    [currentUser, token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
