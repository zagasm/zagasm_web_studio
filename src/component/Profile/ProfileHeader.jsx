import React from "react";
import defaultProfile from "../../assets/avater_pix.avif";
import { Calendar, UserPlus, Users } from "lucide-react";
import { Edit } from "react-feather";
import './profile.css'

export default function ProfileHeader({ user }) {
  const img = user?.profileUrl || defaultProfile;

  return (
    <div className="tw:mt-24 tw:md:mt-24 tw:relative tw:overflow-hidden tw:rounded-3xl tw:bg-linear-to-b tw:from-primary tw:to-primary tw:text-white tw:w-full tw:lg:w-200">
      <div className="tw:flex tw:items-center gap-3 tw:justify-end tw:absolute tw:right-4 tw:top-6 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="tw:size-6 icon"
          
        >
          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="tw:size-6 icon"
          
        >
          <path
            fillRule="evenodd"
            d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {/* decorative background image */}
      <img
        src={"/images/purple-bg.jpg"}
        alt=""
        className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:object-cover tw:opacity-60"
      />
      <div className="tw:relative tw:px-5 md:tw:px-8 tw:py-6 md:tw:py-8">
        <div className="tw:flex tw:flex-col md:tw:flex-row md:tw:items-end tw:gap-5">
          <img
            src={img}
            alt={user?.name || "User"}
            className="tw:h-20 tw:w-20 md:tw:h-24 md:tw:w-24 tw:rounded-full tw:ring-4 tw:ring-white/20 tw:object-cover"
            loading="lazy"
          />
          <div className="tw:flex-1">
            <h1 className="tw:text-2xl md:tw:text-3xl tw:font-semibold">
              {user?.name || "Your Name"}
            </h1>
            <span className="tw:mt-1 tw:text-white/80">Artist</span>
            <div className="tw:mt-3 tw:flex tw:flex-wrap tw:gap-2">
              <span className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white/10 tw:px-3 tw:py-1 tw:text-sm">
                <Calendar size={12} />
                {user?.events_count ?? 0} events
              </span>
              <span className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white/10 tw:px-3 tw:py-1 tw:text-sm">
                <Users size={12} />
                {user?.followings_count ?? 0} following
              </span>
              <span className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white/10 tw:px-3 tw:py-1 tw:text-sm">
                <UserPlus size={12} />
                {user?.followers_count ?? 0} followers
              </span>
            </div>
          </div>

          <a
            href="/event/select-event-type"
            className="tw:inline-flex tw:items-center tw:space-x-2 tw:justify-center tw:rounded-2xl tw:bg-white tw:px-4 tw:py-3 tw:font-medium tw:text-primary hover:tw:shadow"
          >
            <span>Create Event</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="tw:size-6"
            >
              <path
                fillRule="evenodd"
                d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                clipRule="evenodd"
              />
              <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
