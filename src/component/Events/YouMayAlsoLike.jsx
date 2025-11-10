import React from "react";
import { Link } from "react-router-dom";
import { formatEventDateTime } from "../../utils/ui";

export default function YouMayAlsoLike({ recs = [], posterFallback }) {
  if (!recs.length) return null;
  return (
    <div className="tw:lg:sticky tw:lg:top-6">
      <h4 className="tw:text-base tw:font-semibold tw:mb-3">
        You may also like
      </h4>
      <div className="tw:space-y-3">
        {recs.slice(0, 6).map((ev) => (
          <Link
            key={ev.id}
            to={`/event/${ev.id}`}
            className="tw:block tw:bg-white tw:border tw:border-gray-100 tw:rounded-2xl tw:overflow-hidden hover:tw:shadow-sm"
          >
            <img
              src={ev.poster?.[0]?.url || posterFallback}
              alt={ev.title}
              className="tw:w-full tw:h-36 tw:object-cover"
            />
            <div className="tw:p-4">
              <div className="tw:font-medium tw:truncate">{ev.title}</div>
              <div className="tw:text-sm tw:text-gray-500 tw:truncate">
                {formatEventDateTime(ev.eventDate, ev.startTime)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
