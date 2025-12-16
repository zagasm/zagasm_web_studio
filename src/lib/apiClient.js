// lib/apiClient.js
import axios from "axios";
import { showError } from "../component/ui/toast"; // <-- adjust path if different

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

// prevent repeated spam toasts for the same situation
let lastDeactivatedToastAt = 0;
const DEACTIVATED_TOAST_COOLDOWN_MS = 8000;

function maybeToastDeactivated(payload) {
  if (!payload || payload.reactivate !== true) return;

  const now = Date.now();
  if (now - lastDeactivatedToastAt < DEACTIVATED_TOAST_COOLDOWN_MS) return;
  lastDeactivatedToastAt = now;

  const when = payload.deactivation_requested_at || "recently";
  // keep it short and clear
  showError(`Account deactivated (${when}). Please reactivate to continue.`);
}

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

    const payload = error?.response?.data;

    if (!import.meta.env.PROD) {
      console.log("[api] response status:", status, "url:", url);
    }

    // ---- 403 handling (deactivated account) ----
    if (status === 403) {
      maybeToastDeactivated(payload);
      return Promise.reject(error);
    }

    // For non-401, just bubble up
    if (status !== 401) {
      return Promise.reject(error);
    }

    // ---- 401 handling ----
    if (!import.meta.env.PROD) {
      console.warn("[api] 401 in dev – NOT redirecting, just rejecting.");
      return Promise.reject(error);
    }

    if (window.location.pathname !== "/auth/signin") { 
      localStorage.clear();
      window.location.replace("/auth/signin");
    }

    return Promise.reject(error);
  }
);
