import React, { useState } from "react";
import EventsFilterTabs from "./EventsFilterTab";
import EventsGrid from "./EventsGrid";
import useMyEvents from "../../hooks/useMyEvents";

export default function ProfileTabs({ user, isOwnProfile }) {
  const [statusTab, setStatusTab] = useState("upcoming");

  // map to your API filter for "my events"
  const apiFilter = statusTab === "upcoming" ? "soon" : statusTab;

  // still call the hook at the top level (React rules)
  const {
    events: myEvents,
    loading: myEventsLoading,
    error: myEventsError,
  } = useMyEvents(apiFilter, user?.id);

  const isOrganiserProfileData = !isOwnProfile && !!user?.allEvents; // organiser API response

  let events = myEvents;
  let loading = myEventsLoading;
  let error = myEventsError;

  // If this is an organiser profile fetched from organiser endpoint,
  // use the events that came from that response instead of myEvents.
  if (isOrganiserProfileData) {
    loading = false;
    error = null;

    if (statusTab === "upcoming") {
      events = user?.upcomingEvents || [];
    } else {
      // For now, treat other tabs as "all events".
      // You can later filter user.allEvents by status (live, past, etc.).
      events = user?.allEvents || [];
    }
  }

  const heading = isOwnProfile ? "My Events" : "Events";

  return (
    <div className="tw:h-full tw:flex tw:flex-col">
      {/* sticky only on lg+; on mobile/md it scrolls normally */}
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
