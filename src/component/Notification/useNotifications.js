import { useCallback, useEffect, useMemo, useState } from "react";
import { api, authHeaders } from "../../lib/apiClient";
import { showPromise } from "../ui/toast";

export default function useNotifications(token) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const syncNotifications = useCallback((nextValue) => {
    setNotifications((prev) => {
      const nextNotifications =
        typeof nextValue === "function" ? nextValue(prev) : nextValue;

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("notifications:sync", { detail: nextNotifications })
        );
      }

      return nextNotifications;
    });
  }, []);

  const loadNotifications = useCallback(async () => {
    if (!token) {
      syncNotifications([]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/api/v1/notifications", authHeaders(token));
      const list = res?.data?.notifications || [];
      syncNotifications(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  }, [syncNotifications, token]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleSync = (event) => {
      const list = event?.detail;
      if (Array.isArray(list)) {
        setNotifications(list);
      }
    };

    window.addEventListener("notifications:sync", handleSync);
    return () => window.removeEventListener("notifications:sync", handleSync);
  }, []);

  const unreadCount = useMemo(
    () => notifications.reduce((count, item) => count + (item.read_at ? 0 : 1), 0),
    [notifications]
  );

  const markOneAsRead = useCallback(
    async (id, options = {}) => {
      const current = notifications.find((item) => item.id === id);
      if (!current || current.read_at || !token) return;

      syncNotifications((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, read_at: new Date().toISOString(), read_at_human: "now" }
            : item
        )
      );

      try {
        const request = api.post(`/api/v1/notifications/${id}/read`, null, authHeaders(token));
        const response = options.toast
          ? await showPromise(request, {
              loading: "Marking as read...",
              success: "Marked as read",
              error: "Failed to mark as read",
            })
          : await request;

        const updated = response?.data?.notification;
        if (updated) {
          syncNotifications((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
          );
        }
      } catch (err) {
        console.error("Failed to mark notification as read", err);
        syncNotifications((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, read_at: null, read_at_human: null } : item
          )
        );
      }
    },
    [notifications, syncNotifications, token]
  );

  const markAllAsRead = useCallback(
    async (options = {}) => {
      if (!token || unreadCount === 0) return;

      const now = new Date().toISOString();
      syncNotifications((prev) =>
        prev.map((item) =>
          item.read_at
            ? item
            : { ...item, read_at: now, read_at_human: item.read_at_human || "now" }
        )
      );

      try {
        const request = api.post(
          "/api/v1/notifications/mark-all-as-read",
          null,
          authHeaders(token)
        );

        if (options.toast) {
          await showPromise(request, {
            loading: "Marking all as read...",
            success: "All notifications marked as read",
            error: "Failed to mark all as read",
          });
        } else {
          await request;
        }
      } catch (err) {
        console.error("Failed to mark all notifications as read", err);
        loadNotifications();
      }
    },
    [loadNotifications, syncNotifications, token, unreadCount]
  );

  return {
    notifications,
    loading,
    unreadCount,
    loadNotifications,
    markOneAsRead,
    markAllAsRead,
  };
}
