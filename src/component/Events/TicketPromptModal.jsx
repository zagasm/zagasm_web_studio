import React, { Fragment, useMemo, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
} from "@headlessui/react";
import { FileText, X } from "lucide-react";
import { formatEventDateTime } from "../../utils/ui";
import { priceText } from "./SingleEvent";

function getAmountLabel(amount, fallback, prefix = "") {
  if (fallback) return fallback;
  if (!amount) return "Free";
  return `${prefix}${Number(amount).toLocaleString("en-NG")}`;
}

export default function TicketPromptModal({
  open,
  onClose,
  event,
  onBuy,
  onDownloadManual,
  buying = false,
}) {
  const [selectedPurchaseType, setSelectedPurchaseType] = useState("ticket_only");

  const poster = event?.poster?.[0]?.url || "/images/event-dummy.jpg";
  const priceLabel = priceText(event);
  const dateLabel = formatEventDateTime(event?.eventDate, event?.startTime);
  const manual = event?.manual || {};
  const purchaseOptions = event?.purchase_options || {};
  const ticketAmount = Number(event?.price ?? 0);
  const manualAmount = Number(manual?.price ?? 0);
  const combinedAmount = ticketAmount + manualAmount;
  const hasManualAccess = !!manual?.viewer_has_access;

  const options = useMemo(() => {
    const list = [];

    if (purchaseOptions.ticket_only) {
      list.push({
        value: "ticket_only",
        label: "Ticket only",
        amountLabel: getAmountLabel(
          ticketAmount,
          event?.price_display,
          event?.currency?.symbol || ""
        ),
        description: "Standard ticket purchase.",
      });
    }

    if (purchaseOptions.ticket_and_manual && !hasManualAccess) {
      list.push({
        value: "ticket_and_manual",
        label: "Ticket + manual",
        amountLabel:
          combinedAmount > 0
            ? `${event?.currency?.symbol || ""}${combinedAmount.toLocaleString("en-NG")}`
            : event?.price_display,
        description: "Buy your ticket together with the paid event manual.",
      });
    }

    if (purchaseOptions.manual_only && !hasManualAccess) {
      list.push({
        value: "manual_only",
        label: "Manual only",
        amountLabel: getAmountLabel(
          manualAmount,
          manual?.price_display,
          event?.currency?.symbol || ""
        ),
        description: "Unlock the manual without buying another ticket.",
      });
    }

    return list;
  }, [
    combinedAmount,
    event?.currency?.symbol,
    event?.price_display,
    hasManualAccess,
    manual?.price_display,
    manualAmount,
    purchaseOptions.manual_only,
    purchaseOptions.ticket_and_manual,
    purchaseOptions.ticket_only,
    ticketAmount,
  ]);

  React.useEffect(() => {
    if (!open) return;
    setSelectedPurchaseType(options[0]?.value || "ticket_only");
  }, [open, options]);

  if (!event) return null;

  const selectedOption =
    options.find((option) => option.value === selectedPurchaseType) || options[0];

  return (
    <Transition.Root show={open} as={Fragment} appear>
      <Dialog as="div" className="tw:relative tw:z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="tw:ease-out tw:duration-300"
          enterFrom="tw:opacity-0"
          enterTo="tw:opacity-100"
          leave="tw:ease-in tw:duration-200"
          leaveFrom="tw:opacity-100"
          leaveTo="tw:opacity-0"
        >
          <DialogBackdrop className="tw:fixed tw:inset-0 tw:z-40 tw:bg-black/60" />
        </Transition.Child>

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
            <DialogPanel className="tw:relative tw:z-50 tw:w-full tw:max-w-xl tw:overflow-hidden tw:rounded-3xl tw:bg-white tw:p-6 tw:text-left tw:shadow-xl">
              <div className="tw:flex tw:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="tw:rounded-full tw:p-1.5 tw:transition tw:duration-150 tw:hover:bg-gray-100"
                >
                  <X className="tw:h-4 tw:w-4 tw:text-gray-500" />
                </button>
              </div>

              <div className="tw:space-y-5">
                <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:md:grid-cols-[220px_minmax(0,1fr)]">
                  <div className="tw:rounded-2xl tw:overflow-hidden tw:bg-gray-100 tw:shadow-inner">
                    <img
                      src={poster}
                      alt={event?.title || "Event"}
                      className="tw:h-full tw:min-h-[180px] tw:w-full tw:object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="tw:space-y-3">
                    <div className="tw:space-y-1">
                      <span className="tw:block tw:text-xl tw:font-semibold tw:text-gray-900">
                        {event?.title}
                      </span>
                      <span className="tw:block tw:text-sm tw:text-gray-500">{dateLabel}</span>
                    </div>

                    <div className="tw:rounded-2xl tw:border tw:border-gray-200 tw:bg-gray-50 tw:p-4">
                      <span className="tw:block tw:text-sm tw:text-gray-500">Ticket price</span>
                      <span className="tw:block tw:text-2xl tw:font-bold tw:text-black">
                        {priceLabel}
                      </span>
                    </div>

                    {manual?.available && (
                      <div className="tw:rounded-2xl tw:border tw:border-gray-200 tw:bg-white tw:p-4">
                        <div className="tw:flex tw:items-center tw:justify-between tw:gap-3">
                          <div className="tw:flex tw:items-center tw:gap-2">
                            <span className="tw:inline-flex tw:h-10 tw:w-10 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-[#f3f4ff] tw:text-primary">
                              <FileText className="tw:h-4 tw:w-4" />
                            </span>
                            <div>
                              <div className="tw:text-sm tw:font-semibold tw:text-slate-900">
                                Event manual
                              </div>
                              <div className="tw:text-xs tw:text-slate-500">
                                {manual?.file_name || "Soft-copy manual"}
                              </div>
                            </div>
                          </div>
                          <div className="tw:text-sm tw:font-semibold tw:text-slate-900">
                            {manual?.price_display || "Included"}
                          </div>
                        </div>

                        {hasManualAccess ? (
                          <button
                            type="button"
                            onClick={onDownloadManual}
                            className="tw:mt-4 tw:w-full tw:rounded-[18px] tw:border tw:border-primary/20 tw:bg-primary/5 tw:py-3 tw:text-sm tw:font-semibold tw:text-primary hover:tw:bg-primary/10"
                          >
                            Download manual
                          </button>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>

                {!hasManualAccess && options.length > 0 && (
                  <div className="tw:space-y-3">
                    <div className="tw:text-sm tw:font-semibold tw:text-slate-900">
                      Choose access
                    </div>
                    <div className="tw:grid tw:grid-cols-1 tw:gap-3">
                      {options.map((option) => {
                        const selected = option.value === selectedPurchaseType;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setSelectedPurchaseType(option.value)}
                            className={`tw:rounded-2xl tw:border tw:px-4 tw:py-3 tw:text-left tw:transition ${
                              selected
                                ? "tw:border-primary tw:bg-primary/5"
                                : "tw:border-gray-200 tw:bg-white hover:tw:border-primary/30"
                            }`}
                          >
                            <div className="tw:flex tw:items-start tw:justify-between tw:gap-3">
                              <div>
                                <div className="tw:text-sm tw:font-semibold tw:text-slate-900">
                                  {option.label}
                                </div>
                                <div className="tw:mt-1 tw:text-xs tw:leading-5 tw:text-slate-500">
                                  {option.description}
                                </div>
                              </div>
                              <div className="tw:text-sm tw:font-semibold tw:text-slate-900">
                                {option.amountLabel}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="tw:flex tw:flex-col tw:gap-3">
                  {selectedOption && (
                    <button
                      type="button"
                      onClick={() => onBuy(selectedOption.value)}
                      disabled={buying}
                      className="tw:w-full tw:rounded-[20px] tw:bg-primary tw:py-3 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:duration-150 hover:brightness-90 tw:disabled:cursor-not-allowed tw:disabled:opacity-70"
                      style={{ fontSize: 12, borderRadius: 16 }}
                    >
                      {buying
                        ? "Processing purchase..."
                        : `Continue with ${selectedOption.label} (${selectedOption.amountLabel})`}
                    </button>
                  )}

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
