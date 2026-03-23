import React, { useMemo } from "react";
import moment from "moment";
import {
  flattenLaravelErrors,
  prettifyPath,
} from "../../../../../utils/helpers";
import { currencySymbol, formatMoney } from "../../../../../utils/pricingHelpers";

function PreviewMedia({ posterImages, posterVideos, existingPoster }) {
  const imagePreviewUrls = useMemo(
    () =>
      posterImages.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    [posterImages]
  );

  const videoPreviewUrls = useMemo(
    () =>
      posterVideos.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    [posterVideos]
  );

  React.useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((item) => URL.revokeObjectURL(item.url));
      videoPreviewUrls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [imagePreviewUrls, videoPreviewUrls]);

  const mediaItems = [
    ...(existingPoster || []).map((item) => ({
      type: item.type,
      url: item.url,
      name: item.type,
      existing: true,
    })),
    ...imagePreviewUrls.map((item) => ({
      type: "image",
      ...item,
      existing: false,
    })),
    ...videoPreviewUrls.map((item) => ({
      type: "video",
      ...item,
      existing: false,
    })),
  ];

  if (!mediaItems.length) {
    return (
      <div className="tw:flex tw:h-48 tw:items-center tw:justify-center tw:rounded-[28px] tw:border tw:border-dashed tw:border-gray-200 tw:bg-slate-50 tw:text-sm tw:text-slate-500">
        No poster media added yet.
      </div>
    );
  }

  return (
    <div className="tw:grid tw:grid-cols-1 tw:gap-3 tw:sm:grid-cols-2 tw:xl:grid-cols-3">
      {mediaItems.map((item, index) => (
        <figure
          key={`${item.type}-${item.name}-${index}`}
          className="tw:overflow-hidden tw:rounded-[24px] tw:border tw:border-gray-100 tw:bg-white tw:shadow-sm"
        >
          <div className="tw:relative">
            {item.type === "image" ? (
              <img
                src={item.url}
                alt={item.name || `poster-${index}`}
                className="tw:h-52 tw:w-full  tw:object-cover"
              />
            ) : (
              <video
                src={item.url}
                controls
                className="tw:h-52 tw:w-full tw:bg-black tw:object-cover"
              />
            )}

            <span className="tw:absolute tw:left-3 tw:top-3 tw:rounded-full tw:bg-black/65 tw:px-2.5 tw:py-1 tw:text-[11px] tw:uppercase tw:text-white">
              {item.type}
            </span>
            {item.existing && (
              <span className="tw:absolute tw:right-3 tw:top-3 tw:rounded-full tw:bg-white tw:px-2.5 tw:py-1 tw:text-[11px] tw:text-slate-700">
                Existing
              </span>
            )}
          </div>
          <figcaption className="tw:truncate tw:px-3 tw:py-2 tw:text-xs tw:text-slate-500">
            {item.name || item.type}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function ReviewStep({
  collected,
  formErrors,
  isSubmitting,
  onBack,
  onPublish,
  onGoToStep,
  posterImages = [],
  posterVideos = [],
  existingPoster = [],
}) {
  const {
    title,
    date,
    time,
    location,
    description,
    price,
    currencyCode,
    maxTickets,
    ticketLimit,
    visibility,
    matureContent,
  } = collected || {};

  const flat = useMemo(
    () => flattenLaravelErrors(formErrors),
    [formErrors]
  );

  const currencyMark = currencySymbol(currencyCode || "NGN");
  const dateLabel =
    date && time
      ? moment(`${date} ${time}`, "YYYY-MM-DD HH:mm").format("dddd, MMMM D, YYYY [at] h:mm A")
      : "Date and time not set";

  return (
    <div className="tw:rounded-[32px] tw:border tw:border-gray-100 tw:bg-white tw:p-5 tw:shadow-[0_20px_60px_rgba(15,23,42,0.05)] tw:sm:p-7">
      {!!flat.length && (
        <div className="tw:mb-5 tw:rounded-[24px] tw:border tw:border-red-200 tw:bg-red-50 tw:p-4">
          <div className="tw:text-sm tw:font-medium tw:text-red-700">
            Please fix the errors below:
          </div>
          <ul className="tw:mt-2 tw:list-inside tw:list-disc tw:space-y-1 tw:text-sm tw:text-red-700">
            {flat.map(({ path, messages }) => (
              <li key={path}>
                <button
                  type="button"
                  className="tw:text-red-700 tw:underline tw:underline-offset-2 hover:tw:text-red-800"
                  onClick={() => {
                    const match = path.match(/^step_(\d+)/);
                    if (!match || !onGoToStep) return;
                    const step = Math.min(3, Math.max(1, Number(match[1])));
                    onGoToStep(step);
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

      <div className="tw:mb-6 tw:overflow-hidden tw:rounded-[28px] tw:bg-linear-to-br tw:from-[#1f1536] tw:via-[#33165e] tw:to-[#7b1be0] tw:p-6 tw:text-white">
        <div className="tw:flex tw:flex-col tw:gap-6 tw:lg:flex-row tw:lg:items-end tw:lg:justify-between">
          <div className="tw:max-w-2xl">
            <div className="tw:inline-flex tw:rounded-full tw:bg-white/10 tw:px-3 tw:py-1 tw:text-[11px] tw:uppercase tw:tracking-[0.2em]">
              Final preview
            </div>
            <span className="tw:block tw:mt-3 tw:text-2xl tw:font-semibold tw:md:text-4xl">
              {title || "Untitled event"}
            </span>
            <p className="tw:mt-3 tw:max-w-2xl tw:text-sm tw:text-white/80 tw:md:text-base">
              {description || "Add a short description to tell attendees what to expect."}
            </p>
          </div>

          <div className="tw:grid tw:grid-cols-1 tw:gap-3 tw:sm:grid-cols-2">
            <div className="tw:rounded-2xl tw:border tw:border-white/15 tw:bg-white/10 tw:px-4 tw:py-3 tw:backdrop-blur">
              <div className="tw:text-xs tw:text-white/60">Date & time</div>
              <div className="tw:mt-1 tw:text-sm tw:font-medium">{dateLabel}</div>
            </div>
            <div className="tw:rounded-2xl tw:border tw:border-white/15 tw:bg-white/10 tw:px-4 tw:py-3 tw:backdrop-blur">
              <div className="tw:text-xs tw:text-white/60">Ticket price</div>
              <div className="tw:mt-1 tw:text-sm tw:font-medium">
                {currencyMark}
                {formatMoney(Number(price || 0))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tw:grid tw:grid-cols-1 tw:gap-6 tw:xl:grid-cols-[1.15fr_0.85fr]">
        <section className="tw:space-y-4">
          <div className="tw:flex tw:items-center tw:justify-between">
            <div>
              <div className="tw:text-lg tw:font-semibold tw:text-slate-900">
                Poster media
              </div>
              <div className="tw:text-sm tw:text-slate-500">
                Review the images and videos that will represent this event.
              </div>
            </div>
            <button
              type="button"
              className="tw:text-sm tw:text-primary"
              onClick={() => onGoToStep?.(1)}
            >
              Edit
            </button>
          </div>

          <PreviewMedia
            posterImages={posterImages}
            posterVideos={posterVideos}
            existingPoster={existingPoster}
          />
        </section>

        <div className="tw:space-y-4">
          <section className="tw:rounded-[28px] tw:border tw:border-gray-100 tw:bg-[#faf8ff] tw:p-5">
            <div className="tw:mb-4 tw:flex tw:items-center tw:justify-between">
              <div>
                <div className="tw:text-lg tw:font-semibold tw:text-slate-900">
                  Event summary
                </div>
                <div className="tw:text-sm tw:text-slate-500">
                  Core details attendees will care about.
                </div>
              </div>
              <button
                type="button"
                className="tw:text-sm tw:text-primary"
                onClick={() => onGoToStep?.(1)}
              >
                Edit
              </button>
            </div>

            <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2">
              <div>
                <div className="tw:text-xs tw:text-slate-500">Title</div>
                <div className="tw:mt-1 tw:text-sm tw:font-medium tw:text-slate-900">
                  {title || "—"}
                </div>
              </div>
              <div>
                <div className="tw:text-xs tw:text-slate-500">Location</div>
                <div className="tw:mt-1 tw:text-sm tw:font-medium tw:text-slate-900">
                  {location || "Online"}
                </div>
              </div>
              <div className="tw:sm:col-span-2">
                <div className="tw:text-xs tw:text-slate-500">Description</div>
                <div className="tw:mt-1 tw:text-sm tw:text-slate-700">
                  {description || "—"}
                </div>
              </div>
            </div>
          </section>

          <section className="tw:rounded-[28px] tw:border tw:border-gray-100 tw:bg-white tw:p-5">
            <div className="tw:mb-4 tw:flex tw:items-center tw:justify-between">
              <div>
                <div className="tw:text-lg tw:font-semibold tw:text-slate-900">
                  Ticketing summary
                </div>
                <div className="tw:text-sm tw:text-slate-500">
                  Pricing, capacity, and attendee access.
                </div>
              </div>
              <button
                type="button"
                className="tw:text-sm tw:text-primary"
                onClick={() => onGoToStep?.(2)}
              >
                Edit
              </button>
            </div>

            <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2">
              <div className="tw:rounded-2xl tw:bg-slate-50 tw:p-4">
                <div className="tw:text-xs tw:text-slate-500">Price</div>
                <div className="tw:mt-1 tw:text-base tw:font-semibold tw:text-slate-900">
                  {currencyMark}
                  {formatMoney(Number(price || 0))}
                </div>
              </div>
              <div className="tw:rounded-2xl tw:bg-slate-50 tw:p-4">
                <div className="tw:text-xs tw:text-slate-500">Availability</div>
                <div className="tw:mt-1 tw:text-base tw:font-semibold tw:text-slate-900">
                  {maxTickets === "limited"
                    ? `${formatMoney(Number(ticketLimit || 0))} tickets`
                    : "Unlimited tickets"}
                </div>
              </div>
              <div className="tw:rounded-2xl tw:bg-slate-50 tw:p-4">
                <div className="tw:text-xs tw:text-slate-500">Visibility</div>
                <div className="tw:mt-1 tw:text-base tw:font-semibold tw:capitalize tw:text-slate-900">
                  {visibility || "public"}
                </div>
              </div>
              <div className="tw:rounded-2xl tw:bg-slate-50 tw:p-4">
                <div className="tw:text-xs tw:text-slate-500">Mature content</div>
                <div className="tw:mt-1 tw:text-base tw:font-semibold tw:text-slate-900">
                  {matureContent ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="tw:mt-6 tw:flex tw:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="tw:rounded-full tw:border tw:border-gray-200 tw:px-4 tw:py-2.5 tw:hover:bg-gray-50"
          style={{ borderRadius: 20 }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={isSubmitting}
          className="tw:rounded-full tw:bg-linear-to-r tw:from-primary tw:to-primarySecond tw:px-5 tw:py-2.5 tw:text-white disabled:tw:opacity-70"
          style={{ borderRadius: 20 }}
        >
          {isSubmitting ? "Submitting..." : "Submit event"}
        </button>
      </div>
    </div>
  );
}
