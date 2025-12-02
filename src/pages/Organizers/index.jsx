import React, { useState, useEffect, useCallback } from "react";
import SideBarNav from "../pageAssets/SideBarNav";
import SEO from "../../component/SEO";
import { useAuth } from "../auth/AuthContext";
import { useInView } from "react-intersection-observer";
import { showSuccess, showError } from "../../component/ui/toast"; // <-- updated

// ---- tiny util (word-safe)
const truncate = (text, max = 48) => {
  if (!text || typeof text !== "string") return "";
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const safe = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return safe.replace(/[.,:;!?-]*$/, "") + "…";
};

// ---- stable, random fallback avatar
const randomAvatar = (id) => {
  const safeId = String(id || "");
  let hash = 0;
  for (let i = 0; i < safeId.length; i++) {
    hash = (hash * 31 + safeId.charCodeAt(i)) >>> 0;
  }
  const n = hash % 50;
  const gender = n % 2 === 0 ? "men" : "women";
  return `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;
};

const StatPill = ({ label, value }) => (
  <div className="tw:inline-flex tw:items-center tw:gap-1 tw:text-[11px] tw:px-2 tw:py-1 tw:bg-gray-50 tw:text-gray-700 tw:rounded-full tw:ring-1 tw:ring-gray-200">
    <span className="tw:font-semibold">{value ?? 0}</span>
    <span className="tw:text-gray-500">{label}</span>
  </div>
);

const OrganizerCard = ({ org, onToggle, loading }) => {
  const name = org.organiser || "Organizer";
  const imgSrc =
    !org.profileImage ||
    org.profileImage === "null" ||
    org.profileImage === "undefined"
      ? randomAvatar(org.id)
      : org.profileImage;

  const isFollowing = !!org.following;

  return (
    <div className="tw:h-full tw:bg-white tw:border tw:border-gray-100 tw:rounded-2xl tw:p-4 tw:flex tw:flex-col tw:gap-3 tw:shadow-sm">
      <div className="tw:flex tw:items-center tw:gap-3">
        <img
          src={imgSrc}
          alt={name}
          className="tw:w-14 tw:h-14 tw:rounded-full tw:object-cover tw:ring-2 tw:ring-white tw:shadow-sm"
          loading="lazy"
        />
        <div className="tw:min-w-0 tw:flex-1">
          <div className="tw:text-sm tw:font-medium tw:truncate" title={name}>
            {truncate(name, 28)}
          </div>
          <div
            className="tw:text-xs tw:text-gray-500 tw:truncate"
            title={org.email}
          >
            {org.email || "No email"}
          </div>
          <div className="tw:text-xs tw:text-gray-500 tw:truncate">
            {org.phone || "No phone"}
          </div>
        </div>
      </div>

      <div className="tw:flex tw:flex-wrap tw:gap-2">
        <StatPill label="events" value={org.totalEventsCreated} />
        <StatPill label="followers" value={org.numberOfFollowers} />
        <StatPill label="views" value={org.total_views} />
      </div>

      <div className="tw:mt-auto tw:flex tw:items-center tw:justify-between tw:gap-3">
        <div className="tw:text-[11px] tw:text-gray-500" />
        <button
          style={{
            borderRadius: 20,
          }}
          type="button"
          disabled={loading}
          onClick={() => onToggle(org.userId)}
          className={`tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-xl tw:px-3 tw:py-1.5 tw:text-sm tw:font-medium tw:ring-1 tw:transition ${
            isFollowing
              ? "tw:bg-primary tw:text-white tw:ring-primary"
              : "tw:bg-lightPurple tw:text-black tw:ring-transparent hover:tw:bg-primary/10"
          } ${loading ? "tw:opacity-70 tw:cursor-not-allowed" : ""}`}
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

        setOrganizers((prev) => (isMore ? [...prev, ...list] : list));

        const next = data?.links?.next ?? null;
        setNextPageUrl(next);
        setHasMore(!!next);

        if (!isMore) setInitialError(null);
      } catch (e) {
        // If this happened during "load more", stop further loading and show “No more organizers”
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

  const toggleFollow = async (organizerId) => {
    setFollowLoading((p) => ({ ...p, [organizerId]: true }));
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/follow/${organizerId}`,
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
      // result = { message: "...", following: true|false }
      setOrganizers((prev) =>
        prev.map((o) =>
          o.id === organizerId ? { ...o, following: result.following } : o
        )
      );

      // Success toast from server message
      showSuccess(
        result?.message ||
          (result.following
            ? "User followed successfully"
            : "User unfollowed successfully")
      );
    } catch (e) {
      showError("Something went wrong. Try again.");
    } finally {
      setFollowLoading((p) => ({ ...p, [organizerId]: false }));
    }
  };

  return (
    <>
      <SEO
        title="Event Organizers - Connect with Top Event Hosts"
        description="Discover and follow the best event organizers at Zagasm Studios. Connect with professional event hosts, venue managers, and entertainment producers for concerts, festivals, parties and more."
        keywords="zagasm studios, event organizers, event hosts, venue managers, concert organizers, party planners, festival organizers, entertainment producers, follow organizers, professional event management"
      />

      <div className="container-fluid tw:pt-20 tw:md:pt-28">
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
            <div className="row g-4">
              <div className="col-12">
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
                              loading={!!followLoading[org.id]}
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
