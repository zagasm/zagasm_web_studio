import React, { useEffect, useRef, useState } from "react";
import EventCard from "./EventCard";
import EventCardShimmer from "../Events/EventCardShimmer";

export default function EventsGrid({
  events,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  error,
  isOwnProfile,
  isOrganiserProfile,
  refreshEvents,
}) {
  const [items, setItems] = useState(events ?? []);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  // keep local list in sync when parent updates (new fetch, filter, etc.)
  useEffect(() => {
    setItems(events ?? []);
  }, [events]);

  useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (!hasMore || loading || loadingMore || !observerRef.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting) {
          loadMoreRef.current?.();
        }
      },
      {
        root: null,
        rootMargin: "200px 0px",
        threshold: 0.1,
      },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, items.length]);

  const handleDeleted = (id) => {
    setItems((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUpdated = (updatedEvent) => {
    if (!updatedEvent?.id) return;

    setItems((prev) =>
      prev.map((item) => (item.id === updatedEvent.id ? { ...item, ...updatedEvent } : item))
    );
  };

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

  if (!items?.length) {
    return (
      <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:py-16 tw:text-center tw:text-gray-600">
        <div className="tw:text-6xl">📆</div>
        <span className="tw:block tw:mt-3 tw:text-lg tw:font-medium">No events found</span>
        <span className="tw:block tw:text-sm">Create your first event to get started.</span>
      </div>
    );
  }

  return (
    <>
      <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:mt-4 tw:md:mt-6 row tw:mb-6 tw:md:mb-0">
        {items.map((e) => (
          <EventCard
            key={e.id}
            event={e}
            isOwnProfile={isOwnProfile}
            isOrganiserProfile={isOrganiserProfile}
            onDeleted={handleDeleted}
            onUpdated={handleUpdated}
            refreshEvents={refreshEvents}
          />
        ))}
      </div>

      <div ref={observerRef} className="tw:h-4 tw:w-full" />

      {loadingMore ? (
        <div className="row tw:pb-12">
          {Array.from({ length: 2 }).map((_, i) => (
            <EventCardShimmer key={`more-${i}`} />
          ))}
        </div>
      ) : null}
    </>
  );
}
