import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import SEO from "../../../component/SEO";
import { Helmet } from "react-helmet-async";
import { api, authHeaders } from "../../../lib/apiClient";
import { ToastHost, showSuccess, showError } from "../../../component/ui/toast";
import YouMayAlsoLike from "../../../component/Events/YouMayAlsoLike";
import ReportModal from "../../../component/Events/ReportModal";
import LiveAppDownloadModal from "../../../component/Events/LiveAppDownloadModal";
import { formatEventDateTime } from "../../../utils/ui";
import { useAuth } from "../../auth/AuthContext";
import {
  eventStartDate,
  formatMetaLine,
  priceText,
} from "../../../component/Events/SingleEvent";
import {
  CalendarDays,
  Share2,
  Flag,
  ArrowLeft,
  Ticket,
  MapPin,
  Clock,
} from "lucide-react";
import EventShareModal from "../../../component/Events/EvenetShareModal";
import TicketPromptModal from "../../../component/Events/TicketPromptModal";
import Countdown from "react-countdown";
import FundWalletModal from "../../../features/wallet/components/FundWalletModal";
import TicketPurchaseSuccessModal from "../../../features/wallet/components/TicketPurchaseSuccessModal";
import WalletFundingRequiredModal from "../../../features/wallet/components/WalletFundingRequiredModal";
import { useEventShareFlow } from "../../../features/eventShare/hooks/useEventShareFlow";
import { normalizeEventRecord } from "../../../features/eventShare/shareUtils";
import { usePurchaseTicketWithWallet } from "../../../features/wallet/hooks/usePurchaseTicketWithWallet";
import {
  clearPendingPurchaseIntent,
  setPendingPurchaseIntent,
} from "../../../features/wallet/store/walletFlowSlice";
import {
  formatWalletMoney,
  getApiErrorCode,
  getApiErrorMessage,
  getFundingRequiredDetails,
} from "../../../features/wallet/walletUtils";

export function CountdownPill({ target }) {
  if (!target) return null;

  return (
    <div className="tw:flex tw:items-center tw:gap-2 tw:text-base tw:font-medium tw:border tw:border-white/30 tw:backdrop-blur">
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

function isUuid(value = "") {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value)
  );
}

function getTicketPromptStorageKey(eventIdentifier) {
  return `xilolo:event-ticket-prompt-seen:${eventIdentifier}`;
}

function EventDetailShimmer() {
  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-[radial-gradient(circle_at_top_left,#d9ebff_0%,#f6f9fc_34%,#eef4fb_72%,#f8fbff_100%)] tw:pb-12 tw:pt-20">
      <div className="tw:mx-auto tw:max-w-7xl tw:px-2 tw:md:px-6 tw:lg:px-8">
        <div className="tw:mb-4 tw:mt-10 tw:h-[64px] tw:animate-pulse tw:md:rounded-[28px] tw:md:border tw:md:border-white/70 tw:md:bg-white/55 tw:md:shadow-[0_24px_60px_rgba(148,163,184,0.15)] tw:md:backdrop-blur-2xl" />

        <div className="tw:overflow-hidden tw:md:rounded-[36px] tw:md:border tw:md:border-white/70 tw:md:bg-white/50 tw:md:shadow-[0_30px_90px_rgba(15,23,42,0.09)] tw:md:backdrop-blur-2xl">
          <div className="tw:grid tw:grid-cols-1 tw:gap-5 tw:p-0 tw:md:gap-8 tw:md:p-8 tw:xl:grid-cols-[1.25fr_0.75fr]">
            <div className="tw:space-y-6">
              <div className="tw:h-80 tw:animate-pulse tw:rounded-[28px] tw:bg-white/70 tw:md:h-[520px] tw:md:rounded-4xl" />

              <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:md:grid-cols-2 xl:tw:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="tw:h-[116px] tw:animate-pulse tw:rounded-[26px] tw:bg-white/70"
                  />
                ))}
              </div>

              <div className="tw:py-2 tw:md:rounded-[30px] tw:md:bg-white/70 tw:md:p-6">
                <div className="tw:h-4 tw:w-28 tw:animate-pulse tw:rounded-full tw:bg-slate-200" />
                <div className="tw:mt-5 tw:h-8 tw:w-3/4 tw:animate-pulse tw:rounded-full tw:bg-slate-200" />
                <div className="tw:mt-4 tw:space-y-3">
                  <div className="tw:h-4 tw:w-full tw:animate-pulse tw:rounded-full tw:bg-slate-200" />
                  <div className="tw:h-4 tw:w-full tw:animate-pulse tw:rounded-full tw:bg-slate-200" />
                  <div className="tw:h-4 tw:w-5/6 tw:animate-pulse tw:rounded-full tw:bg-slate-200" />
                </div>
              </div>
            </div>

            <div className="tw:space-y-6">
              <div className="tw:h-[360px] tw:animate-pulse tw:rounded-[28px] tw:bg-white/70 tw:md:rounded-[30px]" />
              <div className="tw:h-[280px] tw:animate-pulse tw:rounded-[28px] tw:bg-white/70 tw:md:rounded-[30px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ViewEvent() {
  const { eventId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const [event, setEvent] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [purchaseSuccessOpen, setPurchaseSuccessOpen] = useState(false);
  const [fundingRequiredOpen, setFundingRequiredOpen] = useState(false);
  const [fundWalletOpen, setFundWalletOpen] = useState(false);
  const [fundingRequiredDetails, setFundingRequiredDetails] = useState(null);
  const [modalAutoTrigger, setModalAutoTrigger] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();
  const shareFlow = useEventShareFlow();
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const purchaseTicketMutation = usePurchaseTicketWithWallet({
    onSuccess: () => {
      setEvent((previous) =>
        previous
          ? {
            ...previous,
            hasPaid: true,
          }
          : previous
      );
      setPurchaseSuccessOpen(true);
      setPurchaseModalOpen(false);
      setFundingRequiredOpen(false);
      dispatch(clearPendingPurchaseIntent());
      showSuccess("Ticket purchased successfully.");
    },
  });

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

        const data = res?.data?.data || res?.data || {};
        const ev =
          data?.currentEvent || data?.event || data?.data?.event || null;
        const recommendations =
          data?.recommendations ||
          data?.recommended?.data ||
          data?.recs ||
          data?.data?.recommendations ||
          [];

        setEvent(normalizeEventRecord(ev));
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
    const promptKey = getTicketPromptStorageKey(event?.id || eventId);
    const hasSeenPrompt =
      typeof window !== "undefined" &&
      window.localStorage.getItem(promptKey) === "1";

    if (!event?.hasPaid && hasPrice && !hasSeenPrompt) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(promptKey, "1");
      }
      setPurchaseModalOpen(true);
    }
  }, [event, eventId, modalAutoTrigger]);

  const closePurchaseModal = () => {
    setPurchaseModalOpen(false);
    setModalAutoTrigger(false);
  };

  const priceDisplay =
    event?.price_display ||
    `${event?.currency?.symbol || "₦"}${event?.price || "0"}`;

  const posterUrl = useMemo(() => event?.poster?.[0]?.url, [event]);

  const handleGetTicket = async () => {
    if (event?.is_sold_out || purchaseTicketMutation.isPending) return;

    if (!token) {
      showError("Please log in to purchase a ticket.");
      navigate("/auth/signin");
      return;
    }

    try {
      await purchaseTicketMutation.mutateAsync({
        event_id: event.id,
        quantity: 1,
      });
    } catch (paymentError) {
      const errorCode = getApiErrorCode(paymentError);
      const errorMessage = getApiErrorMessage(
        paymentError,
        "Failed to purchase ticket."
      );

      if (errorCode === "WALLET_FUNDING_REQUIRED") {
        const details = getFundingRequiredDetails(paymentError);
        setFundingRequiredDetails(details);
        setFundingRequiredOpen(true);
        setPurchaseModalOpen(false);
        dispatch(
          setPendingPurchaseIntent({
            eventId: event.id,
            eventTitle: event.title,
            quantity: 1,
            sourcePage: "event_detail",
            eventPath: location.pathname,
            deficitAmount: details?.deficit_amount || 0,
            requiredAmount: details?.required_amount || 0,
            walletBalance: details?.wallet_balance || 0,
          })
        );
        return;
      }

      if (errorCode === "EVENT_NOT_PURCHASABLE") {
        showError(errorMessage || "This event is not available for purchase.");
        return;
      }

      if (errorCode === "TICKET_SOLD_OUT") {
        setEvent((previous) =>
          previous
            ? {
              ...previous,
              is_sold_out: true,
            }
            : previous
        );
        showError(errorMessage || "This event is sold out.");
        return;
      }

      showError(errorMessage);
      console.error("Wallet purchase error:", paymentError);
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
      const res = await api.post(
        `/api/v1/follow/${event.hostId}`,
        null,
        authHeaders(token)
      );

      const isNowFollowing =
        res?.data?.data?.is_following ??
        res?.data?.is_following ??
        !isFollowing;

      setIsFollowing(isNowFollowing);
      showSuccess(
        isNowFollowing
          ? "You're now following this organizer."
          : "You've unfollowed this organizer."
      );
    } catch (followError) {
      console.error(followError);
      showError("Unable to update follow status. Please try again.");
    } finally {
      setFollowLoading(false);
    }
  };

  const isLiveNow = event?.status === "live";
  const isUpcoming = event?.status === "upcoming";
  const isPaused = event?.status === "paused";
  const isEnded = event?.status === "ended";
  const isSoldOut = !!event?.is_sold_out;
  const hasPaid = !!event?.hasPaid;

  let primaryCtaLabel;
  if (hasPaid && isLiveNow) {
    primaryCtaLabel = "Join Live Event";
  } else if (hasPaid && !isLiveNow) {
    primaryCtaLabel = "Ticket Purchased";
  } else if (isSoldOut) {
    primaryCtaLabel = "Sold Out";
  } else if (purchaseTicketMutation.isPending) {
    primaryCtaLabel = "Processing...";
  } else {
    primaryCtaLabel = "Buy Ticket";
  }

  const ctaDisabled =
    (!hasPaid && isSoldOut) ||
    (hasPaid && !isLiveNow) ||
    purchaseTicketMutation.isPending;

  const handleEnterLive = () => {
    if (hasPaid && isLiveNow) {
      setDownloadModalOpen(true);
    }
  };

  const handlePrimaryAction = () => {
    if (ctaDisabled) return;

    if (hasPaid && isLiveNow) {
      handleEnterLive();
      return;
    }

    handleGetTicket();
  };

  if (loading) {
    return <EventDetailShimmer />;
  }

  if (error) {
    return (
      <div className="tw:flex tw:h-[60vh] tw:w-full tw:items-center tw:justify-center tw:bg-[#FEF2F2]">
        <p className="tw:px-4 tw:text-center tw:text-sm tw:text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (!event) return null;

  const formattedDateTime = formatEventDateTime(
    event.eventDate,
    event.startTime
  );

  const startDate = eventStartDate(event);
  const formattedLocation =
    event.location ||
    event.address ||
    (event.eventType?.toLowerCase() === "virtual"
      ? "Online event"
      : "Location to be announced");

  const handleShareEvent = async () => {
    await shareFlow.startShare({ eventId: event?.id });
  };

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
            : "Discover event details, get tickets, and connect with attendees at Xilolo. Join the experience!"
        }
        keywords={`Xilolo, ${event?.title || "event"}, ${event?.eventType || "event"
          }, event tickets, ${event?.hostName || "event organizer"
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
              name: event.hostName || "Xilolo",
            },
            performer: {
              "@type": "PerformingGroup",
              name: event.hostName || "Event Host",
            },
          })}
        </script>
      </Helmet>

      <div className="tw:min-h-screen tw:w-full tw:bg-[radial-gradient(circle_at_top_left,#d9ebff_0%,#f6f9fc_34%,#eef4fb_72%,#f8fbff_100%)] tw:pb-32 tw:pt-20 tw:font-sans tw:text-slate-900 tw:md:pb-12">
        <div className="tw:mx-auto tw:max-w-7xl tw:px-2 tw:md:px-6 tw:lg:px-8">
          <div className="tw:mb-4 tw:mt-4 tw:sm:mt-10 tw:flex tw:items-center tw:justify-between tw:gap-3 tw:px-1 tw:py-2 tw:md:mb-6 tw:md:rounded-[28px] tw:md:border tw:md:border-white/70 tw:md:bg-white/55 tw:md:px-4 tw:md:py-3 tw:md:shadow-[0_24px_60px_rgba(148,163,184,0.15)] tw:md:backdrop-blur-2xl">
            <div className="tw:flex tw:min-w-0 tw:items-center tw:gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="tw:inline-flex tw:size-9 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:border tw:border-white/80 tw:bg-white/80 tw:text-slate-700 tw:shadow-sm hover:tw:bg-white tw:md:size-11"
                style={{ borderRadius: "9999px" }}
              >
                <ArrowLeft className="tw:h-3.5 tw:w-3.5 tw:md:h-4 tw:md:w-4" />
              </button>
              <div className="tw:min-w-0">
                <div className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.22em] tw:text-slate-500">
                  Event Detail
                </div>
                <div className="tw:truncate tw:text-base tw:font-semibold tw:text-slate-900 tw:md:text-lg">
                  {event.title}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleShareEvent}
              className="tw:inline-flex tw:size-9 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:border tw:border-white/80 tw:bg-white/80 tw:text-slate-700 tw:shadow-sm hover:tw:bg-white tw:md:size-11"
              aria-label="Share event"
              style={{ borderRadius: "9999px" }}
            >
              <Share2 className="tw:h-3.5 tw:w-3.5 tw:md:h-4 tw:md:w-4" />
            </button>
          </div>

          <section className="tw:relative tw:overflow-hidden tw:md:rounded-[36px] tw:md:border tw:md:border-white/70 tw:md:bg-white/50 tw:md:shadow-[0_30px_90px_rgba(15,23,42,0.09)] tw:md:backdrop-blur-2xl">
            <div className="tw:absolute tw:-left-20 tw:top-16 tw:hidden tw:h-56 tw:w-56 tw:rounded-full tw:bg-[#d7e8ff] tw:blur-3xl tw:md:block" />
            <div className="tw:absolute tw:right-0 tw:top-0 tw:hidden tw:h-64 tw:w-64 tw:rounded-full tw:bg-[#f3d9ff] tw:blur-3xl tw:md:block" />

            <div className="tw:relative tw:grid tw:grid-cols-1 tw:gap-5 tw:p-0 tw:md:gap-8 tw:md:p-8 tw:xl:grid-cols-[1.25fr_0.75fr]">
              <div className="tw:space-y-6">
                <div className="tw:relative tw:overflow-hidden tw:rounded-[28px] tw:bg-white/35 tw:md:rounded-4xl tw:md:border tw:md:border-white/70 tw:md:shadow-[0_20px_60px_rgba(15,23,42,0.08)] tw:md:backdrop-blur-xl">
                  <div className="tw:relative tw:h-80 tw:w-full tw:overflow-hidden tw:md:h-[520px]">
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={event.title}
                        className="tw:h-full tw:w-full tw:object-cover"
                      />
                    ) : (
                      <div className="tw:h-full tw:w-full tw:bg-[linear-gradient(135deg,#dbeafe_0%,#f8fafc_50%,#f3e8ff_100%)]" />
                    )}

                    <div className="tw:absolute tw:inset-0 tw:bg-[linear-gradient(180deg,rgba(15,23,42,0.02)_0%,rgba(15,23,42,0.08)_42%,rgba(15,23,42,0.62)_100%)] tw:md:bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.18)_35%,rgba(15,23,42,0.75)_100%)]" />

                    <div className="tw:absolute tw:left-4 tw:top-4 tw:flex tw:flex-wrap tw:gap-2">

                      <span className="tw:inline-flex tw:items-center tw:gap-1 tw:rounded-full tw:border tw:border-white/20 tw:bg-white/18 tw:px-3 tw:py-1.5 tw:text-[11px] tw:font-medium tw:text-white tw:backdrop-blur-xl">
                        <Ticket className="tw:h-3 tw:w-3" />
                        {event.eventType}
                      </span>
                      {event.genre && (
                        <span className="tw:rounded-full tw:border tw:border-white/20 tw:bg-white/18 tw:px-3 tw:py-1.5 tw:text-[11px] tw:font-medium tw:text-white tw:backdrop-blur-xl">
                          {event.genre}
                        </span>
                      )}
                    </div>

                    <div className="tw:absolute tw:right-4 tw:top-4 tw:flex tw:flex-col tw:items-end tw:gap-2">
                      {isSoldOut && !hasPaid && (
                        <span className="tw:rounded-full tw:bg-[#ef4444] tw:px-3 tw:py-1.5 tw:text-[11px] tw:font-medium tw:text-white tw:shadow-lg">
                          Sold out
                        </span>
                      )}
                      {hasPaid && (
                        <span className="tw:rounded-full tw:bg-emerald-500/90 tw:px-3 tw:py-1.5 tw:text-[11px] tw:font-medium tw:text-white tw:shadow-lg">
                          Ticket purchased
                        </span>
                      )}
                    </div>

                    <div className="tw:absolute tw:bottom-0 tw:left-0 tw:right-0 tw:p-2.5 tw:md:p-6">
                      <div className="tw:rounded-[24px] tw:border tw:border-white/12 tw:bg-white/10 tw:p-3 tw:text-white tw:shadow-[0_18px_40px_rgba(15,23,42,0.16)] tw:backdrop-blur-xl tw:md:rounded-[28px] tw:md:border-white/15 tw:md:bg-white/14 tw:md:p-6 tw:md:shadow-[0_20px_50px_rgba(15,23,42,0.18)] tw:md:backdrop-blur-2xl">
                        <div className="tw:flex tw:flex-col tw:gap-3 tw:md:gap-5">
                          <div className="tw:space-y-2 tw:md:space-y-3">
                            <div className="tw:hidden tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.24em] tw:text-white/72 tw:md:block">
                              Featured Experience
                            </div>
                            <span className="tw:block tw:max-w-3xl tw:text-[19px] tw:font-semibold tw:leading-tight tw:text-white tw:md:text-3xl">
                              {event.title}
                            </span>
                            <span className="tw:hidden tw:max-w-2xl tw:text-sm tw:leading-6 tw:text-white/84 tw:md:block tw:md:text-base">
                              {event.description ||
                                "No description available for this event yet."}
                            </span>
                          </div>

                          <div className="tw:grid tw:grid-cols-2 tw:gap-2.5 tw:md:grid-cols-3 tw:md:gap-3">
                            <div className="tw:rounded-[18px] tw:border tw:border-white/12 tw:bg-black/18 tw:p-3 tw:md:rounded-2xl tw:md:border-white/15 tw:md:p-3.5">
                              <div className="tw:text-[11px] tw:uppercase tw:tracking-[0.18em] tw:text-white/55">
                                Date & Time
                              </div>
                              <div className="tw:mt-1.5 tw:text-[13px] tw:font-medium tw:leading-5 tw:text-white tw:md:mt-2 tw:md:text-sm">
                                {formattedDateTime || formatMetaLine(event)}
                              </div>
                            </div>

                            <div className="tw:rounded-[18px] tw:border tw:border-white/12 tw:bg-black/18 tw:p-3 tw:md:rounded-2xl tw:md:border-white/15 tw:md:p-3.5">
                              <div className="tw:text-[11px] tw:uppercase tw:tracking-[0.18em] tw:text-white/55">
                                Ticket Price
                              </div>
                              <div className="tw:mt-1.5 tw:text-[13px] tw:font-medium tw:leading-5 tw:text-white tw:md:mt-2 tw:md:text-sm">
                                {priceDisplay}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tw:grid tw:grid-cols-1 tw:gap-3 tw:md:gap-4 tw:md:grid-cols-2 xl:tw:grid-cols-4">
                  <div className="tw:px-1 tw:py-2 tw:md:rounded-[26px] tw:md:border tw:md:border-white/75 tw:md:bg-white/65 tw:md:p-5 tw:md:shadow-[0_18px_50px_rgba(148,163,184,0.12)] tw:md:backdrop-blur-xl">
                    <div className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
                      Event Schedule
                    </div>
                    <div className="tw:mt-3 tw:text-sm tw:font-medium tw:text-slate-900">
                      {formatMetaLine(event)}
                    </div>
                  </div>

                  <div className="tw:px-1 tw:py-2 tw:md:rounded-[26px] tw:md:border tw:md:border-white/75 tw:md:bg-white/65 tw:md:p-5 tw:md:shadow-[0_18px_50px_rgba(148,163,184,0.12)] tw:md:backdrop-blur-xl">
                    <div className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
                      Access Window
                    </div>
                    <div className="tw:mt-3 tw:text-sm tw:font-medium tw:text-slate-900">
                      {event.status === "ended"
                        ? "Event has ended"
                        : hasPaid
                          ? isLiveNow
                            ? "Join now"
                            : "Ticket secured"
                          : "Tickets are available for purchase"}
                    </div>
                  </div>

                  <div className="tw:px-1 tw:py-2 tw:md:rounded-[26px] tw:md:border tw:md:border-white/75 tw:md:bg-white/65 tw:md:p-5 tw:md:shadow-[0_18px_50px_rgba(148,163,184,0.12)] tw:md:backdrop-blur-xl">
                    <div className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
                      Hosted By
                    </div>
                    <div className="tw:mt-3 tw:text-sm tw:font-medium tw:text-slate-900">
                      {event.hostName || "Event Organizer"}
                    </div>
                  </div>

                  <div className="tw:px-1 tw:py-2 tw:md:rounded-[26px] tw:md:border tw:md:border-white/75 tw:md:bg-white/65 tw:md:p-5 tw:md:shadow-[0_18px_50px_rgba(148,163,184,0.12)] tw:md:backdrop-blur-xl">
                    <div className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
                      Countdown
                    </div>
                    <div className="tw:mt-3">
                      {event.status !== "ended" ? (
                        <CountdownPill target={startDate} />
                      ) : (
                        <span className="tw:text-sm tw:font-medium tw:text-slate-900">
                          Closed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="tw:px-1 tw:py-2 tw:md:rounded-[30px] tw:md:border tw:md:border-white/75 tw:md:bg-white/68 tw:md:p-7 tw:md:shadow-[0_20px_60px_rgba(148,163,184,0.12)] tw:md:backdrop-blur-2xl">
                  <div className="tw:flex tw:flex-col tw:gap-6 tw:md:flex-row tw:md:items-start tw:md:justify-between">
                    <div className="tw:max-w-3xl">
                      <div className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
                        About This Event
                      </div>
                      <spam className="tw:block tw:mt-4 tw:text-sm tw:leading-7 tw:text-slate-600 tw:md:text-[15px]">
                        {event.description ||
                          "This event does not have a published description yet."}
                      </spam>
                    </div>

                    <div className="tw:w-full tw:max-w-sm tw:rounded-[22px] tw:bg-[linear-gradient(180deg,#fff7f7_0%,#fffdfd_100%)] tw:p-4 tw:md:rounded-3xl tw:md:border tw:md:border-[#fee2e2]">
                      <div className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-[#dc2626]">
                        <Flag className="tw:h-4 tw:w-4" />
                        Need to flag this event?
                      </div>
                      <span className="tw:block tw:mt-2 tw:text-sm tw:leading-6 tw:text-slate-600">
                        Report suspicious or inappropriate listings and our team will review them.
                      </span>
                      <button
                        style={{
                          borderRadius: 12
                        }}
                        type="button"
                        onClick={() => setReportOpen(true)}
                        className="tw:mt-4 tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-full tw:bg-white tw:px-3 tw:py-1.5 tw:text-xs tw:font-medium tw:text-[#dc2626] tw:shadow-sm hover:tw:bg-red-50 tw:md:gap-2 tw:md:px-4 tw:md:py-2 tw:md:text-sm"
                      >
                        Report this event
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="tw:flex tw:flex-col tw:gap-6">
                <div className="tw:px-1 tw:py-2 tw:md:sticky tw:md:top-28 tw:md:rounded-[30px] tw:md:border tw:md:border-white/75 tw:md:bg-white/70 tw:md:p-5 tw:md:shadow-[0_20px_60px_rgba(148,163,184,0.14)] tw:md:backdrop-blur-2xl">
                  <div className="tw:rounded-[24px] tw:bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] tw:p-4 tw:md:rounded-3xl tw:md:border tw:md:border-white/80 tw:md:p-5">
                    <div className="tw:flex tw:items-start tw:justify-between tw:gap-3">
                      <div>
                        <div className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
                          Ticket Access
                        </div>
                        <div className="tw:mt-3 tw:text-3xl tw:font-semibold tw:text-slate-900">
                          {priceDisplay}
                        </div>
                      </div>
                      <div className="tw:text-[11px] tw:font-medium">
                        <span className={`tw:px-3 tw:py-1 tw:rounded-full ${isEnded === "ended" ? "tw:bg-gray-500/20 tw:text-gray-700" : isLiveNow ? "tw:bg-red-500/20 tw:text-red-600" : isPaused ? "tw:bg-blue-300/30 tw:text-blue-800" : "tw:bg-amber-300/30 tw:text-amber-800"}`}>

                          {isLiveNow ? "Happening now" : event.status || "Upcoming"}
                        </span>
                      </div>
                    </div>

                    <div className="tw:mt-5 tw:space-y-3">
                      <div className="tw:flex tw:items-start tw:gap-3 tw:rounded-2xl tw:bg-[#f6f9ff] tw:px-4 tw:py-3">
                        <CalendarDays className="tw:mt-0.5 tw:h-4 tw:w-4 tw:text-primary" />
                        <div>
                          <div className="tw:text-xs tw:text-slate-500">When</div>
                          <div className="tw:text-sm tw:font-medium tw:text-slate-900">
                            {formattedDateTime || "Date not available"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {hasPaid && (
                      <div className="tw:mt-4 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-emerald-50 tw:px-3 tw:py-1.5 tw:text-[11px] tw:text-emerald-700">
                        <span className="tw:inline-block tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-emerald-500" />
                        <span>You already paid for this event</span>
                      </div>
                    )}

                    <button
                      style={{
                        borderRadius: 24
                      }}
                      type="button"
                      disabled={ctaDisabled}
                      onClick={handlePrimaryAction}
                      className={`tw:mt-5 tw:flex tw:h-10 tw:w-full tw:items-center tw:justify-center tw:rounded-2xl tw:px-4 tw:text-xs tw:font-semibold tw:transition tw:md:h-12 tw:md:px-5 tw:md:text-sm ${ctaDisabled
                        ? "tw:cursor-not-allowed tw:bg-slate-200 tw:text-slate-500"
                        : "tw:bg-primary tw:text-white hover:tw:bg-primarySecond"
                        }`}
                    >
                      {primaryCtaLabel}
                      {!ctaDisabled && !hasPaid && (
                        <span className="tw:ml-1 tw:text-[11px] tw:opacity-80 tw:md:text-xs">
                          ({priceText(event)})
                        </span>
                      )}
                    </button>

                    <p className="tw:mt-3 tw:text-xs tw:leading-6 tw:text-slate-500">
                      {hasPaid
                        ? isLiveNow
                          ? "You already have access. Tap the button above to join the live experience."
                          : "Your ticket is secured. We will notify you when the event starts."
                        : "Secure checkout and fast access to your purchased ticket."}
                    </p>
                  </div>

                  <div className="tw:mt-4 tw:rounded-[24px] tw:bg-white/70 tw:p-4 tw:md:mt-5 tw:md:rounded-3xl tw:md:border tw:md:border-white/80 tw:md:p-5 tw:md:shadow-[0_12px_30px_rgba(148,163,184,0.12)]">
                    <div className="tw:flex tw:items-start tw:gap-4">
                      <div className="tw:flex tw:h-14 tw:w-14 tw:shrink-0 tw:items-center tw:justify-center tw:overflow-hidden tw:rounded-full tw:bg-lightPurple">
                        {hostHasImage ? (
                          <img
                            src={event.hostImage}
                            alt={hostName}
                            className="tw:h-full tw:w-full tw:object-cover"
                          />
                        ) : (
                          <span className="tw:text-sm tw:font-semibold tw:text-primary">
                            {hostInitials}
                          </span>
                        )}
                      </div>

                      <div className="tw:min-w-0 tw:flex-1">
                        <div className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
                          Organizer
                        </div>
                        <div className="tw:mt-1 tw:flex tw:items-center tw:gap-2 tw:text-lg tw:font-semibold tw:text-slate-900">
                          <span className="tw:truncate">
                            {event.hostName || "Organizer"}
                          </span>
                          {event.hostHasActiveSubscription && (
                            <img
                              className="tw:h-4 tw:w-4"
                              src="/images/verifiedIcon.svg"
                              alt="Verified"
                            />
                          )}
                        </div>

                      </div>
                    </div>

                    <div className="tw:mt-4 tw:flex tw:flex-wrap tw:gap-2">

                      {isSaved && (
                        <div className="tw:inline-flex tw:items-center tw:rounded-full tw:bg-[#eef4ff] tw:px-3 tw:py-1.5 tw:text-[11px] tw:font-medium tw:text-[#3158c9]">
                          Saved
                        </div>
                      )}
                    </div>

                    <div className="tw:mt-5 tw:grid tw:grid-cols-2 tw:md:grid-cols-2 tw:gap-3">
                      <button
                        style={{
                          borderRadius: 24
                        }}
                        type="button"
                        onClick={handleToggleFollow}
                        disabled={followLoading || !event.hostId}
                        className={`tw:flex tw:h-10 tw:items-center tw:justify-center tw:rounded-2xl tw:border tw:px-3 tw:text-xs tw:font-medium tw:transition tw:md:h-11 tw:md:text-sm ${isFollowing
                          ? "tw:border-primary/25 tw:bg-white tw:text-primary"
                          : "tw:border-transparent tw:bg-[#f4f7fb] tw:text-slate-800 hover:tw:bg-[#ebf1f8]"
                          } ${followLoading ? "tw:cursor-not-allowed tw:opacity-70" : ""
                          }`}
                      >
                        {followLoading
                          ? "Updating..."
                          : isFollowing
                            ? "Following"
                            : "Follow Organizer"}
                      </button>

                      <Link
                        style={{
                          color: "white"
                        }}
                        to={
                          event.organiserId
                            ? `/profile/${event.organiserId}`
                            : "/organizers"
                        }
                        className="tw:flex tw:h-10 tw:items-center tw:justify-center tw:rounded-3xl tw:px-3 tw:bg-primary tw:text-xs tw:font-medium tw:text-white hover:tw:bg-primarySecond tw:md:h-11 tw:md:text-sm"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <div className="tw:mt-8">
            <YouMayAlsoLike recs={recs} posterFallback={posterUrl} />
          </div>
        </div>
      </div>

      <div className="tw:fixed tw:bottom-20 tw:left-0 tw:right-0 tw:z-40 tw:px-3 tw:md:hidden">
        <div className="tw:rounded-[28px] tw:border tw:border-white/80 tw:bg-white/88 tw:p-3 tw:shadow-[0_18px_45px_rgba(15,23,42,0.18)] tw:backdrop-blur-2xl">
          <div className="tw:flex tw:items-center tw:justify-between tw:gap-3">
            <div className="tw:min-w-0">
              <div className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.18em] tw:text-slate-500">
                Ticket Access
              </div>
              <div className="tw:truncate tw:text-lg tw:font-semibold tw:text-slate-900">
                {priceDisplay}
              </div>
            </div>

            <button
              style={{ borderRadius: 18 }}
              type="button"
              disabled={ctaDisabled}
              onClick={handlePrimaryAction}
              className={`tw:flex tw:h-10 tw:min-w-[138px] tw:shrink-0 tw:items-center tw:justify-center tw:px-3 tw:text-xs tw:font-semibold tw:transition ${ctaDisabled
                ? "tw:cursor-not-allowed tw:bg-slate-200 tw:text-slate-500"
                : "tw:bg-primary tw:text-white hover:tw:bg-primarySecond"
                }`}
            >
              {primaryCtaLabel}
            </button>
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
      <TicketPromptModal
        open={purchaseModalOpen}
        onClose={closePurchaseModal}
        event={event}
        onBuy={() => handleGetTicket()}
        buying={purchaseTicketMutation.isPending}
      />
      <WalletFundingRequiredModal
        open={fundingRequiredOpen}
        onClose={() => setFundingRequiredOpen(false)}
        details={fundingRequiredDetails}
        formatAmount={(amount) =>
          formatWalletMoney(amount, event?.currency?.code || "NGN")
        }
        onFundWallet={() => {
          setFundingRequiredOpen(false);
          setFundWalletOpen(true);
        }}
      />
      <FundWalletModal
        open={fundWalletOpen}
        onClose={() => setFundWalletOpen(false)}
        prefilledAmount={fundingRequiredDetails?.deficit_amount || ""}
        source="ticket_purchase"
      />
      <TicketPurchaseSuccessModal
        open={purchaseSuccessOpen}
        onClose={() => setPurchaseSuccessOpen(false)}
        eventTitle={event?.title}
      />
      <LiveAppDownloadModal
        open={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </>
  );
}
