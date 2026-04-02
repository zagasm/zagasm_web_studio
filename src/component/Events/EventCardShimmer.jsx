import React from "react";

export default function EventCardShimmer() {
  return (
    <article className="col-12 col-md-6 col-lg-6 col-xl-6 tw:overflow-hidden tw:rounded-3xl tw:bg-white">
      <div className="tw:h-52 tw:bg-gray-100 tw:animate-pulse" />
      <div className="tw:p-5 tw:space-y-3">
        <div className="tw:h-5 tw:w-3/4 tw:bg-gray-100 tw:rounded tw:animate-pulse" />
        <div className="tw:h-4 tw:w-1/3 tw:bg-gray-100 tw:rounded tw:animate-pulse" />
        <div className="tw:flex tw:justify-between tw:gap-4">
          <div className="tw:h-4 tw:w-1/2 tw:bg-gray-100 tw:rounded tw:animate-pulse" />
          <div className="tw:h-5 tw:w-20 tw:bg-gray-100 tw:rounded tw:animate-pulse" />
        </div>
        <div className="tw:h-11 tw:w-full tw:bg-gray-100 tw:rounded-2xl tw:animate-pulse" />
      </div>
    </article>
  );
}
