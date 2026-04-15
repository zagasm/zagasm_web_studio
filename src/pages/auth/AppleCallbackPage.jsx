import React from "react";

export default function AppleCallbackPage() {
  return (
    <div className="tw:flex tw:min-h-[50vh] tw:items-center tw:justify-center tw:px-6 tw:text-center">
      <div>
        <h1 className="tw:mb-3 tw:text-xl tw:font-semibold">
          Apple sign-in is processing
        </h1>
        <p className="tw:mb-0 tw:text-sm tw:text-gray-600">
          You can close this window and return to Xilolo if nothing happens
          automatically.
        </p>
      </div>
    </div>
  );
}
