import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { api, authHeaders } from "../../lib/apiClient";
import { useAuth } from "../../pages/auth/AuthContext";
import { showError, showSuccess } from "../../component/ui/toast";

export default function SetUsernameModal({
  open,
  onClose,
  currentUsername = "",
  canChange = true,
  onUsernameUpdated,
}) {
  const { token } = useAuth();
  const [username, setUsername] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState({
    checked: false,
    available: false,
    message: "",
  });
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    setUsername(currentUsername || "");
    setDebouncedUsername((currentUsername || "").trim().toLowerCase());
    setAvailability({
      checked: false,
      available: false,
      message: "",
    });
  }, [open, currentUsername]);

  const normalizedUsername = username.trim().toLowerCase();
  const unchanged =
    normalizedUsername &&
    normalizedUsername === (currentUsername || "").trim().toLowerCase();

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      setDebouncedUsername(normalizedUsername);
    }, 500);

    return () => clearTimeout(timer);
  }, [normalizedUsername, open]);

  const canSubmit = useMemo(() => {
    if (!canChange) return false;
    if (!normalizedUsername) return false;
    if (unchanged) return false;
    if (!availability.checked || !availability.available) return false;
    if (checking || saving) return false;
    return true;
  }, [availability, canChange, checking, normalizedUsername, saving, unchanged]);

  useEffect(() => {
    if (!open || !canChange) return;

    if (!debouncedUsername) {
      setChecking(false);
      setAvailability({
        checked: false,
        available: false,
        message: "",
      });
      return;
    }

    if (
      debouncedUsername === (currentUsername || "").trim().toLowerCase()
    ) {
      setChecking(false);
      setAvailability({
        checked: true,
        available: false,
        message: "This is already your current username.",
      });
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    setChecking(true);
    setAvailability({
      checked: false,
      available: false,
      message: "Checking username availability...",
    });

    const runCheck = async () => {
      try {
        const { data } = await api.post(
          "/api/v1/username/check",
          { username: debouncedUsername },
          authHeaders(token)
        );

        if (requestIdRef.current !== currentRequestId) return;

        setAvailability({
          checked: true,
          available: !!data?.available,
          message: data?.message || "",
        });
      } catch (err) {
        if (requestIdRef.current !== currentRequestId) return;

        const message =
          err?.response?.data?.message || "Unable to check username right now.";
        setAvailability({
          checked: true,
          available: false,
          message,
        });
        showError(message);
      } finally {
        if (requestIdRef.current === currentRequestId) {
          setChecking(false);
        }
      }
    };

    runCheck();
  }, [canChange, currentUsername, debouncedUsername, open, token]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!canSubmit) return;

    try {
      setSaving(true);
      const { data } = await api.post(
        "/api/v1/username/set",
        { username: normalizedUsername },
        authHeaders(token)
      );

      const nextUsername = data?.data?.username || normalizedUsername;
      showSuccess(data?.message || "Username updated successfully");
      onUsernameUpdated?.(nextUsername);
      onClose?.();
    } catch (err) {
      showError(
        err?.response?.data?.message || "Unable to update username right now."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog as="div" className="tw:relative tw:z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="tw:transition tw:ease-out tw:duration-200"
          enterFrom="tw:opacity-0"
          enterTo="tw:opacity-100"
          leave="tw:transition tw:ease-in tw:duration-150"
          leaveFrom="tw:opacity-100"
          leaveTo="tw:opacity-0"
        >
          <div className="tw:fixed tw:inset-0 tw:bg-black/40" />
        </Transition.Child>

        <div className="tw:fixed tw:inset-0 tw:overflow-y-auto">
          <div className="tw:flex tw:min-h-full tw:items-center tw:justify-center tw:p-4">
            <Transition.Child
              as={Fragment}
              enter="tw:transition tw:ease-out tw:duration-200"
              enterFrom="tw:opacity-0 tw:translate-y-2 tw:sm:translate-y-0 tw:sm:scale-95"
              enterTo="tw:opacity-100 tw:translate-y-0 tw:sm:scale-100"
              leave="tw:transition tw:ease-in tw:duration-150"
              leaveFrom="tw:opacity-100 tw:sm:scale-100"
              leaveTo="tw:opacity-0 tw:translate-y-2 tw:sm:translate-y-0 tw:sm:scale-95"
            >
              <Dialog.Panel className="tw:w-full tw:max-w-lg tw:rounded-2xl tw:bg-white tw:shadow-2xl tw:border tw:border-gray-100 tw:p-4 tw:sm:p-6">
                <span className="tw:text-lg tw:sm:text-xl tw:font-semibold tw:text-gray-900">
                  Set Username
                </span>
                <p className="tw:mt-1 tw:text-sm tw:text-gray-500">
                  Choose the username you want other users to see on your
                  profile.
                </p>

                <form onSubmit={handleSubmit} className="tw:mt-6 tw:space-y-4">
                  <div>
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                      placeholder="Enter username"
                      disabled={!canChange || saving}
                      className="tw:w-full tw:h-11 tw:rounded-xl tw:border tw:border-gray-200 focus:tw:border-primary focus:tw:ring-2 focus:tw:ring-primary/20 tw:outline-none tw:px-3"
                    />
                    {!!currentUsername && (
                      <p className="tw:mt-1 tw:text-xs tw:text-gray-500">
                        Current username: @{currentUsername}
                      </p>
                    )}
                  </div>

                  <div className="tw:min-h-[44px]">
                    {!canChange ? (
                      <p className="tw:text-sm tw:text-amber-700 tw:bg-amber-50 tw:rounded-xl tw:px-3 tw:py-2">
                        Username can no longer be changed on this account.
                      </p>
                    ) : availability.message ? (
                      <p
                        className={`tw:text-sm tw:rounded-xl tw:px-3 tw:py-2 ${
                          availability.available
                            ? "tw:text-emerald-700 tw:bg-emerald-50"
                            : "tw:text-gray-700 tw:bg-gray-50"
                        }`}
                      >
                        {availability.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="tw:flex tw:items-center tw:justify-end tw:gap-2">
                    <button
                      style={{ borderRadius: 20 }}
                      type="button"
                      onClick={onClose}
                      className="tw:inline-flex tw:h-11 tw:px-4 tw:items-center tw:justify-center tw:rounded-xl tw:bg-gray-100 tw:hover:bg-gray-200 tw:text-gray-800 tw:font-medium tw:transition"
                    >
                      Cancel
                    </button>
                    <button
                      style={{ borderRadius: 20 }}
                      type="submit"
                      disabled={!canSubmit}
                      className="tw:inline-flex tw:h-11 tw:px-5 tw:items-center tw:justify-center tw:rounded-xl tw:bg-primary tw:hover:bg-primary/90 tw:text-white tw:font-medium tw:transition tw:disabled:opacity-60"
                    >
                      {saving ? "Updating..." : "Update Username"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
