import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Eye, Heart, Users, Pencil, Trash2 } from "lucide-react";
import { api, authHeaders } from "../../lib/apiClient";
import { showPromise } from "../ui/toast";
import { useAuth } from "../../pages/auth/AuthContext";
import MediaCarousel from "./MediaCarousel";
import DeleteConfirmModal from "../DeleteConfirmModal";

function collectMedia(poster = []) {
  const imgs = poster.filter((p) => p.type === "image");
  const vids = poster.filter((p) => p.type === "video");
  return [...imgs, ...vids];
}
function getApiErrorMessage(err) {
  const data = err?.response?.data;

  if (typeof data?.message === "string" && data.message.trim())
    return data.message;
  if (typeof err?.message === "string" && err.message.trim())
    return err.message;

  return "Something went wrong. Please try again.";
}

function normalizeEventStatus(status) {
  const normalized = (status ?? "").toString().toLowerCase().trim();

  if (["live"].includes(normalized)) return "live";
  if (["paused"].includes(normalized)) return "paused";
  if (["ended", "completed", "past"].includes(normalized)) return "ended";
  if (["upcoming", "soon"].includes(normalized)) return "upcoming";

  return "upcoming";
}

function getStatusBadgeConfig(status) {
  const normalized = normalizeEventStatus(status);

  const badgeMap = {
    live: {
      label: "Live",
      className: "tw:bg-red-50 tw:text-red-700 tw:border-red-100",
      dotClassName: "tw:bg-red-500",
    },
    paused: {
      label: "Paused",
      className: "tw:bg-sky-50 tw:text-sky-700 tw:border-sky-100",
      dotClassName: "tw:bg-sky-500",
    },
    upcoming: {
      label: "Upcoming",
      className: "tw:bg-amber-50 tw:text-amber-700 tw:border-amber-100",
      dotClassName: "tw:bg-amber-500",
    },
    ended: {
      label: "Ended",
      className: "tw:bg-gray-100 tw:text-gray-700 tw:border-gray-200",
      dotClassName: "tw:bg-gray-500",
    },
  };

  return badgeMap[normalized];
}

export default function EventCard({
  event,
  isOwnProfile,
  isOrganiserProfile,
  onDeleted,
}) {
  const media = useMemo(() => collectMedia(event.poster), [event]);
  const normalizedStatus = useMemo(
    () => normalizeEventStatus(event?.status),
    [event?.status],
  );
  const statusBadge = useMemo(
    () => getStatusBadgeConfig(event?.status),
    [event?.status],
  );
  const [isSaved, setIsSaved] = useState(!!event.is_saved);
  const [deleteError, setDeleteError] = useState("");

  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  const isOwnerEvent = Boolean(event?.isOwner || isOwnProfile);

  const goToEvent = () => {
    navigate(`/event/view/${event.id}`);
  };

  const goToStreamControl = () => {
    navigate(`/event/stream/${event.id}`);
  };

  const toggleSave = async () => {
    const req = api.post(
      `/api/v1/events/${event.id}/toggle`,
      {},
      authHeaders(token),
    );

    await showPromise(req, {
      loading: isSaved ? "Removing…" : "Saving…",
      success: isSaved ? "Removed from saved" : "Saved",
      error: "Could not update",
    });

    setIsSaved((s) => !s);
  };

  const deleteEvent = async () => {
    setDeleting(true);
    setDeleteError("");

    try {
      await showPromise(
        api.post(`/api/v1/delete/event/${event.id}`, {}, authHeaders(token)),
        {
          loading: "Deleting event…",
          success: "Event deleted",
          error: (err) => getApiErrorMessage(err), // IMPORTANT: allow function
        },
      );

      setOpenDelete(false);
      onDeleted?.(event.id);
    } catch (err) {
      setDeleteError(getApiErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="col-12 col-md-6 col-lg-6 col-xl-6 tw:relative tw:overflow-hidden tw:rounded-3xl tw:bg-white">
      {/* Top-right actions (only for owner) */}
      {event.isOwner && (
        <div className="tw:absolute tw:right-4 tw:top-4 tw:z-10 tw:flex tw:gap-2">
          {/* Edit */}
          <button
            style={{
              borderRadius: 20,
            }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/event/edit/${event.id}`);
            }}
            className="tw:inline-flex tw:h-8 tw:w-8 tw:items-center tw:justify-center tw:rounded-full tw:bg-white tw:text-gray-500 tw:shadow-md hover:tw:bg-lightPurple hover:tw:text-primary tw:transition"
            aria-label="Edit event"
            title="Edit"
          >
            <Pencil className="tw:w-4 tw:h-4" />
          </button>

          {/* Delete */}
          <button
            style={{
              borderRadius: 20,
            }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteError("");
              setOpenDelete(true);
            }}
            className="tw:inline-flex tw:h-8 tw:w-8 tw:items-center tw:justify-center tw:rounded-full tw:bg-white tw:text-red-600 tw:shadow-md hover:tw:bg-red-50 tw:transition"
            aria-label="Delete event"
            title="Delete"
          >
            <Trash2 className="tw:w-4 tw:h-4" />
          </button>
        </div>
      )}

      {/* Clickable media/title section navigates to event page */}
      <div className="tw:cursor-pointer" onClick={goToEvent}>
        <div
          className={`tw:absolute tw:left-4 tw:top-4 tw:z-10 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:border tw:px-2.5 tw:py-1 tw:text-[11px] tw:font-semibold tw:backdrop-blur-sm ${statusBadge.className}`}
        >
          <span
            className={`tw:inline-block tw:h-2 tw:w-2 tw:rounded-full ${statusBadge.dotClassName}`}
          />
          <span>{statusBadge.label}</span>
        </div>

        <MediaCarousel items={media} alt={event.title} />
      </div>

      <div className="tw:p-5 tw:space-y-2">
        <div className="tw:flex tw:items-start tw:gap-2">
          <div
            onClick={goToEvent}
            className="tw:uppercase tw:text-left tw:block tw:text-[16px] tw:text-black tw:font-semibold tw:flex-1"
          >
            {event.title}
          </div>

          {isOrganiserProfile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSave();
              }}
              className={`tw:rounded-xl tw:p-2 tw:transition ${isSaved ? "tw:text-primary" : "tw:text-gray-600 "
                }`}
              aria-label="Save"
              title={isSaved ? "Unsave" : "Save"}
            >
              <Heart
                className={`tw:size-5 ${isSaved ? "tw:fill-current" : ""}`}
              />
            </button>
          )}
        </div>

        <div className="tw:flex tw:items-center tw:justify-between tw:pt-1">
          <div className="tw:text-xs tw:inline-flex tw:items-center tw:gap-2 tw:text-gray-600">
            <Clock size={14} />
            <span>{event.eventDate}</span>
          </div>
          <div className="tw:text-primary tw:text-lg tw:font-semibold">
            {event.price_display}
          </div>
        </div>

        {/* <div className="tw:mt-3 tw:flex tw:items-center tw:justify-between tw:gap-5 tw:text-gray-500">
          <div className="tw:space-x-5">
            <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-sm">
              <Eye size={14} /> 0
            </span>
            <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-sm">
              <Users size={14} /> 0
            </span>
            <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="tw:size-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z"
                  clipRule="evenodd"
                />
              </svg>
              0
            </span>
          </div>
        </div> */}

        {/* CTA */}
        {isOwnerEvent ? (
          <button
            style={{
              fontSize: 12,
              borderRadius: 20,
            }}
            onClick={(e) => {
              e.stopPropagation();
              goToStreamControl();
            }}
            className="tw:mt-4 tw:inline-flex tw:gap-2 tw:w-full tw:items-center tw:justify-center tw:rounded-2xl tw:bg-primary tw:px-4 tw:py-3 tw:font-medium tw:text-white tw:hover:bg-primary/90"
          >
            <span className="tw:mr-2">
              {normalizedStatus === "live"
                ? "Manage live stream"
                : normalizedStatus === "paused"
                  ? "Resume Event"
                  : normalizedStatus === "ended"
                    ? "View Event"
                    : "Start stream"}
            </span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToEvent();
            }}
            className="tw:mt-4 tw:inline-flex tw:gap-2 tw:w-full tw:items-center tw:justify-center tw:rounded-2xl tw:bg-primary tw:px-4 tw:py-3 tw:font-medium tw:text-white tw:hover:bg-primary/90"
          >
            <span className="tw:mr-2">
              {isOrganiserProfile ? "Join event" : "View event"}
            </span>
          </button>
        )}
      </div>

      <DeleteConfirmModal
        open={openDelete}
        onClose={() => (deleting ? null : setOpenDelete(false))}
        title="Delete this event?"
        description="This will permanently remove the event and its details. This action cannot be undone."
        confirmText="Yes, delete"
        cancelText="Cancel"
        loading={deleting}
        onConfirm={deleteEvent}
      />
    </article>
  );
}
