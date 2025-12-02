import React, { useState, useEffect, useCallback } from "react";
import SideBarNav from "../pageAssets/SideBarNav";
import SEO from "../../component/SEO";
import { useAuth } from "../auth/AuthContext";
import { useInView } from "react-intersection-observer";
import { showSuccess, showError } from "../../component/ui/toast";
import { useNavigate } from "react-router-dom";

// ---- tiny util (word-safe)
const truncate = (text, max = 48) => {
  if (!text || typeof text !== "string") return "";
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const safe = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return safe.replace(/[.,:;!?-]*$/, "") + "…";
};

// initials from organiser name
const getInitials = (name) => {
  if (!name || typeof name !== "string") return "Z";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? parts[1][0] : "";
  return (first + second).toUpperCase();
};

const hasProfileImage = (profileImage) => {
  if (!profileImage) return false;
  if (profileImage === "null") return false;
  if (profileImage === "undefined") return false;
  return true;
};

const OrganizerCard = ({ org, onToggle, loading }) => {
  const name = org.organiser || "Organizer";
  const initials = getInitials(name);
  const showImage = hasProfileImage(org.profileImage);
  const isFollowing = !!org.following;
  const followersCount = org.numberOfFollowers ?? 0;
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/profile/${org.id}`)} className="tw:h-full tw:bg-white tw:border tw:border-gray-100 tw:rounded-3xl tw:p-3 tw:flex tw:flex-col tw:gap-3 tw:shadow-sm">
      {/* Top image / initials block */}
      <div className="tw:rounded-3xl tw:overflow-hidden tw:bg-gray-200 tw:aspect-4/3">
        {showImage ? (
          <img
            src={org.profileImage}
            alt={name}
            className="tw:w-full tw:h-full tw:object-cover"
            loading="lazy"
          />
        ) : (
          <div className="tw:w-full tw:h-full tw:flex tw:items-center tw:justify-center tw:bg-[#F4E6FD] tw:text-[#500481] tw:text-xl tw:font-semibold">
            {initials}
          </div>
        )}
      </div>

      {/* Name + rank pill */}
      <div className="tw:flex tw:flex-col tw:md:flex-row tw:md:items-center tw:justify-between tw:gap-2">
        <div className="tw:min-w-0">
          <div
            className="tw:text-xs tw:md:text-base tw:font-semibold tw:text-gray-900 tw:truncate"
            title={name}
          >
            {truncate(name, 24)}
          </div>
        </div>

        {typeof org.rank === "number" && (
          <div className="tw:inline-flex tw:items-center tw:justify-center tw:gap-1 tw:bg-black tw:text-white tw:px-2.5 tw:py-1 tw:rounded-2xl">
            <span className="tw:text-[8px]">🌍</span>
            <span className="tw:text-[8px] tw:font-semibold"># {org.rank}</span>
          </div>
        )}
      </div>

      {/* Category pill */}
      <div className="tw:mt-1">
        <span className="tw:inline-flex tw:px-3 tw:py-1 tw:text-[11px] tw:font-medium tw:rounded-full tw:bg-lightPurple tw:text-gray-900">
          Organizer
        </span>
      </div>

      {/* Followers row */}
      <div className="tw:mt-1 tw:flex tw:items-center tw:gap-2 tw:bg-lightPurple tw:rounded-lg tw:py-2 tw:justify-center">
        <span className="tw:text-xs tw:text-gray-700">
          +{followersCount} <span className="tw:text-gray-500">followers</span>
        </span>
      </div>

      {/* Follow / Unfollow button */}
      <div className="tw:mt-auto">
        <button
          style={{ borderRadius: 20, fontSize: 11 }}
          type="button"
          disabled={loading}
          onClick={() => onToggle(org.userId)}
          className={`tw:w-full tw:flex tw:items-center tw:justify-center tw:gap-2 tw:px-3 tw:py-2.5 tw:text-sm tw:font-medium tw:ring-1 tw:transition
            ${
              isFollowing
                ? "tw:bg-white tw:text-black tw:ring-gray-200"
                : "tw:bg-primary tw:text-white"
            }
            ${loading ? "tw:opacity-70 tw:cursor-not-allowed" : ""}`}
        >
          {loading ? (
            <svg className="tw:size-4 tw:animate-spin" viewBox="0 0 24 24">
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
              <span>{isFollowing ? "Unfollow" : "Follow"}</span>
              <i
                className={
                  isFollowing ? "feather-user-check" : "feather-user-plus"
                }
                aria-hidden
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

function AllOrganizers() {
  const { token } = useAuth();

  const [organizers, setOrganizers] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [initialError, setInitialError] = useState(null);

  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: "400px 0px",
    triggerOnce: false,
  });

  const fetchOrganisers = useCallback(
    async (url = null, isMore = false) => {
      try {
        isMore ? setLoadingMore(true) : setLoadingList(true);

        const endpoint =
          url || `${import.meta.env.VITE_API_URL}/api/v1/organisers`;

        const res = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch organisers");

        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : [];

        // normalise following to boolean if present
        const normalized = list.map((o) => ({
          ...o,
          following: !!o.following,
        }));

        setOrganizers((prev) =>
          isMore ? [...prev, ...normalized] : normalized
        );

        const next = data?.links?.next ?? null;
        setNextPageUrl(next);
        setHasMore(!!next);

        if (!isMore) setInitialError(null);
      } catch (e) {
        if (isMore) {
          setHasMore(false);
          setNextPageUrl(null);
        } else {
          setInitialError("We couldn't load organizers right now.");
          setOrganizers([]);
        }
      } finally {
        setLoadingList(false);
        setLoadingMore(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchOrganisers();
  }, [fetchOrganisers]);

  useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      fetchOrganisers(nextPageUrl, true);
    }
  }, [inView, hasMore, loadingMore, nextPageUrl, fetchOrganisers]);

  const [followLoading, setFollowLoading] = useState({});

  const toggleFollow = async (organizerUserId) => {
    if (!organizerUserId) return;

    setFollowLoading((p) => ({ ...p, [organizerUserId]: true }));
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/follow/${organizerUserId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to toggle follow");

      const result = await res.json();
      // result = { message: "...", following: true|false } or similar
      const isNowFollowing =
        typeof result.following === "boolean"
          ? result.following
          : !!result?.data?.following;

      setOrganizers((prev) =>
        prev.map((o) =>
          o.userId === organizerUserId ? { ...o, following: isNowFollowing } : o
        )
      );

      showSuccess(
        result?.message ||
          (isNowFollowing
            ? "User followed successfully"
            : "User unfollowed successfully")
      );
    } catch (e) {
      showError("Something went wrong. Try again.");
    } finally {
      setFollowLoading((p) => ({ ...p, [organizerUserId]: false }));
    }
  };

  return (
    <>
      <SEO
        title="Event Organizers - Connect with Top Event Hosts"
        description="Discover and follow the best event organizers at Zagasm Studios. Connect with professional event hosts, venue managers, and entertainment producers for concerts, festivals, parties and more."
        keywords="zagasm studios, event organizers, event hosts, venue managers, concert organizers, party planners, festival organizers, entertainment producers, follow organizers, professional event management"
      />

      <div className=" tw:pt-20 tw:md:pt-28">
        <div className="">
          {/* Header */}
          <div className="tw:px-4">
            <span className="tw:text-xl tw:md:text-3xl tw:font-semibold">
              Organizers
            </span>
            <p className="tw:text-sm tw:text-gray-600">
              Browse and follow creators & event hosts.
            </p>
          </div>

          {/* Grid */}
          <div className="">
            <div className="">
              <div className="">
                <div className="tw:bg-white tw:border tw:border-gray-100 tw:rounded-2xl tw:p-4 tw:md:p-6">
                  {/* Initial loading */}
                  {loadingList && organizers.length === 0 ? (
                    <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-16">
                      <svg
                        className="tw:size-7 tw:animate-spin tw:text-primary"
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
                      <p className="tw:text-sm tw:text-gray-600 tw:mt-3">
                        Loading organisers…
                      </p>
                    </div>
                  ) : initialError && organizers.length === 0 ? (
                    <div className="tw:text-center tw:py-12">
                      <p className="tw:text-sm tw:text-red-600">
                        {initialError}
                      </p>
                    </div>
                  ) : organizers.length === 0 ? (
                    <div className="tw:text-center tw:py-12">
                      <p className="tw:text-sm tw:text-gray-600">
                        No organisers to display yet.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Cards */}
                      <div className="row g-3 g-md-4">
                        {organizers.map((org) => (
                          <div
                            key={org.id}
                            className="col-6 col-md-4 col-lg-3 col-xxl-2"
                          >
                            <OrganizerCard
                              org={org}
                              onToggle={toggleFollow}
                              loading={!!followLoading[org.userId]}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Infinite scroll footer */}
                      <div
                        ref={hasMore ? loadMoreRef : undefined}
                        className="tw:flex tw:justify-center tw:py-6"
                      >
                        {hasMore ? (
                          loadingMore ? (
                            <div className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:text-gray-600">
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
                              Loading more…
                            </div>
                          ) : (
                            <span className="tw:text-xs tw:text-gray-500">
                              Scroll to load more
                            </span>
                          )
                        ) : (
                          <span className="tw:text-xs tw:text-gray-500">
                            No more organizers
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="tw:h-10" />
        </div>
      </div>
    </>
  );
}

export default AllOrganizers;
