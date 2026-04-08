import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Share2,
} from "lucide-react";
import SEO from "../../component/SEO";
import EventShareModal from "../../component/Events/EvenetShareModal";
import YouMayAlsoLike from "../../component/Events/YouMayAlsoLike";
import { formatEventDateTime } from "../../utils/ui";
import { useSharedEventPage } from "../../features/eventShare/hooks/useSharedEventPage";
import { useEventShareFlow } from "../../features/eventShare/hooks/useEventShareFlow";
import {
  getEventDescription,
  normalizeSharePayload,
} from "../../features/eventShare/shareUtils";
import {
  eventStartDate,
  formatMetaLine,
} from "../../component/Events/SingleEvent";

function firstPosterUrl(event) {
  return (
    event?.poster?.find((item) => item?.type === "image" && item?.url)?.url ||
    ""
  );
}

function SharedEventShimmer() {
  return (
    <div className="tw:min-h-screen tw:bg-[radial-gradient(circle_at_top_left,#d9ebff_0%,#f6f9fc_34%,#eef4fb_72%,#f8fbff_100%)] tw:pt-20 tw:pb-14">
      <div className="tw:mx-auto tw:max-w-7xl tw:px-4 tw:md:px-6">
        <div className="tw:h-12 tw:w-40 tw:animate-pulse tw:rounded-full tw:bg-white/70" />
        <div className="tw:mt-6 tw:grid tw:grid-cols-1 tw:gap-8 tw:xl:grid-cols-[1.2fr_0.8fr]">
          <div className="tw:h-[440px] tw:animate-pulse tw:rounded-[34px] tw:bg-white/75" />
          <div className="tw:space-y-5">
            <div className="tw:h-52 tw:animate-pulse tw:rounded-[30px] tw:bg-white/75" />
            <div className="tw:h-72 tw:animate-pulse tw:rounded-[30px] tw:bg-white/75" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SharedEventPage() {
  const { shareKey } = useParams();
  const navigate = useNavigate();
  const sharedEventQuery = useSharedEventPage(shareKey);
  const shareFlow = useEventShareFlow();

  const event = sharedEventQuery.data?.event;
  const sharePayload = sharedEventQuery.data?.share;
  const recommended = sharedEventQuery.data?.recommended || [];
  const coverUrl = sharePayload?.coverUrl || firstPosterUrl(event);
  const description = getEventDescription(event);
  const formattedDateTime = formatEventDateTime(
    event?.eventDate,
    event?.startTime
  );
  const startDate = eventStartDate(event);
  const locationLabel =
    event?.location ||
    event?.address ||
    (event?.eventType?.toLowerCase() === "virtual"
      ? "Online event"
      : "Location to be announced");

  const structuredData = useMemo(() => {
    if (!event) return [];

    return [
      {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event?.title,
        description,
        image: coverUrl ? [coverUrl] : undefined,
        startDate: event?.eventDate && event?.startTime
          ? `${event.eventDate} ${event.startTime}`
          : undefined,
        eventAttendanceMode:
          event?.eventType?.toLowerCase() === "virtual"
            ? "https://schema.org/OnlineEventAttendanceMode"
            : "https://schema.org/OfflineEventAttendanceMode",
        location:
          event?.eventType?.toLowerCase() === "virtual"
            ? { "@type": "VirtualLocation", url: sharePayload?.url || "" }
            : {
              "@type": "Place",
              name: event?.location || "Event location",
              address: event?.address || "",
            },
        organizer: {
          "@type": "Organization",
          name: event?.hostName || "Xilolo",
        },
      },
    ];
  }, [coverUrl, description, event, sharePayload?.url]);

  const handleShare = async () => {
    if (!event && !sharePayload) return;

    await shareFlow.startShare({
      eventId: event?.id,
      initialPayload: sharePayload || normalizeSharePayload({ event, share: sharePayload }),
    });
  };

  if (sharedEventQuery.isLoading) {
    return <SharedEventShimmer />;
  }

  if (sharedEventQuery.isError || !event) {
    return (
      <div className="tw:min-h-screen tw:bg-[radial-gradient(circle_at_top_left,#d9ebff_0%,#f6f9fc_34%,#eef4fb_72%,#f8fbff_100%)] tw:pt-24 tw:pb-16">
        <div className="tw:mx-auto tw:max-w-3xl tw:px-4">
          <div className="tw:rounded-[34px] tw:border tw:border-white/80 tw:bg-white/80 tw:p-8 tw:text-center tw:shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            <h1 className="tw:text-2xl tw:font-semibold tw:text-slate-900">
              Event unavailable
            </h1>
            <p className="tw:mt-3 tw:text-sm tw:leading-7 tw:text-slate-600">
              This shared event link is unavailable or may have expired.
            </p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="tw:mt-6 tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-2xl tw:bg-primary tw:px-5 tw:py-3 tw:text-sm tw:font-semibold tw:text-white hover:tw:bg-primarySecond"
            >
              <ArrowLeft className="tw:h-4 tw:w-4" />
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={event?.title || "Shared Event"}
        description={description}
        image={coverUrl || "/images/event-dummy.jpg"}
        url={sharePayload?.url}
        type="article"
        structuredData={structuredData}
      />

      <Helmet>
        <meta property="og:title" content={event?.title || "Shared Event"} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={coverUrl || "/images/event-dummy.jpg"} />
        <meta property="og:url" content={sharePayload?.url || ""} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={event?.title || "Shared Event"} />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content={coverUrl || "/images/event-dummy.jpg"}
        />
      </Helmet>

      <div className="tw:min-h-screen tw:bg-[radial-gradient(circle_at_top_left,#d9ebff_0%,#f6f9fc_34%,#eef4fb_72%,#f8fbff_100%)] tw:pb-16 tw:pt-20">
        <div className="tw:mx-auto tw:max-w-7xl tw:px-4 tw:md:px-6 tw:lg:px-8">
          <div className="tw:mt-4 tw:flex tw:items-center tw:justify-between tw:gap-3 tw:rounded-[28px] tw:border tw:border-white/70 tw:bg-white/55 tw:px-4 tw:py-3 tw:shadow-[0_24px_60px_rgba(148,163,184,0.15)] tw:backdrop-blur-2xl">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="tw:inline-flex tw:h-11 tw:w-11 tw:items-center tw:justify-center tw:rounded-full tw:border tw:border-white/80 tw:bg-white/80 tw:text-slate-700 tw:shadow-sm hover:tw:bg-white"
            >
              <ArrowLeft className="tw:h-4 tw:w-4" />
            </button>

            <div className="tw:min-w-0 tw:flex-1">
              <div className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.22em] tw:text-slate-500">
                Shared Event
              </div>
              <div className="tw:truncate tw:text-base tw:font-semibold tw:text-slate-900 tw:md:text-lg">
                {event?.title}
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-primary tw:px-4 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-white hover:tw:bg-primarySecond"
            >
              <Share2 className="tw:h-4 tw:w-4" />
              Share
            </button>
          </div>

          <section className="tw:mt-6 tw:grid tw:grid-cols-1 tw:gap-8 tw:xl:grid-cols-[1.25fr_0.75fr]">
            <div className="tw:space-y-6">
              <div className="tw:overflow-hidden tw:rounded-[34px] tw:border tw:border-white/70 tw:bg-white/60 tw:shadow-[0_30px_90px_rgba(15,23,42,0.08)] tw:backdrop-blur-2xl">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={event?.title || "Event cover"}
                    className="tw:h-[280px] tw:w-full tw:object-cover tw:md:h-[520px]"
                  />
                ) : (
                  <div className="tw:flex tw:h-[280px] tw:items-center tw:justify-center tw:bg-white/75 tw:text-slate-500 tw:md:h-[520px]">
                    Event cover unavailable
                  </div>
                )}
              </div>

              <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:md:grid-cols-3">
                <div className="tw:rounded-[26px] tw:border tw:border-white/75 tw:bg-white/68 tw:p-5 tw:shadow-[0_18px_50px_rgba(148,163,184,0.12)] tw:backdrop-blur-xl">
                  <div className="tw:flex tw:items-center tw:gap-2 tw:text-slate-500">
                    <CalendarDays className="tw:h-4 tw:w-4" />
                    <span className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.2em]">
                      Schedule
                    </span>
                  </div>
                  <div className="tw:mt-3 tw:text-sm tw:font-medium tw:text-slate-900">
                    {formattedDateTime || formatMetaLine(event)}
                  </div>
                </div>

                <div className="tw:rounded-[26px] tw:border tw:border-white/75 tw:bg-white/68 tw:p-5 tw:shadow-[0_18px_50px_rgba(148,163,184,0.12)] tw:backdrop-blur-xl">
                  <div className="tw:flex tw:items-center tw:gap-2 tw:text-slate-500">
                    <MapPin className="tw:h-4 tw:w-4" />
                    <span className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.2em]">
                      Location
                    </span>
                  </div>
                  <div className="tw:mt-3 tw:text-sm tw:font-medium tw:text-slate-900">
                    {locationLabel}
                  </div>
                </div>

                <div className="tw:rounded-[26px] tw:border tw:border-white/75 tw:bg-white/68 tw:p-5 tw:shadow-[0_18px_50px_rgba(148,163,184,0.12)] tw:backdrop-blur-xl">
                  <div className="tw:flex tw:items-center tw:gap-2 tw:text-slate-500">
                    <Clock className="tw:h-4 tw:w-4" />
                    <span className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.2em]">
                      Starts In
                    </span>
                  </div>
                  <div className="tw:mt-3 tw:text-sm tw:font-medium tw:text-slate-900">
                    {startDate ? formatMetaLine(event) : "Schedule pending"}
                  </div>
                </div>
              </div>

              <div className="tw:rounded-[30px] tw:border tw:border-white/75 tw:bg-white/68 tw:p-7 tw:shadow-[0_20px_60px_rgba(148,163,184,0.12)] tw:backdrop-blur-2xl">
                <div className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
                  About This Event
                </div>
                <p className="tw:mt-4 tw:text-sm tw:leading-7 tw:text-slate-600 tw:md:text-[15px]">
                  {event?.description ||
                    "This event does not have a published description yet."}
                </p>
              </div>
            </div>

            <aside className="tw:flex tw:flex-col tw:gap-6">
              <div className="tw:rounded-[30px] tw:border tw:border-white/75 tw:bg-white/70 tw:p-5 tw:shadow-[0_20px_60px_rgba(148,163,184,0.14)] tw:backdrop-blur-2xl">
                <div className="tw:rounded-3xl tw:bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] tw:p-5 tw:border tw:border-white/80">
                  <div className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
                    Shared By
                  </div>
                  <div className="tw:mt-3 tw:text-2xl tw:font-semibold tw:text-slate-900">
                    {event?.hostName || "Event Organizer"}
                  </div>
                  <p className="tw:mt-3 tw:text-sm tw:leading-6 tw:text-slate-600">
                    Open this event in Xilolo to follow the organizer, buy access, and keep up with live updates.
                  </p>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="tw:mt-5 tw:flex tw:h-12 tw:w-full tw:items-center tw:justify-center tw:gap-2 tw:rounded-2xl tw:bg-primary tw:px-4 tw:text-sm tw:font-semibold tw:text-white hover:tw:bg-primarySecond"
                  >
                    <Share2 className="tw:h-4 tw:w-4" />
                    Share event
                  </button>
                </div>
              </div>

              <YouMayAlsoLike recs={recommended} posterFallback={coverUrl} />
            </aside>
          </section>
        </div>
      </div>

      <EventShareModal
        open={shareFlow.shareModalOpen}
        onClose={shareFlow.closeShareModal}
        payload={shareFlow.sharePayload}
        loading={shareFlow.sharePayloadLoading}
        error={shareFlow.sharePayloadError}
        onRetry={shareFlow.retryShare}
        onCopyLink={shareFlow.handleCopyLink}
        onChannelClick={shareFlow.handleChannelShare}
        title="Share this event"
      />
    </>
  );
}
