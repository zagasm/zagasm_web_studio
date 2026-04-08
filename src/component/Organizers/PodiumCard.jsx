import React from "react";
import { useNavigate } from "react-router-dom";
import {
  getFollowState,
  getInitials,
  hasProfileImage,
  truncate,
} from "./organiser.utils";
import { Ticket } from "lucide-react";
import { useAuth } from "../../pages/auth/AuthContext";

export default function PodiumCard({ org, position, onToggleFollow, loading }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const displayName = org?.userName || org?.organiser || "Organizer";
  const initials = getInitials(displayName);
  const showImage = hasProfileImage(org?.profileImage);
  const followersCount = org?.numberOfFollowers ?? 0;
  const { label: followLabel, buttonClass } = getFollowState(org);
  const canFollow = user?.id !== org?.userId;

  const ring =
    position === 1
      ? "tw:ring-4 tw:ring-primary"
      : "tw:ring-4 tw:ring-primary/60";

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
      className="tw:flex tw:w-full tw:flex-col tw:items-center tw:text-center tw:cursor-pointer tw:focus:outline-none"
    >
      <div className="tw:relative">
        {position === 1 && (
          <div className="tw:absolute tw:left-1/2 tw:top-[-20px] tw:-translate-x-1/2 tw:text-xl tw:sm:top-[-26px] tw:sm:text-3xl">
            👑
          </div>
        )}

        <div
          className={`${size} tw:flex tw:items-center tw:justify-center tw:rounded-full tw:overflow-hidden tw:bg-lightPurple ${ring}`}
        >
          {showImage ? (
            <img
              src={org.profileImage}
              alt={displayName}
              className="tw:h-full tw:w-full tw:object-cover"
              loading="lazy"
            />
          ) : (
            <span className="tw:text-lg tw:font-semibold tw:text-primary tw:sm:text-xl">
              {initials}
            </span>
          )}
        </div>

        <div className="tw:absolute tw:-bottom-3 tw:left-1/2 tw:-translate-x-1/2 tw:rounded-full tw:bg-primary tw:px-3 tw:py-1 tw:text-[10px] tw:font-semibold tw:text-white tw:sm:text-sm">
          #{position}
        </div>
      </div>

      <div className="tw:mt-4 tw:flex tw:w-full tw:flex-col tw:items-center">
        <div className="tw:flex tw:items-center tw:gap-1 tw:sm:gap-2">
          <span className="tw:first-letter:uppercase tw:text-[11px] tw:font-semibold tw:text-gray-900 tw:sm:text-base">
            {truncate(displayName, 12)}
          </span>
          {org.has_active_subscription && (
            <img
              className="tw:size-3 tw:md:size-4"
              src="/images/verifiedIcon.svg"
              alt=""
            />
          )}
        </div>

        <span className="tw:text-[10px] tw:text-gray-600 tw:sm:text-xs">
          {followersCount} <span className="tw:text-gray-500">followers</span>
        </span>
        <span className="tw:my-1 tw:inline-flex tw:items-center tw:gap-1 tw:text-[8px] tw:sm:text-xs">
          <Ticket className="tw:size-3 tw:text-emerald-600 tw:sm:size-4" />
          <span className="tw:text-emerald-600">{org?.tickets_total ?? 0}</span>
          Tickets Sold
        </span>

        <div className="tw:mt-1 tw:flex tw:w-full tw:justify-center">
          {onToggleFollow && canFollow ? (
            <div className="tw:w-full tw:max-w-[62px] tw:sm:max-w-[84px]">
              <button
                style={{ borderRadius: 16 }}
                type="button"
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFollow(org.userId);
                }}
                className={`tw:w-full tw:rounded-2xl tw:px-2 tw:py-1 tw:text-[10px] tw:font-medium tw:leading-tight tw:ring-1 tw:transition tw:sm:px-3 tw:sm:py-1.5 tw:sm:text-[12px] ${buttonClass} ${
                  loading ? "tw:cursor-not-allowed tw:opacity-70" : ""
                }`}
              >
                {loading ? "Wait..." : followLabel}
              </button>
            </div>
          ) : (
            <div className="tw:h-[28px] tw:w-full tw:max-w-[62px] tw:sm:h-[34px] tw:sm:max-w-[84px]" />
          )}
        </div>
      </div>
    </div>
  );
}
