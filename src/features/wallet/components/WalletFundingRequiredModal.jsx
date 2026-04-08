import React, { Fragment } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { AlertTriangle, X } from "lucide-react";

export default function WalletFundingRequiredModal({
  open,
  onClose,
  details,
  formatAmount,
  onFundWallet,
}) {
  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog as="div" className="tw:relative tw:z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="tw:ease-out tw:duration-200"
          enterFrom="tw:opacity-0"
          enterTo="tw:opacity-100"
          leave="tw:ease-in tw:duration-150"
          leaveFrom="tw:opacity-100"
          leaveTo="tw:opacity-0"
        >
          <DialogBackdrop className="tw:fixed tw:inset-0 tw:bg-black/45" />
        </TransitionChild>

        <div className="tw:fixed tw:inset-0 tw:overflow-y-auto">
          <div className="tw:flex tw:min-h-full tw:items-center tw:justify-center tw:p-4">
            <TransitionChild
              as={Fragment}
              enter="tw:ease-out tw:duration-200"
              enterFrom="tw:opacity-0 tw:translate-y-2 tw:sm:scale-95"
              enterTo="tw:opacity-100 tw:translate-y-0 tw:sm:scale-100"
              leave="tw:ease-in tw:duration-150"
              leaveFrom="tw:opacity-100 tw:translate-y-0 tw:sm:scale-100"
              leaveTo="tw:opacity-0 tw:translate-y-2 tw:sm:scale-95"
            >
              <DialogPanel className="tw:w-full tw:max-w-md tw:rounded-[28px] tw:bg-white tw:p-6 tw:shadow-[0_24px_64px_rgba(15,23,42,0.18)]">
                <div className="tw:flex tw:items-start tw:justify-between tw:gap-4">
                  <div className="tw:flex tw:items-center tw:gap-3">
                    
                    <div>
                      <span className="tw:block tw:text-xl tw:font-semibold tw:text-gray-900">
                        Wallet funding required
                      </span>
                      <Dialog.Description className="tw:mt-1 tw:block tw:text-sm tw:text-gray-500">
                        Your user wallet needs more balance before this ticket can be purchased.
                      </Dialog.Description>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="tw:inline-flex tw:h-9 tw:w-9 tw:items-center tw:justify-center tw:rounded-full tw:bg-gray-100 tw:text-gray-500 hover:tw:bg-gray-200"
                  >
                    <X className="tw:h-4 tw:w-4" />
                  </button>
                </div>

                <div className="tw:mt-6 tw:space-y-3">
                  <div className="tw:flex tw:items-center tw:justify-between tw:rounded-2xl tw:bg-gray-50 tw:px-4 tw:py-3">
                    <span className="tw:text-sm tw:text-gray-500">Wallet balance</span>
                    <span className="tw:text-sm tw:font-semibold tw:text-gray-900">
                      {formatAmount(details?.wallet_balance || 0)}
                    </span>
                  </div>
                  <div className="tw:flex tw:items-center tw:justify-between tw:rounded-2xl tw:bg-gray-50 tw:px-4 tw:py-3">
                    <span className="tw:text-sm tw:text-gray-500">Ticket amount</span>
                    <span className="tw:text-sm tw:font-semibold tw:text-gray-900">
                      {formatAmount(details?.required_amount || 0)}
                    </span>
                  </div>
                  <div className="tw:flex tw:items-center tw:justify-between tw:rounded-2xl tw:bg-[#faf8ff] tw:px-4 tw:py-3">
                    <span className="tw:text-sm tw:text-gray-500">Amount needed</span>
                    <span className="tw:text-sm tw:font-semibold tw:text-primary">
                      {formatAmount(details?.deficit_amount || 0)}
                    </span>
                  </div>
                </div>

                <div className="tw:mt-6 tw:flex tw:justify-end tw:gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="tw:inline-flex tw:h-11 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-gray-100 tw:px-4 tw:text-sm tw:font-semibold tw:text-gray-800 hover:tw:bg-gray-200"
                    style={{ borderRadius: 16 }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={onFundWallet}
                    className="tw:inline-flex tw:h-11 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-primary tw:px-5 tw:text-sm tw:font-semibold tw:text-white hover:tw:bg-primarySecond"
                    style={{ borderRadius: 16 }}
                  >
                    Fund wallet
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
