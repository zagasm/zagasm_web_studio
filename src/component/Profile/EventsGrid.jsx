import React from "react";
import EventCard from "./EventCard";

export default function EventsGrid({ events, loading, error }) {
  if (loading) {
    return (
      <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 xl:tw:grid-cols-3 tw:gap-5 tw:mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="tw:h-64 tw:rounded-2xl tw:bg-gray-100 tw:animate-pulse"
          />
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
    <div className="tw:mt-4 tw:md:mt-10 row tw:mb-20 tw:md:mb-0">
      {events.map((e) => (
        <EventCard key={e.id} event={e} />
      ))}
    </div>
  );
}
