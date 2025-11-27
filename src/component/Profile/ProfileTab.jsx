import React, { useState } from "react";
import EventsFilterTabs from "./EventsFilterTab";
import EventsGrid from "./EventsGrid";
import useMyEvents from "../../hooks/useMyEvents";

export default function ProfileTabs() {
  const [statusTab, setStatusTab] = useState("upcoming");

  // map to your API filter
  const apiFilter = statusTab === "upcoming" ? "soon" : statusTab;
  const { events, loading, error } = useMyEvents(apiFilter);

  return (
    <div className="tw:h-full tw:flex tw:flex-col">
      {/* sticky only on lg+; on mobile/md it scrolls normally */}
      <div className="tw:lg:sticky tw:lg:top-0 tw:z-20 tw:bg-[#f5f5f7] tw:pb-3">
        <div className="tw:flex tw:items-center tw:justify-between tw:pt-3 tw:pb-2">
          <span className="tw:text-lg tw:md:text-xl tw:font-semibold tw:text-gray-900">
            My Events
          </span>
        </div>

        <EventsFilterTabs value={statusTab} onChange={setStatusTab} />
      </div>

      <div className="tw:flex-1 tw:mt-3 tw:pb-20">
        <EventsGrid events={events} loading={loading} error={error} />
      </div>
    </div>
  );
}
