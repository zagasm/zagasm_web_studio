import React from "react";
import { Link } from "react-router-dom";
import { formatEventDateTime } from "../../utils/ui";
import { CountdownPill, eventStartDate, firstImageFromPoster, formatMetaLine, hostName, priceText } from "./SingleEvent";
import camera_icon from "../../assets/navbar_icons/camera_icon.png";
import { CalendarDays } from "lucide-react";


export default function YouMayAlsoLike({ recs = [], posterFallback }) {
  if (!recs.length) return null;

  return (
    <div className="tw:lg:sticky tw:lg:top-6">
      <h4 className="tw:text-base tw:font-semibold tw:mb-3">
        You may also like
      </h4>
      <div className="tw:space-y-3">
        {recs.slice(0, 2).map((event) => {
          const startDate = eventStartDate(event);
          const variant = "upcoming";
          const isLive = variant === "live";
          const isUpcoming = variant === "upcoming";

          const ticketLabel = `Buy Ticket (${priceText(event)})`;
          return (
            <div key={event.id} className=" mb-4">
              <div className="tw:bg-white tw:rounded-xl tw:shadow-md tw:overflow-hidden tw:flex tw:flex-col tw:h-full blog-card border-0 tw:relative tw:pb-2">
                {/* Image & badges */}
                <Link
                  to={`/event/view/${event.id}`}
                  className="text-decoration-none"
                >
                  <div className="tw:relative tw:h-[210px] tw:w-full">
                    <img
                      className="tw:w-full tw:h-full tw:object-cover"
                      src={firstImageFromPoster(event?.poster)}
                      alt={event?.title || "Event"}
                    />

                    {/* LIVE badge */}
                    {isLive && (
                      <>
                        <div className="tw:absolute tw:left-4 tw:top-4 tw:flex tw:items-center tw:gap-1.5 tw:bg-[#FF3B30] tw:px-2 tw:py-1 tw:rounded-full tw:text-[8px] tw:font-semibold tw:text-white tw:shadow-lg">
                          <span>Live</span>
                          <img
                            src={camera_icon}
                            alt="Live"
                            className="tw:w-4 tw:h-4 tw:object-contain"
                          />
                        </div>

                        {/* viewers pill */}
                        <div className="tw:absolute tw:right-4 tw:bottom-4 tw:flex tw:items-center tw:gap-2 tw:px-3 tw:py-1.5 tw:rounded-full tw:bg-lightPurple tw:text-xs tw:font-medium tw:text-black tw:shadow-sm">
                          <span className="tw:inline-block tw:w-2 tw:h-2 tw:rounded-full tw:bg-[#22C55E]" />
                          <span>
                            {event?.live_viewers_label || "38M viewers"}
                          </span>
                        </div>
                      </>
                    )}

                    {/* UPCOMING badge + countdown */}
                    {isUpcoming && (
                      <>
                        <div className="tw:absolute tw:left-4 tw:top-4 tw:flex tw:items-center tw:gap-1.5 tw:bg-[#FF9F0A] tw:px-2 tw:py-1 tw:rounded-full tw:text-[8px] tw:font-semibold tw:text-white tw:shadow-lg">
                          <span>Upcoming</span>
                          <img
                            src={camera_icon}
                            alt="Upcoming"
                            className="tw:w-4 tw:h-4 tw:object-contain"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="tw:px-3 tw:pt-3 tw:flex tw:flex-col tw:gap-3 tw:flex-1">
                  {/* Title + price */}
                  <div className="tw:flex tw:items-start tw:justify-between tw:gap-2">
                    <div className="tw:flex-1">
                      <span className="tw:text-[16px] tw:font-semibold tw:text-black tw:leading-snug">
                        {event?.title?.length > 40
                          ? event.title.slice(0, 40) + "…"
                          : event?.title}
                      </span>
                    </div>
                    <div className="tw:text-right tw:ml-2">
                      <span className="tw:text-xl tw:font-bold tw:text-black">
                        {priceText(event)}
                      </span>
                    </div>
                  </div>

                  {/* Host row */}
                  <div className="tw:flex tw:items-center tw:gap-3 tw:-mt-3">
                    <div className="tw:px-3 tw:py-1.5 tw:bg-lightPurple tw:rounded-lg tw:text-xs tw:font-medium tw:text-black tw:flex tw:items-center tw:gap-2">
                      <span className="tw:inline-block tw:w-8 tw:h-8 tw:rounded-full tw:bg-zinc-300 tw:overflow-hidden tw:-ml-1">
                        <img
                          src={event.hostImage ?? "/images/avater_pix.avif"}
                          alt={hostName(event)}
                          className="tw:w-full tw:h-full tw:object-cover"
                        />
                      </span>
                      <span>{hostName(event)}</span>
                    </div>
                  </div>

                  {/* Location + date/time pill */}
                  {isUpcoming && (
                    <div className="tw:mt-1 tw:bg-zinc-50 tw:rounded-lg tw:px-4 tw:py-3 tw:flex tw:items-center tw:gap-4 tw:text-xs tw:text-zinc-600">
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <CountdownPill target={startDate} />
                      </div>
                      <div className="tw:w-px tw:h-6 tw:bg-zinc-200" />
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <CalendarDays className="tw:w-4 tw:h-4" />
                        <span>{formatMetaLine(event)}</span>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  {isLive ? (
                    // LIVE: show "Join event now" button instead of Buy
                    <Link
                      to={`/event/view/${event.id}`}
                      className="tw:mt-2 tw:w-full tw:inline-block"
                    >
                      <button
                        type="button"
                        style={{ borderRadius: 8 }}
                        className="tw:w-full tw:rounded-2xl tw:bg-red-500 tw:text-white tw:py-3 tw:text-sm tw:font-semibold tw:shadow-md tw:transition-colors tw:duration-150"
                      >
                        Join event now
                      </button>
                    </Link>
                  ) : isUpcoming && event.hasPaid ? (
                    // UPCOMING + already paid
                    <button
                      type="button"
                      style={{ borderRadius: 8 }}
                      disabled={event.hasPaid}
                      className="tw:w-full tw:rounded-2xl tw:disabled:bg-primary/50 tw:disabled:cursor-not-allowed tw:text-white tw:py-3 tw:text-sm tw:font-semibold tw:shadow-md tw:transition-colors tw:duration-150"
                    >
                      Paid for this event
                    </button>
                  ) : (
                    // Default: show Buy Ticket
                    <Link
                      to={`/event/view/${event.id}`}
                      className="tw:mt-2 tw:w-full tw:inline-block"
                    >
                      <button
                        type="button"
                        style={{ borderRadius: 8 }}
                        className="tw:w-full tw:rounded-2xl tw:bg-primary tw:text-white tw:py-3 tw:text-sm tw:font-semibold tw:shadow-md tw:hover:bg-primarySecond tw:transition-colors tw:duration-150"
                      >
                        {ticketLabel}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
