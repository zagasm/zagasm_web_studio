import React from "react";

export default function HeroBanner() {
  return (
    <section className="tw:max-w-5xl tw:mx-auto tw:px-4">
      <div className="tw:bg-linear-to-b tw:from-primary tw:to-primarySecond tw:text-white tw:rounded-2xl tw:p-6 tw:sm:p-10 tw:shadow-lg">
        <h1 className="tw:text-2xl tw:sm:text-3xl tw:font-semibold">
          Your Data, Your Rights
        </h1>
        <span className="tw:mt-3 tw:max-w-3xl tw:text-white/90">
          At <span className="tw:font-medium">Zagasm Studios</span>, we power
          creator-first experiences — live streams, events, chat and payouts —
          while keeping your personal data protected. You can access, download,
          move or delete your information whenever you need.
        </span>
      </div>
    </section>
  );
}
