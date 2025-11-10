import React from "react";

export default function DataFormatList() {
  const items = [
    "Profile Data: account info, bio, profile picture, settings",
    "Content: streams, VOD metadata, events, posts, comments, reactions",
    "Media Files: uploaded posters, thumbnails, clips (links/metadata)",
    "Messages: direct messages, community conversations where permitted",
    "Connections: followers, following, subscribers, blocked accounts",
    "Wallet & Earnings: payouts, invoices, tickets, purchases (summaries)",
    "Activity Logs: logins, security checks, platform interactions",
  ];

  return (
    <div className="tw:mb-12">
      <h3 className="tw:text-xl sm:tw:text-2xl tw:font-semibold tw:mb-2">
        Data Format
      </h3>
      <p className="tw:text-gray-600">
        Your archive typically includes the following (subject to retention and
        legal obligations):
      </p>
      <ul className="tw:list-disc tw:pl-6 tw:mt-4 tw:space-y-1 tw:text-gray-800">
        {items.map((txt) => (
          <li key={txt}>{txt}</li>
        ))}
      </ul>
    </div>
  );
}
