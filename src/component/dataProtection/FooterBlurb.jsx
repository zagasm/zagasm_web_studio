import React from "react";

export default function FooterBlurb() {
  return (
    <footer className="tw:bg-primary">
      <div className="tw:max-w-5xl tw:mx-auto tw:px-4 tw:py-10">
        <h4 className="tw:text-xl tw:md:text-2xl tw:font-semibold text-white">Your Privacy Matters</h4>
        <span className="tw:text-white/70 tw:mt-2 tw:max-w-3xl">
          Zagasm Studios is committed to transparent, creator-friendly
          experiences. We design our products with privacy in mind, from
          streaming to payouts, and we continuously improve our security
          controls to safeguard your data.
        </span>
      </div>
    </footer>
  );
}
