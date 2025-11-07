import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { api, authHeaders } from "../../lib/apiClient";
import { useAuth } from "../../pages/auth/AuthContext";
import { showSuccess, showError, showPromise } from "../../component/ui/toast";
import {
  Info,
  UserPlus,
  Heart,
  Share2,
  TriangleAlert,
  X,
  ChevronRight,
  Link as LinkIcon,
} from "lucide-react";

const REASONS = [
  "Spam",
  "Inappropriate content",
  "Scam or fraud",
  "Harassment or bullying",
  "Hate speech",
  "Misinformation",
  "Impersonation",
  "Violence or dangerous acts",
  "Illegal activity",
  "Other",
];

// co = "/images/avatar-fallback.png";

/** map backend channel keys -> your local public icons */
const CHANNEL_ICON = {
  whatsapp: "/images/icons/whatsapp.png",
  facebook: "/images/icons/facebook.png",
  x: "/images/icons/x.png",
  linkedIn: "/images/icons/linkedin.png",
  telegram: "/images/icons/telegram.png",
  copy_link: null, // we'll render an inline icon for this
};

export default function EventActionsSheet({ open, onClose, event = {} }) {
  const { token: ctxToken } = useAuth();
  const token =
    ctxToken ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    "";

  const navigate = useNavigate();

  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(!!event?.is_saved);
  const [followed, setFollowed] = useState(!!event?.is_following_organizer);

  React.useEffect(() => {
    setSaved(!!event?.is_saved);
  }, [event?.id, event?.is_saved, open]);

  React.useEffect(() => {
    setFollowed(!!event?.is_following_organizer);
  }, [event?.id, event?.is_following_organizer, open]);

  const [shareState, setShareState] = useState({
    loading: false,
    channels: null,
    error: null,
  });

  const [reporting, setReporting] = useState(false);
  const [selectedReason, setSelectedReason] = useState("Spam");

  const hostId = event?.hostId;
  const hostName = event?.hostName || "Organizer";
  const hostImage = event?.hostImage;

  async function onFollow() {
    if (!hostId) return;
    setBusy(true);
    try {
      await showPromise(
        api.post(`/api/v1/follow/${hostId}`, {}, authHeaders(token)),
        {
          loading: followed ? "Unfollowing…" : "Following…",
          success: followed ? "Unfollowed" : "Followed",
          error: "Could not follow/unfollow",
        }
      );
      setFollowed((f) => !f);
    } finally {
      setBusy(false);
    }
  }

  async function onToggleSave() {
    if (!event?.id) return;
    setBusy(true);
    try {
      await showPromise(
        api.post(`/api/v1/events/${event.id}/toggle`, {}, authHeaders(token)),
        {
          loading: saved ? "Unsaving…" : "Saving…",
          success: saved ? "Event removed from saved" : "Event saved",
          error: "Could not toggle save",
        }
      );
      setSaved((s) => !s);
    } finally {
      setBusy(false);
    }
  }

  async function onShare() {
    if (!event?.id) return;
    setShareState({ loading: true, channels: null, error: null });
    try {
      const { data } = await api.get(
        `/api/v1/event/share/${event.id}`,
        authHeaders(token)
      );
      setShareState({
        loading: false,
        channels: data?.channels || [],
        error: null,
      });
    } catch (e) {
      console.error(e);
      setShareState({
        loading: false,
        channels: null,
        error: "Failed to load share channels.",
      });
      showError("Failed to load share channels.");
    }
  }

  function openShareLink(ch) {
    try {
      const origin = window?.location?.origin || "";
      const fullLink =
        ch?.type === "internal" ? `${origin}${ch?.link || ""}` : ch?.link;

      if (ch?.key === "copy_link") {
        navigator.clipboard.writeText(fullLink);
        showSuccess("Link copied!");
      } else {
        window.open(fullLink, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      console.error(e);
      showError("Could not open share link.");
    }
  }

  async function onReport() {
    if (!event?.id) return;
    setBusy(true);
    try {
      await showPromise(
        api.post(
          `/api/v1/report/register`,
          {},
          {
            ...authHeaders(token),
            params: {
              reportable_type: "event",
              reportable_id: event.id,
              reason: selectedReason,
            },
          }
        ),
        {
          loading: "Submitting report…",
          success: "Thanks, your report was submitted.",
          error: "Could not submit report.",
        }
      );
      setReporting(false);
      onClose();
    } finally {
      setBusy(false);
    }
  }

  function resetShare() {
    setShareState({ loading: false, channels: null, error: null });
  }

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog
        as="div"
        className="tw:relative tw:z-50"
        onClose={() => !busy && onClose()}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="tw:transition tw:duration-200"
          enterFrom="tw:opacity-0"
          enterTo="tw:opacity-100"
          leave="tw:transition tw:duration-150"
          leaveFrom="tw:opacity-100"
          leaveTo="tw:opacity-0"
        >
          <div className="tw:fixed tw:inset-0 tw:bg-black/40" />
        </Transition.Child>

        {/* Centered modal */}
        <div className="tw:fixed tw:inset-0 tw:overflow-y-auto">
          <div className="tw:flex tw:min-h-full tw:items-end tw:md:items-center tw:justify-center tw:p-0 tw:pb-20 tw:md:pb-0 tw:md:p-4">
            <Transition.Child
              as={Fragment}
              enter="tw:transition tw:duration-200 tw:ease-out"
              enterFrom="tw:opacity-0 tw:translate-y-[20%] md:tw:translate-y-0 md:tw:scale-95"
              enterTo="tw:opacity-100 tw:translate-y-0 md:tw:scale-100"
              leave="tw:transition tw:duration-150 tw:ease-in"
              leaveFrom="tw:opacity-100 tw:translate-y-0 md:tw:scale-100"
              leaveTo="tw:opacity-0 tw:translate-y-[20%] md:tw:translate-y-0 md:tw:scale-95"
            >
              <Dialog.Panel
                className="tw:w-full tw:max-w-md tw:bg-white tw:shadow-xl tw:p-4 tw:pb-[max(env(safe-area-inset-bottom),1rem)] 
            tw:rounded-t-2xl tw:rounded-b-none tw:md:rounded-2xl"
              >
                <button
                  className="tw:absolute tw:right-4 tw:top-3 tw:p-2 tw:rounded-full hover:tw:bg-gray-100"
                  onClick={() => !busy && onClose()}
                  aria-label="Close"
                >
                  <X className="tw:size-5" />
                </button>

                {/* Header */}
                <div className="tw:flex tw:items-center tw:justify-between tw:my-4">
                  <div className="tw:flex tw:items-center tw:gap-3">
                    {hostImage !== null ? (
                      <img
                        src={hostImage}
                        alt={hostName}
                        className="tw:size-10 tw:rounded-full tw:object-cover tw:ring-2 tw:ring-white"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="tw:size-10 tw:text-primary"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}

                    <div>
                      <span className="tw:text-base tw:font-medium tw:first-letter:uppercase">{hostName}</span>
                    </div>
                  </div>
                  <button
                    className="tw:text-primary tw:text-sm tw:underline hover:tw:no-underline"
                    onClick={() => {
                      if (hostId) navigate(`/profile/${hostId}`);
                      onClose();
                    }}
                  >
                    View Profile
                  </button>
                </div>

                {/* Main list */}
                {!shareState.channels && !reporting && (
                  <ul className="tw:divide-y tw:divide-gray-100">
                    <li>
                      <button
                        className="tw:flex tw:w-full tw:items-center tw:gap-3 tw:py-3"
                        onClick={() => {
                          navigate(`/event/view/${event?.id}`);
                          onClose();
                        }}
                      >
                        <span className="tw:shrink-0">
                          <Info className="tw:size-5" />
                        </span>
                        <span className="tw:flex-1 tw:text-left">
                          View Event Detail
                        </span>
                        <ChevronRight className="tw:size-4" />
                      </button>
                    </li>

                    <li>
                      <button
                        disabled={!hostId || busy}
                        className="tw:flex tw:w-full tw:items-center tw:gap-3 tw:py-3 disabled:tw:opacity-60"
                        onClick={onFollow}
                      >
                        <span className="tw:shrink-0">
                          <UserPlus className="tw:size-5" />
                        </span>
                        <span className="tw:flex-1 tw:text-left">
                          {followed ? "Unfollow Organizer" : "Follow Organizer"}
                        </span>
                        <ChevronRight className="tw:size-4" />
                      </button>
                    </li>

                    <li>
                      <button
                        disabled={busy}
                        className="tw:flex tw:w-full tw:items-center tw:gap-3 tw:py-3 disabled:tw:opacity-60"
                        onClick={onToggleSave}
                      >
                        <span className="tw:shrink-0">
                          <Heart
                            className={`tw:size-5 ${
                              saved ? "tw:fill-current" : ""
                            }`}
                          />
                        </span>
                        <span className="tw:flex-1 tw:text-left">
                          {saved ? "Unsave Event" : "Save Event"}
                        </span>
                        <ChevronRight className="tw:size-4" />
                      </button>
                    </li>

                    <li>
                      <button
                        disabled={shareState.loading}
                        className="tw:flex tw:w-full tw:items-center tw:gap-3 tw:py-3 disabled:tw:opacity-60"
                        onClick={onShare}
                      >
                        <span className="tw:shrink-0">
                          <Share2 className="tw:size-5" />
                        </span>
                        <span className="tw:flex-1 tw:text-left">
                          {shareState.loading ? "Loading…" : "Share Event"}
                        </span>
                        <ChevronRight className="tw:size-4" />
                      </button>
                    </li>

                    <li>
                      <button
                        className="tw:flex tw:w-full tw:items-center tw:gap-3 tw:py-3"
                        onClick={() => setReporting(true)}
                      >
                        <span className="tw:shrink-0">
                          <TriangleAlert className="tw:size-5 tw:text-red-500" />
                        </span>
                        <span className="tw:flex-1 tw:text-left tw:text-red-600">
                          Report Event
                        </span>
                        <ChevronRight className="tw:size-4 tw:text-red-500" />
                      </button>
                    </li>
                  </ul>
                )}

                {/* Share view (uses local icons) */}
                {shareState.channels && (
                  <div className="tw:mt-1">
                    <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
                      <p className="tw:text-sm tw:text-gray-600">Share via</p>
                      <button
                        className="tw:text-sm tw:text-gray-500 tw:underline"
                        onClick={resetShare}
                      >
                        Back
                      </button>
                    </div>
                    <div className="tw:grid tw:grid-cols-3 tw:gap-3">
                      {shareState.channels.map((ch) => {
                        const iconSrc = CHANNEL_ICON[ch.key];
                        return (
                          <button
                            key={ch.key}
                            className="tw:flex tw:flex-col tw:items-center tw:gap-2 tw:p-3 tw:border tw:border-gray-100 tw:rounded-xl hover:tw:bg-gray-50"
                            onClick={() => openShareLink(ch)}
                          >
                            {iconSrc ? (
                              <img
                                src={iconSrc}
                                alt={ch.name}
                                className="tw:size-10 tw:rounded"
                              />
                            ) : (
                              <div className="tw:flex tw:items-center tw:justify-center tw:size-10 tw:rounded tw:bg-gray-100">
                                <LinkIcon className="tw:size-5 tw:text-gray-700" />
                              </div>
                            )}
                            <span className="tw:text-xs">{ch.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Report view */}
                {reporting && (
                  <div className="tw:mt-1">
                    <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
                      <p className="tw:text-sm tw:text-gray-600">
                        Select a reason
                      </p>
                      <button
                        className="tw:text-sm tw:text-gray-500 tw:underline"
                        onClick={() => setReporting(false)}
                      >
                        Back
                      </button>
                    </div>

                    <div className="tw:max-h-56 tw:overflow-y-auto tw:space-y-2">
                      {REASONS.map((r) => (
                        <label
                          key={r}
                          className={`tw:flex tw:items-center tw:gap-3 tw:p-3 tw:border tw:rounded-xl ${
                            selectedReason === r
                              ? "tw:border-primary tw:bg-lightPurple/50"
                              : "tw:border-gray-100"
                          }`}
                        >
                          <input
                            type="radio"
                            name="report-reason"
                            className="tw:size-4"
                            checked={selectedReason === r}
                            onChange={() => setSelectedReason(r)}
                          />
                          <span className="tw:text-sm">{r}</span>
                        </label>
                      ))}
                    </div>

                    <button
                      disabled={busy}
                      onClick={onReport}
                      className="tw:mt-4 tw:w-full tw:bg-primary tw:text-white tw:rounded-xl tw:py-3 tw:font-medium disabled:tw:opacity-60"
                    >
                      {busy ? "Submitting…" : "Submit Report"}
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
