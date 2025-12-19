import React from "react";
import { useNavigate } from "react-router-dom";
import { getInitials, hasProfileImage, truncate } from "./organiser.utils";
import { Ticket } from "lucide-react";

export default function PodiumCard({ org, position, onToggleFollow, loading }) {
  const navigate = useNavigate();

  const name = org?.organiser || "Organizer";
  const initials = getInitials(name);
  const showImage = hasProfileImage(org?.profileImage);
  const followersCount = org?.numberOfFollowers ?? 0;
  const isFollowing =
    typeof org?.isFollowing === "boolean" ? org.isFollowing : !!org?.following;

  const ring =
    position === 1
      ? "tw:ring-4 tw:ring-purple-500"
      : "tw:ring-4 tw:ring-purple-400";

  // smaller on mobile
  const size =
    position === 1
      ? "tw:size-16 tw:sm:size-20 tw:md:size-28"
      : "tw:size-12 tw:sm:size-16 tw:md:size-24";

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(`/profile/${org.id}`);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/profile/${org.id}`)}
      onKeyDown={handleKeyDown}
      className="tw:flex tw:flex-col tw:items-center tw:text-center tw:cursor-pointer tw:focus:outline-none"
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

      <div className="tw:mt-5 tw:flex tw:flex-col tw:items-center">
        <div className="tw:flex tw:items-center tw:gap-2">
          <span className="tw:text-[12px] tw:sm:text-base tw:font-semibold tw:text-gray-900">
            {truncate(name, 12)}
          </span>
          {org.has_active_subscription && (
            <img
              className="tw:size-3 tw:md:size-4"
              src="/images/verifiedIcon.svg"
              alt=""
            />
          )}
        </div>
        <span className="tw:block tw:text-[10px] tw:sm:text-xs tw:text-gray-500 tw:truncate">
          {truncate(org?.userName || org?.email || org?.slug || "", 10)}
        </span>

        <span className="tw:text-[11px] tw:sm:text-xs tw:text-gray-600">
          {followersCount} <span className="tw:text-gray-500">followers</span>
        </span>
        <span className="tw:my-1 tw:inline-flex tw:items-center tw:gap-1 tw:text-[9px] tw:sm:text-xs">
          <Ticket className="tw:text-emerald-600 tw:size-4" />
          <span className="tw:text-emerald-600">{org?.tickets_total ?? 0}</span>
          Tickets Sold
        </span>

        {onToggleFollow && (
          <div className="tw:w-full tw:max-w-[70px]">
            <button
              style={{
                borderRadius: 16,
                fontSize: 11,
              }}
              type="button"
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFollow(org.userId);
              }}
              className={`tw:w-full tw:rounded-2xl tw:px-2 tw:py-1 tw:text-[12px] tw:font-medium tw:ring-1 tw:transition
                ${
                  isFollowing
                    ? "tw:bg-white tw:text-gray-900 tw:ring-gray-200"
                    : "tw:bg-primary tw:text-white tw:ring-primary"
                }
                ${loading ? "tw:opacity-70 tw:cursor-not-allowed" : ""}`}
            >
              {loading ? "Wait..." : isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
