import React, { useCallback, useEffect, useMemo, useState } from "react";
import SEO from "../../component/SEO";
import { useAuth } from "../auth/AuthContext";
import { useInView } from "react-intersection-observer";
import { showSuccess, showError } from "../../component/ui/toast";
import {
  PodiumShimmer,
  RowShimmer,
} from "../../component/Organizers/OrganisersShimmer";
import PodiumSection from "../../component/Organizers/PodiumSection";
import OrganizerRowCard from "../../component/Organizers/OrganiserRowCard";
import { rankSafe } from "../../component/Organizers/organiser.utils";

export default function AllOrganizers() {
  const { token } = useAuth();

  const [organizers, setOrganizers] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [initialError, setInitialError] = useState(null);

  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: "500px 0px",
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

        const normalized = list.map((o) => {
          const isFollowing =
            typeof o.isFollowing === "boolean" ? o.isFollowing : !!o.following;

          return {
            ...o,
            isFollowing,
            following: isFollowing, // keep both in sync so old components don’t break
          };
        });

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

  const sorted = useMemo(() => {
    return [...organizers].sort((a, b) => rankSafe(a) - rankSafe(b));
  }, [organizers]);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const [followLoading, setFollowLoading] = useState({});
  console.log(organizers);

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
      const isNowFollowing =
        typeof result.following === "boolean"
          ? result.following
          : !!result?.data?.following;

      setOrganizers((prev) =>
        prev.map((o) =>
          o.userId === organizerUserId
            ? { ...o, isFollowing: isNowFollowing, following: isNowFollowing }
            : o
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
        title="Top Organizers"
        description="See best rated organizers globally."
        keywords="zagasm studios, organizers, ranking"
      />

      <div className="tw:font-sans tw:bg-white tw:min-h-screen tw:pt-20 tw:md:pt-28 tw:px-2 tw:md:px-6">
        <div className="tw:max-w-3xl tw:mx-auto">
          {/* header (spans only) */}
          <div className="tw:flex tw:items-start tw:justify-between tw:gap-4 tw:mt-5 tw:md:mt-0">
            <div className="tw:flex tw:flex-col">
              <span className="tw:text-2xl tw:md:text-3xl tw:font-semibold tw:text-gray-900">
                Top Organizers
              </span>
              <span className="tw:text-xs tw:md:text-sm tw:text-gray-600 tw:mt-1">
                See best rated organizers globally
              </span>
            </div>
          </div>

          {/* main card */}
          <div className="tw:mt-6 tw:bg-white tw:md:border tw:md:border-gray-100 tw:rounded-3xl tw:md:p-6 tw:md:shadow-sm tw:relative tw:pb-10">
            {/* initial loading */}
            {loadingList && organizers.length === 0 ? (
              <div className="tw:space-y-5 tw:py-2">
                <PodiumShimmer />
                <div className="tw:space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <RowShimmer key={i} />
                  ))}
                </div>
              </div>
            ) : initialError && organizers.length === 0 ? (
              <div className="tw:text-center tw:py-10">
                <span className="tw:text-sm tw:text-red-600">
                  {initialError}
                </span>
              </div>
            ) : organizers.length === 0 ? (
              <div className="tw:text-center tw:py-10">
                <span className="tw:text-sm tw:text-gray-600">
                  No organisers to display yet.
                </span>
              </div>
            ) : (
              <>
                <PodiumSection top3={top3} />

                <div className="tw:mt-6 tw:space-y-3">
                  {rest.map((org) => (
                    <OrganizerRowCard
                      key={org.id}
                      org={org}
                      onToggleFollow={toggleFollow}
                      loading={!!followLoading[org.userId]}
                    />
                  ))}
                </div>

                {/* infinite scroll trigger */}
                <div
                  ref={hasMore ? loadMoreRef : undefined}
                  className="tw:flex tw:justify-center tw:py-6"
                >
                  {hasMore ? (
                    loadingMore ? (
                      <div className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:text-gray-600">
                        <div className="tw:h-4 tw:w-4 tw:rounded-full tw:border-2 tw:border-gray-300 tw:border-t-gray-700 tw:animate-spin" />
                        <span className="tw:text-sm">Loading more…</span>
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

          <div className="tw:h-10" />
        </div>
      </div>
    </>
  );
}
