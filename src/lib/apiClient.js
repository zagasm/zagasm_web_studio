// lib/apiClient.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

/**
 * Helper to attach bearer header per request without piling interceptors
 */
export function authHeaders(token) {
  const brToken = localStorage.getItem("token");

  const finalToken = token || brToken;

  return finalToken
    ? {
        headers: { Authorization: `Bearer ${finalToken}` },
      }
    : {};
}
/**
 * Global response interceptor:
 * - If backend returns 401, clear token and send user to /auth/signin
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    console.log("API response status:", status);

    if (status === 401) {
      // Clear *everything* in localStorage
      localStorage.clear();

      if (window.location.pathname !== "/auth/signin") {
        window.location.replace("/auth/signin");
      }
    }

    return Promise.reject(error);
  }
);
