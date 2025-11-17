// src/component/Events/SingleEvent.jsx
import React, { useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import "./eventSTyling.css";
import camera_icon from "../../../assets/navbar_icons/camera_icon.png";
import live_indicator from "../../../assets/navbar_icons/live_indicator.png";
import { Link } from "react-router-dom";
import usePaginatedEvents from "../../../hooks/usePaginatedEvents";
import { Ellipsis, Clock, MapPin, CalendarDays } from "lucide-react";
import Countdown from "react-countdown";
import EventActionsSheet from "../EventsActionSheet";

/* ---- Shimmer ---- */
export const EventShimmer = () => (
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
  return "/images/event-dummy.jpg";
}

function formatMetaLine(event) {
  const rawDate = getRawDate(event);
  const rawTime = getRawTime(event);

  if (!rawDate) return rawTime || "";

  const [year, month, day] = rawDate.split("-").map(Number);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  const shortDate = `${day}${suffix} ${months[month - 1]}, ${year}`;

  // Convert time to 12-hour format
  const [h, m] = rawTime.split(":");
  let hr = parseInt(h);
  const ampm = hr >= 12 ? "PM" : "AM";
  hr = ((hr + 11) % 12) + 1;

  return `${shortDate} - ${hr}:${m} ${ampm}`;
}

function priceText(event) {
  if (event?.price_display) return event.price_display;
  if (event?.currency?.symbol && event?.price) {
    return `${event.currency.symbol}${event.price}`;
  }
  if (event?.price) return event.price;
  return "Free";
}

function hostName(event) {
  return (
    event?.hostName ||
    event?.organizer_name ||
    event?.creator_name ||
    "Unknown host"
  );
}

function eventLocation(event) {
  if (event?.is_online) return "Online";
  return event?.location || "Venue TBA";
}

/** Extract clean raw date like 2025-11-25 */
function getRawDate(event) {
  const raw = event?.eventDate || event?.event_date;
  if (!raw) return null;

  // Example: "Tuesday, November 25, 2025"
  const parts = raw.split(",");
  if (parts.length < 3) return null;

  const monthDay = parts[1].trim(); // "November 25"
  const yearPart = parts[2].trim(); // "2025"

  // FIX: remove invisible Unicode characters
  const cleanYear = yearPart.replace(/[^\d]/g, "");

  const [monthName, day] = monthDay.split(" ");

  const monthIndex = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ].indexOf(monthName.toLowerCase());

  if (monthIndex === -1) return null;

  const mm = String(monthIndex + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");

  return `${cleanYear}-${mm}-${dd}`;
}

/** Convert "08:00 PM" → "20:00:00" */
function getRawTime(event) {
  const raw = event?.startTime || event?.start_time;
  if (!raw) return "00:00:00";

  const [time, ampm] = raw.split(" ");
  let [h, m] = time.split(":");

  h = parseInt(h);
  if (ampm.toUpperCase() === "PM" && h !== 12) h += 12;
  if (ampm.toUpperCase() === "AM" && h === 12) h = 0;

  return `${String(h).padStart(2, "0")}:${m}:00`;
}

/** Build accurate JS Date considering timezone */
function eventStartDate(event) {
  const date = getRawDate(event);
  const time = getRawTime(event);

  if (!date) return null;

  // Use backend timezone (important!)
  const zone = event?.timeZone?.name || "UTC";
  const iso = `${date}T${time}`;

  try {
    return new Date(new Date(iso).toLocaleString("en-US", { timeZone: zone }));
  } catch {
    return new Date(iso);
  }
}

/* ---- Countdown pill for upcoming events ---- */
function CountdownPill({ target }) {
  if (!target) return null;

  return (
    <div className="tw:absolute tw:bottom-4 tw:right-4 tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-1.5 tw:rounded-full tw:bg-black/70 tw:text-white tw:text-xs tw:font-medium tw:border tw:border-white/30 tw:backdrop-blur">
      <Clock className="tw:w-4 tw:h-4 tw:opacity-80" />

      <Countdown
        date={target.getTime()}
        daysInHours={false}
        renderer={({ days, hours, minutes, seconds }) => {
          return (
            <span>
              {String(days).padStart(2, "0")}D:
              {String(hours).padStart(2, "0")}H:
              {String(minutes).padStart(2, "0")}M:
              {String(seconds).padStart(2, "0")}S
            </span>
          );
        }}
      />
    </div>
  );
}

/* ---- Single Card (shared for all variants) ---- */
function EventCard({ event, variant = "default", onMore }) {
  const startDate = eventStartDate(event);

  const isLive = variant === "live";
  const isUpcoming = variant === "upcoming";

  const ticketLabel = `Buy Ticket (${priceText(event)})`;

  return (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4">
      <div className="tw:bg-white tw:rounded-xl tw:shadow-md tw:overflow-hidden tw:flex tw:flex-col tw:h-full blog-card border-0 tw:relative">
        {/* three dots */}
        <button
          type="button"
          onClick={onMore}
          className="tw:absolute tw:z-40 tw:right-3 tw:top-3 tw:size-9 tw:rounded-full tw:bg-black/35 tw:flex tw:items-center tw:justify-center tw:text-white tw:backdrop-blur"
        >
          <Ellipsis className="tw:w-4 tw:h-4" />
        </button>

        {/* Image & badges */}
        <Link to={`/event/view/${event.id}`} className="text-decoration-none">
          <div className="tw:relative tw:h-[210px] tw:w-full">
            <img
              className="tw:w-full tw:h-full tw:object-cover"
              src={firstImageFromPoster(event?.poster)}
              alt={event?.title || "Event"}
            />

            {/* LIVE badge */}
            {isLive && (
              <>
                <div className="tw:absolute tw:left-4 tw:top-4 tw:flex tw:items-center tw:gap-1.5 tw:bg-[#FF3B30] tw:px-3 tw:py-1.5 tw:rounded-full tw:text-xs tw:font-semibold tw:text-white tw:shadow-lg">
                  <span>Live</span>
                  <img
                    src={camera_icon}
                    alt="Live"
                    className="tw:w-4 tw:h-4 tw:object-contain"
                  />
                </div>

                {/* viewers pill */}
                <div className="tw:absolute tw:right-4 tw:bottom-4 tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-1.5 tw:rounded-full tw:bg-lightPurple tw:text-xs tw:font-medium tw:text-black tw:shadow-sm">
                  <span className="tw:inline-block tw:w-2 tw:h-2 tw:rounded-full tw:bg-[#22C55E]" />
                  <span>{event?.live_viewers_label || "38M viewers"}</span>
                </div>
              </>
            )}

            {/* UPCOMING badge + countdown */}
            {isUpcoming && (
              <>
                <div className="tw:absolute tw:left-4 tw:top-4 tw:flex tw:items-center tw:gap-1.5 tw:bg-[#FF9F0A] tw:px-3 tw:py-1.5 tw:rounded-full tw:text-xs tw:font-semibold tw:text-white tw:shadow-lg">
                  <span>Upcoming</span>
                  <img
                    src={camera_icon}
                    alt="Upcoming"
                    className="tw:w-4 tw:h-4 tw:object-contain"
                  />
                </div>

                <CountdownPill target={startDate} />
              </>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="tw:px-3 tw:pt-3 tw:flex tw:flex-col tw:gap-3 tw:flex-1">
          {/* Title + price */}
          <div className="tw:flex tw:items-start tw:justify-between tw:gap-2">
            <div className="tw:flex-1">
              <span className="tw:text-[16px] tw:font-semibold tw:text-black tw:leading-snug">
                {event?.title?.length > 40
                  ? event.title.slice(0, 40) + "…"
                  : event?.title}
              </span>
            </div>
            <div className="tw:text-right tw:ml-2">
              <span className="tw:text-xl tw:font-bold tw:text-black">
                {priceText(event)}
              </span>
            </div>
          </div>

          {/* Host row */}
          <div className="tw:flex tw:items-center tw:gap-3 tw:-mt-3">
            <div className="tw:px-3 tw:py-1.5 tw:bg-lightPurple tw:rounded-lg tw:text-xs tw:font-medium tw:text-black tw:flex tw:items-center tw:gap-2">
              <span className="tw:inline-block tw:w-8 tw:h-8 tw:rounded-full tw:bg-zinc-300 tw:overflow-hidden tw:-ml-1">
                <img
                  src={event.hostImage ?? "/images/avater_pix.avif"}
                  alt={hostName(event)}
                  className="tw:w-full tw:h-full tw:object-cover"
                />
              </span>
              <span>{hostName(event)}</span>
            </div>
          </div>

          {/* Location + date/time pill */}
          <div className="tw:mt-1 tw:bg-zinc-50 tw:rounded-lg tw:px-4 tw:py-3 tw:flex tw:items-center tw:gap-4 tw:text-xs tw:text-zinc-600">
            <div className="tw:flex tw:items-center tw:gap-2">
              <MapPin className="tw:w-4 tw:h-4" />
              <span>{eventLocation(event)}</span>
            </div>
            <div className="tw:w-px tw:h-6 tw:bg-zinc-200" />
            <div className="tw:flex tw:items-center tw:gap-2">
              <CalendarDays className="tw:w-4 tw:h-4" />
              <span>{formatMetaLine(event)}</span>
            </div>
          </div>

          {/* CTA */}
          <Link
            to={`/event/view/${event.id}`}
            className="tw:mt-2 tw:w-full tw:inline-block"
          >
            <button
              type="button"
              style={{ borderRadius: 8 }}
              className="tw:w-full tw:rounded-2xl tw:bg-primary tw:text-white tw:py-3 tw:text-sm tw:font-semibold tw:shadow-md tw:hover:bg-primarySecond tw:transition-colors tw:duration-150"
            >
              {ticketLabel}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---- MAIN TEMPLATE: list + pagination ---- */
export default function EventTemplate({
  endpoint = "/api/v1/events",
  live = false,
  upcoming = false,
}) {
  const {
    items: serverEvents,
    meta,
    loading,
    loadingMore,
    loadNext,
  } = usePaginatedEvents(endpoint);

  const [visibleEvents, setVisibleEvents] = useState([]);
  const [cacheLoaded, setCacheLoaded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const cacheKey = React.useMemo(
    () => `zagasm_events_cache_${endpoint}`,
    [endpoint]
  );

  /* ---- 1. Load CACHE instantly on mount ---- */
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed.events)) {
        setVisibleEvents(parsed.events);
      }
    } catch (err) {
      console.error("CACHE READ ERROR", err);
    }

    setCacheLoaded(true);
  }, [cacheKey]);

  /* ---- 2. When API loads, override cache ---- */
  React.useEffect(() => {
    if (!serverEvents || serverEvents.length === 0) return;

    setVisibleEvents(serverEvents);

    // update cache
    try {
      const payload = { events: serverEvents, meta };
      localStorage.setItem(cacheKey, JSON.stringify(payload));
    } catch (err) {
      console.error("CACHE WRITE ERROR", err);
    }
  }, [serverEvents, meta, cacheKey]);

  /* ---- 3. Infinite scroll trigger ---- */
  const { ref: loadMoreRef, inView } = useInView({ rootMargin: "300px" });

  React.useEffect(() => {
    if (inView) loadNext();
  }, [inView, loadNext]);

  const isDone = useMemo(() => meta?.current_page >= meta?.last_page, [meta]);

  const variant = live ? "live" : upcoming ? "upcoming" : "default";

  /* ---- 4. SHOW SHIMMER WHEN: cache not loaded + loading ---- */
  const showShimmer = !cacheLoaded && loading;

  return (
    <>
      {/* SHIMMER */}
      {showShimmer && (
        <div className="row tw:mx-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <EventShimmer key={i} />
          ))}
        </div>
      )}

      {/* EVENTS */}
      {!showShimmer && (
        <div className="row tw:mx-0">
          {visibleEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              variant={variant}
              onMore={() => setSelectedEvent(event)}
            />
          ))}
        </div>
      )}

      {/* LOADING MORE */}
      {loadingMore && (
        <div className="row">
          {Array.from({ length: 4 }).map((_, i) => (
            <EventShimmer key={i} />
          ))}
        </div>
      )}

      {/* LOAD MORE TRIGGER */}
      {!isDone && (
        <div
          ref={loadMoreRef}
          className="tw:h-10 tw:w-full tw:flex tw:items-center tw:justify-center"
        />
      )}

      {/* EMPTY STATE */}
      {cacheLoaded && !loading && visibleEvents.length === 0 && (
        <div className="text-center mt-3">
          <span>No events available</span>
        </div>
      )}

      {/* END MESSAGE */}
      {!loading && isDone && visibleEvents.length > 0 && (
        <div className="text-center mt-3 mb-4 text-muted">
          You’ve reached the end of all events
        </div>
      )}

      <EventActionsSheet
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        onEventReported={(id) =>
          setVisibleEvents((prev) => prev.filter((ev) => ev.id !== id))
        }
      />
    </>
  );
}
