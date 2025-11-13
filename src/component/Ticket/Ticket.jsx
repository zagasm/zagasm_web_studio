import React from "react";
import "./ticket.css"; // perforation styles

const statusColors = {
  active: "tw:bg-emerald-100 tw:text-emerald-700",
  used: "tw:bg-gray-100 tw:text-gray-600",
  cancelled: "tw:bg-red-100 tw:text-red-700",
};

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const dt = new Date();
  dt.setHours(Number(h), Number(m) || 0, 0, 0);
  return dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function Ticket({ ticket, onViewReceipt }) {
  const event = ticket.event || {};
  const user = ticket.user || {};
  const payment = ticket.payment || {};
  const currency = payment.currency || {};

  const title = event.title || "Event";
  const dateLabel = formatDate(event.event_date);
  const timeLabel = formatTime(event.start_time);
  const venue = event.venue || "Online • Zagasm Studios";
  const status = ticket.status || "active";

  const priceLabel =
    event.fullPrice ||
    (currency.symbol && payment.amount
      ? `${currency.symbol}${Number(payment.amount).toLocaleString()}`
      : payment.amount || "—");

  const statusClass = statusColors[status] || "tw:bg-gray-100 tw:text-gray-700";

  return (
    <div className="ticket-card tw:w-full">
      {/* Left content */}
      <div className="ticket-card__body tw:flex-1 tw:flex tw:flex-col tw:gap-3">
        {/* Top row */}
        <div className="tw:flex tw:items-start tw:justify-between tw:gap-2">
          <div className="tw:flex tw:flex-col tw:gap-1">
            <span className="tw:text-[11px] tw:font-semibold tw:tracking-[0.18em] tw:text-gray-500 tw:uppercase">
              Event Ticket
            </span>

            <h3 className="tw:text-xl tw:font-semibold tw:text-gray-900 tw:leading-tight">
              {title}
            </h3>

            <span
              className={`tw:inline-flex tw:items-center tw:px-3 tw:py-1 tw:rounded-full tw:text-xs tw:font-medium tw:uppercase tw:tracking-wide tw:bg-primary/10 tw:text-primary`}
            >
              {status === "active" ? "Live in event" : status}
            </span>
          </div>

          <button
            type="button"
            onClick={onViewReceipt}
            className="tw:text-xs tw:md:text-sm tw:font-semibold tw:text-primary tw:underline tw:underline-offset-4 tw:whitespace-nowrap hover:tw:text-primarySecond"
          >
            View ticket
          </button>
        </div>

        {/* Middle row – date / time / venue */}
        <div className="tw:space-y-1">
          <p className="tw:text-sm tw:font-medium tw:text-gray-900">
            {dateLabel}{" "}
            {timeLabel && (
              <>
                <span className="tw:mx-1">•</span>
                {timeLabel}
              </>
            )}
          </p>
          <p className="tw:text-xs tw:text-gray-500">{venue}</p>
        </div>

        {/* Bottom stats row */}
        <div className="tw:mt-2 tw:grid tw:grid-cols-3 tw:gap-3 tw:text-[11px] tw:uppercase tw:tracking-[0.15em] tw:text-gray-500">
          <div>
            <p className="tw:mb-0.5">Status</p>
            <span
              className={`tw:inline-flex tw:px-2 tw:py-1 tw:rounded-full tw:text-[10px] tw:font-semibold tw:normal-case ${statusClass}`}
            >
              {status}
            </span>
          </div>
          <div>
            <p className="tw:mb-0.5">Ticket Code</p>
            <p className="tw:text-gray-900 tw:text-xs tw:font-semibold tw:break-all">
              {ticket.code}
            </p>
          </div>
          <div className="tw:text-right">
            <p className="tw:mb-0.5">Price</p>
            <p className="tw:text-gray-900 tw:text-sm tw:font-semibold">
              {priceLabel}
            </p>
          </div>
        </div>

        {/* Owner */}
        <div className="tw:mt-1 tw:flex tw:items-center tw:gap-2">
          <div className="tw:h-7 tw:w-7 tw:rounded-full tw:bg-gray-200 tw:flex tw:items-center tw:justify-center tw:text-[10px] tw:font-semibold tw:text-gray-700">
            {(user.name || "U").charAt(0)}
          </div>
          <div className="tw:flex tw:flex-col">
            <span className="tw:text-xs tw:text-gray-500">Ticket Holder</span>
            <span className="tw:text-xs tw:font-medium tw:text-gray-900">
              {user.name || "You"}
            </span>
          </div>
        </div>
      </div>

      {/* Right tear / perforation side */}
      <div className="ticket-card__tear tw:hidden tw:sm:flex tw:flex-col tw:items-center tw:justify-center">
        <div className="ticket-card__dots" />
        <span className="tw:mt-2 tw:text-[10px] tw:font-semibold tw:text-gray-400 tw:tracking-[0.2em] tw:uppercase tw:rotate-90">
          Admit One
        </span>
      </div>
    </div>
  );
}

export default Ticket;
