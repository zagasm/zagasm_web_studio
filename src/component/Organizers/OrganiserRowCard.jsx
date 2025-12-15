import React from "react";
import { useNavigate } from "react-router-dom";
import { getInitials, hasProfileImage } from "./organiser.utils";

export default function OrganizerRowCard({ org, onToggleFollow, loading }) {
  const navigate = useNavigate();

  const name = org?.organiser || "Organizer";
  const initials = getInitials(name);
  const showImage = hasProfileImage(org?.profileImage);
  const followersCount = org?.numberOfFollowers ?? 0;
  const isFollowing =
  typeof org?.isFollowing === "boolean" ? org.isFollowing : !!org?.following;

  return (
    <div
      onClick={() => navigate(`/profile/${org.id}`)}
      className="tw:w-full tw:bg-white tw:border tw:border-gray-100 tw:rounded-3xl tw:p-3 tw:sm:p-4 tw:flex tw:items-center tw:gap-3 tw:sm:gap-4 tw:shadow-sm tw:cursor-pointer"
    >
      {/* bigger picture box, but still responsive */}
      <div className="tw:relative tw:size-24 tw:sm:w-[110px] tw:sm:h-[110px] tw:rounded-2xl tw:overflow-hidden tw:bg-[#F4E6FD] tw:shrink-0">
        {showImage ? (
          <img
            src={org.profileImage}
            alt={name}
            className="tw:w-full tw:h-full tw:object-cover"
            loading="lazy"
          />
        ) : (
          <div className="tw:w-full tw:h-full tw:flex tw:items-center tw:justify-center">
            <span className="tw:text-[#500481] tw:text-xl tw:sm:text-2xl tw:font-semibold">
              {initials}
            </span>
          </div>
        )}

        {Number.isFinite(Number(org?.rank)) && (
          <div className="tw:absolute tw:top-2 tw:left-2 tw:bg-white/90 tw:backdrop-blur tw:px-2.5 tw:py-1 tw:rounded-xl tw:text-[11px] tw:sm:text-xs tw:font-semibold tw:text-gray-900 tw:border tw:border-gray-100">
            #{org.rank}
          </div>
        )}
      </div>

      {/* meta */}
      <div className="tw:flex-1 tw:min-w-0">
        <span className="tw:block tw:text-sm tw:sm:text-lg tw:font-semibold tw:text-gray-900 tw:truncate">
          {name}
        </span>

        <span className="tw:block tw:text-[10px] tw:sm:text-xs tw:text-gray-500 tw:truncate">
          @{(org?.username || org?.email || org?.slug || "").replace("@", "")}
        </span>

        <span className="tw:block tw:mt-1.5 tw:text-[11px] tw:sm:text-xs tw:text-gray-600">
          +{followersCount} <span className="tw:text-gray-500">followers</span>
        </span>

        {/* optional stats (keep small on mobile) */}
        {/* <div className="tw:mt-2 tw:flex tw:flex-wrap tw:items-center tw:gap-3 tw:text-[11px] tw:sm:text-xs">
          <span className="tw:text-red-500 tw:inline-flex tw:items-center tw:gap-2">
            <span className="tw:inline-flex tw:items-center tw:justify-center tw:rounded-lg tw:border tw:border-red-200 tw:px-2 tw:py-1">
              🎟️
            </span>
            {org?.totalEventsCreated ?? 0} {org?.totalEventsCreated > 1 ? "events" : "event"}  created
          </span>

          <span className="tw:text-emerald-600 tw:inline-flex tw:items-center tw:gap-2">
            <span className="tw:inline-flex tw:items-center tw:justify-center tw:rounded-lg tw:border tw:border-emerald-200 tw:px-2 tw:py-1">
              ✅
            </span>
            {org?.tickets_total ?? 0} Tickets Sold
          </span>
        </div> */}
      </div>

      {/* follow */}
      <div className="tw:shrink-0 tw:w-24 tw:sm:w-[120px]">
        <button
          style={{
            borderRadius: 16,
            fontSize: 12,
          }}
          type="button"
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFollow(org.userId);
          }}
          className={`tw:w-full tw:rounded-2xl tw:px-3 tw:py-2 tw:text-[12px] tw:sm:text-sm tw:font-medium tw:ring-1 tw:transition
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
    </div>
  );
}
