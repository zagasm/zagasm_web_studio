import React from "react";

export default function StepLoader() {
  return (
    <div className="tw:absolute tw:inset-0 tw:bg-white/80 tw:flex tw:items-center tw:justify-center tw:rounded-2xl tw:z-10">
      <div className="tw:animate-spin tw:h-6 tw:w-6 tw:rounded-full tw:border-2 tw:border-gray-300 tw:border-t-primary" />
    </div>
  );
}
