import React, { Fragment, useState } from "react";
import { Tab } from "@headlessui/react";
import EventsFilterTabs from "./EventsFilterTab";
import EventsGrid from "./EventsGrid";
import AboutPanel from "./AboutPanel";
import useMyEvents from "../../hooks/useMyEvents";

export default function ProfileTabs({ user }) {
  const [filter, setFilter] = useState("all");
  const { events, loading, error } = useMyEvents(filter);

  return (
    <Tab.Group as="div" className="tw:mt-6">
      <div className="tw:flex tw:flex-col tw:gap-4">
        {/* top-level tabs: Events / About */}
        <Tab.List className="tw:flex tw:rounded-2xl tw:bg-gray-50 tw:p-2">
          {["Events", "About"].map((t) => (
            <Tab as={Fragment} key={t}>
              {({ selected }) => (
                <button
                  style={{
                    borderRadius: 20,
                  }}
                  className={`tw:flex-1 tw:rounded-xl tw:px-4 tw:py-3 tw:text-sm tw:md:text-base tw:font-medium tw:transition
                  ${
                    selected
                      ? "tw:bg-purple-100 tw:text-purple-700 tw:outline-none tw:border-none"
                      : "tw:text-gray-700 hover:tw:bg-gray-100"
                  }`}
                >
                  {t}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {/* Events */}
          <Tab.Panel>
            <EventsFilterTabs value={filter} onChange={setFilter} />
            <EventsGrid events={events} loading={loading} error={error} />
          </Tab.Panel>

          {/* About */}
          <Tab.Panel>
            <AboutPanel user={user} />
          </Tab.Panel>
        </Tab.Panels>
      </div>
    </Tab.Group>
  );
}
