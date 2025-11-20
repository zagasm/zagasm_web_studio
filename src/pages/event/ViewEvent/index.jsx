import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SideBarNav from "../../pageAssets/SideBarNav";
import SEO from "../../../component/SEO";
import { Helmet } from "react-helmet-async";
import { api, authHeaders } from "../../../lib/apiClient";
import { ToastHost, showSuccess, showError } from "../../../component/ui/toast";

import PosterHeader from "../../../component/Events/PostHeader";
import GuestPerformers from "../../../component/Events/GuestPerformers";
import OrganizerCard from "../../../component/Events/OrganizerCard";
import Remarks from "../../../component/Events/Remarks";
import YouMayAlsoLike from "../../../component/Events/YouMayAlsoLike";
import MobileStickyBar from "../../../component/Events/MobileStickyBar";
import ReportModal from "../../../component/Events/ReportModal";

import { formatEventDateTime, randomAvatar } from "../../../utils/ui";
import { useAuth } from "../../auth/AuthContext";
import {
  CountdownPill,
  eventStartDate,
  formatMetaLine,
  priceText,
} from "../../../component/Events/SingleEvent";
import { CalendarDays } from "lucide-react";

/* ---------- Page ---------- */
export default function ViewEvent() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // local UI mirrors API
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // report modal
  const [reportOpen, setReportOpen] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!eventId) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/api/v1/events/${eventId}/view`,
          authHeaders(token)
        );
        const payload = res?.data?.data || {};
        if (!mounted) return;
        const ev = payload.currentEvent || null;
        setEvent(ev);
        setRecs(payload.recommendations || []);
        setIsSaved(!!ev?.is_saved);
        setIsFollowing(!!ev?.is_following_organizer);
      } catch (e) {
        setError(
          e?.response?.data?.message || e?.message || "Failed to fetch event"
        );
        console.error(e);
      } finally {
        mounted = false;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [eventId, token]);

  const priceDisplay =
    event?.price_display ||
    `${event?.currency?.symbol || "₦"}${event?.price || "0"}`;

  const posterUrl = useMemo(() => event?.poster?.[0]?.url, [event]);

  const handleGetTicket = async () => {
    if (event?.is_sold_out) return;

    if (!token) {
      showError("Please log in to purchase a ticket.");
      navigate("/login");
      return;
    }

    try {
      const res = await api.post(
        `/api/v1/payments/${event.id}/initiate`,
        null,
        authHeaders(token)
      );

      const payload = res?.data || {};

      if (payload.status === false && payload.message) {
        // Already paid scenario
        showError(payload.message);
        return;
      }

      // Check for successful redirection URL
      if (payload.url) {
        showSuccess(`Preparing ticket for “${event?.title || "Event"}”…`);
        // Redirect to Paystack checkout URL
        window.location.href = payload.url;
      } else {
        // Fallback for unexpected success response
        showError("Payment initiation failed: no redirect URL received.");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to initiate payment.";
      showError(errorMessage);
      console.error("Payment initiation error:", error);
    }
  };

  const isLiveNow = !!event?.is_live;
  const isSoldOut = !!event?.is_sold_out;

  let primaryCtaLabel = "Buy Ticket";
  if (isSoldOut) primaryCtaLabel = "Sold Out";
  else if (isLiveNow) primaryCtaLabel = "Join Live";

  if (loading) {
    return (
      <div className="tw:w-full tw:h-[50vh] tw:flex tw:items-center tw:justify-center tw:text-gray-600">
        Loading event…
      </div>
    );
  }
  if (error) {
    return (
      <div className="tw:w-full tw:h-[50vh] tw:flex tw:items-center tw:justify-center tw:text-red-600">
        {error}
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
  const variant = "upcoming";
  const isLive = variant === "live";
  const isUpcoming = variant === "upcoming";

  const ticketLabel = `Buy Ticket (${priceText(event)})`;

  console.log(event);

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
      <div className="tw:w-full tw:min-h-screen tw:bg-white tw:mt-24 tw:md:mt-0 tw:md:pt-20 tw:lg:px-4 tw:text-black">
        <div className="tw:pb-10">
          {/* EVENT HEADER */}
          <div className="tw:max-w-[500px] tw:mx-auto tw:flex tw:justify-between tw:items-center tw:my-4. tw:px-2">
            <div
              onClick={() => navigate(-1)}
              className=" tw:bg-[#E6E6E6] tw:rounded-full tw:p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="tw:size-3 tw:mdsize-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </div>

            <div className="tw:flex tw:justify-center tw:items-center tw:flex-col tw:my-2 tw:gap-2">
              <span className="tw:text-xs tw:md:text-xl tw:font-semibold">
                {event.title}
              </span>
              <div className="tw:bg-[#E6E6E6] tw:text-[10px] tw:px-2 tw:py-1.5 tw:inline-block tw:rounded-lg">
                <span>{event.eventType}</span>
              </div>
            </div>

            <div className="tw:grid tw:place-items-center tw:bg-[#E6E6E6] tw:rounded-full tw:p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="tw:size-3 tw:mdsize-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                />
              </svg>
            </div>
          </div>
          <div className="row g-4 g-lg-4">
            {/* MAIN COLUMN */}
            <div
              style={{
                padding: 0,
              }}
              className="col-12"
            >
              <div className="tw:bg-white tw:border tw:border-gray-100 tw:rounded-lg tw:overflow-hidden tw:shadow-sm tw:mb-6">
                {/* HERO POSTER */}
                <div className="tw:relative tw:h-[220px] tw:md:h-[488px] tw:w-full tw:overflow-hidden">
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={event.title}
                      className="tw:w-full tw:h-full tw:object-cover"
                    />
                  ) : (
                    <div className="tw:w-full tw:h-full tw:bg-gray-200" />
                  )}

                  {/* Live / Upcoming badge */}
                  <div className="tw:absolute tw:top-4 tw:right-4 tw:flex tw:items-center tw:gap-2">
                    <div className="tw:inline-flex tw:items-center tw:gap-1 tw:px-3 tw:py-1 tw:bg-[#111827]/80 tw:text-white tw:text-xs tw:rounded-full tw:backdrop-blur">
                      <span
                        className={`tw:inline-block tw:size-2 tw:rounded-full ${
                          isLiveNow ? "tw:bg-red-500" : "tw:bg-amber-500"
                        }  tw:animate-pulse`}
                      />
                      <span>{isLiveNow ? "Live" : "Upcoming"}</span>
                    </div>
                  </div>
                </div>

                {/* SUMMARY STRIP (Organizer / Location / Date / Price / CTA) */}
                <div className="tw:px-5 tw:md:px-8 tw:py-4 tw:border-b tw:border-gray-100">
                  <div className="">
                    {/* Organizer + title */}
                    <div className="tw:flex tw:items-center tw:gap-3 tw:min-w-[200px]">
                      <div className="tw:h-9 tw:w-9 tw:rounded-full tw:bg-gray-200 tw:flex tw:items-center tw:justify-center tw:text-xs tw:font-semibold">
                        <img
                          src={event.hostImage || "/images/avater_pix.avif"}
                          alt=""
                        />
                      </div>
                      <div>
                        <div className="tw:text-sm tw:text-gray-500">
                          {event.hostName || "Event Organizer"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="tw:flex tw:flex-col tw:xl:flex-row tw:xl:items-center tw:xl:justify-between tw:gap-4">
                    <div className="tw:mt-1 tw:bg-zinc-50 tw:rounded-lg tw:py-3 tw:flex tw:items-center tw:gap-4 tw:text-xs tw:text-zinc-600">
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <CountdownPill target={startDate} />
                      </div>
                      <div className="tw:w-px tw:h-6 tw:bg-zinc-200" />
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <CalendarDays className="tw:w-4 tw:h-4" />
                        <span>{formatMetaLine(event)}</span>
                      </div>
                    </div>

                    {/* Price + CTA */}
                    <div className="tw:hidden tw:md:flex tw:xl:flex-1 tw:items-center tw:justify-between tw:gap-4">
                      <div className="tw:flex tw:gap-2 tw:items-center">
                        <div className="tw:text-[11px] tw:text-gray-500">
                          Price
                        </div>
                        <div className="tw:text-2xl tw:font-semibold tw:text-gray-900">
                          {priceDisplay}
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isSoldOut}
                        onClick={handleGetTicket}
                        style={{ borderRadius: 999 }}
                        className={`tw:h-11 tw:px-6 tw:min-w-[140px] tw:flex tw:items-center tw:justify-center tw:text-sm tw:font-semibold tw:transition tw:duration-200 ${
                          isSoldOut
                            ? "tw:bg-gray-200 tw:text-gray-500 tw:cursor-not-allowed"
                            : "tw:bg-primary tw:hover:tw:bg-primarySecond tw:text-white"
                        }`}
                      >
                        {primaryCtaLabel}
                        {!isSoldOut && (
                          <span className="tw:ml-1 tw:text-xs tw:opacity-80">
                            ({priceDisplay})
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* REPORT ROW */}
                <div className="tw:px-5 tw:md:px-8 tw:py-3 tw:border-b tw:border-[#FEE2E2]">
                  <button
                    style={{
                      borderRadius: 30,
                    }}
                    type="button"
                    onClick={() => setReportOpen(true)}
                    className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:bg-red-100 tw:px-4 tw:py-2 tw:rounded-2xl tw:text-[#F04438]"
                  >
                    <span className="fa fa-flag-o" />
                    <span>Report this event</span>
                  </button>
                </div>

                {/* ORGANIZER CARD BLOCK (centered like screenshot) */}
                <div className="tw:relative tw:px-5 tw:md:px-2 tw:pt-5 tw:pb-6 tw:bg-[rgb(247,247,249)]">
                  <div className="tw:w-full tw:bg-white tw:rounded-lg tw:px-4 tw:md:px-10 tw:py-4 tw:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                    {/* top row: organiser summary + small badge on the right */}
                    <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
                      <div className="tw:flex-1 tw:flex tw:flex-col tw:items-center tw:gap-2">
                        {/* avatar */}
                        <div className="tw:h-12 tw:w-12 tw:rounded-full tw:bg-[#E5E7EB] tw:flex tw:items-center tw:justify-center tw:text-sm tw:font-semibold tw:text-gray-800">
                          <img
                            src={event.hostImage || "/images/avater_pix.avif"}
                            alt=""
                          />
                        </div>

                        {/* name */}
                        <div className="tw:text-sm tw:md:text-base tw:font-semibold tw:text-gray-900">
                          {event.hostName || "Juv Academy"}
                        </div>

                        {/* followers chip */}
                        <div className="tw:inline-flex tw:items-center tw:gap-2 tw:px-3 tw:py-1 tw:bg-[#F3F4FF] tw:rounded-full">
                          <div className="tw:flex tw:-space-x-2">
                            {[0, 1, 2].map((i) => (
                              <img
                                key={i}
                                src={randomAvatar(
                                  (event.id || "host") + ":" + i
                                )}
                                alt=""
                                className="tw:h-5 tw:w-5 tw:rounded-full tw:ring-2 tw:ring-white tw:object-cover"
                              />
                            ))}
                          </div>
                          <span className="tw:text-[11px] tw:text-gray-700 tw:whitespace-nowrap">
                            {event.organizer_followers_label ||
                              "+200k followers"}
                          </span>
                        </div>

                        {/* active since */}
                        <div className="tw:text-[11px] tw:text-gray-400 tw:mt-1">
                          Active since {event.organizer_since || "2025"}
                        </div>
                      </div>

                      {/* small badge at the far right */}
                      <div className="tw:absolute tw:right-8 tw:md:right-4 tw:top-8 tw:flex tw:items-center tw:justify-center">
                        <div className="tw:inline-flex tw:items-center tw:gap-2 tw:px-3 tw:py-2 tw:bg-black tw:text-white tw:text-xs tw:rounded-2xl">
                          <span className="tw:inline-flex tw:h-6 tw:w-6 tw:items-center tw:justify-center tw:bg-[#111827] tw:rounded-full">
                            <img
                              className="w-4"
                              src="/images/icons/globe.png"
                              alt=""
                            />
                          </span>
                          <span>#{event.organizer_rank || 2}</span>
                        </div>
                      </div>
                    </div>

                    {/* follow / view profile buttons */}
                    <div className="tw:mt-5 tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4">
                      <button
                        style={{
                          borderRadius: 10,
                        }}
                        type="button"
                        className="tw:h-10 tw:flex tw:items-center tw:justify-center tw:text-xs tw:md:text-sm tw:font-medium tw:bg-[#F3F4F6] tw:text-gray-800"
                      >
                        Follow Organizer
                      </button>

                      <Link
                        to={
                          event.hostId
                            ? `/organizer/${event.hostId}`
                            : "/organizers"
                        }
                        className="tw:h-10 tw:flex tw:items-center tw:justify-center tw:text-xs tw:md:text-sm tw:font-medium tw:bg-primary text-white tw:rounded-[10px]"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>

                {/* SPECIAL GUESTS */}
                <div className="tw:px-5 tw:md:px-2 tw:pt-4 tw:pb-6 tw:bg-[#F7F7F9]">
                  {/* card container */}
                  <div className="tw:bg-white tw:rounded-lg tw:px-3 tw:md:px-4 tw:py-4 tw:shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                    <span className="tw:text-lg tw:md:text-2xl tw:font-semibold tw:text-gray-900 tw:mb-3">
                      Special Guest
                    </span>
                    {/* horizontal scroll on small / medium screens */}
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
                <div className="tw:px-5 tw:md:px-2 tw:pt-2 tw:pb-6 tw:bg-[#F7F7F9]">
                  <div className="tw:bg-white tw:rounded-lg tw:px-4 tw:md:px-6 tw:py-4 tw:shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                    <span className="tw:text-lg tw:md:text-2xl tw:font-semibold tw:mb-3">
                      Event Description
                    </span>

                    {/* light-grey strip like screenshot */}
                    <div className="tw:w-full tw:bg-[#F3F4F6] tw:rounded-xl tw:px-4 tw:py-3 tw:text-sm tw:text-gray-700 tw:leading-relaxed">
                      <p
                        className={
                          expanded
                            ? ""
                            : "tw:line-clamp-2 tw:md:tw:line-clamp-1"
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

                {/* AGE RESTRICTION BANNER */}
                <div className="tw:px-5 tw:md:px-2 tw:pb-6 tw:bg-[#F7F7F9]">
                  <div className="tw:bg-white tw:rounded-lg tw:px-4 tw:py-4 tw:shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                    <div className="tw:w-full tw:bg-[#111111] tw:text-white tw:text-center tw:text-xs tw:md:text-sm tw:py-3 tw:rounded-[14px] tw:font-medium">
                      {event.ageRestrictionText || "+18 (not for children)"}
                    </div>
                  </div>
                </div>

                {/* EVENT STATS */}
                <div className="tw:px-5 tw:md:px-2 tw:pb-6 tw:bg-[#F7F7F9]">
                  <div className="tw:bg-white tw:rounded-lg tw:px-4 tw:md:px-6 tw:py-4 tw:shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                    <span className="tw:text-lg tw:md:text-2xl tw:font-semibold tw:mb-3">
                      Event Stats
                    </span>

                    <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
                      {/* rating pill */}
                      <div className="tw:inline-flex tw:items-center tw:gap-2 tw:px-3 tw:py-1.5 tw:bg-[#F3F4F6] tw:rounded-full tw:text-xs tw:text-gray-800">
                        <span className="fa fa-star tw:text-[#FACC15]" />
                        <span>
                          {event.rating || "4.9"}{" "}
                          <span className="tw:text-gray-500">
                            ({event.reviews_count || "1,240"} reviews)
                          </span>
                        </span>
                      </div>

                      {/* attending pill */}
                      <div className="tw:inline-flex tw:items-center tw:gap-2 tw:px-3 tw:py-1.5 tw:bg-[#F3F4F6] tw:rounded-full tw:text-xs tw:text-gray-800">
                        <div className="tw:flex tw:-space-x-2">
                          {[0, 1, 2].map((i) => (
                            <img
                              key={i}
                              src={randomAvatar(
                                (event.id || "attending") + ":" + i
                              )}
                              alt=""
                              className="tw:h-5 tw:w-5 tw:rounded-full tw:ring-2 tw:ring-white tw:object-cover"
                            />
                          ))}
                        </div>
                        <span>{event.attending_count || "+60k"} attending</span>
                      </div>

                      {/* shares pill */}
                      <div className="tw:inline-flex tw:items-center tw:gap-2 tw:px-3 tw:py-1.5 tw:bg-[#F3F4F6] tw:rounded-full tw:text-xs tw:text-gray-800">
                        <span className="fa fa-share-alt" />
                        <span>{event.shares_count || "+60k"} Shares</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TOP COMMENT REVIEW + REMARK BOX */}
                <div className="tw:px-5 tw:md:px-8 tw:py-6">
                  <span className="tw:text-lg tw:md:text-2xl tw:font-semibold tw:my-3 tw:pt-2">
                    Top Comment Review
                  </span>

                  {/* Existing remarks list / input – styled to resemble screenshot */}
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
            {/* MORE FROM ORGANIZER */}
            <div
              style={{
                padding: 0,
              }}
              className="tw:mt-4 tw:px-6"
            >
              <YouMayAlsoLike recs={recs} posterFallback={posterUrl} />
            </div>
          </div>
          <div className="tw:block tw:md:hidden tw:h-20" />

          {/* Mobile sticky bar (bottom) */}
          <MobileStickyBar
            priceDisplay={priceDisplay}
            dateTime={formattedDateTime}
            onGetTickets={handleGetTicket}
          />
        </div>
      </div>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={async (reason) => {
          const url = `/api/v1/report/register?reportable_type=event&reportable_id=${encodeURIComponent(
            eventId
          )}&reason=${encodeURIComponent(reason)}`;
          await api.post(url, null, authHeaders());
          setReportOpen(false);
          navigate("/feed");
          showSuccess("Report submitted. Thank you.");
        }}
      />
    </>
  );
}
