import React, { useEffect, useMemo, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import SingleNotificationTemplate from "../../../component/Notification/singleNotification";
import SideBarNav from "../../pageAssets/SideBarNav";
import { api, authHeaders } from "../../../lib/apiClient";
import { useAuth } from "../../auth/AuthContext";
import {
  ToastHost,
  showPromise,
  showSuccess,
  showError,
} from "../../../component/ui/toast";

function AllNotification() {
  const { token } = useAuth();
  const [items, setItems] = useState([]); // server notifications
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  const unreadCount = useMemo(
    () => items.reduce((acc, n) => acc + (n.read_at ? 0 : 1), 0),
    [items]
  );

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
    <div className="">
      <div className="tw:py-16 tw:md:py-20">
        <div className="">
          <div className="col ">
            <div className="container">
              <div className="mt-5 p-md-2">
                <div className="mb-4 d-flex justify-content-between align-items-center">
                  <h4 className="text-black m-0 d-flex align-items-center gap-2">
                    Notification
                    {/* Unread badge (tiny) */}
                    <span
                      style={{
                        display: "inline-block",
                        minWidth: 22,
                        padding: "2px 8px",
                        borderRadius: 9999,
                        background: "#F4E6FD",
                        color: "#8F07E7",
                        fontSize: 12,
                        fontWeight: 600,
                        textAlign: "center",
                      }}
                      aria-label={`Unread notifications: ${unreadCount}`}
                    >
                      {unreadCount}
                    </span>
                  </h4>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="tw:px-2 tw:py-1 tw:bg-primary text-white tw:text-[8px] tw:md:text-sm"
                      onClick={markAll}
                      disabled={unreadCount === 0 || loading}
                    >
                      Mark all as read
                    </button>
                    <h4 className="feather-settings text-black m-0"></h4>
                  </div>
                </div>

                {loading ? (
                  <div className="text-muted">Loading…</div>
                ) : items.length === 0 ? (
                  <div className="text-muted">No notifications yet.</div>
                ) : (
                  items.map((n) => (
                    <SingleNotificationTemplate
                      key={n.id}
                      notification={n}
                      onClick={() => markOneAsRead(n.id)}
                      onDelete={() => requestDelete(n.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
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
                  <p className="mb-3 text-muted">
                    This action cannot be undone.
                  </p>
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
