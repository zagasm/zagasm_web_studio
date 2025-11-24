import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
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

export default function TicketReceiptModal({ open, onClose, ticket }) {
  const event = ticket?.event || {};
  const user = ticket?.user || {};
  const payment = ticket?.payment || {};
  const currency = payment.currency || {};

  console.log(ticket, event);

  const dateLabel = formatDate(event.event_date);
  const timeLabel = formatTime(event.start_time);
  const priceLabel =
    event.fullPrice ||
    (currency.symbol && payment.amount
      ? `${currency.symbol}${Number(payment.amount).toLocaleString()}`
      : payment.amount || "—");

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog as="div" className="tw:relative tw:z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="tw:transition tw:duration-200"
          enterFrom="tw:opacity-0"
          enterTo="tw:opacity-100"
          leave="tw:transition tw:duration-150"
          leaveFrom="tw:opacity-100"
          leaveTo="tw:opacity-0"
        >
          <div className="tw:fixed tw:inset-0 tw:bg-black/50" />
        </Transition.Child>

        {/* Panel wrapper */}
        <div className="tw:fixed tw:inset-0 tw:overflow-y-auto">
          <div className="tw:flex tw:min-h-full tw:items-center tw:justify-center tw:p-4 tw:md:pt-20">
            <Transition.Child
              as={Fragment}
              enter="tw:transition tw:duration-200 tw:ease-out"
              enterFrom="tw:opacity-0 tw:translate-y-4 tw:scale-95"
              enterTo="tw:opacity-100 tw:translate-y-0 tw:scale-100"
              leave="tw:transition tw:duration-150 tw:ease-in"
              leaveFrom="tw:opacity-100 tw:translate-y-0 tw:scale-100"
              leaveTo="tw:opacity-0 tw:translate-y-4 tw:scale-95"
            >
              <Dialog.Panel className="tw:w-full tw:max-w-lg tw:bg-linear-to-b tw:from-gray-50 tw:to-white tw:rounded-3xl tw:shadow-2xl tw:overflow-hidden tw:relative">
                {/* Cover */}
                <div className="tw:w-full tw:h-20 tw:md:h-40 tw:overflow-hidden tw:bg-gray-200">
                  <img
                    src={event.poster || "/images/banner.png"}
                    alt={event.title || "Event cover"}
                    className="tw:w-full tw:h-full tw:object-cover"
                  />
                </div>

                {/* Content */}
                <div className="tw:p-5 tw:space-y-5">
                  {/* Title + close */}
                  <div className="tw:flex tw:items-start tw:justify-between tw:gap-4">
                    <div className="tw:space-y-1">
                      <span className="tw:block tw:text-sm tw:md:text-xl tw:font-semibold tw:text-gray-900 tw:leading-snug">
                        {event.title || "Event Ticket"}
                      </span>
                      <span className="tw:block tw:text-[10px] tw:font-medium tw:tracking-[0.2em] tw:text-gray-500 tw:uppercase">
                        Ticket • {ticket?.status || "active"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="tw:h-8 tw:w-8 tw:flex tw:items-center tw:justify-center tw:rounded-full tw:bg-black/5 hover:tw:bg-black/10 tw:text-gray-700"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Ticket layout (bigger) */}
                  <div className="tw:bg-white tw:rounded-2xl tw:border tw:border-gray-100 tw:shadow-sm tw:overflow-hidden tw:flex">
                    <div className="tw:flex-1 tw:p-4 tw:flex tw:flex-col tw:gap-3">
                      {/* Date / time / venue */}
                      <div className="tw:space-y-1">
                        <p className="tw:text-sm tw:font-semibold tw:text-gray-900">
                          {dateLabel}
                          {timeLabel && (
                            <>
                              <span className="tw:mx-1">•</span>
                              {timeLabel}
                            </>
                          )}
                        </p>
                        <p className="tw:text-xs tw:text-gray-500">
                          {event.venue || "Online • Zagasm Studios"}
                        </p>
                      </div>

                      {/* Owner & ticket code */}
                      <div className="tw:grid tw:grid-cols-2 tw:gap-3 tw:text-xs">
                        <div className="tw:flex tw:flex-col tw:gap-1">
                          <span className="tw:text-gray-500">
                            Ticket Holder
                          </span>
                          <span className="tw:font-medium tw:text-gray-900">
                            {user.name || "You"}
                          </span>
                        </div>
                        <div className="tw:flex tw:flex-col tw:gap-1 tw:text-right">
                          <span className="tw:text-gray-500">Ticket Code</span>
                          <span className="tw:font-mono tw:text-[11px] tw:text-gray-900 tw:break-all">
                            {ticket?.code}
                          </span>
                        </div>
                      </div>

                      {/* Payment & status */}
                      <div className="tw:grid tw:grid-cols-3 tw:gap-3 tw:text-xs tw:pt-2 tw:border-t tw:border-dashed tw:border-gray-200">
                        <div>
                          <p className="tw:text-[11px] tw:text-gray-500 tw:uppercase tw:tracking-[0.16em] tw:mb-0.5">
                            Price
                          </p>
                          <p className="tw:text-sm tw:font-semibold tw:text-gray-900">
                            {priceLabel}
                          </p>
                        </div>
                        <div>
                          <p className="tw:text-[11px] tw:text-gray-500 tw:uppercase tw:tracking-[0.16em] tw:mb-0.5">
                            Payment
                          </p>
                          <p className="tw:text-xs tw:text-gray-900 tw:font-medium">
                            {currency.code || ""} {payment.amount || ""}
                          </p>
                        </div>
                        
                      </div>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:text-[11px] tw:text-gray-500">
                    <p>
                      Need help? Contact{" "}
                      <span className="tw:text-primary tw:font-medium">
                        support@zagasm.com
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="tw:px-4 tw:py-2 tw:text-xs tw:font-semibold tw:rounded-full tw:bg-primary tw:text-white hover:tw:bg-primarySecond"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
