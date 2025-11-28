import React from "react";

export default function PlansSkeleton() {
  const placeholders = [1, 2, 3];

  return (
    <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 xl:tw:grid-cols-3 tw:gap-5">
      {placeholders.map((id) => (
        <div
          key={id}
          className="tw:rounded-3xl tw:border tw:border-white/10 tw:bg-white/5 tw:p-5 tw:space-y-4 tw:animate-pulse"
        >
          <div className="tw:h-5 tw:w-24 tw:bg-white/15 tw:rounded-full" />
          <div className="tw:h-8 tw:w-32 tw:bg-white/15 tw:rounded-full" />
          <div className="tw:h-3 tw:w-full tw:bg-white/10 tw:rounded-full" />
          <div className="tw:h-3 tw:w-3/4 tw:bg-white/10 tw:rounded-full" />
          <div className="tw:h-10 tw:w-full tw:bg-white/15 tw:rounded-2xl tw:mt-3" />
        </div>
      ))}
    </div>
  );
}
