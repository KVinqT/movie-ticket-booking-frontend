import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    // Skip the ngrok browser-warning interstitial page
    "ngrok-skip-browser-warning": "true",
  },
});

// Attach the Bearer token from localStorage before every request
http.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalise error messages so callers always get a plain Error
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const serverMessage =
      err?.response?.data?.message ??
      err?.response?.data?.error ??
      err?.message ??
      "Something went wrong";
    return Promise.reject(new Error(serverMessage as string));
  }
);

export default http;
