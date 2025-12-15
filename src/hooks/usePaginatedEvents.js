import { useState, useEffect, useCallback } from "react";
import { api, authHeaders } from "../lib/apiClient"; // adjust path
import { useAuth } from "../pages/auth/AuthContext";

export default function usePaginatedEvents(endpoint) {
  const { token, user } = useAuth();

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchPage = useCallback(
    async (page = 1, append = false) => {
      if (!endpoint) return;

      try {
        setError(null);
        page === 1 ? setLoading(true) : setLoadingMore(true);

        // Let axios handle query params properly (avoids manual "?"/"&" logic)
        const res = await api.get(endpoint, {
          ...authHeaders(token),
          params: { page },
        });

        const data = res?.data?.data ?? [];
        const m = res?.data?.meta ?? {
          current_page: page,
          last_page: 1,
          total: data.length,
        };

        setItems((prev) => (append ? [...prev, ...data] : data));
        setMeta({
          current_page: Number(m.current_page ?? page),
          last_page: Number(m.last_page ?? 1),
          total: Number(m.total ?? data.length),
        });
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [endpoint, token]
  );

  // initial + endpoint change
  useEffect(() => {
    setItems([]);
    setMeta({ current_page: 1, last_page: 1, total: 0 });

    // if your endpoint is public, remove user/token checks
    if (user && endpoint) fetchPage(1, false);
  }, [user, endpoint, fetchPage]);

  const loadNext = useCallback(() => {
    if (loadingMore) return;
    if (meta.current_page >= meta.last_page) return;
    fetchPage(meta.current_page + 1, true);
  }, [loadingMore, meta.current_page, meta.last_page, fetchPage]);

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
