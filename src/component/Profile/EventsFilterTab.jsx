import React from "react";

const FILTERS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "live", label: "Live" },
  { key: "ended", label: "Ended" },
];

export default function EventsFilterTabs({ value, onChange }) {
  return (
    <div className="tw:flex tw:rounded-2xl tw:bg-white tw:p-1 tw:ring-1 tw:ring-gray-200">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          style={{
            borderRadius: 20,
          }}
          type="button"
          onClick={() => onChange(f.key)}
          className={`tw:flex-1 tw:rounded-xl tw:px-4 tw:py-2 tw:text-sm tw:md:text-base tw:font-medium tw:transition
            ${
              value === f.key
                ? "tw:bg-primary tw:text-white"
                : "tw:text-gray-700 tw:hover:bg-gray-100"
            }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
