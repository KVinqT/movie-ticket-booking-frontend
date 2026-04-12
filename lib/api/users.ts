import { delay } from "./mock/_delay";
import { mockUsers, mockCredentials } from "./mock/users";
import type { LoginRequest, LoginResponse, User } from "./types";

export async function login(req: LoginRequest): Promise<LoginResponse> {
  await delay();
  const match = mockCredentials.find(
    (c) =>
      c.user.email === req.email.trim() && c.password === req.password,
  );
  if (!match) throw { status: 401, message: "Invalid email or password." };
  return { user: match.user, token: `mock-token-${match.user.id}` };
}

export async function getUsers(): Promise<User[]> {
  await delay();
  return [...mockUsers];
}

export async function getUserById(id: number): Promise<User> {
  await delay();
  const user = mockUsers.find((u) => u.id === id);
  if (!user) throw { status: 404, message: "User not found" };
  return user;
}

export async function deleteUser(id: number): Promise<void> {
  await delay();
  const idx = mockUsers.findIndex((u) => u.id === id);
  if (idx === -1) throw { status: 404, message: "User not found" };
  mockUsers.splice(idx, 1);
}
