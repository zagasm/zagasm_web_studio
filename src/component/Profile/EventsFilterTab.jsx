import React, { Fragment } from "react";
import { Tab } from "@headlessui/react";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "soon", label: "Soon" },
  { key: "live", label: "Live" },
  { key: "ended", label: "Ended" },
];

export default function EventsFilterTabs({ value, onChange }) {
  const selectedIndex = Math.max(
    0,
    FILTERS.findIndex((f) => f.key === value)
  );

  return (
    <Tab.Group
      selectedIndex={selectedIndex}
      onChange={(i) => onChange(FILTERS[i].key)}
    >
      <Tab.List className="tw:mt-2 tw:mb-4 tw:flex tw:rounded-2xl tw:bg-white tw:p-2 tw:ring-1 tw:ring-gray-200">
        {FILTERS.map((f) => (
          <Tab as={Fragment} key={f.key}>
            {({ selected }) => (
              <button
                style={{
                  borderRadius: 10,
                }}
                className={`tw:flex-1 tw:rounded-xl tw:px-4 tw:py-2 tw:text-sm tw:md:text-base tw:font-medium
                ${
                  selected
                    ? "tw:bg-purple-600 tw:text-white"
                    : "tw:text-gray-700 hover:tw:bg-gray-100"
                }`}
              >
                {f.label}
              </button>
            )}
          </Tab>
        ))}
      </Tab.List>
    </Tab.Group>
  );
}
