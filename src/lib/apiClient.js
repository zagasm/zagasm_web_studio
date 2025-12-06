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
 * - In dev: don't auto-redirect on 401, just let the request fail
 * - In prod: on 401, clear auth + redirect to /auth/signin (like before)
 * - Never treat network/5xx errors as auth issues
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    // Network / CORS / server not reachable -> no response object
    if (!error.response) {
      if (!import.meta.env.PROD) {
        console.warn("[api] Network or CORS error (no response)", error);
      }
      return Promise.reject(error);
    }

    if (!import.meta.env.PROD) {
      console.log("[api] response status:", status, "url:", url);
    }

    // For non-401, just bubble up
    if (status !== 401) {
      return Promise.reject(error);
    }

    // ---- 401 handling ----

    // In development: do NOT auto-logout / redirect.
    // This is what was kicking you out while coding / server restarting.
    if (!import.meta.env.PROD) {
      console.warn("[api] 401 in dev – NOT redirecting, just rejecting.");
      // Optionally clear only the token if you want:
      // localStorage.removeItem("token");
      return Promise.reject(error);
    }

    // In production: behave like before (hard logout + redirect),
    // but avoid looping on the signin page.
    if (window.location.pathname !== "/auth/signin") {
      // Clear auth-related storage. You were doing localStorage.clear(),
      // keeping same behaviour to avoid surprises.
      localStorage.clear();
      window.location.replace("/auth/signin");
    }

    return Promise.reject(error);
  }
);
