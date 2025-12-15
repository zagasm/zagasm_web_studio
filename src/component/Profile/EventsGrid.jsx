import React from "react";
import EventCard from "./EventCard";
import EventCardShimmer from "../Events/EventCardShimmer";

export default function EventsGrid({
  events,
  loading,
  error,
  isOwnProfile,
  isOrganiserProfile,
}) {
  if (loading) {
    return (
      <div className="row tw:mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardShimmer key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="tw:mt-4 tw:text-red-600">Failed to load events: {error}</p>
    );
  }

  if (!events?.length) {
    return (
      <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-16 tw:text-center tw:text-gray-600">
        <div className="tw:text-6xl">📆</div>
        <p className="tw:mt-3 tw:text-lg tw:font-medium">No events found</p>
        <p className="tw:text-sm">Create your first event to get started.</p>
      </div>
    );
  }

  return (
    <div className="tw:mt-4 tw:md:mt-6 row tw:mb-20 tw:md:mb-0">
      {events.map((e) => (
        <EventCard
          key={e.id}
          event={e}
          isOwnProfile={isOwnProfile}
          isOrganiserProfile={isOrganiserProfile}
        />
      ))}
    </div>
  );
}
