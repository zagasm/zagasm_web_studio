import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SideBarNav from "../../pageAssets/SideBarNav";
import SEO from "../../../component/SEO";
import { Helmet } from "react-helmet-async";
import { api, authHeaders } from "../../../lib/apiClient";
import { ToastHost, showSuccess, showError } from "../../../component/ui/toast";

import GuestPerformers from "../../../component/Events/GuestPerformers";
import Remarks from "../../../component/Events/Remarks";
import YouMayAlsoLike from "../../../component/Events/YouMayAlsoLike";
import MobileStickyBar from "../../../component/Events/MobileStickyBar";
import ReportModal from "../../../component/Events/ReportModal";
import AccessTypeModal from "../../../component/Events/AccessTypeModal";
import LiveAppDownloadModal from "../../../component/Events/LiveAppDownloadModal";

import { formatEventDateTime, randomAvatar } from "../../../utils/ui";
import { useAuth } from "../../auth/AuthContext";
import {
  CountdownPill,
  eventStartDate,
  formatMetaLine,
  priceText,
} from "../../../component/Events/SingleEvent";
import {
  CalendarDays,
  Share2,
  Flag,
  Star,
  Users,
  Share,
  ArrowLeft,
  Ticket,
  MapPin,
  Bookmark,
} from "lucide-react";
import EventShareModal from "../../../component/Events/EvenetShareModal";
import TicketPromptModal from "../../../component/Events/TicketPromptModal";
import HlsVideoPlayer from "../../../component/HlsVideoPlayer";
function isUuid(value = "") {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value)
  );
}
/* ---------- Page ---------- */
export default function ViewEvent() {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);

  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [modalAutoTrigger, setModalAutoTrigger] = useState(true);
  const [initiatingPayment, setInitiatingPayment] = useState(false);

  const navigate = useNavigate();
  const { token } = useAuth();

  // local UI mirrors API
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // report modal
  const [reportOpen, setReportOpen] = useState(false);

  // access-type modal
  const [accessModalOpen, setAccessModalOpen] = useState(false);

  function initialsFromName(name = "") {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase() || "?";
  }

  const hostName = event?.hostName || "Organizer";
  const hostInitials = initialsFromName(hostName);
  const hostHasImage = !!event?.hostImage;

  useEffect(() => {
    if (!eventId) return;

    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        setModalAutoTrigger(true);
        setPurchaseModalOpen(false);

        const isId = isUuid(eventId);

        const res = isId
          ? await api.get(`/api/v1/events/${eventId}/view`, authHeaders(token))
          : await api.get(
              `/api/v1/event/recommended/${eventId}`,
              authHeaders(token)
            );

        if (!mounted) return;

        // Handle BOTH response shapes safely
        const data = res?.data?.data || res?.data || {};

        // ID endpoint shape (what you already use):
        // data.currentEvent, data.recommendations
        const ev =
          data?.currentEvent ||
          data?.event || // slug endpoint likely
          data?.data?.event || // extra fallback
          null;

        const recommendations =
          data?.recommendations ||
          data?.recommended.data ||
          data?.recs ||
          data?.data?.recommendations ||
          [];

        setEvent(ev);
        setRecs(recommendations);

        setIsSaved(!!ev?.is_saved);
        setIsFollowing(!!(ev?.is_following_organizer || ev?.is_following));
      } catch (e) {
        setError(
          e?.response?.data?.message || e?.message || "Failed to fetch event"
        );
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [eventId, token]);

  useEffect(() => {
    if (!event || !modalAutoTrigger) return;

    const priceValue = Number(event?.price ?? 0);
    const hasPrice = priceValue > 0 || Boolean(event?.price_display);

    if (!event?.hasPaid && hasPrice) {
      setPurchaseModalOpen(true);
    }
  }, [event, modalAutoTrigger]);

  const closePurchaseModal = () => {
    setPurchaseModalOpen(false);
    setModalAutoTrigger(false);
  };

  const priceDisplay =
    event?.price_display ||
    `${event?.currency?.symbol || "₦"}${event?.price || "0"}`;

  const posterUrl = useMemo(() => event?.poster?.[0]?.url, [event]);

  const handleGetTicket = async (accessType = "main") => {
    if (event?.is_sold_out) return;

    if (!token) {
      showError("Please log in to purchase a ticket.");
      navigate("/login");
      return;
    }

    try {
      setInitiatingPayment(true);
      const res = await api.post(
        `/api/v1/payments/${event.id}/initiate`,
        { access_type: accessType },
        authHeaders(token)
      );

      const payload = res?.data || {};

      if (payload.status === false && payload.message) {
        // Already paid scenario, or backend-specific error
        showError(payload.message);
        return;
      }

      if (payload.url) {
        showSuccess(`Preparing ticket for “${event?.title || "Event"}”…`);
        window.location.href = payload.url;
      } else {
        showError("Payment initiation failed: no redirect URL received.");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to initiate payment.";
      showError(errorMessage);
      console.error("Payment initiation error:", error);
    } finally {
      setInitiatingPayment(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!event?.hostId) return;

    if (!token) {
      showError("Please log in to follow organizers.");
      navigate("/login");
      return;
    }

    try {
      setFollowLoading(true);

      // Using the endpoint pattern: /api/v1/follow/{organizerId}
      const res = await api.post(
        `/api/v1/follow/${event.hostId}`,
        null,
        authHeaders(token)
      );

      // Try different response shapes, fallback to toggling locally
      const isNowFollowing =
        res?.data?.data?.is_following ??
        res?.data?.is_following ??
        !isFollowing;

      setIsFollowing(isNowFollowing);

      if (isNowFollowing) {
        showSuccess("You’re now following this organizer.");
      } else {
        showSuccess("You’ve unfollowed this organizer.");
      }
    } catch (e) {
      console.error(e);
      showError("Unable to update follow status. Please try again.");
    } finally {
      setFollowLoading(false);
    }
  };

  const isLiveNow = event?.status === "live";
  const isSoldOut = !!event?.is_sold_out;
  const hasPaid = !!event?.hasPaid;

  // When user has paid and event is live -> "Enter Live Room"
  // When user has paid and event not live yet -> "Ticket Purchased"
  // Else fall back to normal states
  let primaryCtaLabel;
  if (hasPaid && isLiveNow) {
    primaryCtaLabel = "Join Live Event";
  } else if (hasPaid && !isLiveNow) {
    primaryCtaLabel = "Ticket Purchased";
  } else if (isSoldOut) {
    primaryCtaLabel = "Sold Out";
  } else if (isLiveNow) {
    primaryCtaLabel = "Buy Ticket";
  } else {
    primaryCtaLabel = "Buy Ticket";
  }

  // Disable CTA when:
  // - Sold out and user hasn't paid
  // - User has paid but event is not live yet
  const ctaDisabled = (!hasPaid && isSoldOut) || (hasPaid && !isLiveNow);

  const handleEnterLive = () => {
    // When event is live and user has paid, show the app download modal
    if (hasPaid && isLiveNow) {
      setDownloadModalOpen(true);
      return;
    }
  };

  if (loading) {
    return (
      <div className="tw:w-full tw:h-[60vh] tw:flex tw:items-center tw:justify-center tw:bg-[#F5F5F7]">
        <div className="tw:flex tw:flex-col tw:items-center tw:gap-3">
          <div className="tw:h-8 tw:w-8 tw:border-2 tw:border-primary/30 tw:border-t-primary tw:rounded-full tw:animate-spin" />
          <p className="tw:text-sm tw:text-gray-600">Loading event details…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw:w-full tw:h-[60vh] tw:flex tw:items-center tw:justify-center tw:bg-[#FEF2F2]">
        <p className="tw:text-sm tw:text-red-600 tw:px-4 tw:text-center">
          {error}
        </p>
      </div>
    );
  }

  if (!event) return null;

  const remarks = Array.isArray(event.remarks) ? event.remarks : [];

  const formattedDateTime = formatEventDateTime(
    event.eventDate,
    event.startTime
  );

  const startDate = eventStartDate(event);
  const ticketLabel = `Buy Ticket (${priceText(event)})`;

  const formattedLocation =
    event.location ||
    event.address ||
    (event.eventType?.toLowerCase() === "virtual"
      ? "Online event"
      : "Location to be announced");

  console.log({ event });

  return (
    <>
      <ToastHost />

      <SEO
        title={
          event?.title ? `${event.title} - Event Details` : "Event Details"
        }
        description={
          event?.description
            ? event.description.slice(0, 155)
            : "Discover event details, get tickets, and connect with attendees at Zagasm Studios. Join the experience!"
        }
        keywords={`zagasm studios, ${event?.title || "event"}, ${
          event?.eventType || "event"
        }, event tickets, ${
          event?.hostName || "event organizer"
        }, live events, entertainment`}
        image={posterUrl}
        type="article"
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: event.title,
            description: event.description,
            image: posterUrl,
            startDate: `${event.eventDate} ${event.startTime}`,
            endDate: event.endDate
              ? `${event.endDate} ${event.endTime}`
              : undefined,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              event.eventType?.toLowerCase() === "virtual"
                ? "https://schema.org/OnlineEventAttendanceMode"
                : "https://schema.org/OfflineEventAttendanceMode",
            location:
              event.eventType?.toLowerCase() === "virtual"
                ? { "@type": "VirtualLocation", url: event.streamUrl || "" }
                : {
                    "@type": "Place",
                    name: event.location || "Event Location",
                    address: event.address || "",
                  },
            offers: {
              "@type": "Offer",
              price: event.price || 0,
              priceCurrency: event.currency?.code || "NGN",
              availability: "https://schema.org/InStock",
              url: typeof window !== "undefined" ? window.location.href : "",
            },
            organizer: {
              "@type": "Organization",
              name: event.hostName || "Zagasm Studios",
            },
            performer: {
              "@type": "PerformingGroup",
              name: event.hostName || "Event Host",
            },
          })}
        </script>
      </Helmet>

      {/* PAGE BG */}
      <div className="tw:font-sans tw:w-full tw:min-h-screen tw:bg-[#F5F5F7] tw:pt-20 tw:pb-10 tw:text-black">
        <div className="tw:max-w-6xl tw:mx-auto tw:px-2 tw:md:px-6 tw:lg:px-8">
          {/* TOP BAR */}
          <div className="tw:flex tw:items-center tw:justify-between tw:gap-3 tw:mb-5 tw:mt-10">
            <button
              style={{
                borderRadius: "50%",
              }}
              type="button"
              onClick={() => navigate(-1)}
              className="tw:inline-flex tw:items-center tw:justify-center tw:size-10 tw:rounded-full tw:bg-white tw:border tw:border-gray-200 tw:hover:bg-gray-50"
            >
              <ArrowLeft className="tw:w-4 tw:h-4" />
            </button>

            <div className="tw:flex tw:flex-col tw:items-center tw:flex-1 tw:min-w-0">
              <span className="tw:text-lg tw:md:text-xl tw:font-semibold tw:text-gray-900 tw:text-center tw:truncate tw:uppercase">
                {event.title}
              </span>
              <div className="tw:mt-1 tw:inline-flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-2">
                <span className="tw:bg-[#E5E7EB] tw:text-[10px] tw:px-2.5 tw:py-1 tw:inline-flex tw:items-center tw:gap-1 tw:rounded-full tw:text-gray-700">
                  <Ticket className="tw:w-3 tw:h-3" />
                  <span>{event.eventType}</span>
                </span>
                {event.genre && (
                  <span className="tw:bg-[#EEF2FF] tw:text-[10px] tw:px-2.5 tw:py-1 tw:inline-flex tw:items-center tw:gap-1 tw:rounded-full tw:text-[#4F46E5]">
                    {event.genre}
                  </span>
                )}
                {isLiveNow && (
                  <span className="tw:inline-flex tw:items-center tw:gap-1 tw:px-2.5 tw:py-1 tw:rounded-full tw:bg-red-500/10 tw:text-[10px] tw:text-red-600">
                    <span className="tw:inline-block tw:size-2 tw:rounded-full tw:bg-red-500 tw:animate-pulse" />
                    Live now
                  </span>
                )}
              </div>
            </div>

            <div className="tw:flex tw:items-center tw:gap-2">
              <button
              style={{
                borderRadius: "50%"
              }}
                type="button"
                onClick={() => setShareOpen(true)}
                className="tw:inline-flex tw:items-center tw:justify-center tw:size-10 tw:rounded-full tw:bg-white tw:border tw:border-gray-200 tw:hover:bg-gray-50"
                aria-label="Share event"
              >
                <Share2 className="tw:size-5 tw:text-gray-800" />
              </button>
            </div>
          </div>

          {/* MAIN CARD */}
          <div className="tw:bg-white tw:border tw:border-gray-100 tw:rounded-3xl tw:overflow-hidden tw:shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            {/* HERO POSTER */}
            <div className="tw:relative tw:h-[230px] tw:md:h-[430px] tw:w-full tw:overflow-hidden">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={event.title}
                  className="tw:w-full tw:h-full tw:object-cover"
                />
              ) : (
                <div className="tw:w-full tw:h-full tw:bg-linear-to-br tw:from-[#E5E7EB] tw:to-[#E0ECFF]" />
              )}

              {/* Soft linear overlay bottom */}
              <div className="tw:absolute tw:inset-x-0 tw:bottom-0 tw:h-28 tw:bg-linear-to-t tw:from-black/60 tw:via-black/20 tw:to-transparent" />

              {/* Live / Upcoming / Sold out badge */}
              <div className="tw:absolute tw:top-4 tw:right-4 tw:flex tw:flex-col tw:items-end tw:gap-2">
                <div className="tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:bg-black/70 tw:text-white tw:text-[11px] tw:rounded-full tw:backdrop-blur-sm">
                  <span
                    className={`tw:inline-block tw:size-2 tw:rounded-full ${
                      isLiveNow ? "tw:bg-red-500" : "tw:bg-amber-400"
                    } tw:animate-pulse`}
                  />
                  <span>{isLiveNow ? "Live" : event.status || "Upcoming"}</span>
                </div>
                {isSoldOut && !hasPaid && (
                  <div className="tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1.5 tw:bg-red-600 tw:text-white tw:text-[11px] tw:rounded-full">
                    Sold Out
                  </div>
                )}
              </div>

              {/* Meta strip at bottom of poster */}
              <div className="tw:absolute tw:bottom-4 tw:left-4 tw:right-4">
                <div className="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:px-3.5 tw:py-3 tw:bg-black/70 tw:rounded-2xl tw:text-xs tw:text-gray-100 tw:backdrop-blur-sm">
                  <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
                    <div className="tw:inline-flex tw:items-center tw:gap-1.5">
                      <CalendarDays className="tw:w-4 tw:h-4" />
                      <span>{formatMetaLine(event)}</span>
                    </div>
                    <div className="tw:inline-flex tw:items-center tw:gap-1.5">
                      <MapPin className="tw:w-4 tw:h-4" />
                      <span className="tw:max-w-[220px] tw:truncate">
                        {formattedLocation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SUMMARY STRIP */}
            <div className="tw:px-4 tw:md:px-8 tw:py-4 tw:border-b tw:border-gray-100 tw:bg-[#F9FAFB]">
              <div className="tw:flex tw:flex-col tw:md:flex-row tw:md:items-center tw:justify-between tw:gap-4">
                {/* Left: Organizer + countdown */}
                <div className="tw:flex tw:flex-1 tw:flex-col tw:gap-3">
                  <div className="tw:flex tw:items-center tw:gap-3">
                    <div className="tw:h-12 tw:w-12 tw:rounded-full tw:bg-lightPurple tw:flex tw:items-center tw:justify-center tw:overflow-hidden">
                      {hostHasImage ? (
                        <img
                          src={event.hostImage}
                          alt={hostName}
                          className="tw:w-full tw:h-full tw:object-cover"
                        />
                      ) : (
                        <span className="tw:text-[13px] tw:font-semibold tw:text-primary">
                          {hostInitials}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="tw:text-[11px] tw:text-gray-500">
                        Hosted by
                      </div>
                      <div className="tw:flex tw:items-center tw:text-sm tw:md:text-base tw:font-semibold tw:text-gray-900">
                        <span>{event.hostName || "Event Organizer"}</span>
                        {event.hostHasActiveSubscription && (
                          <img
                            className="tw:inline-block tw:size-4"
                            src="/images/verifiedIcon.svg"
                            alt="Verified"
                          />
                        )}
                      </div>
                      <div className="tw:text-[11px] tw:text-gray-400 tw:mt-0.5">
                        {event.organizer_since
                          ? `Active since ${event.organizer_since}`
                          : "Trusted host"}
                      </div>
                    </div>
                  </div>

                  <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3 tw:text-xs tw:text-zinc-600">
                    <div className="tw:flex tw:items-center tw:gap-2">
                      <CountdownPill target={startDate} />
                    </div>
                  </div>
                </div>

                {/* Right: Price + CTA */}
                <div className="tw:flex tw:flex-col tw:items-stretch tw:md:items-end tw:gap-2 tw:w-full tw:max-w-xs">
                  {hasPaid && (
                    <div className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-emerald-50 tw:px-3 tw:py-1.5 tw:text-[11px] tw:text-emerald-700">
                      <span className="tw:inline-block tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-emerald-500" />
                      <span>You already paid for this event</span>
                    </div>
                  )}

                  <div className="tw:flex tw:items-baseline tw:gap-2">
                    <span className="tw:text-[11px] tw:text-gray-500">
                      Ticket price
                    </span>
                    <span className="tw:text-2xl tw:font-semibold tw:text-gray-900">
                      {priceDisplay}
                    </span>
                  </div>

                  <button
                    style={{
                      borderRadius: "12px",
                    }}
                    type="button"
                    disabled={ctaDisabled}
                    onClick={() => {
                      if (ctaDisabled) return;

                      if (hasPaid && isLiveNow) {
                        // user has paid and event is live -> enter live
                        handleEnterLive();
                        return;
                      }

                      // normal purchase flow
                      if (
                        isLiveNow &&
                        !event.hasBackstage &&
                        !event.combined_price
                      ) {
                        handleGetTicket("main");
                      } else {
                        setAccessModalOpen(true);
                      }
                    }}
                    className={`tw:h-11 tw:px-6 tw:min-w-[170px] tw:flex tw:items-center tw:justify-center tw:text-sm tw:font-semibold tw:transition tw:duration-200 tw:rounded-full ${
                      ctaDisabled
                        ? "tw:bg-gray-200 tw:text-gray-500 tw:cursor-not-allowed"
                        : "tw:bg-primary tw:tw:hover:bg-primarySecond tw:text-white"
                    }`}
                  >
                    {primaryCtaLabel}
                    {!ctaDisabled && !hasPaid && (
                      <span className="tw:ml-1 tw:text-xs tw:opacity-80">
                        ({priceDisplay})
                      </span>
                    )}
                  </button>

                  <div className="tw:text-[11px] tw:text-gray-400 tw:mt-0.5 tw:text-right">
                    {hasPaid
                      ? isLiveNow
                        ? "You already have access. Tap “Enter Live Room” to join."
                        : "You’ve already paid. We’ll notify you when it’s live."
                      : "Secure checkout • Instant ticket access"}
                  </div>
                </div>
              </div>
            </div>

            {/* REPORT ROW */}
            <div className="tw:px-4 tw:md:px-8 tw:py-3 tw:border-b tw:border-[#FEE2E2] tw:bg-[#FFFBFB]">
              <button
                type="button"
                onClick={() => setReportOpen(true)}
                className="tw:inline-flex tw:items-center tw:gap-2 tw:text-xs tw:md:text-sm tw:bg-red-50 tw:px-4 tw:py-2 tw:rounded-full tw:text-[#F04438] tw:hover:bg-red-100"
              >
                <Flag className="tw:w-4 tw:h-4" />
                <span>Report this event</span>
              </button>
            </div>

            {/* BODY SECTIONS */}
            <div className="tw:bg-[#F7F7F9]">
              {/* ORGANIZER CARD */}
              <div className="tw:px-4 tw:md:px-6 tw:pt-5 tw:pb-6">
                <div className="tw:w-full tw:bg-white tw:rounded-2xl tw:px-4 tw:md:px-8 tw:py-5 tw:shadow-[0_10px_30px_rgba(15,23,42,0.06)] tw:relative">
                  <div className="tw:flex tw:flex-col tw:md:flex-row tw:items-center tw:md:items-start tw:gap-4">
                    {/* avatar + meta */}
                    <div className="tw:flex-1 tw:flex tw:flex-col tw:items-center tw:md:items-start tw:gap-2">
                      <div className="tw:h-14 tw:w-14 tw:rounded-full tw:bg-lightPurple tw:flex tw:items-center tw:justify-center tw:overflow-hidden">
                        {hostHasImage ? (
                          <img
                            className="tw:w-full tw:h-full tw:object-cover"
                            src={event.hostImage}
                            alt={hostName}
                          />
                        ) : (
                          <span className="tw:text-[16px] tw:font-semibold tw:text-primary">
                            {hostInitials}
                          </span>
                        )}
                      </div>

                      <div className="tw:text-sm tw:md:text-base tw:font-semibold tw:text-gray-900 tw:text-center tw:md:text-left">
                        {event.hostName || "Organizer"}
                      </div>

                      <div className="tw:text-[11px] tw:text-gray-400 tw:mt-1">
                        {event.organizer_since
                          ? `On Zagasm since ${event.organizer_since}`
                          : "Part of Zagasm Studios community"}
                      </div>
                    </div>

                    {/* Rank badge */}
                    <div className="tw:md:absolute tw:md:right-6 tw:md:top-6 tw:flex tw:items-center tw:justify-center tw:mt-4 tw:md:mt-0">
                      <div className="tw:inline-flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:bg-black tw:text-white tw:text-xs tw:rounded-2xl">
                        <span className="tw:inline-flex tw:h-6 tw:w-6 tw:items-center tw:justify-center tw:bg-[#111827] tw:rounded-full">
                          <img
                            className="tw:w-4"
                            src="/images/icons/globe.png"
                            alt=""
                          />
                        </span>
                        <span>#{event.organizer_rank || 2} Organizer</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="tw:mt-5 tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-3">
                    <button
                      style={{
                        borderRadius: "12px",
                      }}
                      type="button"
                      onClick={handleToggleFollow}
                      disabled={followLoading || !event.hostId}
                      className={`tw:h-10 tw:flex tw:items-center tw:justify-center tw:text-xs tw:md:text-sm tw:font-medium tw:rounded-[10px] tw:border tw:transition tw:duration-150 ${
                        isFollowing
                          ? "tw:bg-white tw:border-primary/30 tw:text-primary"
                          : "tw:bg-[#F3F4F6] tw:border-transparent tw:text-gray-800 tw:hover:bg-[#E5E7EB]"
                      } ${
                        followLoading
                          ? "tw:opacity-70 tw:cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {followLoading
                        ? "Updating…"
                        : isFollowing
                        ? "Following"
                        : "Follow Organizer"}
                    </button>

                    <Link
                      to={
                        event.organiserId
                          ? `/profile/${event.organiserId}`
                          : "/organizers"
                      }
                      className="tw:h-10 tw:flex tw:items-center tw:justify-center tw:text-xs tw:md:text-sm tw:font-medium tw:bg-primary text-white tw:rounded-[10px] tw:hover:bg-primarySecond"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>

              {/* SPECIAL GUESTS */}
              <div className="tw:px-4 tw:md:px-6 tw:pb-6">
                <div className="tw:bg-white tw:rounded-2xl tw:px-4 tw:md:px-6 tw:py-4 tw:shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                  <div className="tw:flex tw:items-center tw:justify-between tw:mb-3">
                    <span className="tw:text-lg tw:md:text-2xl tw:font-semibold tw:text-gray-900">
                      Special Guests
                    </span>
                  </div>

                  <div
                    className="
                      tw:overflow-x-auto tw:pb-1
                      tw:[&::-webkit-scrollbar]:hidden
                      tw:[-ms-overflow-style:'none']
                      tw:[scrollbar-width:'none']
                    "
                  >
                    <div className="tw:flex tw:flex-nowrap tw:gap-4 tw:min-w-max">
                      <GuestPerformers performers={event.eventPerformers} />
                    </div>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="tw:px-4 tw:md:px-6 tw:pb-6">
                <div className="tw:bg-white tw:rounded-2xl tw:px-4 tw:md:px-6 tw:py-4 tw:shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                  <span className="tw:text-lg tw:md:text-2xl tw:font-semibold tw:mb-3 tw:block">
                    Event Description
                  </span>

                  <div className="tw:w-full tw:bg-[#F3F4F6] tw:rounded-xl tw:px-4 tw:py-3 tw:text-sm tw:text-gray-700 tw:leading-relaxed">
                    <p
                      className={
                        expanded ? "" : "tw:line-clamp-3 tw:md:line-clamp-4"
                      }
                    >
                      {event.description ||
                        "No description available for this event yet."}
                    </p>

                    {event.description?.length > 140 && (
                      <button
                        className="tw:text-primary tw:text-xs tw:font-medium tw:mt-1"
                        onClick={() => setExpanded(!expanded)}
                      >
                        {expanded ? "Read less" : "Read more…"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* EVENT STATS */}
              <div className="tw:px-4 tw:md:px-6 tw:pb-6">
                <div className="tw:bg-white tw:rounded-2xl tw:px-4 tw:md:px-6 tw:py-4 tw:shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                  <span className="tw:text-lg tw:md:text-2xl tw:font-semibold tw:mb-4 tw:block">
                    Event Stats
                  </span>

                  <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-3 tw:gap-3">
                    {/* Rating */}
                    <div className="tw:flex tw:items-center tw:gap-3 tw:bg-[#F3F4F6] tw:rounded-xl tw:px-3 tw:py-2.5">
                      <div className="tw:flex tw:items-center tw:justify-center tw:h-8 tw:w-8 tw:rounded-full tw:bg-white">
                        <Star className="tw:w-4 tw:h-4 tw:text-[#FACC15] tw:fill-[#FACC15]" />
                      </div>
                      <div>
                        <div className="tw:text-xs tw:text-gray-500">
                          Rating
                        </div>
                        <div className="tw:text-sm tw:font-semibold tw:text-gray-900">
                          {event.rating || "4.9"}{" "}
                          <span className="tw:text-[11px] tw:text-gray-500">
                            ({event.reviews_count || "1,240"} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Attending */}
                    <div className="tw:flex tw:items-center tw:gap-3 tw:bg-[#F3F4F6] tw:rounded-xl tw:px-3 tw:py-2.5">
                      <div className="tw:flex tw:items-center tw:justify-center tw:h-8 tw:w-8 tw:rounded-full tw:bg-white">
                        <Users className="tw:w-4 tw:h-4 tw:text-gray-700" />
                      </div>
                      <div>
                        <div className="tw:text-xs tw:text-gray-500">
                          Attending
                        </div>
                        <div className="tw:text-sm tw:font-semibold tw:text-gray-900">
                          {event.attending_count || "+60k"} people
                        </div>
                      </div>
                    </div>

                    {/* Shares */}
                    <div className="tw:flex tw:items-center tw:gap-3 tw:bg-[#F3F4F6] tw:rounded-xl tw:px-3 tw:py-2.5">
                      <div className="tw:flex tw:items-center tw:justify-center tw:h-8 tw:w-8 tw:rounded-full tw:bg-white">
                        <Share className="tw:w-4 tw:h-4 tw:text-gray-700" />
                      </div>
                      <div>
                        <div className="tw:text-xs tw:text-gray-500">
                          Shares
                        </div>
                        <div className="tw:text-sm tw:font-semibold tw:text-gray-900">
                          {event.shares_count || "+60k"} shares
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TOP COMMENT REVIEW + REMARK BOX */}
              <div className="tw:px-4 tw:md:px-8 tw:py-6 tw:bg-white">
                <span className="tw:text-lg tw:md:text-2xl tw:font-semibold tw:my-3 tw:pt-2 tw:block">
                  Top Comment Review
                </span>

                <Remarks
                  eventId={eventId}
                  remarks={remarks}
                  onAppend={(r) =>
                    setEvent((p) => ({
                      ...p,
                      remarks: [r, ...(p?.remarks || [])],
                    }))
                  }
                />
              </div>

              {/* Spacer for mobile sticky bar */}
              <div className="tw:block tw:md:hidden tw:h-20" />
            </div>
          </div>

          {/* MORE FROM ORGANIZER / RECS */}
          <div className="tw:mt-6 tw:px-1">
            <YouMayAlsoLike recs={recs} posterFallback={posterUrl} />
          </div>
        </div>
      </div>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={async (reason) => {
          const url = `/api/v1/report/register?reportable_type=event&reportable_id=${encodeURIComponent(
            eventId
          )}&reason=${encodeURIComponent(reason)}`;
          await api.post(url, null, authHeaders(token));
          setReportOpen(false);
          navigate("/feed");
          showSuccess("Report submitted. Thank you.");
        }}
      />
      <EventShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        eventId={event?.id} // IMPORTANT: use actual id even when page was opened via slug
        token={token}
        title="Share this event"
      />

      <AccessTypeModal
        open={accessModalOpen}
        onClose={() => setAccessModalOpen(false)}
        event={event}
        onConfirm={async (accessType) => {
          await handleGetTicket(accessType);
          setAccessModalOpen(false);
        }}
      />

      <TicketPromptModal
        open={purchaseModalOpen}
        onClose={closePurchaseModal}
        event={event}
        onBuy={() => handleGetTicket("main")}
        buying={initiatingPayment}
      />

      <LiveAppDownloadModal
        open={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </>
  );
}
