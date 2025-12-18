import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// Components
import AccountLeft from "../../component/account/AccountLeft";
import AccountRight from "../../component/account/AccountRight";
import DeactivateAccountModal from "../../component/account/DeactivateAccountModal";

// CSS
import "./accountStyling.css";

function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleOpenConfirm = () => {
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

  const handleDeactivateSuccess = () => {
    // called from DeactivateAccountModal once API returns 200
    setIsSuccessOpen(true);
  };

  return (
    <Fragment>
      {/* Main Container with Light Grey Background */}
      <div className="tw:font-sans account-page-wrapper tw:w-full tw:bg-[#F9FAFB] tw:pt-20">
        <div className="container-fluid">
          <div className="tw:grid tw:grid-cols-2 tw:gap-4">
            {/* LEFT COLUMN */}
            <div className="tw:col-span-2 tw:lg:col-span-1 account-scroll-area hide-scrollbar tw:bg-[#F9FAFB]">
              <div className="tw:lg:mr-0">
                <AccountLeft user={user} />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="tw:col-span-2 tw:lg:col-span-1 account-scroll-area hide-scrollbar tw:bg-[#F9FAFB]">
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

      {/* Deactivate modal (reason + password) */}
      <DeactivateAccountModal
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onSuccess={handleDeactivateSuccess}
      />

      {/* Success Modal */}
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
                  <Dialog.Title
                    as="span"
                    className="tw:block tw:text-lg tw:font-semibold tw:text-gray-900"
                  >
                    Account deactivated
                  </Dialog.Title>
                  <Dialog.Description
                    as="span"
                    className="tw:mt-2 tw:block tw:text-sm tw:text-gray-600"
                  >
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
