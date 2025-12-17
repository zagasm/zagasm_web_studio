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
  performers,
  onGoToStep,
  posterImages = [],
  posterVideos = [],
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
    hasBackstage,
    backstagePrice,
  } = collected || {};


  const flat = React.useMemo(
    () => flattenLaravelErrors(formErrors),
    [formErrors]
  );
  const needPoster = Boolean(formErrors?.step_3?.poster?.length);

  const hasImages = Array.isArray(posterImages) && posterImages.length > 0;
  const hasVideos = Array.isArray(posterVideos) && posterVideos.length > 0;
  const hasAnyPoster = hasImages || hasVideos;

  return (
    <div className="tw:bg-white tw:rounded-2xl tw:p-4 tw:sm:p-6 tw:border tw:border-gray-100">
      {!!flat.length && (
        <div className="tw:mb-4 tw:rounded-xl tw:bg-red-50 tw:border tw:border-red-200 tw:p-3">
          <div className="tw:text-sm tw:text-red-700 tw:font-medium">
            Please fix the errors below:
          </div>
          <ul className="tw:text-sm tw:text-red-700 tw:mt-1 tw:list-disc tw:list-inside tw:space-y-1">
            {flat.map(({ path, messages }) => (
              <li key={path}>
                <button
                  type="button"
                  className="tw:underline tw:underline-offset-2 tw:text-red-700 tw:hover:text-red-800"
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

      {/* ✅ Poster Media (images + videos) */}
      <section className="tw:mb-6">
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
          <span className="tw:block tw:text-xl tw:md:text-2xl tw:font-semibold">
            Poster Media{" "}
            {hasAnyPoster && (
              <span className="tw:text-gray-500 tw:font-normal tw:ml-1">
                (
                {hasImages
                  ? `${posterImages.length} image${posterImages.length > 1 ? "s" : ""
                  }`
                  : ""}
                {hasImages && hasVideos ? ", " : ""}
                {hasVideos
                  ? `${posterVideos.length} video${posterVideos.length > 1 ? "s" : ""
                  }`
                  : ""}
                )
              </span>
            )}
          </span>
          <button
            type="button"
            className="tw:text-primary"
            onClick={() => onGoToStep?.(2)}
          >
            Edit
          </button>
        </div>

        {!hasAnyPoster ? (
          <div className="tw:h-40 tw:flex tw:flex-col tw:items-center tw:justify-center tw:rounded-xl tw:bg-gray-50 tw:text-gray-500">
            No posters added yet
            <button
              type="button"
              className="tw:mt-2 tw:text-primary tw:underline"
              onClick={() => onGoToStep?.(2)}
            >
              Add posters
            </button>
          </div>
        ) : (
          <div className="tw:space-y-4">
            {hasImages && (
              <div>
                <div className="tw:text-xs tw:text-gray-500 tw:mb-2">
                  Images
                </div>
                <div className="tw:grid tw:grid-cols-2 tw:sm:grid-cols-3 tw:md:grid-cols-4 tw:gap-3">
                  {posterImages.map((f, i) => (
                    <figure
                      key={`img-${i}-${f.name}`}
                      className="tw:rounded-xl tw:overflow-hidden tw:border tw:border-gray-200 tw:bg-white tw:shadow-sm"
                    >
                      <img
                        src={URL.createObjectURL(f)}
                        alt={f.name || `poster-image-${i}`}
                        className="tw:w-full tw:h-40 tw:object-cover"
                      />
                      <figcaption className="tw:text-[11px] tw:text-gray-600 tw:px-2 tw:py-1 tw:truncate">
                        {f.name || "image"}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {hasVideos && (
              <div>
                <div className="tw:text-xs tw:text-gray-500 tw:mb-2">
                  Videos
                </div>
                <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:md:grid-cols-3 tw:gap-3">
                  {posterVideos.map((f, i) => (
                    <figure
                      key={`vid-${i}-${f.name}`}
                      className="tw:rounded-xl tw:overflow-hidden tw:border tw:border-gray-200 tw:bg-white tw:shadow-sm"
                    >
                      <video
                        src={URL.createObjectURL(f)}
                        controls
                        className="tw:w-full tw:h-44 tw:bg-black tw:object-contain"
                      />
                      <figcaption className="tw:text-[11px] tw:text-gray-600 tw:px-2 tw:py-1 tw:truncate">
                        {f.name || "video"}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Performers */}
      {performers?.length > 0 && (
        <section className="tw:mb-6">
          <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
            <span className="tw:block tw:text-xl tw:md:text-2xl tw:font-semibold">Guest Performers</span>
            <button
              type="button"
              className="tw:text-primary"
              onClick={() => onGoToStep?.(2)}
            >
              Edit
            </button>
          </div>
          <div className="tw:grid tw:grid-cols-3 tw:sm:grid-cols-4 tw:md:grid-cols-6 tw:gap-3">
            {performers.map((p) => (
              <div key={p.id} className="tw:text-center">
                <div className="tw:h-20 tw:w-20 tw:mx-auto tw:rounded-full tw:overflow-hidden tw:bg-gray-100 tw:flex tw:items-center tw:justify-center">
                  {p.image ? (
                    <img
                      src={URL.createObjectURL(p.image)}
                      className="tw:h-full tw:w-full tw:object-cover"
                      alt={p.name || "Performer"}
                    />
                  ) : (
                    <span className="tw:text-gray-400">👤</span>
                  )}
                </div>
                <div className="tw:text-xs tw:mt-1 tw:truncate">
                  {p.name || "Unnamed"}
                </div>
                {p.user_name && (
                  <div className="tw:text-[11px] tw:text-gray-500 tw:truncate">
                    {p.user_name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Details */}
      <section className="tw:mb-6">
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
          <span className="tw:block tw:text-xl tw:md:text-2xl tw:font-semibold">Event Details</span>
          <button
            type="button"
            className="tw:text-primary"
            onClick={() => onGoToStep?.(1)}
          >
            Edit
          </button>
        </div>
        <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4">
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
          <div className="tw:md:col-span-2">
            <div className="tw:text-xs tw:text-gray-500">Description</div>
            <div>{description || "—"}</div>
          </div>
        </div>
      </section>

      {/* Ticketing */}
      <section className="tw:mb-6">
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
          <span className="tw:block tw:text-xl tw:md:text-2xl tw:font-semibold">Ticketing</span>
          <button
            type="button"
            className="tw:text-primary"
            onClick={() => onGoToStep?.(3)}
          >
            Edit
          </button>
        </div>
        <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4">
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
              {typeof price === "number" ? price.toFixed(2) : price || "0.00"}
            </div>
          </div>
          <div>
            <div className="tw:text-xs tw:text-gray-500">Backstage</div>
            <div>
              {hasBackstage
                ? `Yes${backstagePrice ? ` - ${backstagePrice}` : ""}`
                : "No"}
            </div>
          </div>
        </div>
      </section>

      {/* Access */}
      <section className="tw:mb-2">
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
          <span className="tw:block tw:text-xl tw:md:text-2xl tw:font-semibold">Access & Visibility</span>
          <button
            type="button"
            className="tw:text-primary"
            onClick={() => onGoToStep?.(4)}
          >
            Edit
          </button>
        </div>
        <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4">
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
          type="button"
          onClick={onBack}
          className="tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-gray-200 tw:hover:bg-gray-50"
          style={{ borderRadius: 20 }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={isSubmitting}
          className="tw:px-4 tw:py-2 tw:rounded-xl tw:bg-linear-to-br tw:from-primary tw:to-primarySecond tw:text-white tw:hover:bg-primarySecond tw:disabled:opacity-70"
          style={{ borderRadius: 20 }}
        >
          {isSubmitting ? "Submitting..." : "Submit Event"}
        </button>
      </div>
    </div>
  );
}
