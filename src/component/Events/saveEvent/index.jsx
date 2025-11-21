import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./SavedeventSTyling.css";
import { useAuth } from "../../../pages/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { api, authHeaders } from "../../../lib/apiClient";
import {
  showError,
  showPromise,
  showSuccess,
} from "../../../component/ui/toast";
import SavedEventCard from "./SaveEventCard";

const FALLBACK_IMG = "/images/event-dummy.jpg";

const TABS = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "live", label: "Live" },
  { key: "ended", label: "Ended" },
];

/* ---------- Shimmer ---------- */
const ShimmerCard = () => (
  <div className="col-12 col-md-4 col-lg-3 mb-4">
    <div className="tw:bg-white tw:rounded-3xl tw:p-3 tw:h-full tw:shadow-[0_12px_30px_rgba(15,23,42,0.10)] shimmer-container">
      <div className="tw:rounded-[20px] tw:mb-3 shimmer-image shimmer-placeholder" />
      <div className="shimmer-line shimmer-title shimmer-placeholder" />
      <div className="shimmer-line shimmer-author shimmer-placeholder tw:mt-3" />
      <div className="shimmer-line shimmer-date shimmer-placeholder tw:mt-3" />
      <div className="shimmer-line shimmer-cta shimmer-placeholder tw:mt-4" />
    </div>
  </div>
);

/* ---------- Helpers ---------- */
function resolveCurrencySymbol(ev) {
  if (Array.isArray(ev.suggested_currencies)) {
    const ngn = ev.suggested_currencies.find((c) => c.code === "NGN");
    if (ngn?.symbol) return ngn.symbol;
    const first = ev.suggested_currencies[0];
    if (first?.symbol) return first.symbol;
  }
  // fallback
  return "₦";
}

function buildEventModel(ev) {
  const symbol = resolveCurrencySymbol(ev);
  const rawPrice = ev.price || "";
  // keep formatting from backend, just strip .00
  const cleanedPrice = rawPrice.endsWith(".00")
    ? rawPrice.slice(0, -3)
    : rawPrice;

  return {
    id: ev.id,
    title: ev.title || "Untitled Event",
    description: ev.description || "",
    status: ev.status || "upcoming",
    image: ev?.poster?.[0]?.url || FALLBACK_IMG,
    hostImage: ev.hostImage,
    hostName: ev.hostName || "Unknown Host",
    hasPaid: !!ev.hasPaid,
    isSaved: !!ev.is_saved,
    liveViewers: ev.live_sessions_count ?? null,
    eventDate: ev.eventDate || "",
    startTime: ev.startTime || "",
    priceLabel: `${symbol}${cleanedPrice || "0"}`,
    streamUrl: ev.streamUrl || null,
  };
}

export default function SaveEventTemplate() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchSavedEvents = useCallback(async () => {
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get(
        "/api/v1/events/saved/list",
        authHeaders(token)
      );

      const list = Array.isArray(data?.data) ? data.data : [];
      const mapped = list.map(buildEventModel);
      setEvents(mapped);

      if (!mapped.length) {
        setError("You haven't saved any events yet.");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load saved events. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSavedEvents();
  }, [fetchSavedEvents]);

  const counts = useMemo(() => {
    const upcoming = events.filter(
      (e) => (e.status || "").toLowerCase() === "upcoming"
    ).length;
    const live = events.filter(
      (e) => (e.status || "").toLowerCase() === "live"
    ).length;
    const ended = events.filter((e) =>
      ["ended", "completed", "past"].includes((e.status || "").toLowerCase())
    ).length;

    return {
      all: events.length,
      upcoming,
      live,
      ended,
    };
  }, [events]);

  const filteredEvents = useMemo(() => {
    const key = activeTab;
    if (key === "upcoming") {
      return events.filter(
        (e) => (e.status || "").toLowerCase() === "upcoming"
      );
    }
    if (key === "live") {
      return events.filter((e) => (e.status || "").toLowerCase() === "live");
    }
    if (key === "ended") {
      return events.filter((e) =>
        ["ended", "completed", "past"].includes((e.status || "").toLowerCase())
      );
    }
    return events;
  }, [events, activeTab]);

  function handleOpenDetails(id) {
    navigate(`/event/view/${id}`);
  }

  async function handleToggleSave(eventId) {
    const previous = events;
    setEvents((list) => list.filter((ev) => ev.id !== eventId));

    try {
      await showPromise(
        api.post(`/api/v1/events/${eventId}/toggle`, {}, authHeaders(token)),
        {
          loading: "Updating…",
          success: "Event removed from saved",
          error: "Failed to update saved event",
        }
      );
    } catch (e) {
      console.error(e);
      setEvents(previous); // rollback
      showError("Failed to unsave event. Please try again.");
    }
  }

  function handlePrimaryAction(ev) {
    const status = (ev.status || "").toLowerCase();

    if (status === "live" && ev.streamUrl) {
      // TODO: adjust this route to your live player route
      window.open(ev.streamUrl, "_blank", "noopener,noreferrer");
      return;
    }

    // For upcoming / ended / fallback, go to event details.
    navigate(`/event/view/${ev.id}`);
  }

  if (!loading && error && !events.length) {
    return (
      <div className="tw:py-24 tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-4 tw:text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="tw:w-24 tw:h-24 tw:text-primary"
        >
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>

        <p className="tw:text-base tw:text-gray-700 tw:max-w-md">{error}</p>
        {error.includes("Authentication") && (
          <p className="tw:text-sm tw:text-gray-500">
            Please log in to view saved events.
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="tw:flex tw:flex-col tw:md:flex-row tw:items-start tw:md:items-center tw:justify-between tw:gap-3 tw:mb-5 tw:pt-20 tw:md:pt-0">
        <h1 className="tw:text-2xl tw:md:text-3xl tw:font-bold tw:font-sans tw:text-gray-900 m-0">
          Saved events ({events.length})
        </h1>
      </div>

      {/* Tabs */}
      <div className="tw:w-full tw:mb-6 tw:overflow-x-auto">
        <div className="tw:inline-flex tw:bg-white tw:rounded-lg tw:p-1 tw:gap-1">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            const count = counts[tab.key] ?? 0;

            return (
              <button
                style={{
                  borderRadius: 8,
                }}
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "tw:px-4 tw:py-2 tw:rounded-full tw:text-sm tw:font-medium tw:whitespace-nowrap tw:transition tw:duration-150",
                  active
                    ? "tw:bg-lightPurple tw:text-gray-900 tw:shadow-sm"
                    : "tw:text-gray-500 hover:tw:text-gray-900",
                ].join(" ")}
              >
                {tab.label}
                
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="row">
          {Array.from({ length: 12 }).map((_, i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      ) : filteredEvents.length ? (
        <div className="row">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="col-12 col-md-4 col-lg-3 mb-4">
              <SavedEventCard
                event={ev}
                onToggleSave={handleToggleSave}
                onPrimaryAction={handlePrimaryAction}
                onOpenDetails={handleOpenDetails}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="tw:py-16 tw:text-center tw:text-gray-500">
          No {activeTab === "all" ? "" : activeTab} saved events yet.
        </div>
      )}
    </>
  );
}
