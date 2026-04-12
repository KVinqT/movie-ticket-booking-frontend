import type { LoginRequest, LoginResponse, User } from "./types";

const BASE_URL = "https://outdated-sacred-dispatch.ngrok-free.dev/api";

// ngrok requires this header to skip the browser warning interstitial
const NGROK_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

// Shape the server user response into our canonical User type
function normalizeUser(raw: Record<string, unknown>): User {
  return {
    id: raw.id as number,
    name: raw.name as string,
    email: raw.email as string,
    role: raw.role as User["role"],
    created_at: raw.created_at as string,
  };
}

// Parse server error messages from Laravel-style responses
async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    // Laravel validation errors: { message: "...", errors: { field: [...] } }
    if (body?.errors) {
      const firstField = Object.values(body.errors as Record<string, string[]>)[0];
      if (Array.isArray(firstField) && firstField.length > 0) return firstField[0];
    }
    if (body?.message) return body.message as string;
  } catch {
    // non-JSON error body — fall through
  }
  return `Request failed with status ${res.status}`;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export async function apiLogin(req: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: NGROK_HEADERS,
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const message = await parseError(res);
    throw new Error(message);
  }

  const body = await res.json();
  return {
    user: normalizeUser(body.user),
    token: body.token as string,
  };
}

export async function apiRegister(req: RegisterRequest): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: NGROK_HEADERS,
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const message = await parseError(res);
    throw new Error(message);
  }

  const body = await res.json();
  return {
    user: normalizeUser(body.user),
    token: body.token as string,
  };
}
