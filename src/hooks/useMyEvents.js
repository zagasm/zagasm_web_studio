import { useCallback, useEffect, useMemo, useState } from "react";
import { api, authHeaders } from "../lib/apiClient";
import { useAuth } from "../pages/auth/AuthContext";
import { resolveMediaUrl } from "../utils/media";

export function normalizeStatus(v) {
  if (!v) return "unknown";
  const s = String(v).toLowerCase().trim();
  if (s === "upcoming" || s === "soon") return "upcoming";
  if (s === "live") return "live";
  if (s === "paused") return "paused";
  if (s === "ended" || s === "past" || s === "completed") return "ended";
  return s;
}

function formatMoney(value, currencyCode = "NGN") {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount)) return "Free";

  if (amount <= 0) return "Free";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currencyCode}`;
  }
}

function formatEventDate(dateValue) {
  if (!dateValue) return "Date not set";

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return String(dateValue);

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizePoster(rawEvent) {
  const source = Array.isArray(rawEvent?.poster)
    ? rawEvent.poster
    : Array.isArray(rawEvent?.event_images)
      ? rawEvent.event_images
      : [];

  return source.map((item) => ({
    ...item,
    url: resolveMediaUrl(item?.url),
    original_url: resolveMediaUrl(item?.original_url),
  }));
}

function mapEventForCard(rawEvent) {
  return {
    ...rawEvent,
    poster: normalizePoster(rawEvent),
    eventDate: rawEvent?.eventDate || formatEventDate(rawEvent?.event_date),
    eventDateISO: rawEvent?.eventDateISO || rawEvent?.event_date || "",
    startTime: rawEvent?.startTime || rawEvent?.start_time || "",
    hostName:
      rawEvent?.hostName ||
      rawEvent?.organizer?.name ||
      rawEvent?.organiser?.name ||
      rawEvent?.user?.name ||
      "Zagasm Studios",
    price_display:
      rawEvent?.price_display ||
      formatMoney(
        rawEvent?.price,
        rawEvent?.currency?.code || rawEvent?.currency_code || "NGN",
      ),
    isOwner: rawEvent?.isOwner ?? true,
  };
}

function extractEventsPayload(payload) {
  const data = payload?.data ?? {};
  const list = Array.isArray(data?.events)
    ? data.events
    : Array.isArray(data)
      ? data
      : [];
  const pagination = data?.pagination ?? {};

  return {
    events: list.map(mapEventForCard),
    pagination: {
      currentPage: Number(pagination?.current_page ?? 1),
      perPage: Number(pagination?.per_page ?? (list.length || 10)),
      total: Number(pagination?.total ?? list.length),
      hasMore: Boolean(pagination?.has_more),
      lastPage: Number(
        pagination?.last_page ??
          (pagination?.has_more
            ? Number(pagination?.current_page ?? 1) + 1
            : 1),
      ),
    },
  };
}

export default function useMyEvents(activeFilter = "all") {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
    hasMore: false,
    lastPage: 1,
  });

  const fetchPage = useCallback(
    async (page = 1, append = false) => {
      if (!token) return;

      try {
        setError(null);
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const params = { page };
        if (activeFilter !== "all") {
          params.status = activeFilter;
        }

        const response = await api.get(
          "/api/v1/user/events",
          {
            ...authHeaders(token),
            params,
          },
        );

        const { events: nextEvents, pagination: nextPagination } =
          extractEventsPayload(response?.data);

        setEvents((current) =>
          append ? [...current, ...nextEvents] : nextEvents,
        );
        setPagination(nextPagination);
      } catch (e) {
        setError(e?.message || "Failed to fetch events");
        if (page === 1) {
          setEvents([]);
          setPagination({
            currentPage: 1,
            perPage: 10,
            total: 0,
            hasMore: false,
            lastPage: 1,
          });
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeFilter, token],
  );

  useEffect(() => {
    setEvents([]);
    setPagination({
      currentPage: 1,
      perPage: 10,
      total: 0,
      hasMore: false,
      lastPage: 1,
    });

    if (!token) {
      setLoading(false);
      return;
    }

    fetchPage(1, false);
  }, [fetchPage, token]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !pagination.hasMore) return;
    fetchPage(pagination.currentPage + 1, true);
  }, [fetchPage, loading, loadingMore, pagination]);

  const filteredEvents = useMemo(() => {
    const list = Array.isArray(events) ? events : [];
    if (activeFilter === "all") return list;
    return list.filter((event) => normalizeStatus(event?.status) === activeFilter);
  }, [activeFilter, events]);

  return {
    events: filteredEvents,
    rawEvents: events,
    loading,
    loadingMore,
    error,
    hasMore: pagination.hasMore,
    pagination,
    loadMore,
    refresh: () => fetchPage(1, false),
  };
}
