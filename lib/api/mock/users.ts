import type { User } from "../types";

interface MockCredential {
  user: User;
  password: string;
}

export const mockCredentials: MockCredential[] = [
  {
    user: {
      id: 1,
      name: "Cinema Admin",
      email: "admin@movie.com",
      role: "admin",
      created_at: "2026-01-01T00:00:00Z",
    },
    password: "admin123",
  },
  {
    user: {
      id: 2,
      name: "May Phyu",
      email: "user@movie.com",
      role: "client",
      created_at: "2026-01-05T10:00:00Z",
    },
    password: "user123",
  },
  {
    user: {
      id: 3,
      name: "Htet Aung Lin",
      email: "htet@example.com",
      role: "client",
      created_at: "2026-01-07T11:00:00Z",
    },
    password: "htet123",
  },
  {
    user: {
      id: 4,
      name: "Sarah Jenkins",
      email: "sarah@example.com",
      role: "client",
      created_at: "2026-01-09T12:00:00Z",
    },
    password: "sarah123",
  },
  {
    user: {
      id: 5,
      name: "Min Khant Zaw",
      email: "minkhant@example.com",
      role: "client",
      created_at: "2026-01-12T09:30:00Z",
    },
    password: "min123",
  },
];

export const mockUsers: User[] = mockCredentials.map((c) => c.user);
