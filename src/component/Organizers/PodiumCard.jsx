import React from "react";
import { useNavigate } from "react-router-dom";
import { getInitials, hasProfileImage, truncate } from "./organiser.utils";

export default function PodiumCard({ org, position }) {
  const navigate = useNavigate();

  const name = org?.organiser || "Organizer";
  const initials = getInitials(name);
  const showImage = hasProfileImage(org?.profileImage);
  const followersCount = org?.numberOfFollowers ?? 0;

  const ring =
    position === 1
      ? "tw:ring-4 tw:ring-purple-500"
      : "tw:ring-4 tw:ring-purple-400";

  // smaller on mobile
  const size =
    position === 1
      ? "tw:size-16 tw:sm:size-20 tw:md:size-28"
      : "tw:size-12 tw:sm:size-16 tw:md:size-24";

  return (
    <button
      type="button"
      onClick={() => navigate(`/profile/${org.id}`)}
      className="tw:flex tw:flex-col tw:items-center tw:text-center tw:focus:outline-none"
    >
      <div className="tw:relative">
        {position === 1 && (
          <div className="tw:absolute tw:top-[-26px] tw:left-1/2 tw:-translate-x-1/2 tw:text-2xl tw:sm:text-3xl">
            👑
          </div>
        )}

        <div
          className={`${size} tw:rounded-full tw:overflow-hidden tw:bg-[#F4E6FD] ${ring} tw:flex tw:items-center tw:justify-center`}
        >
          {showImage ? (
            <img
              src={org.profileImage}
              alt={name}
              className="tw:w-full tw:h-full tw:object-cover"
              loading="lazy"
            />
          ) : (
            <span className="tw:text-[#500481] tw:text-lg tw:sm:text-xl tw:font-semibold">
              {initials}
            </span>
          )}
        </div>

        <div className="tw:absolute tw:-bottom-3 tw:left-1/2 tw:-translate-x-1/2 tw:bg-purple-600 tw:text-white tw:rounded-full tw:px-3 tw:py-1 tw:text-[10px] tw:sm:text-sm tw:font-semibold">
          #{position}
        </div>
      </div>

      <div className="tw:mt-5 tw:flex tw:flex-col tw:gap-1">
        <span className="tw:text-[10px] tw:sm:text-base tw:font-semibold tw:text-gray-900">
          {truncate(name, 18)}
        </span>

        {/* <span className="tw:text-[11px] tw:sm:text-xs tw:text-gray-500">
          @{(org?.username || org?.email || org?.slug || "").replace("@", "")}
        </span> */}

        <span className=" tw:text-[11px] tw:sm:text-xs tw:text-gray-600">
          +{followersCount} <span className="tw:text-gray-500">followers</span>
        </span>
      </div>
    </button>
  );
}
