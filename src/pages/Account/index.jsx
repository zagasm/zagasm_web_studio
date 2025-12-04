import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { api, authHeaders } from "../../lib/apiClient";

// Components
import AccountLeft from "../../component/account/AccountLeft";
import AccountRight from "../../component/account/AccountRight";

// CSS
import "./accountStyling.css";

function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- State for Deactivation Modal ---
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Handlers ---
  const handleOpenConfirm = () => {
    setReason("");
    setReasonError("");
    setIsConfirmOpen(true);
  };

  const handleForceLogout = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error("Failed to clear localStorage", e);
    }
    if (logout) logout();
    navigate("/auth/signin", { replace: true });
  };

  const handleDeactivate = async () => {
    if (!reason.trim()) {
      setReasonError("Please tell us why you are deactivating your account.");
      return;
    }
    setIsSubmitting(true);
    setReasonError("");

    const token = localStorage.getItem("token") || user?.token;

    try {
      await api.post(
        "/api/v1/user/deactivate",
        { reason: reason.trim() },
        authHeaders(token)
      );
      setIsSubmitting(false);
      setIsConfirmOpen(false);
      setIsSuccessOpen(true);
    } catch (error) {
      console.error("Deactivate error:", error);
      const apiMessage =
        error?.response?.data?.message ||
        "Unable to deactivate account. Please try again.";
      setReasonError(apiMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <Fragment>
      {/* Main Container with Light Grey Background */}
      <div className="account-page-wrapper tw:w-full tw:bg-[#F9FAFB] tw:pt-20">
        <div className="container-fluid">
          <div className="row">
            
            {/* LEFT COLUMN 
               - Desktop: col-lg-5 col-xl-4
               - Scroll behavior: This area stays sticky/static on desktop 
            */}
            <div className="col-12 col-lg-6 col-xl-6 account-scroll-area hide-scrollbar tw:bg-[#F9FAFB]">
              <div className="tw:lg:mr-0">
                 <AccountLeft user={user} />
              </div>
            </div>

            {/* RIGHT COLUMN 
               - Desktop: col-lg-7 col-xl-8 
               - Scroll behavior: This area scrolls independently on desktop 
            */}
            <div className="col-12 col-lg-6 col-xl-6 account-scroll-area hide-scrollbar tw:bg-[#F9FAFB]">
              <div className="tw:max-w-2xl">
                 <AccountRight 
                    onLogout={handleForceLogout} 
                    onDeactivate={handleOpenConfirm} 
                 />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ───────── Confirm Deactivate Modal (Kept Logic) ───────── */}
      <Transition appear show={isConfirmOpen} as={Fragment}>
        <Dialog
          as="div"
          className="tw:relative tw:z-50"
          onClose={() => {
            if (isSubmitting) return;
            setIsConfirmOpen(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="tw:ease-out tw:duration-200"
            enterFrom="tw:opacity-0"
            enterTo="tw:opacity-100"
            leave="tw:ease-in tw:duration-150"
            leaveFrom="tw:opacity-100"
            leaveTo="tw:opacity-0"
          >
            <div className="tw:fixed tw:inset-0 tw:bg-black/40" />
          </Transition.Child>

          <div className="tw:fixed tw:inset-0 tw:overflow-y-auto">
            <div className="tw:flex tw:min-h-full tw:items-center tw:justify-center tw:p-4">
              <Transition.Child
                as={Fragment}
                enter="tw:ease-out tw:duration-200"
                enterFrom="tw:opacity-0 tw:scale-95"
                enterTo="tw:opacity-100 tw:scale-100"
                leave="tw:ease-in tw:duration-150"
                leaveFrom="tw:opacity-100 tw:scale-100"
                leaveTo="tw:opacity-0 tw:scale-95"
              >
                <Dialog.Panel className="tw:w-full tw:max-w-md tw:rounded-2xl tw:bg-white tw:p-6 tw:shadow-xl">
                  <Dialog.Title className="tw:text-lg tw:font-semibold tw:text-gray-900">
                    Deactivate your account?
                  </Dialog.Title>
                  <Dialog.Description className="tw:mt-2 tw:text-sm tw:text-gray-600">
                    This will deactivate your Zagasm Studios account.
                  </Dialog.Description>

                  <div className="tw:mt-4">
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-800 tw:mb-1">
                      Reason for deactivating <span className="tw:text-red-500">*</span>
                    </label>
                    <textarea
                      className="tw:w-full tw:min-h-[100px] tw:rounded-xl tw:border tw:border-gray-200 tw:p-3 tw:text-sm tw:outline-none focus:tw:border-purple-600 focus:tw:ring-1 focus:tw:ring-purple-600"
                      placeholder="Tell us why you’re leaving…"
                      value={reason}
                      onChange={(e) => {
                        setReason(e.target.value);
                        if (reasonError) setReasonError("");
                      }}
                      disabled={isSubmitting}
                    />
                    {reasonError && (
                      <p className="tw:mt-1 tw:text-xs tw:text-red-500">
                        {reasonError}
                      </p>
                    )}
                  </div>

                  <div className="tw:mt-6 tw:flex tw:justify-end tw:gap-3">
                    <button
                      type="button"
                      className="tw:inline-flex tw:justify-center tw:rounded-xl tw:border tw:border-gray-300 tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-gray-700 tw:hover:bg-gray-50"
                      onClick={() => setIsConfirmOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="tw:inline-flex tw:justify-center tw:rounded-xl tw:bg-red-500 tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-white tw:hover:bg-red-600 tw:disabled:opacity-60 tw:disabled:cursor-not-allowed"
                      onClick={handleDeactivate}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Deactivating…" : "Deactivate"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* ───────── Success Modal (Kept Logic) ───────── */}
      <Transition appear show={isSuccessOpen} as={Fragment}>
        <Dialog
          as="div"
          className="tw:relative tw:z-50"
          onClose={handleForceLogout}
        >
          <Transition.Child
            as={Fragment}
            enter="tw:ease-out tw:duration-200"
            enterFrom="tw:opacity-0"
            enterTo="tw:opacity-100"
            leave="tw:ease-in tw:duration-150"
            leaveFrom="tw:opacity-100"
            leaveTo="tw:opacity-0"
          >
            <div className="tw:fixed tw:inset-0 tw:bg-black/40" />
          </Transition.Child>

          <div className="tw:fixed tw:inset-0 tw:overflow-y-auto">
            <div className="tw:flex tw:min-h-full tw:items-center tw:justify-center tw:p-4">
              <Transition.Child
                as={Fragment}
                enter="tw:ease-out tw:duration-200"
                enterFrom="tw:opacity-0 tw:scale-95"
                enterTo="tw:opacity-100 tw:scale-100"
                leave="tw:ease-in tw:duration-150"
                leaveFrom="tw:opacity-100 tw:scale-100"
                leaveTo="tw:opacity-0 tw:scale-95"
              >
                <Dialog.Panel className="tw:w-full tw:max-w-md tw:rounded-2xl tw:bg-white tw:p-6 tw:shadow-xl">
                  <Dialog.Title className="tw:text-lg tw:font-semibold tw:text-gray-900">
                    Account deactivated
                  </Dialog.Title>
                  <Dialog.Description className="tw:mt-2 tw:text-sm tw:text-gray-600">
                    Your account has been successfully deactivated. You’ll now
                    be signed out.
                  </Dialog.Description>

                  <div className="tw:mt-6 tw:flex tw:justify-end tw:gap-3">
                    <button
                      type="button"
                      className="tw:inline-flex tw:justify-center tw:rounded-xl tw:bg-purple-600 tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-white tw:hover:bg-purple-700"
                      onClick={handleForceLogout}
                    >
                      OK
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Fragment>
  );
}

export default Account;