import React from "react";

const formatNotificationText = (value) => {
  if (typeof value === "string") {
    return value.trim();
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => formatNotificationText(item))
      .filter(Boolean)
      .join(" ");
  }
  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([key, val]) => {
        const formattedVal = formatNotificationText(val);
        return formattedVal ? `${key}: ${formattedVal}` : key;
      })
      .filter(Boolean)
      .join(" - ");
  }
  return "";
};

const pickNotificationText = (...values) => {
  for (const value of values) {
    const formatted = formatNotificationText(value);
    if (formatted) {
      return formatted;
    }
  }
  return "";
};

function SingleNotificationTemplate({ notification, onClick }) {
  const actorName = notification?.data?.actor?.name || "Someone";
  const title =
    pickNotificationText(
      notification?.data?.action,
      notification?.data?.message,
      notification?.message
    ) || "Notification";
  const messageBody =
    pickNotificationText(notification?.data?.message, notification?.message) ||
    `${actorName} updated your feed`;
  const isUnread = !notification?.read_at;
  const timeLabel = notification?.time_ago || notification?.created_at || "Just now";

  return (
    <article
      className={`tw:cursor-pointer tw:px-5 tw:py-4 tw:transition tw:duration-200 hover:tw:bg-[#fcfaf7] ${
        isUnread
          ? "tw:border-l-4 tw:border-primary tw:bg-[#fffaf4]"
          : "tw:border-l-4 tw:border-transparent"
      }`}
      onClick={onClick}
      role="button"
    >
      <div className="tw:flex tw:items-start tw:gap-4">
        <span
          className={`tw:h-2 tw:w-2 tw:shrink-0 tw:rounded-full ${
            isUnread ? "tw:bg-primary" : "tw:bg-slate-300"
          }`}
        />

        <div className="tw:min-w-0 tw:flex-1 tw:space-y-2">
          <div className="tw:flex tw:items-start tw:justify-between tw:gap-3">
            <strong className="tw:text-sm tw:font-semibold tw:text-slate-900 tw:first-letter:uppercase sm:tw:text-base">
              {title}
            </strong>
            <span className="tw:shrink-0 tw:text-xs tw:text-slate-500">{timeLabel}</span>
          </div>

          <p className="tw:text-sm tw:leading-6 tw:text-slate-600">{messageBody}</p>
        </div>
      </div>
    </article>
  );
}

export default SingleNotificationTemplate;
