import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import { useAuth } from "../../../pages/auth/AuthContext";
import { truncate } from "../../../utils/helpers";
import { showError, showSuccess } from "../../ui/toast";
import { api, authHeaders } from "../../../lib/apiClient";

export default function MobileSingleOrganizers() {
  const [organizers, setOrganizers] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [followLoading, setFollowLoading] = useState({});
  const { token } = useAuth();

  // ---- helpers: stable id + image pickers
  const getId = (org) => org?.userId ?? org?.id; // support either shape
  const getOrganizerImage = (id) => {
    const safeId = Number(id) || Math.floor(Math.random() * 50) + 1;
    const randomImageId = safeId % 50;
    const gender = randomImageId % 2 === 0 ? "men" : "women";
    return `https://randomuser.me/api/portraits/${gender}/${randomImageId}.jpg`;
  };
  const pickProfileImage = (profileImage, id) => {
    const bad =
      !profileImage || profileImage === "null" || profileImage === "undefined";
    return bad ? getOrganizerImage(id) : profileImage;
  };

  useEffect(() => {
    fetchOrganizers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrganizers = async () => {
    try {
      setLoadingList(true);
      const res = await api.get("/api/v1/organisers", authHeaders(token));
      const data = res?.data;
      if (data && Array.isArray(data.data)) {
        // Normalize: ensure boolean "following"
        const list = data.data.map((o) => ({
          ...o,
          following: !!o.following,
        }));
        setOrganizers(list);
      } else {
        setOrganizers([]);
        console.warn("No organisers data received");
      }
    } catch (e) {
      console.error("Error fetching organizers:", e);
      showError("Unable to load organizers right now.");
    } finally {
      setLoadingList(false);
    }
  };

  const toggleFollow = async (targetId) => {
    if (!targetId) return;
    setFollowLoading((prev) => ({ ...prev, [targetId]: true }));
    try {
      const res = await api.post(
        `/api/v1/follow/${targetId}`,
        {},
        authHeaders(token)
      );

      // Accept either { following, message } or { data: { following }, message }
      const body = res?.data || {};
      const newFollowing =
        typeof body.following === "boolean"
          ? body.following
          : !!body?.data?.following;

      showSuccess(body?.message || "Updated");

      // Update the exact organizer using our stable id getter
      setOrganizers((prev) =>
        prev.map((org) =>
          getId(org) === targetId ? { ...org, following: newFollowing } : org
        )
      );
    } catch (e) {
      console.error("Error toggling follow:", e);
      showError("Something went wrong. Please try again.");
    } finally {
      setFollowLoading((prev) => ({ ...prev, [targetId]: false }));
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
      <p className="tw:text-sm tw:text-gray-600">No organizers to show yet.</p>
    </div>
  );

  return (
    <div className="tw:mb-3">
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
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 3.2 },
            480: { slidesPerView: 4 },
            768: { slidesPerView: 4.2 },
          }}
          className="tw:pb-8"
        >
          {organizers.map((organizer) => {
            const id = getId(organizer);
            const name =
              organizer.organiser ||
              [organizer.firstName, organizer.lastName]
                .filter(Boolean)
                .join(" ") ||
              "Organizer";
            const imgSrc = pickProfileImage(organizer.profileImage, id);
            const isFollowing = !!organizer.following; // ← TRUE/FALSE drives label
            const isBusy = !!followLoading[id];

            return (
              <SwiperSlide key={id}>
                <div className="tw:h-full tw:bg-white tw:border tw:border-gray-100 tw:rounded-2xl tw:p-3 tw:flex tw:flex-col tw:items-stretch tw:gap-2">
                  <div className="tw:flex tw:flex-col tw:items-center tw:text-center tw:gap-3">
                    <img
                      src={imgSrc}
                      alt={name}
                      className="tw:w-14 tw:h-14 tw:rounded-full tw:object-cover tw:ring-2 tw:ring-white tw:shadow-sm"
                      loading="lazy"
                    />
                    <div className="tw:min-w-0 tw:flex-1">
                      <div className="tw:text-xs tw:font-medium tw:truncate">
                        {truncate(name, 14)}
                      </div>
                      <div className="tw:text-[8px] tw:text-gray-500 tw:truncate">
                        {organizer.phone || "No phone"}
                      </div>
                    </div>
                  </div>

                  <button
                    style={{ borderRadius: 6 }}
                    type="button"
                    onClick={() => toggleFollow(id)}
                    disabled={isBusy}
                    className={`tw:w-full tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-xl tw:px-3 tw:py-1.5 tw:text-xs tw:font-medium tw:ring-1 tw:transition
                      ${
                        isFollowing
                          ? "tw:bg-primary tw:text-white tw:ring-primary"
                          : "tw:bg-[#F4E6FD] tw:text-black tw:ring-transparent hover:tw:bg-primary/10"
                      }`}
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
                        {/* TRUE/FALSE decides label here */}
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
