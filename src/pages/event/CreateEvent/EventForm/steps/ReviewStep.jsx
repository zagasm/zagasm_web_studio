import React from "react";
import {
  flattenLaravelErrors,
  prettifyPath,
} from "../../../../../utils/helpers";

export default function ReviewStep({
  collected,
  formErrors,
  isSubmitting,
  onBack,
  onPublish,
  timezoneLabel,
  eventImage,
  performers,
  onGoToStep
}) {
  const {
    title,
    organizer,
    date,
    time,
    location,
    genre,
    description,
    price,
    currency,
    maxTickets,
    ticketLimit,
    streamingOption,
    enableReplay,
    streamingDuration,
    visibility,
    matureContent,
  } = collected || {};
  const flat = React.useMemo(
    () => flattenLaravelErrors(formErrors),
    [formErrors]
  );

  const needPoster = Boolean(formErrors?.step_3?.poster?.length);

  return (
    <div className="tw:bg-white tw:rounded-2xl tw:p-4 sm:tw:p-6 tw:border tw:border-gray-100">
      {!!flat.length && (
        <div className="tw:mb-4 tw:rounded-xl tw:bg-red-50 tw:border tw:border-red-200 tw:p-3">
          <div className="tw:text-sm tw:text-red-700 tw:font-medium">
            Please fix the errors below:
          </div>
          <ul className="tw:text-sm tw:text-red-700 tw:mt-1 tw:list-disc tw:list-inside tw:space-y-1">
            {flat.map(({ path, messages }) => (
              <li key={path}>
                {/* If you want the label clickable to jump to that step: */}
                <button
                  type="button"
                  className="tw:underline tw:underline-offset-2 tw:text-red-700 hover:tw:text-red-800"
                  onClick={() => {
                    const match = path.match(/^step_(\d+)/);
                    if (match && onGoToStep) onGoToStep(Number(match[1]));
                  }}
                >
                  {prettifyPath(path)}:
                </button>{" "}
                {messages.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {needPoster && (
        <div className="tw:bg-yellow-50 tw:border tw:border-yellow-200 tw:text-yellow-800 tw:text-sm tw:rounded-xl tw:p-3 tw:mb-4">
          Add at least one <b>poster</b> in <b>Media</b>.
        </div>
      )}

      {/* Image */}
      <section className="tw:mb-6">
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
          <h3 className="tw:text-base tw:font-semibold">Event Image</h3>
          <button
            onClick={() => window?.scrollTo(0, 0)}
            className="tw:text-primary"
          >
            Edit
          </button>
        </div>
        {eventImage ? (
          <img
            src={URL.createObjectURL(eventImage)}
            alt="Event"
            className="tw:max-h-72 tw:rounded-xl tw:object-cover tw:border tw:border-gray-100"
          />
        ) : (
          <div className="tw:h-40 tw:flex tw:items-center tw:justify-center tw:rounded-xl tw:bg-gray-50 tw:text-gray-500">
            No image uploaded
          </div>
        )}
      </section>

      {/* Performers */}
      {performers?.length > 0 && (
        <section className="tw:mb-6">
          <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
            <h3 className="tw:text-base tw:font-semibold">Guest Performers</h3>
            <button className="tw:text-primary">Edit</button>
          </div>
          <div className="tw:grid tw:grid-cols-3 sm:tw:grid-cols-4 md:tw:grid-cols-6 tw:gap-3">
            {performers.map((p) => (
              <div key={p.id} className="tw:text-center">
                <div className="tw:h-20 tw:w-20 tw:mx-auto tw:rounded-full tw:overflow-hidden tw:bg-gray-100 tw:flex tw:items-center tw:justify-center">
                  {p.image ? (
                    <img
                      src={URL.createObjectURL(p.image)}
                      className="tw:h-full tw:w-full tw:object-cover"
                    />
                  ) : (
                    <span className="tw:text-gray-400">👤</span>
                  )}
                </div>
                <div className="tw:text-xs tw:mt-1 tw:truncate">
                  {p.name || "Unnamed"}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Details */}
      <section className="tw:mb-6">
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
          <h3 className="tw:text-base tw:font-semibold">Event Details</h3>
          <button className="tw:text-primary">Edit</button>
        </div>
        <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
          <div>
            <div className="tw:text-xs tw:text-gray-500">Title</div>
            <div>{title || "—"}</div>
          </div>
          <div>
            <div className="tw:text-xs tw:text-gray-500">Organizer</div>
            <div>{organizer || "—"}</div>
          </div>
          <div>
            <div className="tw:text-xs tw:text-gray-500">Date & Time</div>
            <div>
              {date ? new Date(date).toLocaleDateString() : "—"}{" "}
              {time ? `at ${time}` : ""}
              <div className="tw:text-xs tw:text-gray-500">{timezoneLabel}</div>
            </div>
          </div>
          <div>
            <div className="tw:text-xs tw:text-gray-500">Location</div>
            <div>{location || "—"}</div>
          </div>
          <div>
            <div className="tw:text-xs tw:text-gray-500">Genre</div>
            <div>{genre || "—"}</div>
          </div>
          <div className="md:tw:col-span-2">
            <div className="tw:text-xs tw:text-gray-500">Description</div>
            <div>{description || "—"}</div>
          </div>
        </div>
      </section>

      {/* Ticketing */}
      <section className="tw:mb-6">
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
          <h3 className="tw:text-base tw:font-semibold">Ticketing</h3>
          <button className="tw:text-primary">Edit</button>
        </div>
        <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
          <div>
            <div className="tw:text-xs tw:text-gray-500">Availability</div>
            <div className="tw:capitalize">
              {maxTickets === "limited"
                ? `Limited (${ticketLimit || "?"})`
                : "Unlimited"}
            </div>
          </div>
          <div>
            <div className="tw:text-xs tw:text-gray-500">Price</div>
            <div>
              {currency ? "" : ""}
              {typeof price === "number" ? price.toFixed(2) : price || "0.00"}
            </div>
          </div>
        </div>
      </section>

      {/* Streaming */}
      <section className="tw:mb-6">
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
          <h3 className="tw:text-base tw:font-semibold">Streaming</h3>
          <button className="tw:text-primary">Edit</button>
        </div>
        <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
          <div>
            <div className="tw:text-xs tw:text-gray-500">Option</div>
            <div>{streamingOption || "—"}</div>
          </div>
          {enableReplay && (
            <div>
              <div className="tw:text-xs tw:text-gray-500">Replay</div>
              <div>{streamingDuration || "24"} Hours</div>
            </div>
          )}
        </div>
      </section>

      {/* Access */}
      <section className="tw:mb-2">
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
          <h3 className="tw:text-base tw:font-semibold">Access & Visibility</h3>
          <button className="tw:text-primary">Edit</button>
        </div>
        <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
          <div>
            <div className="tw:text-xs tw:text-gray-500">Visibility</div>
            <div className="tw:capitalize">{visibility || "public"}</div>
          </div>
          <div>
            <div className="tw:text-xs tw:text-gray-500">Mature Content</div>
            <div>{matureContent ? "Yes" : "No"}</div>
          </div>
        </div>
      </section>

      <div className="tw:flex tw:justify-between tw:mt-6">
        <button
          style={{
            borderRadius: 20,
          }}
          type="button"
          onClick={onBack}
          className="tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-gray-200 hover:tw:bg-gray-50"
        >
          Back
        </button>
        <button
          style={{
            borderRadius: 20,
          }}
          type="button"
          onClick={onPublish}
          disabled={isSubmitting}
          className="tw:px-4 tw:py-2 tw:rounded-xl tw:bg-linear-to-br tw:from-primary tw:to-primarySecond tw:text-white hover:tw:bg-primarySecond disabled:tw:opacity-70"
        >
          {isSubmitting ? "Creating…" : "Create Event"}
        </button>
      </div>
    </div>
  );
}
