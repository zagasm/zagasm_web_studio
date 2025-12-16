import React, { useMemo, useState } from "react";
import EventsFilterTabs from "./EventsFilterTab";
import EventsGrid from "./EventsGrid";
import useMyEvents from "../../hooks/useMyEvents";

export default function ProfileTabs({ user, isOwnProfile }) {
  const [statusTab, setStatusTab] = useState("all");

  // ---------- MY PROFILE ----------
  const apiFilter = useMemo(() => {
    if (statusTab === "upcoming") return "soon";
    if (statusTab === "all") return "all";
    return statusTab; // live, ended
  }, [statusTab]);

  const {
    events: myEvents,
    loading: myEventsLoading,
    error: myEventsError,
  } = useMyEvents(apiFilter, user?.id);

  // ---------- ORGANISER PROFILE ----------
  const isOrganiserProfileData =
    !isOwnProfile && (!!user?.events || !!user?.allEvents);

  const organiserEventsByTab = useMemo(() => {
    const buckets = user?.events || null;

    const all =
      buckets?.all ?? (Array.isArray(user?.allEvents) ? user.allEvents : []);

    const upcoming =
      buckets?.upcoming ??
      (Array.isArray(user?.upcomingEvents) ? user.upcomingEvents : []);

    const live = buckets?.live ?? [];

    // IMPORTANT: many systems treat paused as "not live" / past-ish.
    // If you want "Ended" to include paused too:
    const endedStrict = buckets?.ended ?? [];
    const paused = buckets?.paused ?? [];
    const ended = [...endedStrict, ...paused];

    if (statusTab === "all") return all;
    if (statusTab === "upcoming") return upcoming;
    if (statusTab === "live") return live;
    if (statusTab === "ended") return ended;

    return all;
  }, [user, statusTab]);

  // ---------- choose source ----------
  const events = isOrganiserProfileData ? organiserEventsByTab : myEvents;
  const loading = isOrganiserProfileData ? false : myEventsLoading;
  const error = isOrganiserProfileData ? null : myEventsError;

  const heading = isOwnProfile ? "My Events" : "Events";

  return (
    <div className="tw:h-full tw:flex tw:flex-col">
      <div className="tw:lg:sticky tw:lg:top-0 tw:z-20 tw:bg-[#f5f5f7] tw:pb-3">
        <div className="tw:flex tw:items-center tw:justify-between tw:pt-3 tw:pb-2">
          <span className="tw:text-lg tw:md:text-xl tw:font-semibold tw:text-gray-900">
            {heading}
          </span>
        </div>

        <EventsFilterTabs value={statusTab} onChange={setStatusTab} />
      </div>

      <div className="tw:flex-1 tw:mt-3 tw:pb-20">
        <EventsGrid
          events={events}
          loading={loading}
          error={error}
          isOwnProfile={isOwnProfile}
          isOrganiserProfile={isOrganiserProfileData}
        />
      </div>
    </div>
  );
}
