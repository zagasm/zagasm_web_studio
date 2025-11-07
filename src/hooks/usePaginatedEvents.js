import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../pages/auth/AuthContext";

export default function usePaginatedEvents(endpoint) {
  const { token, user } = useAuth();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

  const fetchPage = useCallback(
    async (page = 1, append = false) => {
      if (!token || !base || !endpoint) return;

      try {
        setError(null);
        page === 1 ? setLoading(true) : setLoadingMore(true);

        const url = `${base}${endpoint}${
          endpoint.includes("?") ? "&" : "?"
        }page=${page}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res?.data?.data ?? [];
        const meta = res?.data?.meta ?? {
          current_page: 1,
          last_page: 1,
          total: data.length,
        };

        setItems((prev) => (append ? [...prev, ...data] : data));
        setMeta({
          current_page: Number(meta.current_page ?? page),
          last_page: Number(meta.last_page ?? 1),
          total: Number(meta.total ?? data.length),
        });
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [token, base, endpoint]
  );

  // initial + endpoint change
  useEffect(() => {
    setItems([]);
    setMeta({ current_page: 1, last_page: 1, total: 0 });
    if (user && token && endpoint) fetchPage(1, false);
  }, [user, token, endpoint, fetchPage]);

  const loadNext = useCallback(() => {
    if (loadingMore) return;
    if (meta.current_page >= meta.last_page) return;
    fetchPage(meta.current_page + 1, true);
  }, [loadingMore, meta, fetchPage]);

  return {
    items,
    meta,
    loading,
    loadingMore,
    error,
    refresh: () => fetchPage(1, false),
    loadNext,
  };
}
