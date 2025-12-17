import React, { Fragment } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
} from "@headlessui/react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EventCreationSuccessModal({
  open,
  onClose,
  eventId,
  variant = "created",
}) {
  const navigate = useNavigate();

  const title = variant === "updated" ? "Event updated" : "Event created";
  const subtitle =
    variant === "updated"
      ? "Your changes are now live for attendees."
      : "You’re all set to share and promote your event.";

  const handleView = () => {
    if (!eventId) return;
    onClose?.();
    navigate(`/event/view/${eventId}`);
  };

  return (
    <Transition.Root show={open} as={Fragment} appear>
      <Dialog as="div" className="tw:relative tw:z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="tw:transition tw:duration-300 tw:ease-out"
          enterFrom="tw:opacity-0"
          enterTo="tw:opacity-100"
          leave="tw:transition tw:duration-200 tw:ease-in"
          leaveFrom="tw:opacity-100"
          leaveTo="tw:opacity-0"
        >
          <DialogBackdrop className="tw:fixed tw:inset-0 tw:bg-black/60 tw:z-40" />
        </Transition.Child>

        {/* Wrapper */}
        <div className="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center tw:p-4">
          <Transition.Child
            as={Fragment}
            enter="tw:transition tw:duration-300 tw:ease-out"
            enterFrom="tw:opacity-0 tw:scale-95"
            enterTo="tw:opacity-100 tw:scale-100"
            leave="tw:transition tw:duration-200 tw:ease-in"
            leaveFrom="tw:opacity-100 tw:scale-100"
            leaveTo="tw:opacity-0 tw:scale-95"
          >
            <DialogPanel className="tw:w-full tw:max-w-md tw:overflow-hidden tw:rounded-4xl tw:border tw:border-white/30 tw:bg-white tw:p-6 tw:text-left tw:shadow-2xl tw:text-black">
              <div className="tw:flex tw:flex-col tw:items-center tw:gap-4">
                <div className="tw:flex tw:h-16 tw:w-16 tw:items-center tw:justify-center tw:rounded-full tw:bg-white/15">
                  <CheckCircle2 className="tw:size-14 tw:text-emerald-400" />
                </div>

                <span className="tw:text-2xl tw:font-bold tw:text-black tw:text-center">
                  {title} successfully
                </span>

                <p className="tw:text-center tw:text-sm tw:text-white/80">
                  {subtitle}
                </p>

                <div className="tw:w-full tw:flex tw:flex-col tw:gap-3">
                  <button
                  style={{
                    borderRadius: 16, 
                    fontSize: 12
                  }}
                    type="button"
                    onClick={handleView}
                    className="tw:w-full tw:rounded-[18px] tw:bg-linear-to-br tw:from-primary tw:to-primarySecond tw:px-4 tw:py-3 tw:text-sm tw:font-semibold tw:text-[#ffffff] tw:transition tw:duration-150 tw:hover:scale-[1.01]"
                  >
                    View Event
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="tw:w-full tw:rounded-[18px] tw:border tw:border-white/60 tw:px-4 tw:py-3 tw:text-sm tw:font-semibold tw:text-black tw:transition tw:duration-150 tw:hover:bg-white/10"
                  >
                    Later
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
