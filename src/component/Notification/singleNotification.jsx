import React, { useEffect, useState } from "react";

/**
 * Props:
 * - notification: {
 *     id, message, data, read_at, read_at_human, created_at, time_ago
 *   }
 * - onClick: () => void   // mark as read (container click)
 * - onDelete: () => void  // opens confirm modal
 */
function SingleNotificationTemplate({ notification, onClick, onDelete }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const title =
    notification?.data?.action ||
    notification?.data?.message ||
    notification?.message ||
    "Notification";
  const messageBody =
    notification?.data?.message ||
    notification?.message ||
    `${notification?.data?.actor?.name || "Someone"} updated your feed`;
  const previewText =
    messageBody.length > 120 ? `${messageBody.slice(0, 120)}…` : messageBody;

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const isUnread = !notification?.read_at;
  const timeLabel = notification?.time_ago || notification?.created_at || "Just now";

  return (
    <article
      className={`tw:rounded-2xl tw:bg-white tw:p-5 tw:shadow-sm tw:transition tw:duration-200 tw:cursor-pointer tw:border ${
        isUnread
          ? "tw:border-l-4 tw:border-purple-600 tw:shadow-[0_12px_30px_rgba(15,23,42,0.15)]"
          : "tw:border-transparent hover:tw:shadow-md"
      }`}
      onClick={onClick}
      role="button"
    >
      <div className="tw:flex tw:gap-4 tw:items-start">
        <span
          className={`tw:h-2 tw:w-2 tw:shrink-0 tw:rounded-full ${
            isUnread ? "tw:bg-purple-600" : "tw:bg-slate-300"
          }`}
        />
        <div className="tw:flex-1 tw:space-y-3">
          <div className="tw:flex tw:justify-between tw:gap-3">
            <strong className="tw:text-base tw:font-semibold tw:text-slate-900 tw:first-letter:uppercase ">
              {title}
            </strong>
            {isUnread && (
              <span className="tw:rounded-full tw:bg-purple-100 tw:px-3 tw:py-0.5 tw:text-xs tw:font-semibold tw:text-purple-700">
                New
              </span>
            )}
          </div>

          <p className="tw:text-sm tw:text-slate-600">
            {isMobile && !isExpanded ? previewText : messageBody}
            {isMobile && messageBody.length > 120 && (
              <button
                type="button"
                onClick={toggleExpand}
                className="tw:ml-2 tw:text-xs tw:font-semibold tw:text-purple-600 tw:underline-offset-4 hover:tw:underline"
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </p>

          <div className="tw:flex tw:items-center tw:justify-between tw:text-xs tw:text-slate-500">
            <span>{timeLabel}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="tw:text-red-500 hover:tw:text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default SingleNotificationTemplate;
