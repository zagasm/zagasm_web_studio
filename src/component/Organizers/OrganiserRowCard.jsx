import React from "react";
import { useNavigate } from "react-router-dom";
import { getInitials, hasProfileImage } from "./organiser.utils";
import { Camera, CameraIcon, Ticket } from "lucide-react";
import { FaCamera, FaCameraRetro } from "react-icons/fa";
import { useAuth } from "../../pages/auth/AuthContext";

export default function OrganizerRowCard({ org, onToggleFollow, loading }) {
  const { user } = useAuth();
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
        <div className="tw:flex tw:items-center">
          <span className="tw:block tw:text-xs tw:sm:text-lg tw:font-semibold tw:text-gray-900 tw:truncate">
            {name}
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
          {org?.userName || org?.email || org?.slug || ""}
        </span>

        <span className="tw:block tw:mt-1.5 tw:text-[11px] tw:sm:text-xs tw:text-gray-600">
          +{followersCount} <span className="tw:text-gray-500">followers</span>
        </span>

        {/* optional stats (keep small on mobile) */}
        <div className="tw:mt-2 tw:flex tw:flex-wrap tw:items-center tw:gap-1 tw:md:gap-2 ">
          <span className=" tw:inline-flex tw:items-center tw:gap-1 tw:text-[9px] tw:sm:text-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="tw:size-4 tw:text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            <span className="tw:text-red-500">
              {org?.events_live_count ?? 0}
            </span>
            active {org?.totalEventsCreated > 1 ? "events" : "event"}
          </span>

          <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-[9px] tw:sm:text-xs">
            <Ticket className="tw:text-emerald-600 tw:size-4" />
            <span className="tw:text-emerald-600">
              {org?.tickets_total ?? 0}
            </span>
            Tickets Sold
          </span>
        </div>
      </div>

      {/* follow */}
      {user.id !== org?.userId && (
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
      )}
    </div>
  );
}
