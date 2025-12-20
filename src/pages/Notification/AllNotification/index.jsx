import React, { useEffect, useMemo, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import SingleNotificationTemplate from "../../../component/Notification/singleNotification";
import { api, authHeaders } from "../../../lib/apiClient";
import { useAuth } from "../../auth/AuthContext";
import { showPromise } from "../../../component/ui/toast";

function AllNotification() {
  const { token } = useAuth();
  const [items, setItems] = useState([]); // server notifications
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [filter, setFilter] = useState("all");

  const unreadCount = useMemo(
    () => items.reduce((acc, n) => acc + (n.read_at ? 0 : 1), 0),
    [items]
  );

  const filteredItems = useMemo(() => {
    if (filter === "unread") {
      return items.filter((n) => !n.read_at);
    }
    return items;
  }, [items, filter]);

  // Fetch
  useEffect(() => {
    let mounted = true;
    async function run() {
      try {
        setLoading(true);
        const req = api.get("/api/v1/notifications", authHeaders(token));
        const res = await req;
        const list = res?.data?.notifications || [];
        if (mounted) setItems(list);
      } catch (e) {
        // toast shown above
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [token]);

  // Mark one as read
  const markOneAsRead = async (id) => {
    // optimistic: if already read, skip request
    const current = items.find((n) => n.id === id);
    if (!current || current.read_at) return;

    try {
      // Optimistic UI
      setItems((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, read_at: new Date().toISOString(), read_at_human: "now" }
            : n
        )
      );

      const req = api.post(
        `/api/v1/notifications/${id}/read`,
        null,
        authHeaders(token)
      );
      const res = await showPromise(req, {
        loading: "Marking as read…",
        success: "Marked as read",
        error: "Failed to mark as read",
      });

      // Reconcile with server response if needed
      const updated = res?.data?.notification;
      if (updated) {
        setItems((prev) =>
          prev.map((n) => (n.id === id ? { ...n, ...updated } : n))
        );
      }
    } catch (e) {
      // rollback on error
      setItems((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: null, read_at_human: null } : n
        )
      );
    }
  };

  // Mark all as read
  const markAll = async () => {
    try {
      // Optimistic: mark all read locally
      const now = new Date().toISOString();
      setItems((prev) =>
        prev.map((n) => ({
          ...n,
          read_at: n.read_at || now,
          read_at_human: n.read_at_human || "now",
        }))
      );

      const req = api.post(
        "/api/v1/notifications/mark-all-as-read",
        null,
        authHeaders(token)
      );
      await showPromise(req, {
        loading: "Marking all as read…",
        success: "All notifications marked as read",
        error: "Failed to mark all as read",
      });
    } catch (e) {
      // If it fails, you could refetch; for now we’ll just show the error toast (above)
    }
  };

  // Delete flow
  const requestDelete = (id) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const id = toDeleteId;
    if (!id) return;
    setConfirmOpen(false);

    try {
      // Optimistic remove
      const prevBackup = items;
      setItems((prev) => prev.filter((n) => n.id !== id));

      const req = api.delete(`/api/v1/notifications/${id}`, authHeaders(token));
      await showPromise(req, {
        loading: "Deleting…",
        success: "Notification deleted",
        error: "Failed to delete notification",
      });
    } catch (e) {
      // If delete fails you might refetch; for now just show toast (already shown)
    } finally {
      setToDeleteId(null);
    }
  };

  return (
    <div className="tw:font-sans tw:mt-20 tw:bg-slate-50 tw:min-h-screen tw:px-4 tw:py-10 tw:sm:px-6 tw:md:px-8">
      <div className="tw:mx-auto tw:flex tw:max-w-6xl tw:flex-col tw:gap-8">
        <section className="tw:rounded-[28px] tw:bg-linear-to-br tw:from-white tw:to-purple-50 tw:p-6 tw:shadow-[0_25px_45px_rgba(15,23,42,0.15)] tw:space-y-4">
          <div className="tw:text-slate-700">
            <span className="tw:text-xs tw:font-bold tw:uppercase tw:tracking-[0.4em] tw:text-purple-700">
              Activity center
            </span>
            <h1 className="tw:mt-3 tw:text-3xl tw:font-semibold tw:text-slate-900">
              Notifications
            </h1>
            <span className="tw:mt-1 tw:max-w-3xl tw:text-sm tw:text-slate-600">
              Keep up with everything happening on Zagasm Studios—reads,
              follows, and community updates live in one place.
            </span>
          </div>
          <div className="tw:flex tw:flex-col tw:gap-4 tw:rounded-2xl tw:bg-white tw:p-5 tw:shadow-lg md:tw:flex-row md:tw:items-center md:tw:justify-between">
            <div className="tw:flex tw:gap-6 tw:flex-wrap">
              <div className="tw:flex tw:flex-col">
                <span className="tw:text-3xl tw:font-bold tw:text-slate-900">
                  {items.length}
                </span>
                <span className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.4em] tw:text-slate-500">
                  Total alerts
                </span>
              </div>
              <div className="tw:flex tw:flex-col">
                <span className="tw:text-3xl tw:font-bold tw:text-slate-900">
                  {unreadCount}
                </span>
                <span className="tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-[0.4em] tw:text-slate-500">
                  Unread
                </span>
              </div>
            </div>
            <button
              style={{
                borderRadius: 16,
              }}
              type="button"
              className="tw:rounded-full tw:bg-primary tw:px-5 tw:py-2.5 tw:text-sm tw:font-semibold tw:text-white disabled:tw:opacity-60"
              onClick={markAll}
              disabled={unreadCount === 0 || loading}
            >
              Mark all as read
            </button>
          </div>
          <div className="tw:flex tw:flex-wrap tw:gap-3">
            <button
              style={{
                borderRadius: 16,
              }}
              type="button"
              onClick={() => setFilter("all")}
              className={`tw:rounded-full tw:border tw:px-5 tw:py-2 tw:text-sm tw:font-semibold ${
                filter === "all"
                  ? "tw:border-transparent tw:bg-purple-600 tw:text-white"
                  : "tw:border-purple-200 tw:bg-white tw:text-purple-700"
              }`}
            >
              All updates
            </button>
            <button
              style={{
                borderRadius: 16,
              }}
              type="button"
              onClick={() => setFilter("unread")}
              className={`tw:rounded-full tw:border tw:px-5 tw:py-2 tw:text-sm tw:font-semibold ${
                filter === "unread"
                  ? "tw:border-transparent tw:bg-purple-600 tw:text-white"
                  : "tw:border-purple-200 tw:bg-white tw:text-purple-700"
              }`}
            >
              Unread only
              {unreadCount > 0 && (
                <span className="tw:ml-3 tw:inline-flex tw:h-2 tw:w-2 tw:rounded-full tw:bg-purple-500" />
              )}
            </button>
          </div>
        </section>

        <section className="tw:space-y-4">
          {loading ? (
            <div className="tw:rounded-2xl tw:bg-white tw:p-8 tw:text-center tw:text-sm tw:text-slate-500 tw:shadow-sm">
              Loading notifications…
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="tw:rounded-2xl tw:bg-white tw:p-8 tw:text-center tw:text-sm tw:text-slate-500 tw:shadow-sm">
              You are all caught up. Check back later for updates.
            </div>
          ) : (
            filteredItems.map((n) => (
              <SingleNotificationTemplate
                key={n.id}
                notification={n}
                onClick={() => markOneAsRead(n.id)}
                onDelete={() => requestDelete(n.id)}
              />
            ))
          )}
        </section>
      </div>

      {/* Confirm Delete Modal (Headless UI) */}
      <Transition show={confirmOpen} as={Fragment} appear>
        <Dialog
          as="div"
          className="position-relative"
          onClose={() => setConfirmOpen(false)}
        >
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="position-fixed top-0 bottom-0 start-0 end-0"
              style={{ background: "rgba(0,0,0,0.4)" }}
            />
          </Transition.Child>

          <div className="position-fixed top-0 bottom-0 start-0 end-0 overflow-auto">
            <div className="d-flex min-vh-100 align-items-center justify-content-center p-3">
              <Transition.Child
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-middle-y"
                enterTo="opacity-100 translate-none"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0 translate-middle-y"
              >
                <Dialog.Panel
                  className="bg-white rounded-3 shadow-lg border p-3"
                  style={{ maxWidth: 420, width: "100%" }}
                >
                  <Dialog.Title className="h5 mb-2">
                    Delete notification?
                  </Dialog.Title>
                  <span className="mb-3 text-muted">
                    This action cannot be undone.
                  </span>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-light"
                      onClick={() => setConfirmOpen(false)}
                    >
                      Cancel
                    </button>
                    <button className="btn btn-danger" onClick={confirmDelete}>
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default AllNotification;
