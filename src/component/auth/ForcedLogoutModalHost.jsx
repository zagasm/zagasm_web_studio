import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, authHeaders } from "../../lib/apiClient";
import { subscribeToForcedLogout, emitForcedLogout } from "../../lib/authSessionSignals";
import { canUseRealtimePusher, createRealtimePusher } from "../../lib/realtimePusher";
import { useAuth } from "../../pages/auth/AuthContext";

const SESSION_CHECK_INTERVAL_MS = 8000;

export default function ForcedLogoutModalHost() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(
    "You have been logged out because you have logged in on another device."
  );
  const isHandlingRef = useRef(false);
  const isCheckingRef = useRef(false);
  const pusherRef = useRef(null);
  const channelRef = useRef(null);

  const disconnectRealtime = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unbind_all();
      if (pusherRef.current) {
        pusherRef.current.unsubscribe(channelRef.current.name);
      }
      channelRef.current = null;
    }

    if (pusherRef.current) {
      pusherRef.current.disconnect();
      pusherRef.current = null;
    }
  }, []);

  const handleForcedLogout = useCallback(
    (payload = {}) => {
      if (isHandlingRef.current) return;
      isHandlingRef.current = true;

      setMessage(
        payload?.message ||
          "You have been logged out because you have logged in on another device."
      );
      setOpen(true);
      disconnectRealtime();
      logout();

      if (location.pathname !== "/auth/signin") {
        navigate("/auth/signin", { replace: true });
      }
    },
    [disconnectRealtime, location.pathname, logout, navigate]
  );

  const validateSession = useCallback(async () => {
    if (!token || !user || isCheckingRef.current) return;

    isCheckingRef.current = true;
    try {
      await api.get("/api/v1/profile", authHeaders(token));
    } catch (error) {
      if (error?.response?.status === 401) {
        emitForcedLogout({
          reason: "another_device",
          message:
            "You have been logged out because you have logged in on another device.",
        });
      }
    } finally {
      isCheckingRef.current = false;
    }
  }, [token, user]);

  useEffect(() => {
    const unsubscribe = subscribeToForcedLogout(handleForcedLogout);
    return unsubscribe;
  }, [handleForcedLogout]);

  useEffect(() => {
    if (!token || !user?.id || !canUseRealtimePusher()) {
      disconnectRealtime();
      return;
    }

    const pusher = createRealtimePusher(token);
    if (!pusher) {
      return;
    }

    const channelName = `private-user.${user.id}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("session.revoked", (payload = {}) => {
      emitForcedLogout({
        reason: payload?.reason || "another_device",
        message:
          payload?.message ||
          "You have been logged out because you have logged in on another device.",
      });
    });

    pusherRef.current = pusher;
    channelRef.current = channel;

    return () => {
      disconnectRealtime();
    };
  }, [disconnectRealtime, token, user?.id]);

  useEffect(() => {
    if (!token || !user) {
      disconnectRealtime();
      isHandlingRef.current = false;
      return;
    }

    const interval = window.setInterval(() => {
      validateSession();
    }, SESSION_CHECK_INTERVAL_MS);

    const handleFocus = () => validateSession();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        validateSession();
      }
    };

    const handleStorage = (event) => {
      if (event.key !== "token") return;
      if (!token) return;

      if (!event.newValue || event.newValue !== token) {
        emitForcedLogout({
          reason: "another_device",
          message:
            "You have been logged out because you have logged in on another device.",
        });
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("online", handleFocus);
    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibility);

    validateSession();

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("online", handleFocus);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [disconnectRealtime, token, user, validateSession]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="tw:relative tw:z-[1000]"
        onClose={() => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="tw:transition-opacity tw:duration-200"
          enterFrom="tw:opacity-0"
          enterTo="tw:opacity-100"
          leave="tw:transition-opacity tw:duration-150"
          leaveFrom="tw:opacity-100"
          leaveTo="tw:opacity-0"
        >
          <div className="tw:fixed tw:inset-0 tw:bg-slate-950/50" />
        </Transition.Child>

        <div className="tw:fixed tw:inset-0 tw:flex tw:items-center tw:justify-center tw:p-4">
          <Transition.Child
            as={Fragment}
            enter="tw:transition tw:duration-200"
            enterFrom="tw:opacity-0 tw:scale-95 tw:translate-y-2"
            enterTo="tw:opacity-100 tw:scale-100 tw:translate-y-0"
            leave="tw:transition tw:duration-150"
            leaveFrom="tw:opacity-100 tw:scale-100 tw:translate-y-0"
            leaveTo="tw:opacity-0 tw:scale-95 tw:translate-y-2"
          >
            <Dialog.Panel className="tw:w-full tw:max-w-md tw:rounded-3xl tw:bg-white tw:p-6 tw:shadow-2xl">
              <span className="tw:block tw:text-xl tw:font-semibold tw:text-slate-900">
                You have been logged out
              </span>

              <span className="tw:mt-3 tw:text-sm tw:leading-6 tw:text-slate-600">
                {message}
              </span>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="tw:mt-6 tw:inline-flex tw:h-11 tw:w-full tw:items-center tw:justify-center tw:rounded-2xl tw:bg-black tw:px-4 tw:text-sm tw:font-semibold tw:text-white"
              >
                Continue to sign in
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
