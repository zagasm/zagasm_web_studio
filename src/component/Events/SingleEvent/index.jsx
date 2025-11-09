import React, { useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import "./eventSTyling.css";
import threeDot from "../../../assets/navbar_icons/threeDot.png";
import camera_icon from "../../../assets/navbar_icons/camera_icon.png";
import live_indicator from "../../../assets/navbar_icons/live_indicator.png";
import { Link } from "react-router-dom";
import usePaginatedEvents from "../../../hooks/usePaginatedEvents";
import { Ellipsis, EllipsisVertical } from "lucide-react";
import EventActionsSheet from "../EventsActionSheet";

/* ---- Shimmer ---- */
const EventShimmer = () => (
  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4">
    <div className="shadow-s rounded h-100 blog-card border-0 position-relative">
      <div className="shimmer-container">
        <div className="shimmer-image"></div>
        <div className="shimmer-content">
          <div className="shimmer-line shimmer-title"></div>
          <div className="shimmer-line shimmer-subtitle"></div>
          <div className="shimmer-line shimmer-price"></div>
        </div>
      </div>
    </div>
  </div>
);

/* ---- Helpers ---- */
function firstImageFromPoster(poster = []) {
  const img = poster.find((p) => p?.type === "image" && p?.url);
  if (img) return img.url;
  // If there’s a video only, let’s still show a neutral fallback
  return "/images/event-dummy.jpg";
}

function formatMetaLine(event) {
  // Prefer server ‘eventDate’ if present; otherwise try to compose
  const datePart = event?.eventDate || "";
  const timePart = event?.startTime ? `${event.startTime}` : "";
  const pieces = [datePart, timePart].filter(Boolean);
  return pieces.join(" • ");
}

function priceText(event) {
  if (event?.price_display) return event.price_display;
  if (event?.currency?.symbol && event?.price) {
    return `${event.currency.symbol}${event.price}`;
  }
  if (event?.price) return event.price;
  return "$0.00";
}

export default function EventTemplate({
  endpoint = "/api/v1/events",
  live = false,
}) {
  const {
    items: events,
    meta,
    loading,
    loadingMore,
    loadNext,
  } = usePaginatedEvents(endpoint);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // intersection observer sentinel
  const { ref: loadMoreRef, inView } = useInView({ rootMargin: "300px" });

  React.useEffect(() => {
    if (inView) loadNext();
  }, [inView, loadNext]);

  const isDone = useMemo(() => meta.current_page >= meta.last_page, [meta]);

  return (
    <>
      <div style={{
        margin: '0 0'
      }} className="row tw:mx-0">
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <EventShimmer key={`s-${i}`} />
          ))}

        {!loading &&
          events.map((event) => (
            <div
              key={event.id}
              className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
            >
              <div className="shadow-s rounded h-100 blog-card border-0 tw:relative tw:shadow-md tw:rounded-xl">
                <div
                  className="tw:size-10 tw:rounded-full tw:bg-black/30 tw:grid tw:place-items-center tw:absolute tw:z-40 tw:right-3 tw:top-3"
                  onClick={() => setSelectedEvent(event)}
                >
                  <Ellipsis className="text-white" />
                </div>

                {live && (
                  <div className="">
                    <div className="camera-overlay-icon tw:flex tw:items-center tw:gap-1">
                      Live <img src={camera_icon} alt="Live" />
                    </div>
                    <div className="viewers-overlay-icon">
                      <img
                        className="viewers_indicator"
                        src={live_indicator}
                        alt="indicator"
                      />
                      38M Viewers
                    </div>
                  </div>
                )}

                <Link
                  to={`/event/view/${event.id}`}
                  className="text-decoration-none text-dark"
                >
                  <div style={{ position: "relative", height: 200 }}>
                    <img
                      className="card-img-top"
                      src={firstImageFromPoster(event?.poster)}
                      alt={event?.title || "Event"}
                      style={{ height: 200, width: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center w-100 pt-2 pb-0 tw:px-4">
                    <div className="eventName" style={{ width: "65%" }}>
                      <h6
                        className="pt-2 event_title tw:first-letter:uppercase"
                        style={{ lineHeight: "15px" }}
                      >
                        <b>
                          {event?.title?.length > 28
                            ? event.title.slice(0, 28) + "…"
                            : event?.title}
                        </b>
                      </h6>
                      <small className="event_time text-muted text-truncate">
                        {formatMetaLine(event)}
                      </small>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className="tw:text-lg tw:font-bold tw:md:text-sm">{priceText(event)}</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
      </div>

      {/* loader for next page */}
      {loadingMore && (
        <div className="row">
          {Array.from({ length: 4 }).map((_, i) => (
            <EventShimmer key={`more-${i}`} />
          ))}
        </div>
      )}

      {/* sentinel for infinite scroll */}
      {!isDone && !loading && (
        <div
          ref={loadMoreRef}
          className="tw:h-10 tw:w-full tw:flex tw:items-center tw:justify-center"
        />
      )}

      {/* end state */}
      {!loading && events.length === 0 && (
        <div className="text-center mt-3">
          <span>No events available</span>
        </div>
      )}
      {!loading && isDone && events.length > 0 && (
        <div className="text-center mt-3 mb-4 text-muted">
          You’ve reached the end of all events
        </div>
      )}

      {/* Action Modal */}
      <EventActionsSheet
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />
    </>
  );
}
