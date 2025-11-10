import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SideBarNav from "../../pageAssets/SideBarNav";
import SEO from "../../../component/SEO";
import { Helmet } from "react-helmet-async";
import { api, authHeaders } from "../../../lib/apiClient";
import { ToastHost, showSuccess } from "../../../component/ui/toast";

import PosterHeader from "../../../component/Events/PostHeader";
import GuestPerformers from "../../../component/Events/GuestPerformers";
import OrganizerCard from "../../../component/Events/OrganizerCard";
import Remarks from "../../../component/Events/Remarks";
import YouMayAlsoLike from "../../../component/Events/YouMayAlsoLike";
import MobileStickyBar from "../../../component/Events/MobileStickyBar";
import ReportModal from "../../../component/Events/ReportModal";

import { formatEventDateTime, randomAvatar } from "../../../utils/ui";
import { useAuth } from "../../auth/AuthContext";

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
  }, [eventId]);

  const priceDisplay =
    event?.price_display ||
    (event?.currency?.symbol || "$") + (event?.price || "0");

  const posterUrl = useMemo(
    () =>
      event?.poster?.[0]?.url
    [event]
  );

  const handleGetTicket = () => {
    showSuccess(`🎟️ Ticket booked for “${event?.title || "Event"}”!`);
  };

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
              priceCurrency: event.currency?.code || "USD",
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

      <div className="container-fluid m-0 p-0">
        <SideBarNav />
        <div className="page_wrapper overflow-hidden">
          <div className="container tw:py-6">
            <div className="row g-4 tw:pb-36 tw:md:pb-0">
              {/* MAIN */}
              <div className="col-12 col-lg-8">
                <div className="tw:bg-white tw:border tw:border-gray-100 tw:rounded-3xl tw:overflow-hidden tw:shadow-sm">
                  <PosterHeader
                    eventId={eventId}
                    posterUrl={posterUrl}
                    title={event.title}
                    isSaved={isSaved}
                    setIsSaved={setIsSaved}
                    shareLink={event.shareable_link}
                  />

                  {/* Title & meta */}
                  <div className="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-4 tw:px-5 tw:md:px-7 tw:py-4">
                    <div className="tw:min-w-0">
                      <span className="tw:text-xl tw:md:text-3xl tw:font-semibold tw:text-gray-900 tw:truncate">
                        {event.title || "Untitled Event"}
                      </span>
                      <div className="tw:mt-1 tw:space-x-2">
                        <span className="tw:text-primary tw:font-medium">
                          {event.hostName || "Unknown Host"}
                        </span>
                        <span className="tw:text-gray-500">·</span>
                        <span className="tw:text-gray-500">
                          {formatEventDateTime(
                            event.eventDate,
                            event.startTime
                          )}
                        </span>
                      </div>
                      <div className="tw:mt-2 tw:flex tw:items-center tw:gap-2">
                        <div className="tw:flex tw:-space-x-2">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <img
                              key={i}
                              src={randomAvatar(event.id + ":" + i)}
                              alt=""
                              className="tw:h-7 tw:w-7 tw:rounded-full tw:ring-2 tw:ring-white tw:object-cover"
                            />
                          ))}
                        </div>
                        <span className="tw:text-sm tw:text-gray-600">
                          200 others are attending
                        </span>
                      </div>
                    </div>

                    <div className="tw:hidden tw:md:block">
                      <button
                      style={{
                        borderRadius: 20
                      }}
                        type="button"
                        className="tw:h-11 tw:px-6 tw:flex tw:items-center tw:gap-2 tw:bg-primary tw:text-white tw:rounded-full"
                        onClick={handleGetTicket}
                      >
                        <span className="tw:bg-[#FFCC00] tw:text-black tw:font-semibold tw:px-3 tw:py-1 tw:rounded-full">
                          Pay
                        </span>
                        <span className="tw:opacity-90">({priceDisplay})</span>
                      </button>
                    </div>
                  </div>

                  <GuestPerformers performers={event.eventPerformers} />

                  {/* Description */}
                  <div className="tw:border-y tw:border-gray-100 tw:px-5 tw:md:px-7 tw:py-5">
                    <h3 className="tw:text-base tw:font-semibold tw:mb-2">
                      Description
                    </h3>
                    <p
                      className={`tw:text-gray-700 ${
                        expanded ? "" : "tw:line-clamp-3"
                      }`}
                    >
                      {event.description || "No description available."}
                    </p>
                    {event.description?.length > 140 && (
                      <button
                        className="tw:text-primary tw:text-sm tw:mt-2"
                        onClick={() => setExpanded(!expanded)}
                      >
                        {expanded ? "see less" : "see more…"}
                      </button>
                    )}
                  </div>

                  {/* Location */}
                  <div className="tw:px-5 tw:md:px-7 tw:py-5">
                    <div className="tw:flex tw:items-start tw:justify-between tw:gap-4">
                      <div>
                        <h3 className="tw:text-base tw:font-semibold tw:mb-1">
                          Location
                        </h3>
                        <div className="tw:text-sm tw:text-gray-900 tw:font-medium">
                          {event.location || "—"}
                        </div>
                      </div>
                      <button
                        className="tw:text-sm tw:text-gray-600 hover:tw:text-gray-900"
                        onClick={() => {
                          navigator.clipboard?.writeText(event.location || "");
                          showSuccess("Location copied");
                        }}
                      >
                        <span className="fa fa-copy" />
                      </button>
                    </div>
                  </div>

                  <OrganizerCard
                    hostImage={event.hostImage}
                    hostId={event.hostId}
                    hostName={event.hostName}
                    isFollowing={isFollowing}
                    setIsFollowing={setIsFollowing}
                  />

                  <div className="tw:px-5 tw:md:px-7 tw:pb-2">
                    <button
                      className="tw:flex tw:items-center tw:gap-2 tw:text-[#F04438]"
                      onClick={() => setReportOpen(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="tw:size-6 tw:text-red-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>

                      <u>Report this event</u>
                    </button>
                  </div>

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

                  {/* Spacer for mobile sticky */}
                  <div className="tw:block tw:md:hidden tw:h-20" />
                </div>
              </div>

              {/* RIGHT rail */}
              <div className="col-12 col-lg-4 tw:mb-12 tw:md:mb-0">
                <YouMayAlsoLike recs={recs} posterFallback={posterUrl} />
              </div>
            </div>
          </div>

          {/* Mobile sticky bar */}
          <MobileStickyBar
            priceDisplay={priceDisplay}
            dateTime={formatEventDateTime(event.eventDate, event.startTime)}
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
          navigate('/feed');
          showSuccess("Report submitted. Thank you.");
        }}
      />
    </>
  );
}
