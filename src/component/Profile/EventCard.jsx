import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Eye, Heart, Users } from "lucide-react";
import { api, authHeaders } from "../../lib/apiClient";
import { showPromise } from "../ui/toast";
import { useAuth } from "../../pages/auth/AuthContext";
import MediaCarousel from "./MediaCarousel";
import ObsInstructionsModal from "./ObsInstructionModal"; // ← spelling fixed

function collectMedia(poster = []) {
  const imgs = poster.filter((p) => p.type === "image");
  const vids = poster.filter((p) => p.type === "video");
  return [...imgs, ...vids];
}

export default function EventCard({ event }) {
  const media = useMemo(() => collectMedia(event.poster), [event]);
  const [isSaved, setIsSaved] = useState(!!event.is_saved);
  const [obsOpen, setObsOpen] = useState(false);
  const [obsPayload, setObsPayload] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const goToStreaming = () => {
    navigate(`/creator/channel/new?eventId=${event.id}`);
  };

  const onCreateChannel = async () => {
    const run = api.post(
      `/api/v1/event/${event.id}/scalstream/channel-create`,
      {},
      authHeaders(token)
    );
    const res = await showPromise(run, {
      loading: "Creating channel…",
      success: "Channel created!",
      error: "Failed to create channel",
    });
    setObsPayload(res?.data?.data || res?.data);
    setObsOpen(true);
  };

  const onProceed = () => {
    setObsOpen(false);
    navigate(`/creator/channel/new?eventId=${event.id}`, {
      state: { channel: obsPayload },
    });
  };

  const onCancelModal = () => {
    setObsOpen(false);
    navigate(-1);
  };

  const toggleSave = async () => {
    const req = api.post(
      `/api/v1/events/${event.id}/toggle`,
      {},
      authHeaders(token)
    );
    await showPromise(req, {
      loading: isSaved ? "Removing…" : "Saving…",
      success: isSaved ? "Removed from saved" : "Saved",
      error: "Could not update",
    });
    setIsSaved((s) => !s);
  };

  return (
    <article className="col-12 col-md-6 col-lg-4 col-xl-4 tw:overflow-hidden tw:rounded-3xl tw:bg-white ">
      {/* Clickable media/title section navigates to streaming page */}
      <div className="tw:cursor-pointer" onClick={goToStreaming}>
        <MediaCarousel items={media} alt={event.title} />
      </div>

      <div className="tw:p-5 tw:space-y-2">
        <div className="tw:flex tw:items-start tw:gap-2">
          <button
            onClick={goToStreaming}
            className="tw:text-left tw:block tw:text-lg tw:text-black tw:font-semibold tw:flex-1"
          >
            {event.title}
          </button>

          {/* stop propagation so card doesn't navigate when pressing save */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSave();
            }}
            className={`tw:rounded-xl tw:p-2 tw:transition ${
              isSaved ? "tw:text-primary" : "tw:text-gray-600 "
            }`}
            aria-label="Save"
            title={isSaved ? "Unsave" : "Save"}
          >
            <Heart
              className={`tw:size-5 ${isSaved ? "tw:fill-current" : ""}`}
            />
          </button>
        </div>

        <span className="tw:text-gray-400">{event.hostName}</span>

        <div className="tw:flex tw:items-center tw:justify-between tw:pt-1">
          <div className="tw:text-xs tw:inline-flex tw:items-center tw:gap-2 tw:text-gray-600">
            <Clock size={14} />
            <span>{event.eventDate}</span>
          </div>
          <div className="tw:text-primary tw:text-lg tw:font-semibold">
            {event.price_display}
          </div>
        </div>

        <div className="tw:mt-3 tw:flex tw:items-center tw:justify-between tw:gap-5 tw:text-gray-500">
          <div className="tw:space-x-5">
            <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-sm">
              <Eye size={14} /> 0{" "}
            </span>
            <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-sm">
              <Users size={14} /> 0{" "}
            </span>{" "}
            <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-sm">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="tw:size-3.5"
              >
                {" "}
                <path
                  fillRule="evenodd"
                  d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z"
                  clipRule="evenodd"
                />{" "}
              </svg>{" "}
              0{" "}
            </span>{" "}
          </div>{" "}
          
        </div>

        {/* Create Channel (only if not yet created) */}
        {!event.srt_ingest_url && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateChannel();
            }}
            className="tw:mt-4 tw:inline-flex tw:gap-2 tw:w-full tw:items-center tw:justify-center tw:rounded-2xl tw:bg-primary tw:px-4 tw:py-3 tw:font-medium tw:text-white hover:tw:bg-primary/90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="tw:size-6"
            >
              <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
            </svg>
            <span className="tw:mr-2">Create Channel</span>
          </button>
        )}
      </div>

      <ObsInstructionsModal
        open={obsOpen}
        payload={obsPayload}
        onProceed={onProceed}
        onClose={onCancelModal}
      />
    </article>
  );
}
