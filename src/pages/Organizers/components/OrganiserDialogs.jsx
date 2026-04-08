import React, { Fragment } from "react";
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import { Dialog as MuiDialog, DialogContent, DialogTitle } from "@mui/material";

export function OrganiserProcessingDialog({ open }) {
  return (
    <MuiDialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
        Processing verification
      </DialogTitle>
      <DialogContent>
        <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-3 tw:py-4">
          <div className="tw:w-24 tw:h-24 tw:rounded-full tw:bg-lightPurple/70 tw:flex tw:items-center tw:justify-center tw:mb-1">
            <img
              src="/images/processing.gif"
              alt="Processing"
              className="tw:w-20 tw:h-20 tw:object-contain"
            />
          </div>
          <span className="tw:block tw:text-sm tw:text-center tw:text-gray-700">
            We&apos;re verifying your details. This usually takes a short while.
            You can continue using the app while we update your organiser
            profile.
          </span>
        </div>
      </DialogContent>
    </MuiDialog>
  );
}

export function OrganiserDiditInfoDialog({
  open,
  diditStarting,
  onClose,
  onContinue,
}) {
  return (
    <MuiDialog
      open={open}
      onClose={() => !diditStarting && onClose()}
      maxWidth="sm"
      fullWidth
    >
      <span className="tw:block tw:text-2xl tw:font-semibold tw:text-black tw:px-4 tw:pt-6">
        Continue with DIDIT verification
      </span>
      <DialogContent>
        <div className="tw:space-y-4 tw:py-2">
          <span className="tw:block tw:text-sm tw:text-gray-700">
            You are about to start an identity verification process powered by
            DIDIT.
          </span>
          <div className="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:px-4 tw:py-4 tw:text-sm tw:text-slate-600 tw:space-y-2">
            <span className="tw:block">• DIDIT will ask for your government-issued ID and a selfie or liveness check.</span>
            <span className="tw:block">• You should allow camera access and complete the flow in one session.</span>
          </div>
          <div className="tw:flex tw:flex-col-reverse tw:sm:flex-row tw:sm:justify-end tw:gap-3 tw:pt-2">
            <button
              style={{
                borderRadius: 12
              }}
              type="button"
              disabled={diditStarting}
              onClick={onClose}
              className="tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-gray-300 tw:text-sm tw:font-medium tw:bg-white tw:hover:bg-gray-50 tw:disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              style={{
                borderRadius: 12
              }}
              type="button"
              disabled={diditStarting}
              onClick={onContinue}
              className="tw:px-4 tw:py-2 tw:rounded-xl tw:bg-primary tw:text-white tw:text-sm tw:font-semibold tw:disabled:opacity-50"
            >
              {diditStarting ? "Starting..." : "Continue"}
            </button>
          </div>
        </div>
      </DialogContent>
    </MuiDialog>
  );
}

export function OrganiserNameMismatchDialog({
  open,
  onClose,
  onEditProfile,
}) {
  return (
    <Transition appear show={open} as={Fragment}>
      <HeadlessDialog
        as="div"
        className="tw:relative tw:z-120"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="tw:ease-out tw:duration-200"
          enterFrom="tw:opacity-0"
          enterTo="tw:opacity-100"
          leave="tw:ease-in tw:duration-150"
          leaveFrom="tw:opacity-100"
          leaveTo="tw:opacity-0"
        >
          <div className="tw:fixed tw:inset-0 tw:bg-black/40 tw:backdrop-blur-sm" />
        </Transition.Child>

        <div className="tw:fixed tw:inset-0 tw:overflow-y-auto">
          <div className="tw:flex tw:min-h-full tw:items-center tw:justify-center tw:p-4">
            <Transition.Child
              as={Fragment}
              enter="tw:ease-out tw:duration-200"
              enterFrom="tw:opacity-0 tw:translate-y-2 tw:scale-95"
              enterTo="tw:opacity-100 tw:translate-y-0 tw:scale-100"
              leave="tw:ease-in tw:duration-150"
              leaveFrom="tw:opacity-100 tw:translate-y-0 tw:scale-100"
              leaveTo="tw:opacity-0 tw:translate-y-2 tw:scale-95"
            >
              <HeadlessDialog.Panel className="tw:w-full tw:max-w-md tw:rounded-3xl tw:bg-white tw:px-6 tw:py-6 tw:shadow-2xl tw:ring-1 tw:ring-black/5">
                <span className="tw:text-lg tw:md:text-xl tw:font-semibold tw:text-gray-900">
                  Account name mismatch
                </span>
                <span className="tw:block tw:mt-2 tw:text-sm tw:text-gray-600">
                  Your Zagasm account name must match the name on your bank
                  account. Please update your bank details or edit your profile
                  to continue.
                </span>

                <div className="tw:mt-5 tw:flex tw:flex-col tw:gap-3 tw:sm:flex-row tw:sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="tw:w-full tw:sm:w-auto tw:rounded-xl tw:border tw:border-gray-200 tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-gray-700 tw:hover:bg-gray-50 tw:transition"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={onEditProfile}
                    className="tw:w-full tw:sm:w-auto tw:rounded-xl tw:bg-primary tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-white tw:shadow-sm tw:hover:shadow-md tw:transition"
                  >
                    Edit profile
                  </button>
                </div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}
