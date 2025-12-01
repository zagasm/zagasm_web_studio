import React from "react";
import { ExternalLink } from "lucide-react";

// TODO: replace these with your real store URLs
const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=com.zagasm.studios";
const APPSTORE_URL = "https://apps.apple.com/app/id1234567890";

export default function LiveAppDownloadBanner() {
  return (
    <div className="tw:w-full tw:rounded-2xl tw:bg-[#F3F4FF] tw:px-3.5 tw:py-3 tw:text-[11px] tw:text-gray-700">
      <p className="tw:text-xs tw:font-semibold tw:text-gray-900">
        Join live from the Zagasm Studios app
      </p>
      <p className="tw:mt-1 tw:text-[11px] tw:text-gray-600">
        For the smoothest low-latency experience, join this live event from our
        mobile app.
      </p>

      <div className="tw:mt-2 tw:flex tw:flex-wrap tw:gap-2">
        <a
          href={PLAYSTORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="tw:inline-flex tw:items-center tw:justify-center tw:gap-1 tw:rounded-full tw:bg-black tw:px-3 tw:py-1.5 tw:text-[11px] tw:font-medium tw:text-white hover:tw:bg-[#111827]"
        >
          <span>Get on Play Store</span>
          <ExternalLink className="tw:w-3 tw:h-3 tw:text-white/80" />
        </a>

        <a
          href={APPSTORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="tw:inline-flex tw:items-center tw:justify-center tw:gap-1 tw:rounded-full tw:bg-white tw:border tw:border-gray-200 tw:px-3 tw:py-1.5 tw:text-[11px] tw:font-medium tw:text-gray-800 hover:tw:bg-gray-50"
        >
          <span>Get on App Store</span>
          <ExternalLink className="tw:w-3 tw:h-3 tw:text-gray-400" />
        </a>
      </div>
    </div>
  );
}
