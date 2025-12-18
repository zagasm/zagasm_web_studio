// src/pages/search/SearchPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X } from "lucide-react";

import { api, authHeaders } from "../../lib/apiClient";
import { useAuth } from "../../pages/auth/AuthContext";
import { showError } from "../../component/ui/toast";

// Re-use your existing card + shimmer
import { EventCard, EventShimmer } from "../../component/Events/SingleEvent";

const RECENTS_KEY = "zagasm_search_recent_people";

function normalizeSearchResponse(raw) {
  if (!raw) return { people: [], events: [] };

  const items = Array.isArray(raw) ? raw : raw.data || [];
  const people = [];
  const events = [];

  items.forEach((item) => {
    if (!item || !item.type || !item.data) return;

    if (item.type === "event") {
      events.push(item.data);
    } else if (item.type === "organiser" || item.type === "user") {
      people.push(item);
    }
  });

  return { people, events };
}

function initialsFromName(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase() || "?";
}

function getDisplayName(item) {
  const data = item?.data || {};

  // Organiser search result
  if (item?.type === "organiser") {
    // if organiser is a string, use it
    if (typeof data.organiser === "string") return data.organiser;

    // if organiser is an object, pick a good label
    if (data.organiser && typeof data.organiser === "object") {
      return (
        data.organiser.organiser ||
        data.organiser.name ||
        data.organiser.userName ||
        data.organiser.email ||
        "Organizer"
      );
    }

    // some APIs might return name directly
    return data.name || data.userName || data.email || "Organizer";
  }

  // Normal user search result
  return data.name || data.firstName || data.userName || data.email || "User";
}

function getPersonId(item) {
  const data = item?.data || {};

  // organiser result
  if (item?.type === "organiser") {
    if (typeof data.organiser === "object" && data.organiser?.id)
      return data.organiser.id;
    return data.id || data.userId || null;
  }

  // user result
  return data.id || data.userId || null;
}

function getAvatarUrl(item) {
  const data = item?.data || {};

  if (item?.type === "organiser") {
    // organiser might be object or string
    if (typeof data.organiser === "object") {
      return data.organiser.profileImage || data.organiser.profileUrl || null;
    }
    return data.profileImage || null;
  }

  return data.profileUrl || data.profileImage || null;
}

function PersonRow({ item, onClick }) {
  const isOrganiser = item.type === "organiser";

  const name = getDisplayName(item);
  const subtitle = isOrganiser ? "Event organiser" : "User";
  const avatarUrl = getAvatarUrl(item);
  const initials = initialsFromName(name);

  // console.log(item)

  return (
    <button
      type="button"
      onClick={onClick}
      className="tw:w-full tw:flex tw:items-center tw:gap-3 tw:py-3 tw:px-1 tw:rounded-2xl tw:hover:bg-zinc-50 tw:transition-colors"
    >
      <div className="tw:w-14 tw:h-14 tw:rounded-full tw:overflow-hidden tw:shrink-0 tw:bg-lightPurple tw:flex tw:items-center tw:justify-center tw:font-semibold">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="tw:w-full tw:h-full tw:object-cover"
          />
        ) : (
          <span className="tw:text-primary">{initials}</span>
        )}
      </div>

      <div className="tw:flex tw:flex-col tw:text-left tw:overflow-hidden">
        <div className="tw:flex tw:items-center">
          <span className="tw:text-base tw:font-semibold tw:text-black tw:truncate">
            {name}
          </span>
          {item.data.has_active_subscription && (
            <img width={15} src="/images/verifiedIcon.svg" alt="" />
          )}
        </div>
        <span className="tw:text-sm tw:text-zinc-500 tw:truncate">
          {subtitle}
        </span>
      </div>
    </button>
  );
}

export default function SearchPage() {
  const navigate = useNavigate();
  const { token } = useAuth() || {};

  const [query, setQuery] = useState("");
  const [people, setPeople] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [trendingEvents, setTrendingEvents] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(false);

  const fetchTrending = async () => {
    try {
      setLoadingTrending(true);
      const res = await api.get("/api/v1/recommendations/trending/search", {
        ...authHeaders(token),
      });

      setTrendingEvents(res?.data?.data ?? []);
    } catch (err) {
      console.error(err);
      // don't toast here - trending is "nice to have"
    } finally {
      setLoadingTrending(false);
    }
  };

  useEffect(() => {
    fetchTrending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // persistent recent people
  const [recentPeople, setRecentPeople] = useState([]);

  // load recent from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENTS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setRecentPeople(parsed);
      }
    } catch (e) {
      console.error("Failed to read recents", e);
    }
  }, []);

  // small debounce
  const [pendingQuery, setPendingQuery] = useState("");
  useEffect(() => {
    const id = setTimeout(() => {
      const t = pendingQuery.trim();

      if (!t) {
        // reset search results view when input is empty
        setPeople([]);
        setEvents([]);
        setHasSearched(false);
        return;
      }

      doSearch(t);
    }, 400);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuery]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleClear = () => {
    setQuery("");
    setPendingQuery("");
    setPeople([]);
    setEvents([]);
    setHasSearched(false);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setPendingQuery(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    doSearch(query.trim());
  };

  const updateRecents = (newPeople) => {
    if (!Array.isArray(newPeople) || newPeople.length === 0) return;

    setRecentPeople((prev) => {
      const map = new Map();

      // new first so they appear at top
      [...newPeople, ...prev].forEach((item) => {
        if (!item || !item.type || !item.data) return;
        const key = `${item.type}-${item.data.id}`;
        if (!map.has(key)) {
          map.set(key, item);
        }
      });

      const merged = Array.from(map.values()).slice(0, 10); // keep last 10
      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(merged));
      } catch (e) {
        console.error("Failed to write recents", e);
      }

      return merged;
    });
  };

  const doSearch = async (term) => {
    try {
      setLoading(true);
      setHasSearched(true);

      const res = await api.get("/api/v1/search", {
        params: { q: term },
        ...authHeaders(token),
      });

      const { people: foundPeople, events: foundEvents } =
        normalizeSearchResponse(res.data);

      setPeople(foundPeople);
      setEvents(foundEvents);
      updateRecents(foundPeople);
    } catch (err) {
      console.error(err);
      showError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasResults = useMemo(
    () => people.length > 0 || events.length > 0,
    [people, events]
  );

  const peopleToShow = people.length > 0 ? people : recentPeople;
  const showPeopleSection = peopleToShow.length > 0;

  return (
    <div className="tw:min-h-screen tw:bg-white tw:flex tw:justify-center tw:py-16 tw:md:py-20 tw:px-3 tw:sm:px-4">
      <div className="tw:w-full tw:max-w-6xl tw:pb-10 tw:pt-8">
        {/* Top search bar */}
        <div className="tw:flex tw:items-center tw:gap-3 tw:mb-6 tw:sm:mb-8">
          <button
            type="button"
            onClick={handleBack}
            className="tw:flex tw:items-center tw:justify-center tw:w-9 tw:h-9 tw:rounded-full tw:hover:bg-zinc-100 tw:transition-colors"
          >
            <ArrowLeft className="tw:w-5 tw:h-5 tw:text-black" />
          </button>

          <form
            onSubmit={handleSubmit}
            className="tw:flex-1 tw:relative tw:flex tw:items-center"
          >
            <div className="tw:flex tw:items-center tw:bg-white tw:border tw:border-[#F5F5F5] tw:rounded-full tw:px-3 tw:sm:px-4 tw:py-4 tw:w-full">
              <Search className="tw:w-5 tw:h-5 tw:text-zinc-500 tw:mr-2" />
              <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search events, creators or genres..."
                className="tw:flex-1 tw:bg-transparent tw:border-none tw:outline-none tw:text-sm tw:sm:text-base tw:text-black tw:placeholder:text-zinc-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="tw:flex tw:items-center tw:justify-center tw:w-7 tw:h-7 tw:rounded-full tw:hover:bg-white/60 tw:transition-colors"
                >
                  <X className="tw:w-4 tw:h-4 tw:text-zinc-500" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Loading state text */}
        {loading && (
          <div className="tw:mb-4 tw:text-sm tw:text-zinc-500">Searching…</div>
        )}

        {/* People / recent searches */}
        {showPeopleSection && (
          <section className="tw:mb-8">
            <span className="tw:text-lg tw:sm:text-xl tw:font-semibold tw:text-black tw:mb-3">
              Recent Searches
            </span>

            <div className="tw:flex tw:flex-col tw:gap-1">
              {peopleToShow.map((item) => (
                <PersonRow
                  key={`${item.type}-${item.data.id}`}
                  item={item}
                  onClick={() => {
                    const id = getPersonId(item);
                    if (!id) return;
                    navigate(`/profile/${id}`);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Trending events (initial load / when not searching) */}
        {!hasSearched && trendingEvents.length > 0 && (
          <section className="tw:mb-6">
            <span className="tw:text-lg tw:sm:text-xl tw:font-semibold tw:text-black tw:mb-6">
              Trending Searches
            </span>

            <div className="row tw:mx-0 tw:mt-3">
              {trendingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant="all"
                  onMore={() => {}}
                />
              ))}
            </div>
          </section>
        )}

        {/* Trending shimmer */}
        {!hasSearched && loadingTrending && trendingEvents.length === 0 && (
          <div className="row tw:mx-0 tw:mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <EventShimmer key={i} />
            ))}
          </div>
        )}

        {/* Events */}
        {events.length > 0 && (
          <section className="tw:mb-6">
            <span className="tw:text-lg tw:sm:text-xl tw:font-semibold tw:text-black tw:mb-3">
              Events
            </span>

            <div className="row tw:mx-0 tw:mt-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant="all"
                  onMore={() => {}}
                />
              ))}
            </div>
          </section>
        )}

        {/* Events shimmer while loading and no current events yet */}
        {loading && events.length === 0 && (
          <div className="row tw:mx-0 tw:mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <EventShimmer key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && hasSearched && !hasResults && (
          <div className="tw:mt-10 tw:text-center tw:text-zinc-500">
            <p className="tw:text-base tw:font-medium">
              No results found for “{query}”
            </p>
            <p className="tw:text-sm tw:mt-1">
              Try a different name, event title or genre.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
