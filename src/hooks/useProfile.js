// src/hooks/useProfile.js
import { useEffect, useState } from "react";
import { useAuth } from "../pages/auth/AuthContext";
import { api, authHeaders } from "../lib/apiClient";

export default function useProfile() {
  const { token } = useAuth();

  const [user, setUser] = useState(null);
  const [organiser, setOrganiser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/api/v1/profile", authHeaders(token));

        // supports either {user, organiser} or {data:{user, organiser}}
        const payload = res?.data?.data ?? res?.data ?? {};
        const u = payload?.user ?? null;
        const o = payload?.organiser ?? payload?.organizer ?? null;

        if (!mounted) return;

        setUser(u);
        setOrganiser(o);
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to fetch profile");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token]);

  return { user, organiser, loading, error };
}
