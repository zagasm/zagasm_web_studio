import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../pages/auth/AuthContext";

export function normalizeStatus(v) {
  if (!v) return "unknown";
  const s = String(v).toLowerCase();
  if (s === "upcoming" || s === "soon") return "soon";
  if (s === "live") return "live";
  if (s === "ended" || s === "past") return "ended";
  return s;
}

export default function useMyEvents(activeFilter = "all") {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/user/events`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        const list = data?.data || data?.message || [];
        if (isMounted) setEvents(list);
      } catch (e) {
        setError(e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return events;
    return events.filter((e) => normalizeStatus(e.status) === activeFilter);
  }, [events, activeFilter]);

  return { events: filtered, rawEvents: events, loading, error };
}
