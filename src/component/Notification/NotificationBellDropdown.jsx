import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "../assets/Dropdown";
import { api, authHeaders } from "../../lib/apiClient";
import { useAuth } from "../../pages/auth/AuthContext";
import { showPromise } from "../ui/toast";
import "./notificationBell.css";

export default function NotificationBellDropdown() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    let mounted = true;
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/v1/notifications", authHeaders(token));
        if (mounted) {
          const list = res?.data?.notifications || [];
          setNotifications(list);
        }
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadNotifications();
    return () => {
      mounted = false;
    };
  }, [token]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read_at).length,
    [notifications]
  );

  const markAll = async () => {
    if (!token || unreadCount === 0) return;

    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((n) =>
        n.read_at
          ? n
          : { ...n, read_at: now, read_at_human: n.read_at_human || "now" }
      )
    );

    try {
      const req = api.post(
        "/api/v1/notifications/mark-all-as-read",
        null,
        authHeaders(token)
      );
      await showPromise(req, {
        loading: "Marking all as read…",
        success: "All notifications marked as read",
        error: "Failed to mark all as read",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const markOneAsRead = async (id) => {
    const current = notifications.find((n) => n.id === id);
    if (!current || current.read_at || !token) return;

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, read_at: new Date().toISOString(), read_at_human: "now" }
          : n
      )
    );

    try {
      const req = api.post(
        `/api/v1/notifications/${id}/read`,
        null,
        authHeaders(token)
      );
      await showPromise(req, {
        loading: "Marking as read…",
        success: "Marked as read",
        error: "Failed to mark as read",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const previewItems = notifications.slice(0, 3);

  return (
    <li className="notification-bell">
      <Dropdown
        title={
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-bell"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="notification-bell__badge">{unreadCount}</span>
            )}
          </>
        }
      >
        <div className="notification-dropdown">
          <div className="notification-dropdown__header">
            <div>
              <strong>{unreadCount} new notification(s)</strong>
              <p className="notification-dropdown__subtitle">
                Recent activity
              </p>
            </div>
            <button
              type="button"
              className="notification-dropdown__mark-all"
              onClick={markAll}
              disabled={unreadCount === 0 || loading}
            >
              Mark all read
            </button>
          </div>
          <ul className="drops-menu notification-dropdown__list">
            {loading ? (
              <li className="notification-dropdown__empty">Loading…</li>
            ) : previewItems.length === 0 ? (
              <li className="notification-dropdown__empty">
                No notifications yet.
              </li>
            ) : (
              previewItems.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    className="notification-dropdown__item"
                    onClick={(e) => {
                      e.preventDefault();
                      markOneAsRead(n.id);
                    }}
                  >
                    <div className="notification-dropdown__item-body">
                      <span className="notification-dropdown__item-title">
                        {n.data?.action || n.message || "Notification"}
                      </span>
                      <span className="notification-dropdown__item-time">
                        {n.time_ago || n.created_at || "just now"}
                      </span>
                    </div>
                    {!n.read_at && (
                      <span className="notification-dropdown__item-dot" />
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className="notification-dropdown__footer">
            <Link to="/notifications">See all</Link>
          </div>
        </div>
      </Dropdown>
    </li>
  );
}
