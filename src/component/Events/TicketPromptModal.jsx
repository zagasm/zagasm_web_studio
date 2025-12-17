import React, { Fragment } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
} from "@headlessui/react";
import { X } from "lucide-react";
import { formatEventDateTime } from "../../utils/ui";
import { priceText } from "./SingleEvent";

export default function TicketPromptModal({
  open,
  onClose,
  event,
  onBuy,
  buying = false,
}) {
  if (!event) return null;

  const poster = event?.poster?.[0]?.url || "/images/event-dummy.jpg";
  const priceLabel = priceText(event);
  const dateLabel = formatEventDateTime(event?.eventDate, event?.startTime);

  return (
    <Transition.Root show={open} as={Fragment} appear>
      <Dialog as="div" className="tw:relative tw:z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="tw:ease-out tw:duration-300"
          enterFrom="tw:opacity-0"
          enterTo="tw:opacity-100"
          leave="tw:ease-in tw:duration-200"
          leaveFrom="tw:opacity-100"
          leaveTo="tw:opacity-0"
        >
          <DialogBackdrop className="tw:fixed tw:inset-0 tw:bg-black/60 tw:z-40" />
        </Transition.Child>

        {/* Wrapper */}
        <div className="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center tw:p-4">
          <Transition.Child
            as={Fragment}
            enter="tw:ease-out tw:duration-300"
            enterFrom="tw:opacity-0 tw:scale-95"
            enterTo="tw:opacity-100 tw:scale-100"
            leave="tw:ease-in tw:duration-200"
            leaveFrom="tw:opacity-100 tw:scale-100"
            leaveTo="tw:opacity-0 tw:scale-95"
          >
            <DialogPanel className="tw:relative tw:z-50 tw:w-full tw:max-w-md tw:overflow-hidden tw:rounded-3xl tw:bg-white tw:p-6 tw:text-left tw:shadow-xl">
              <div className="tw:flex tw:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="tw:rounded-full tw:p-1.5 tw:transition tw:duration-150 tw:hover:bg-gray-100"
                >
                  <X className="tw:h-4 tw:w-4 tw:text-gray-500" />
                </button>
              </div>

              <div className="tw:space-y-4">
                <div className="tw:rounded-2xl tw:overflow-hidden tw:bg-gray-100 tw:shadow-inner">
                  <img
                    src={poster}
                    alt={event?.title || "Event"}
                    className="tw:h-40 tw:w-full tw:object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="tw:space-y-1 tw:text-center">
                  <span className="tw:block tw:text-xl tw:font-semibold tw:text-gray-900">
                    {event?.title}
                  </span>
                  <span className="tw:block tw:text-sm tw:text-gray-500">
                    {dateLabel}
                  </span>
                </div>

                <div className="tw:rounded-2xl tw:border tw:border-gray-200 tw:bg-gray-50 tw:p-4 tw:text-center">
                  <span className="tw:block tw:text-sm tw:text-gray-500">
                    Price
                  </span>
                  <span className="tw:block tw:text-2xl tw:font-bold tw:text-black">
                    {priceLabel}
                  </span>
                </div>

                <div className="tw:flex tw:flex-col tw:gap-3">
                  <button
                    type="button"
                    onClick={onBuy}
                    disabled={buying}
                    className="tw:w-full tw:rounded-[20px] tw:bg-primary tw:py-3 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:duration-150 hover:brightness-90 tw:disabled:cursor-not-allowed tw:disabled:opacity-70"
                    style={{ fontSize: 12, borderRadius: 16 }}
                  >
                    {buying
                      ? "Opening checkout…"
                      : `Buy Ticket (${priceLabel})`}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="tw:w-full tw:rounded-[20px] tw:border tw:border-gray-200 tw:py-3 tw:text-sm tw:font-semibold tw:text-gray-700 tw:transition tw:duration-150 tw:hover:bg-gray-100"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </DialogPanel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
