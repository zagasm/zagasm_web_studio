import React from "react";

const ShimmerBlock = ({ className = "" }) => (
  <div className={`tw:relative tw:overflow-hidden tw:bg-gray-100 ${className}`}>
    <div className="tw:absolute tw:inset-0 tw:animate-pulse tw:bg-gray-200" />
    <div className="tw:absolute tw:inset-0 tw:bg-linear-to-r tw:from-transparent tw:via-white/60 tw:to-transparent tw:-translate-x-full tw:animate-[shimmer_1.2s_infinite]" />
  </div>
);

// NOTE: add this keyframe once in your global css (below)
export function PodiumShimmer() {
  return (
    <div className="tw:grid tw:grid-cols-3 tw:items-end tw:gap-4 tw:md:gap-6 tw:py-2">
      <div className="tw:flex tw:flex-col tw:items-center tw:gap-3">
        <ShimmerBlock className="tw:rounded-full tw:size-16 tw:sm:size-20 tw:md:size-24" />
        <ShimmerBlock className="tw:h-3 tw:w-20 tw:rounded-full" />
        <ShimmerBlock className="tw:h-2.5 tw:w-16 tw:rounded-full" />
      </div>

      <div className="tw:flex tw:flex-col tw:items-center tw:gap-3">
        <ShimmerBlock className="tw:rounded-full tw:size-20 tw:sm:size-24 tw:md:size-28" />
        <ShimmerBlock className="tw:h-3 tw:w-24 tw:rounded-full" />
        <ShimmerBlock className="tw:h-2.5 tw:w-18 tw:rounded-full" />
      </div>

      <div className="tw:flex tw:flex-col tw:items-center tw:gap-3">
        <ShimmerBlock className="tw:rounded-full tw:size-16 tw:sm:size-20 tw:md:size-24" />
        <ShimmerBlock className="tw:h-3 tw:w-20 tw:rounded-full" />
        <ShimmerBlock className="tw:h-2.5 tw:w-16 tw:rounded-full" />
      </div>
    </div>
  );
}

export function RowShimmer() {
  return (
    <div className="tw:w-full tw:border tw:border-gray-100 tw:rounded-3xl tw:p-3 tw:sm:p-4 tw:flex tw:items-center tw:gap-3 tw:sm:gap-4">
      <ShimmerBlock className="tw:rounded-2xl tw:size-4 tw:sm:w-[110px] tw:sm:h-[110px]" />

      <div className="tw:flex-1 tw:space-y-2">
        <ShimmerBlock className="tw:h-3 tw:w-40 tw:rounded-full" />
        <ShimmerBlock className="tw:h-2.5 tw:w-24 tw:rounded-full" />
        <ShimmerBlock className="tw:h-2.5 tw:w-28 tw:rounded-full" />
        <div className="tw:flex tw:gap-3 tw:pt-1">
          <ShimmerBlock className="tw:h-8 tw:w-32 tw:rounded-2xl" />
          <ShimmerBlock className="tw:h-8 tw:w-32 tw:rounded-2xl" />
        </div>
      </div>

      <ShimmerBlock className="tw:rounded-2xl tw:w-24 tw:sm:w-[120px] tw:h-10" />
    </div>
  );
}
