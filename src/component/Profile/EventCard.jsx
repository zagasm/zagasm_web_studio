import React from "react";
import { normalizeStatus } from "../../hooks/useMyEvents";
import { Clock, Eye, Plus, Users } from "lucide-react";

function posterImage(poster = []) {
  const img = poster.find((p) => p.type === "image");
  if (img) return img.url;
  const vid = poster.find((p) => p.type === "video");
  if (vid) return vid.url;
  return null;
}

export default function EventCard({ event }) {
  const status = normalizeStatus(event.status);
  const cover = posterImage(event.poster);

  return (
    <article className="col-12 col-md-6 col-lg-4 col-xl-3 tw:overflow-hidden tw:rounded-3xl tw:bg-white tw:shadow-sm tw:border tw:border-gray-100 tw:md:border-none tw:md:shadow-none">
      {/* cover */}
      <div className="tw:relative tw:aspect-video tw:bg-gray-100">
        {cover ? (
          <img
            src={cover}
            alt={event.title}
            className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover"
          />
        ) : null}
        <span
          className={`tw:absolute tw:right-3 tw:top-3 tw:rounded-full tw:px-3 tw:py-1 tw:text-xs tw:font-medium
          ${
            status === "live"
              ? "tw:bg-red-600 tw:text-white"
              : status === "soon"
              ? "tw:bg-amber-100 tw:text-amber-800"
              : "tw:bg-gray-100 tw:text-gray-700"
          }`}
        >
          {status === "soon" ? "upcoming" : status}
        </span>
      </div>

      {/* body */}
      <div className="tw:p-5 tw:space-y-2">
        <span className="tw:block tw:text-lg tw:text-black tw:font-semibold">
          {event.title}
        </span>
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

        {event.streamUrl !== null && (
          <a
            href={`/creator/channel/new?eventId=${event.id}`}
            className="tw:mt-4 tw:inline-flex tw:gap-2 tw:w-full tw:items-center tw:justify-center tw:rounded-2xl tw:bg-purple-600 tw:px-4 tw:py-3 tw:font-medium text-white hover:tw:bg-purple-700"
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
          </a>
        )}

        <div className="tw:mt-3 tw:flex tw:items-center tw:justify-between tw:gap-5 tw:text-gray-500">
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
              </svg>{" "}
              0
            </span>
          </div>
          <button className="tw:ml-auto tw:text-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="tw:size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
