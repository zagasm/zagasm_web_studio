import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

/** Helper to attach bearer header per request without piling interceptors */
export function authHeaders(token) {
  return token
    ? {
        headers: { Authorization: `Bearer ${token}` },
      }
    : {};
}
