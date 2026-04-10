import React, { useMemo, useState } from "react";
import { ChevronLeftIcon } from "lucide-react";
import SingleNotificationTemplate from "../../../component/Notification/singleNotification";
import useNotifications from "../../../component/Notification/useNotifications";
import { useAuth } from "../../auth/AuthContext";

function AllNotification() {
  const { token } = useAuth();
  const [filter, setFilter] = useState("all");
  const { notifications, loading, unreadCount, markOneAsRead, markAllAsRead } =
    useNotifications(token);

  const filteredItems = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((item) => !item.read_at);
    }
    return notifications;
  }, [notifications, filter]);

  return (
    <div className="tw:mt-16 tw:min-h-[calc(100vh-4rem)] tw:bg-[#f8f6f2] tw:px-4 tw:py-6 tw:font-sans tw:sm:px-6 tw:md:px-8 tw:md:py-8">
      <div className="tw:mx-auto tw:flex tw:max-w-4xl tw:flex-col tw:gap-6">
        <section className="tw:rounded-[28px] tw:border tw:border-[#ebe3d8] tw:bg-white tw:p-5 tw:shadow-[0_18px_50px_rgba(15,23,42,0.06)] tw:sm:p-6">
          <div className="tw:text-slate-700">
            <button
              onClick={() => window.history.back()}
              className="tw:inline-flex tw:items-center tw:gap-1 tw:text-sm tw:font-medium tw:text-primary"
            >
              <ChevronLeftIcon className="tw:mr-2 tw:h-5 tw:w-5" />
              <span>Back</span>
            </button>
            <span className="tw:mt-3 tw:block tw:text-3xl tw:font-semibold tw:text-slate-900">
              Notifications
            </span>
            <span className="tw:mt-1 tw:max-w-3xl tw:text-sm tw:text-slate-600">
              Keep up with event updates, reads, and activity in one simple feed.
            </span>
          </div>

          <div className="tw:mt-5 tw:flex tw:flex-col tw:gap-4 tw:sm:flex-row tw:sm:items-center tw:sm:justify-between">
            <div className="tw:flex tw:items-center tw:gap-3">
              <div className="tw:rounded-2xl tw:bg-[#f5efe6] tw:px-4 tw:py-3">
                <span className="tw:block tw:text-2xl tw:font-semibold tw:text-slate-900">
                  {notifications.length}
                </span>
                <span className="tw:text-xs tw:text-slate-500">Total</span>
              </div>
              <div className="tw:rounded-2xl tw:bg-[#fff5ef] tw:px-4 tw:py-3">
                <span className="tw:block tw:text-2xl tw:font-semibold tw:text-slate-900">
                  {unreadCount}
                </span>
                <span className="tw:text-xs tw:text-slate-500">Unread</span>
              </div>
            </div>

            <button
              type="button"
              className="tw:rounded-full tw:bg-primary tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-white disabled:tw:opacity-60"
              onClick={() => markAllAsRead({ toast: true })}
              disabled={unreadCount === 0 || loading}
            >
              Mark all as read
            </button>
          </div>

          <div className="tw:mt-4 tw:flex tw:flex-wrap tw:gap-3">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`tw:rounded-full tw:border tw:px-5 tw:py-2 tw:text-sm tw:font-semibold ${
                filter === "all"
                  ? "tw:border-transparent tw:bg-primary tw:text-white"
                  : "tw:border-[#ddd4ca] tw:bg-white tw:text-primary"
              }`}
            >
              All updates
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`tw:rounded-full tw:border tw:px-5 tw:py-2 tw:text-sm tw:font-semibold ${
                filter === "unread"
                  ? "tw:border-transparent tw:bg-primary tw:text-white"
                  : "tw:border-[#ddd4ca] tw:bg-white tw:text-primary"
              }`}
            >
              Unread only
              {unreadCount > 0 && (
                <span className="tw:ml-3 tw:inline-flex tw:h-2 tw:w-2 tw:rounded-full tw:bg-primary" />
              )}
            </button>
          </div>
        </section>

        <section className="tw:overflow-hidden tw:rounded-[28px] tw:border tw:border-[#ebe3d8] tw:bg-white tw:shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="tw:divide-y tw:divide-[#efe7dc]">
            {loading ? (
              <div className="tw:p-8 tw:text-center tw:text-sm tw:text-slate-500">
                Loading notifications...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="tw:p-8 tw:text-center tw:text-sm tw:text-slate-500">
                You are all caught up. Check back later for updates.
              </div>
            ) : (
              filteredItems.map((notification) => (
                <SingleNotificationTemplate
                  key={notification.id}
                  notification={notification}
                  onClick={() => markOneAsRead(notification.id, { toast: true })}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AllNotification;
