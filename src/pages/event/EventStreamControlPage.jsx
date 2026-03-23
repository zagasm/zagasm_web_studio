import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Copy,
  LoaderCircle,
  MonitorPlay,
  PauseCircle,
  PlayCircle,
  Radio,
  Signal,
  Square,
  Video,
} from "lucide-react";
import SideBarNav from "../pageAssets/SideBarNav";
import { api, authHeaders } from "../../lib/apiClient";
import { useAuth } from "../auth/AuthContext";
import {
  showError,
  showPromise,
  showSuccess,
} from "../../component/ui/toast";
import StartStreamAppDownloadModal from "../../component/Events/StartStreamAppDownloadModal";
import { formatEventDateTime } from "../../utils/ui";

const cx = (...classes) => classes.filter(Boolean).join(" ");

function getErrorMessage(error, fallback = "Something went wrong.") {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

function getEventFromViewResponse(payload) {
  return (
    payload?.data?.currentEvent ||
    payload?.data?.event ||
    payload?.currentEvent ||
    payload?.event ||
    payload?.data ||
    null
  );
}

function getEventFromStreamResponse(payload) {
  return payload?.event || payload?.data?.event || payload?.data || null;
}

function mergeEventData(baseEvent, streamEvent) {
  if (!baseEvent && !streamEvent) return null;

  return {
    ...(baseEvent || {}),
    ...(streamEvent || {}),
    poster:
      streamEvent?.poster ||
      baseEvent?.poster ||
      [],
    stream: streamEvent?.stream || baseEvent?.stream || null,
    stream_status:
      streamEvent?.stream_status ||
      baseEvent?.stream_status ||
      null,
  };
}

function formatStartedAt(value) {
  if (!value) return "Not started yet";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function extractPoster(event) {
  return event?.poster?.find?.((item) => item?.type === "image")?.url || "";
}

function getStatusTone(status) {
  const value = String(status || "").toLowerCase();

  if (value === "live") return "tw:bg-red-50 tw:text-red-700 tw:border-red-200";
  if (value === "paused")
    return "tw:bg-amber-50 tw:text-amber-700 tw:border-amber-200";
  if (value === "ended")
    return "tw:bg-gray-100 tw:text-gray-700 tw:border-gray-200";

  return "tw:bg-emerald-50 tw:text-emerald-700 tw:border-emerald-200";
}

async function copyText(value, label) {
  if (!value) {
    showError(`No ${label.toLowerCase()} available yet.`);
    return;
  }

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    showSuccess(`${label} copied`);
  } catch {
    showError(`Could not copy ${label.toLowerCase()}.`);
  }
}

function DetailCard({ icon: Icon, label, value, helperText }) {
  return (
    <div className="tw:rounded-3xl tw:border tw:border-[#ece8ff] tw:bg-white tw:p-4 tw:shadow-sm">
      <div className="tw:flex tw:items-start tw:justify-between tw:gap-3">
        <div className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-700">
          <span className="tw:flex tw:h-10 tw:w-10 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-[#f6f1ff] tw:text-primary">
            <Icon className="tw:h-4 tw:w-4" />
          </span>
          <span>{label}</span>
        </div>

        <button
          type="button"
          onClick={() => copyText(value, label)}
          className="tw:inline-flex tw:h-10 tw:w-10 tw:items-center tw:justify-center tw:rounded-2xl tw:border tw:border-[#ece8ff] tw:text-primary hover:tw:bg-[#faf7ff]"
          aria-label={`Copy ${label}`}
        >
          <Copy className="tw:h-4 tw:w-4" />
        </button>
      </div>

      <div className="tw:mt-4 tw:break-all tw:text-sm tw:font-semibold tw:text-gray-900">
        {value || "Will appear after you start the stream."}
      </div>

      {helperText ? (
        <div className="tw:mt-2 tw:text-xs tw:text-gray-500">{helperText}</div>
      ) : null}
    </div>
  );
}

function StepItem({ index, title, description }) {
  return (
    <div className="tw:flex tw:gap-4">
      <div className="tw:flex tw:h-9 tw:w-9 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:bg-primary tw:text-sm tw:font-semibold tw:text-white">
        {index}
      </div>

      <div>
        <div className="tw:text-lg tw:font-semibold tw:text-gray-900">
          {title}
        </div>
        <div className="tw:mt-1 tw:text-sm tw:leading-6 tw:text-gray-600">
          {description}
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  loading,
  disabled,
  className,
  icon: Icon,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cx(
        "tw:inline-flex tw:w-full tw:items-center tw:justify-center tw:gap-2 tw:rounded-2xl tw:px-4 tw:py-3 tw:text-sm tw:font-semibold tw:transition disabled:tw:cursor-not-allowed disabled:tw:opacity-60",
        className,
      )}
    >
      {loading ? (
        <LoaderCircle className="tw:h-4 tw:w-4 tw:animate-spin" />
      ) : Icon ? (
        <Icon className="tw:h-4 tw:w-4" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export default function EventStreamControlPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState("");
  const [watchModalOpen, setWatchModalOpen] = useState(false);

  const loadEventDetails = useCallback(
    async ({ background = false } = {}) => {
      if (!eventId) return;

      if (background) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const [viewResult, streamResult] = await Promise.allSettled([
          api.get(`/api/v1/events/${eventId}/view`, authHeaders(token)),
          api.get(`/api/v1/events/${eventId}/streams`, authHeaders(token)),
        ]);

        const viewPayload =
          viewResult.status === "fulfilled" ? viewResult.value?.data : null;
        const streamPayload =
          streamResult.status === "fulfilled" ? streamResult.value?.data : null;

        const merged = mergeEventData(
          getEventFromViewResponse(viewPayload),
          getEventFromStreamResponse(streamPayload),
        );

        if (!merged) {
          throw new Error("Could not load stream details for this event.");
        }

        setEventData(merged);
      } catch (err) {
        setError(getErrorMessage(err, "Could not load this stream page."));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [eventId, token],
  );

  useEffect(() => {
    loadEventDetails();
  }, [loadEventDetails]);

  const stream = eventData?.stream || {};
  const streamingApi = stream?.streaming_api || {};

  const status = String(eventData?.status || "upcoming").toLowerCase();
  const isLive = status === "live";
  const isPaused = status === "paused" || !!stream?.is_paused;
  const isEnded = status === "ended";
  const hasStartedStream = Boolean(
    stream?.id ||
      stream?.stream_key ||
      streamingApi?.streamKey ||
      stream?.rtmp_url ||
      streamingApi?.rtmp_server,
  );

  const rtmpServer =
    streamingApi?.rtmp_server ||
    (stream?.rtmp_url ? stream.rtmp_url.replace(/\/[^/]+$/, "") : "");
  const rtmpKey =
    streamingApi?.rtmp_key ||
    streamingApi?.streamKey ||
    stream?.stream_key ||
    "";
  const rtmpUrl =
    stream?.rtmp_url ||
    [rtmpServer, rtmpKey].filter(Boolean).join("/");
  const srtServer = streamingApi?.srt_server || "";
  const srtKey = streamingApi?.srt_key || stream?.stream_key || "";
  const playbackUrl =
    stream?.playback_variants?.llhls ||
    stream?.playback_variants?.hls ||
    stream?.playback_url ||
    streamingApi?.playback_url ||
    "";
  const webrtcUrl = stream?.playback_variants?.webrtc || "";

  const quickStartCards = useMemo(
    () => [
      {
        label: "RTMP Server",
        value: rtmpServer,
        helperText: "Set OBS service to Custom and paste this into Server.",
        icon: Radio,
      },
      {
        label: "Stream Key",
        value: rtmpKey,
        helperText: "Paste this into the OBS Stream Key field.",
        icon: Video,
      },
      {
        label: "RTMP URL",
        value: rtmpUrl,
        helperText: "Full publish URL if you need the combined RTMP target.",
        icon: Signal,
      },
      {
        label: "SRT Server",
        value: srtServer,
        helperText: "Use this if you prefer SRT instead of RTMP.",
        icon: MonitorPlay,
      },
      {
        label: "SRT Key",
        value: srtKey,
        helperText: "Use the same stream key when your encoder asks for it.",
        icon: Copy,
      },
      {
        label: "Playback URL",
        value: playbackUrl,
        helperText: "Share this internally for testing or playback checks.",
        icon: PlayCircle,
      },
      ...(webrtcUrl
        ? [
            {
              label: "WebRTC URL",
              value: webrtcUrl,
              helperText: "Low-latency playback endpoint returned by the API.",
              icon: CheckCircle2,
            },
          ]
        : []),
    ],
    [playbackUrl, rtmpKey, rtmpServer, rtmpUrl, srtKey, srtServer, webrtcUrl],
  );

  const instructionSteps = useMemo(
    () => [
      {
        title: "Open OBS Studio",
        description:
          "Launch OBS Studio on your computer and select the scene you want to stream.",
      },
      {
        title: "Add your video and audio sources",
        description:
          'In the "Sources" panel, click the "+" button to add your camera, screen capture, or media sources, and confirm audio inputs are present in the mixer.',
      },
      {
        title: "Open OBS settings",
        description:
          'Click "Settings" in the bottom-right corner of OBS, then choose the "Stream" tab.',
      },
      {
        title: "Configure the stream target",
        description: rtmpServer && rtmpKey
          ? `In the "Stream" tab, set "Service" to "Custom". In the "Server" field, paste ${rtmpServer}. In the "Stream Key" field, paste ${rtmpKey}.`
          : 'Start the stream first so we can generate the RTMP server and stream key you need for OBS.',
      },
      {
        title: "Apply and close settings",
        description:
          'Click "Apply", then "OK" to save your stream configuration.',
      },
      {
        title: "Check output settings",
        description:
          'In "Settings" → "Output", set a video bitrate between 3500 and 6000 Kbps for 1080p, keep keyframe interval at 2 seconds, and use a hardware encoder when available.',
      },
      {
        title: "Start streaming from OBS",
        description:
          'Click "Start Streaming" in OBS. Once your encoder is connected and ready, return here and press "Go Live" so viewers can access the event.',
      },
    ],
    [rtmpKey, rtmpServer],
  );

  const runAction = async ({
    key,
    request,
    loadingText,
    successText,
  }) => {
    setPendingAction(key);

    try {
      await showPromise(request(), {
        loading: loadingText,
        success: successText,
        error: (err) => getErrorMessage(err),
      });

      await loadEventDetails({ background: true });
    } finally {
      setPendingAction("");
    }
  };

  const handleStart = () =>
    runAction({
      key: "start",
      request: () =>
        api.post(`/api/v1/events/${eventId}/streams/start`, {}, authHeaders(token)),
      loadingText: "Generating stream credentials…",
      successText: "Stream details ready. Configure OBS, then go live.",
    });

  const handleGoLive = () =>
    runAction({
      key: "go-live",
      request: () =>
        api.post(
          `/api/v1/events/${eventId}/streams/go-live`,
          {},
          authHeaders(token),
        ),
      loadingText: "Taking event live…",
      successText: "Event is now live.",
    });

  const handleTogglePause = () =>
    runAction({
      key: "pause",
      request: () =>
        api.post(
          `/api/v1/events/${eventId}/streams/toggle-pause`,
          {},
          authHeaders(token),
        ),
      loadingText: isPaused ? "Resuming event…" : "Pausing event…",
      successText: isPaused ? "Event resumed." : "Event paused.",
    });

  const handleEnd = async () => {
    const confirmed = window.confirm(
      "End this stream? Viewers will no longer be able to watch it live.",
    );

    if (!confirmed) return;

    await runAction({
      key: "end",
      request: () =>
        api.post(`/api/v1/events/${eventId}/streams/end`, {}, authHeaders(token)),
      loadingText: "Ending stream…",
      successText: "Stream ended.",
    });
  };

  if (loading) {
    return (
      <div className="row tw:px-3 tw:py-6 tw:md:px-6">
        <div className="col-md-1 col-lg-2 col-xl-2 tw:hidden tw:lg:block">
          <SideBarNav />
        </div>

        <div className="col-md-12 col-lg-10 col-xl-10 tw:lg:ml-30 tw:py-24">
          <div className="tw:animate-pulse tw:space-y-4">
            <div className="tw:h-10 tw:w-64 tw:rounded-2xl tw:bg-gray-200" />
            <div className="tw:h-56 tw:rounded-[32px] tw:bg-gray-200" />
            <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:lg:grid-cols-2">
              <div className="tw:h-64 tw:rounded-[32px] tw:bg-gray-200" />
              <div className="tw:h-64 tw:rounded-[32px] tw:bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="row tw:px-3 tw:py-6 tw:md:px-6">
        <div className="col-md-1 col-lg-2 col-xl-2 tw:hidden tw:lg:block">
          <SideBarNav />
        </div>

        <div className="col-md-12 col-lg-10 col-xl-10 tw:lg:ml-30 tw:py-24">
          <div className="tw:rounded-[32px] tw:border tw:border-red-100 tw:bg-red-50 tw:p-6 tw:text-red-700">
            <div className="tw:text-lg tw:font-semibold">
              Could not load stream details
            </div>
            <div className="tw:mt-2 tw:text-sm">{error}</div>
            <div className="tw:mt-4">
              <button
                type="button"
                onClick={() => loadEventDetails()}
                className="tw:rounded-2xl tw:bg-primary tw:px-4 tw:py-3 tw:text-sm tw:font-semibold tw:text-white"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const posterUrl = extractPoster(eventData);
  const formattedDate = formatEventDateTime(
    eventData?.eventDateISO || eventData?.date || eventData?.eventDate,
    eventData?.startTime || eventData?.time || "",
  );
  const canGoLive = hasStartedStream && !isLive && !isEnded && !isPaused;
  const canPause = hasStartedStream && (isLive || isPaused) && !isEnded;
  const canEnd = hasStartedStream && !isEnded;
  const canWatch = Boolean(playbackUrl) && (isLive || isPaused);

  return (
    <>
      <div className="tw:px-3 tw:py-4 tw:md:px-6">
        {/* <div className="col-md-1 col-lg-2 col-xl-2 tw:hidden tw:lg:block">
          <SideBarNav />
        </div> */}

        <div className="col-md-12 col-lg-10 col-xl-10 tw:lg:ml-30 tw:py-24">
          <div className="tw:mx-auto tw:max-w-[1240px] tw:space-y-6">
            <div className="tw:flex tw:flex-col tw:gap-4 tw:lg:flex-row tw:lg:items-center tw:lg:justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-500 hover:tw:text-gray-900"
                >
                  <ArrowLeft className="tw:h-4 tw:w-4" />
                  <span>Back</span>
                </button>

                <h1 className="tw:mt-3 tw:text-2xl tw:font-bold tw:text-gray-900 tw:md:text-3xl">
                  Stream Event
                </h1>
                <p className="tw:mt-2 tw:max-w-2xl tw:text-sm tw:text-gray-600 tw:md:text-base">
                  Generate your stream details, configure OBS, then switch the event live when you are ready for viewers.
                </p>
              </div>

              <div className="tw:flex tw:items-center tw:gap-3 tw:self-start tw:lg:self-auto">
                <span
                  className={cx(
                    "tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:border tw:px-4 tw:py-2 tw:text-sm tw:font-semibold",
                    getStatusTone(status),
                  )}
                >
                  <span className="tw:h-2.5 tw:w-2.5 tw:rounded-full tw:bg-current" />
                  {status === "paused" ? "Paused" : status === "live" ? "Live" : status === "ended" ? "Ended" : "Upcoming"}
                </span>

                {refreshing ? (
                  <span className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:text-gray-500">
                    <LoaderCircle className="tw:h-4 tw:w-4 tw:animate-spin" />
                    Refreshing
                  </span>
                ) : null}
              </div>
            </div>

            <div className="tw:grid tw:grid-cols-1 tw:gap-6 tw:xl:grid-cols-[1.25fr_0.85fr]">
              <section className="tw:overflow-hidden tw:rounded-[32px] tw:border tw:border-[#ede7ff] tw:bg-white tw:shadow-sm">
                <div className="tw:grid tw:grid-cols-1 tw:lg:grid-cols-[280px_1fr]">
                  <div className="tw:h-56 tw:bg-[#f5f0ff] tw:lg:h-full">
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={eventData?.title || "Event poster"}
                        className="tw:h-full tw:w-full tw:object-cover"
                      />
                    ) : (
                      <div className="tw:flex tw:h-full tw:w-full tw:items-center tw:justify-center tw:text-primary">
                        <Video className="tw:h-10 tw:w-10" />
                      </div>
                    )}
                  </div>

                  <div className="tw:p-5 tw:md:p-6">
                    <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
                      <span className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-[#f5f1ff] tw:px-3 tw:py-1 tw:text-xs tw:font-semibold tw:text-primary">
                        <Radio className="tw:h-3.5 tw:w-3.5" />
                        Event Stream Control
                      </span>
                    </div>

                    <h2 className="tw:mt-4 tw:text-2xl tw:font-bold tw:text-gray-900">
                      {eventData?.title || "Untitled event"}
                    </h2>

                    <div className="tw:mt-4 tw:flex tw:flex-wrap tw:items-center tw:gap-4 tw:text-sm tw:text-gray-600">
                      <span className="tw:inline-flex tw:items-center tw:gap-2">
                        <CalendarDays className="tw:h-4 tw:w-4 tw:text-primary" />
                        {formattedDate || "Date not available"}
                      </span>
                      <span className="tw:inline-flex tw:items-center tw:gap-2">
                        <Signal className="tw:h-4 tw:w-4 tw:text-primary" />
                        Stream started: {formatStartedAt(stream?.started_at)}
                      </span>
                    </div>

                    {eventData?.description ? (
                      <p className="tw:mt-4 tw:max-w-3xl tw:text-sm tw:leading-7 tw:text-gray-600">
                        {eventData.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </section>

              <aside className="tw:rounded-[32px] tw:border tw:border-[#ede7ff] tw:bg-white tw:p-5 tw:shadow-sm tw:md:p-6">
                <div className="tw:flex tw:items-center tw:justify-between tw:gap-3">
                  <div>
                    <div className="tw:text-lg tw:font-semibold tw:text-gray-900">
                      Stream actions
                    </div>
                    <div className="tw:mt-1 tw:text-sm tw:text-gray-500">
                      Start the stream, switch live, pause, resume, or end it from here.
                    </div>
                  </div>
                </div>

                <div className="tw:mt-5 tw:grid tw:grid-cols-1 tw:gap-3">
                  {!hasStartedStream ? (
                    <ActionButton
                      onClick={handleStart}
                      loading={pendingAction === "start"}
                      className="tw:bg-primary tw:text-white hover:tw:bg-primary/90"
                      icon={Radio}
                    >
                      Start stream
                    </ActionButton>
                  ) : null}

                  {canGoLive ? (
                    <ActionButton
                      onClick={handleGoLive}
                      loading={pendingAction === "go-live"}
                      className="tw:bg-red-500 tw:text-white hover:tw:bg-red-600"
                      icon={PlayCircle}
                    >
                      Go live
                    </ActionButton>
                  ) : null}

                  {canPause ? (
                    <ActionButton
                      onClick={handleTogglePause}
                      loading={pendingAction === "pause"}
                      className="tw:bg-[#f7f3ff] tw:text-primary hover:tw:bg-[#efe6ff]"
                      icon={PauseCircle}
                    >
                      {isPaused ? "Resume event" : "Pause event"}
                    </ActionButton>
                  ) : null}

                  {canEnd ? (
                    <ActionButton
                      onClick={handleEnd}
                      loading={pendingAction === "end"}
                      className="tw:bg-gray-900 tw:text-white hover:tw:bg-black"
                      icon={Square}
                    >
                      End stream
                    </ActionButton>
                  ) : null}

                  {canWatch ? (
                    <ActionButton
                      onClick={() => setWatchModalOpen(true)}
                      className="tw:bg-[#fff4f2] tw:text-[#d93a23] hover:tw:bg-[#ffe9e4]"
                      icon={MonitorPlay}
                    >
                      Watch live
                    </ActionButton>
                  ) : null}
                </div>

                <div className="tw:mt-5 tw:rounded-3xl tw:bg-[#faf7ff] tw:p-4">
                  <div className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-gray-900">
                    <CheckCircle2 className="tw:h-4 tw:w-4 tw:text-primary" />
                    What to do next
                  </div>

                  <div className="tw:mt-3 tw:text-sm tw:leading-7 tw:text-gray-600">
                    {!hasStartedStream
                      ? "Generate your RTMP and SRT details first. We will show the full server URLs and stream keys here."
                      : isEnded
                        ? "This stream has ended. You can return to the event page or create another live session for a future event."
                        : isLive
                          ? "Your event is live. You can pause it temporarily, copy playback details, or end it when the broadcast is over."
                          : isPaused
                            ? "The event is currently paused. Resume it when you are ready for viewers to continue watching."
                            : "OBS details are ready. Start encoding from OBS, then press Go Live here when the feed is stable."}
                  </div>
                </div>
              </aside>
            </div>

            <section className="tw:rounded-[32px] tw:border tw:border-[#ede7ff] tw:bg-white tw:p-5 tw:shadow-sm tw:md:p-6">
              <div className="tw:flex tw:flex-col tw:gap-2 tw:md:flex-row tw:md:items-end tw:md:justify-between">
                <div>
                  <h3 className="tw:text-xl tw:font-semibold tw:text-gray-900">
                    Quick start
                  </h3>
                  <p className="tw:mt-1 tw:text-sm tw:text-gray-600">
                    Copy the stream target details directly into OBS or another encoder.
                  </p>
                </div>
              </div>

              <div className="tw:mt-6 tw:grid tw:grid-cols-1 tw:gap-4 tw:md:grid-cols-2 tw:xl:grid-cols-3">
                {quickStartCards.map((item) => (
                  <DetailCard
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    value={item.value}
                    helperText={item.helperText}
                  />
                ))}
              </div>
            </section>

            <section className="tw:rounded-[32px] tw:border tw:border-[#ede7ff] tw:bg-white tw:p-5 tw:shadow-sm tw:md:p-6">
              <div className="tw:flex tw:flex-col tw:gap-3 tw:md:flex-row tw:md:items-center tw:md:justify-between">
                <div>
                  <h3 className="tw:text-xl tw:font-semibold tw:text-gray-900">
                    How to stream this event using OBS Studio
                  </h3>
                  <p className="tw:mt-1 tw:text-sm tw:text-gray-600">
                    Use these steps to connect OBS to Zagasm Studios before you press Go Live.
                  </p>
                </div>

                <div className="tw:flex tw:flex-wrap tw:gap-2">
                  <span className="tw:rounded-full tw:border tw:border-[#ece8ff] tw:px-4 tw:py-2 tw:text-sm tw:text-gray-700">
                    OBS Studio
                  </span>
                  <span className="tw:rounded-full tw:border tw:border-[#ece8ff] tw:px-4 tw:py-2 tw:text-sm tw:text-gray-700">
                    Recommended: OBS Studio 28+
                  </span>
                </div>
              </div>

              <div className="tw:mt-8 tw:space-y-6">
                {instructionSteps.map((step, index) => (
                  <StepItem
                    key={step.title}
                    index={index + 1}
                    title={step.title}
                    description={step.description}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <StartStreamAppDownloadModal
        open={watchModalOpen}
        onClose={() => setWatchModalOpen(false)}
        title="Watch this event live on mobile"
        description="Watching live is currently available in the Zagasm Studios mobile app. Download the app to continue."
        dismissLabel="Maybe later"
      />
    </>
  );
}
