import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./SavedeventSTyling.css";
import heart_icon from "../../../assets/navbar_icons/heart_icon.png";
import { useAuth } from "../../../pages/auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { api, authHeaders } from "../../../lib/apiClient";
import {
  showError,
  showPromise,
  showSuccess,
} from "../../../component/ui/toast";

/* ---------- Shimmer ---------- */
const ShimmerCard = () => (
  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mt-4">
    <div className="car shadow-s rounded h-100 blog-card border-0 position-relative shimmer-container">
      <div className="shimmer-heart shimmer-placeholder" />
      <div className="shimmer-image shimmer-placeholder" />
      <div className="save-event-detail d-flex justify-content-between align-items-center w-100 pt-3 pb-0 pr-2 pl-2">
        <div className="w-100">
          <div className="shimmer-line shimmer-title shimmer-placeholder" />
          <div className="d-flex align-items-center people-list mt-2">
            <div className="dropdown-list-image mr-2 position-relative">
              <div className="shimmer-avatar shimmer-placeholder" />
            </div>
            <div className="font-weight-bold mt-2 w-75">
              <div className="shimmer-line shimmer-author shimmer-placeholder" />
            </div>
          </div>
          <div className="shimmer-line shimmer-date shimmer-placeholder mt-2" />
        </div>
      </div>
    </div>
  </div>
);

/* ---------- Utilities ---------- */
const FALLBACK_IMG = "/images/event-dummy.jpg";
const FALLBACK_AVATAR = "https://placehold.co/50x50?text=No+Image";

function fmtDateTime(dateStr, timeStr) {
  if (!dateStr) return "Date not available";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime()))
    return timeStr ? `${dateStr} . ${timeStr}` : dateStr;

  const day = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  if (!timeStr) return day;

  // Expecting something like "02:17 PM"
  const [hm, maybePeriod] = timeStr.split(" ");
  let [h, m] = hm.split(":").map((x) => parseInt(x, 10));
  const isPM = (maybePeriod || "").toLowerCase().includes("pm");
  if (isPM && h < 12) h += 12;
  if (!isPM && h === 12) h = 0;
  const hh = String(h).padStart(2, "0");
  const mm = String(m ?? 0).padStart(2, "0");
  return `${day} . ${hh}:${mm}`;
}

export default function SaveEventTemplate() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]); // full list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // limit card count if you like; keep your grid performant
  const pageSize = 40;
  const visible = useMemo(() => events.slice(0, pageSize), [events, pageSize]);

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
      const mapped = list.map((ev) => ({
        id: ev.id,
        title: ev.title || "Untitled Event",
        image: ev?.poster?.[0]?.url || FALLBACK_IMG,
        hostImage: ev.hostImage || FALLBACK_AVATAR,
        hostName: ev.hostName || "Unknown Host",
        eventDate: ev.eventDate || "",
        startTime: ev.startTime || "",
      }));
      setEvents(mapped);
      if (!mapped.length) setError("You haven't saved any events yet.");
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

  function openEvent(id) {
    navigate(`/event/view/${id}`);
  }

  async function handleUnsaveEvent(eventId) {
    // optimistic remove
    const prev = events;
    setEvents((list) => list.filter((e) => e.id !== eventId));

    try {
      await showPromise(
        // Prefer toggle if that's the canonical route; if you truly have a dedicated /unsave, swap it here:
        api.post(`/api/v1/events/${eventId}/toggle`, {}, authHeaders(token)),
        {
          loading: "Removing…",
          success: "Event removed",
          error: "Failed to remove",
        }
      );
      // Refetch to stay authoritative (if anything changed server-side)
      fetchSavedEvents();
    } catch (e) {
      console.error(e);
      setEvents(prev); // rollback
      showError("Failed to unsave event. Please try again.");
    }
  }

  if (!loading && error) {
    return (
      <div className="text-center tw:py-24 tw:flex tw:justify-center tw:items-center tw:flex-col tw:gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="tw:size-56 tw:text-primary"
        >
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>

        <p>{error}</p>
        {error.includes("Authentication") && (
          <p>Please log in to view saved events.</p>
        )}
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <div className="row">
          {Array.from({ length: 8 }).map((_, i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className=" tw:text-2xl tw:md:text-3xl tw:font-bold tw:font-sans m-0">
              Saved events ({events.length})
            </span>
          </div>

          <div className="row tw:divide-purple-100 tw:divider-y">
            {visible.length ? (
              visible.map((post) => (
                <div
                  key={post.id}
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mt-4"
                >
                  <div className="car tw:shadow-sm rounded h-100 blog-card border-0 position-relative">
                    {/* Unsave button */}
                    <button
                      type="button"
                      className="heart-overlay-icon"
                      onClick={() => handleUnsaveEvent(post.id)}
                      title="Unsave event"
                      aria-label={`Unsave ${post.title}`}
                      style={{
                        cursor: "pointer",
                        background: "transparent",
                        border: 0,
                      }}
                    >
                      <img src={heart_icon} alt="Unsave" />
                    </button>

                    {/* Poster */}
                    <img
                      className="card-img-top poster_image"
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      onClick={() => openEvent(post.id)}
                      style={{ cursor: "pointer" }}
                      onError={(e) => {
                        if (!e.currentTarget.dataset.fallback) {
                          e.currentTarget.src = FALLBACK_IMG;
                          e.currentTarget.dataset.fallback = "1";
                        }
                      }}
                    />

                    <div className="save-event-detail d-flex justify-content-between align-items-center w-100 pt-3 pb-0 pr-2 pl-2">
                      <div className="w-100 tw:px-4">
                        <span className="tw:text-lg tw:font-semibold tw:text-black">
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => openEvent(post.id)}
                          >
                            {post.title.length > 20
                              ? post.title.slice(0, 20) + "…"
                              : post.title}
                          </span>
                        </span>

                        <Link
                          to={`/profile/${user?.id || ""}`}
                          className="d-flex align-items-center gap-2 mt-2 osahan-post-header people-list"
                        >
                          <div className="">
                            <img
                              className=""
                              style={{
                                borderRadius: "50%",
                                width: 30,
                                height: 30,
                                objectFit: "cover",
                              }}
                              src={post.hostImage}
                              alt={post.hostName}
                              onError={(e) => {
                                if (!e.currentTarget.dataset.fallback) {
                                  e.currentTarget.src = FALLBACK_AVATAR;
                                  e.currentTarget.dataset.fallback = "1";
                                }
                              }}
                            />
                          </div>
                          <div className="font-weight-bolder">
                            <p className="author_name mb-0">
                              {post.hostName.length > 25
                                ? post.hostName.slice(0, 25) + "…"
                                : post.hostName}
                            </p>
                          </div>
                        </Link>

                        <small className="text-dark d-block font-weight-light mt-3">
                          {fmtDateTime(post.eventDate, post.startTime)}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p>No saved events found.</p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
