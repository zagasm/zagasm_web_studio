import React from "react";
import "./ticket.css";
import {
  formatTicketDate,
  formatTicketPrice,
  formatTicketTime,
  normalizeTicketStatus,
} from "../../utils/ticketHelpers";

const phaseStyles = {
  live: {
    label: "Live",
    classes: "tw:bg-red-100 tw:text-red-600",
    icon: (
      <svg
        className="tw:w-3 tw:h-3 tw:mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
      </svg>
    ),
  },
  upcoming: {
    label: "Upcoming",
    classes: "tw:bg-orange-100 tw:text-orange-600",
  },
  ended: {
    label: "Ended",
    classes: "tw:bg-gray-100 tw:text-gray-600",
  },
};

function Ticket({ ticket, phase: phaseProp, onViewReceipt }) {
  const event = ticket.event || {};
  const payment = ticket.payment || {};
  const currency = payment.currency || {};
  const title = event.title || "Event";

  const dateLabel = formatTicketDate(event.event_date);
  const timeLabel = formatTicketTime(event.start_time);

  const phase = phaseProp || normalizeTicketStatus(event.status);
  const phaseDef = phaseStyles[phase] || phaseStyles.upcoming;

  const priceLabel = formatTicketPrice(
    payment.amount ?? event.price ?? event.fullPrice ?? "",
    currency.symbol || event.currency || ""
  );

  return (
    <div className="ticket-wrapper">
      {/* 1. The Background Image sits at the back */}
      <img src="/images/ticketbg.png" alt="" className="ticket-bg-image" />

      {/* 2. The Content sits on top */}
      <div className="ticket-content">
        {/* LEFT SIDE: Main Info */}
        <div className="ticket-main">
          <div className="tw:flex tw:flex-col tw:gap-4 tw:h-full tw:justify-between">
            {/* Header: Logo + Title + Status */}
            <div className="tw:flex tw:items-start tw:justify-between tw:gap-2">
              <div className="tw:flex tw:items-center tw:gap-3">
                <div className="tw:h-10 tw:w-10 tw:rounded-full tw:overflow-hidden tw:bg-gray-200 tw:shrink-0">
                  <img
                    src={event.poster}
                    alt={title}
                    className="tw:w-full tw:h-full tw:object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <span className="tw:text-sm tw:md:text-[16px] tw:font-semibold tw:text-gray-900 tw:leading-tight tw:line-clamp-2">
                  {title}
                </span>
              </div>

              <span
                className={`tw:inline-flex tw:items-center tw:px-2.5 tw:py-0.5 tw:rounded-full tw:text-[8px] tw:font-bold tw:uppercase ${phaseDef.classes}`}
              >
                {phaseDef.label}
              </span>
            </div>

            {/* Info Pill */}
            <div className="tw:inline-flex tw:items-center tw:px-4 tw:py-2 tw:bg-gray-100 tw:rounded-full tw:text-[9px] tw:md:text-[11px] tw:text-gray-700 tw:font-medium tw:w-fit">
              <span>{dateLabel}</span>
              <span className="tw:mx-2 tw:text-gray-300">•</span>
              <span>{timeLabel}</span>
              <span className="tw:mx-2 tw:text-gray-300">•</span>
              <span>Online</span>
            </div>

            {/* Button */}
            <button
              style={{
                borderRadius: 8,
              }}
              type="button"
              onClick={onViewReceipt}
              className="tw:w-full tw:h-12 tw:rounded-xl tw:bg-[#F5E9FF] tw:text-[14px] tw:font-bold tw:text-purple-700 tw:hover:bg-[#EAD7FF] tw:transition-colors"
            >
              View Receipt
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: Price Stub */}
        <div className="ticket-stub">
          <div className="tw:flex tw:flex-col tw:items-start tw:justify-end tw:h-full">
            <span style={{ fontSize: 8 }} className="tw:text-[10px] tw:uppercase tw:tracking-widest tw:text-gray-400 tw:font-semibold tw:mb-1">
              Price
            </span>
            <span
              style={{ fontSize: 12 }}
              className="tw:text-[8px] tw:md:text-[20px] tw:font-semibold tw:text-gray-900"
            >
              {priceLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ticket;
