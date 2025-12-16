import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../pages/auth/AuthContext";
import { truncate } from "../../../utils/helpers";
import { showError, showSuccess } from "../../ui/toast";
import { api, authHeaders } from "../../../lib/apiClient";

export default function MobileSingleOrganizers() {
  const navigate = useNavigate();

  const [organizers, setOrganizers] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [followLoading, setFollowLoading] = useState({});
  const { token } = useAuth();

  // stable ids (your payload has BOTH id and userId)
  const getProfileId = (org) => org?.id; // for /profile/:id
  const getFollowId = (org) => org?.userId; // for /follow/:userId

  const getInitials = (organizer) => {
    const name =
      organizer.organiser ||
      [organizer.firstName, organizer.lastName].filter(Boolean).join(" ") ||
      "";
    if (!name) return "Z";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const second = parts.length > 1 ? parts[1][0] : "";
    return (first + second).toUpperCase();
  };

  const hasValidProfileImage = (profileImage) => {
    if (!profileImage) return false;
    if (profileImage === "null") return false;
    if (profileImage === "undefined") return false;
    return true;
  };

  const deriveIsFollowing = (org) =>
    typeof org?.isFollowing === "boolean" ? org.isFollowing : !!org?.following;

  useEffect(() => {
    fetchOrganizers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrganizers = async () => {
    try {
      setLoadingList(true);

      const res = await api.get(
        "/api/v1/organiser/for-you/get",
        authHeaders(token)
      );

      const list = Array.isArray(res?.data?.data) ? res.data.data : [];

      // normalize follow state (keep both fields in sync)
      const normalized = list.map((o) => {
        const isFollowing = deriveIsFollowing(o);
        return { ...o, isFollowing, following: isFollowing };
      });

      setOrganizers(normalized);
    } catch (e) {
      console.error("Error fetching organizers:", e);
      showError("Unable to load organizers right now.");
      setOrganizers([]);
    } finally {
      setLoadingList(false);
    }
  };

  const toggleFollow = async (followUserId) => {
    if (!followUserId) return;

    setFollowLoading((prev) => ({ ...prev, [followUserId]: true }));

    try {
      const res = await api.post(
        `/api/v1/follow/${followUserId}`,
        {},
        authHeaders(token)
      );

      const body = res?.data || {};
      const newFollowing =
        typeof body.following === "boolean"
          ? body.following
          : typeof body?.data?.following === "boolean"
          ? body.data.following
          : // fallback: some APIs return is_following / isFollowing
            !!(body?.data?.is_following ?? body?.data?.isFollowing);

      showSuccess(body?.message || "Updated");

      setOrganizers((prev) =>
        prev.map((org) =>
          org?.userId === followUserId
            ? { ...org, isFollowing: newFollowing, following: newFollowing }
            : org
        )
      );
    } catch (e) {
      console.error("Error toggling follow:", e);
      showError("Something went wrong. Please try again.");
    } finally {
      setFollowLoading((prev) => ({ ...prev, [followUserId]: false }));
    }
  };

  const EmptyState = () => (
    <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-10 tw:text-center tw:rounded-2xl tw:border tw:border-gray-100 tw:bg-white">
      <div className="tw:size-12 tw:rounded-full tw:bg-gray-100 tw:flex tw:items-center tw:justify-center tw:mb-3">
        <svg
          viewBox="0 0 24 24"
          className="tw:size-6 tw:text-gray-500"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="7" r="4" strokeWidth="1.5" />
        </svg>
      </div>
      <span className="tw:text-sm tw:text-gray-600">
        No organizers to show yet.
      </span>
    </div>
  );

  return (
    <div className="tw:mb-3 tw:font-sans">
      {loadingList ? (
        <div className="tw:flex tw:items-center tw:justify-center tw:py-10">
          <svg
            className="tw:size-6 tw:animate-spin tw:text-primary"
            viewBox="0 0 24 24"
          >
            <circle
              className="tw:opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="tw:opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8v4A4 4 0 0 0 8 12H4z"
            />
          </svg>
        </div>
      ) : organizers.length === 0 ? (
        <EmptyState />
      ) : (
        <Swiper
          modules={[Pagination]}
          spaceBetween={12}
          breakpoints={{
            0: { slidesPerView: 3.2 },
            480: { slidesPerView: 4 },
            768: { slidesPerView: 4.2 },
          }}
          className="tw:pb-8"
        >
          {organizers.map((organizer) => {
            const profileId = getProfileId(organizer);
            const followUserId = getFollowId(organizer);

            const name =
              organizer.organiser ||
              [organizer.firstName, organizer.lastName]
                .filter(Boolean)
                .join(" ") ||
              "Organizer";

            const isFollowing = deriveIsFollowing(organizer);
            const isBusy = !!followLoading[followUserId];
            const showImage = hasValidProfileImage(organizer.profileImage);
            const initials = getInitials(organizer);

            return (
              <SwiperSlide key={profileId || followUserId}>
                {/* CARD: click navigates */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => profileId && navigate(`/profile/${profileId}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && profileId) {
                      navigate(`/profile/${profileId}`);
                    }
                  }}
                  className="tw:h-full tw:bg-white tw:border tw:border-gray-100 tw:rounded-2xl tw:p-3 tw:flex tw:flex-col tw:items-stretch tw:gap-2 tw:cursor-pointer"
                >
                  <div className="tw:flex tw:flex-col tw:items-center tw:text-center tw:gap-3">
                    <div className="tw:w-14 tw:h-14 tw:rounded-full tw:ring-2 tw:ring-white tw:shadow-sm tw:flex tw:items-center tw:justify-center tw:bg-[#F4E6FD] tw:font-semibold tw:text-[#500481] tw:overflow-hidden">
                      {showImage ? (
                        <img
                          src={organizer.profileImage}
                          alt={name}
                          className="tw:w-full tw:h-full tw:object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="tw:text-sm">{initials}</span>
                      )}
                    </div>

                    <div className="tw:min-w-0 tw:flex-1">
                      <div className="tw:flex tw:items-center">
                        <span className="tw:block tw:text-xs tw:font-medium tw:truncate">
                          {truncate(name, 14)}
                        </span>
                        {organizer.plan && (
                          <img
                            className="tw:size-4"
                            src="/images/verifiedIcon.svg"
                            alt=""
                          />
                        )}
                      </div>

                      <span className="tw:block tw:text-[8px] tw:text-gray-500 tw:truncate">
                        {organizer.totalEventsCreated || "No"} Events created
                      </span>
                    </div>
                  </div>

                  {/* FOLLOW BUTTON: stopPropagation so it doesn't open profile */}
                  <button
                    style={{ borderRadius: 6 }}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollow(followUserId);
                    }}
                    disabled={isBusy || !followUserId}
                    className={`tw:w-full tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-xl tw:px-3 tw:py-1.5 tw:text-xs tw:font-medium tw:ring-1 tw:transition
                      ${
                        isFollowing
                          ? "tw:bg-primary tw:text-white tw:ring-primary"
                          : "tw:bg-[#F4E6FD] tw:text-black tw:ring-transparent tw:hover:bg-primary/10"
                      } ${isBusy ? "tw:opacity-70 tw:cursor-not-allowed" : ""}`}
                  >
                    {isBusy ? (
                      <svg
                        className="tw:size-4 tw:animate-spin"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="tw:opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="tw:opacity-90"
                          fill="currentColor"
                          d="M4 12a8 8 0 0 1 8-8v4A4 4 0 0 0 8 12H4z"
                        />
                      </svg>
                    ) : (
                      <>
                        <span className="tw:text-[10px]">
                          {isFollowing ? "Unfollow" : "Follow"}
                        </span>
                        <i
                          className={
                            isFollowing
                              ? "feather-user-check"
                              : "feather-user-plus"
                          }
                          aria-hidden
                        />
                      </>
                    )}
                  </button>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
}
