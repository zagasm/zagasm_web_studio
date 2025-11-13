import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import SideBarNav from "../pageAssets/SideBarNav";
import AccountHeading from "./AccountHeading";
import rocket from "../../assets/navbar_icons/rocket.png";
import Users_icon from "../../assets/navbar_icons/Users_icon.png";
import Bell from "../../assets/navbar_icons/Bell.png";
import login from "../../assets/navbar_icons/Login.png";
import { Link, useNavigate } from "react-router-dom";
import "./accountStyling.css";
import { useAuth } from "../auth/AuthContext";
import default_profilePicture from "../../assets/avater_pix.avif";
import { File, InfoIcon, Key, Laptop } from "lucide-react";
import { api, authHeaders } from "../../lib/apiClient";

function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(user);
  const Default_user_image = user?.profileUrl
    ? user.profileUrl
    : default_profilePicture;

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
      <div className="container-flui m-0 p-0">
        <SideBarNav />
        <div className="page_wrapper overflow-hidden">
          <div className="row p-0 ">
            <div className="col account_section ">
              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12 col-12 tw:px-0 tw:pb-0 tw:pt-12 m-0">
                  <AccountHeading />
                </div>
                <div className="col-xl-9 col-lg-8 col-md-7 col-sm-12 col-12 tw:px-0 tw:pt-0 tw:pb-24 m-0">
                  <div className="account_nav_section">
                    <div>
                      <div className="row">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 Preference_section">
                          {/* Preference */}
                          <div className=" internal_container tw:md:mt-10">
                            <h6>Preference</h6>
                            <ul>
                              <li>
                                <Link
                                  to={"/account/interest"}
                                  className=" account_link"
                                >
                                  <div>
                                    <img src={rocket} alt="" />
                                    <span>Interest</span>
                                  </div>
                                  <div>
                                    <i className="fa fa-angle-right "></i>
                                  </div>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to={"/organizers"}
                                  className=" account_link"
                                >
                                  <div>
                                    <img src={Users_icon} alt="" />
                                    <span>Organizers you follow</span>
                                  </div>
                                  <div>
                                    <i className="fa fa-angle-right "></i>
                                  </div>
                                </Link>
                              </li>
                              <li className="p-0 m-0" style={{ margin: "0px" }}>
                                <Link
                                  to={"/account/manage-notification"}
                                  className=" account_link"
                                >
                                  <div>
                                    <img src={Bell} alt="" />
                                    <span>Manage notification</span>
                                  </div>
                                  <div>
                                    <i className="fa fa-angle-right "></i>
                                  </div>
                                </Link>
                              </li>
                            </ul>
                          </div>

                          {/* Help */}
                          <div className=" internal_container">
                            <h6>Help</h6>
                            <ul>
                              <li>
                                <Link
                                  to={"/account/interest"}
                                  className=" account_link"
                                >
                                  <div>
                                    <InfoIcon />
                                    <span>Help Center</span>
                                  </div>
                                  <div>
                                    <i className="fa fa-angle-right "></i>
                                  </div>
                                </Link>
                              </li>
                            </ul>
                          </div>

                          {/* Legal */}
                          <div className=" internal_container">
                            <h6>Legal</h6>
                            <ul>
                              <li>
                                <a
                                  href={
                                    "https://api.studios.zagasm.com/legal/terms-of-service"
                                  }
                                  className=" account_link"
                                >
                                  <div>
                                    <File />
                                    <span>Terms of Service</span>
                                  </div>
                                  <div>
                                    <i className="fa fa-angle-right "></i>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://api.studios.zagasm.com/legal/privacy-policy"
                                  className=" account_link"
                                >
                                  <div>
                                    <Laptop />
                                    <span>Accessibility</span>
                                  </div>
                                  <div>
                                    <i className="fa fa-angle-right "></i>
                                  </div>
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://api.studios.zagasm.com/legal/privacy-policy"
                                  className=" account_link"
                                >
                                  <div>
                                    <Key />
                                    <span>Privacy</span>
                                  </div>
                                  <div>
                                    <i className="fa fa-angle-right "></i>
                                  </div>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Footer / Version */}
                      <div className="d-flex justify-content-between mt-3 footer_section p-2 mb-3">
                        <span>Version</span>
                        <span>120.0382j2.465</span>
                      </div>

                      {/* Sign out */}
                      <Link
                        onClick={() => logout()}
                        className="p-2 tw:flex tw:items-center tw:gap-3 "
                      >
                        <img src={login} alt="" />{" "}
                        <span className="tw:text-red-500 tw:text-[14px]">
                          Sign out
                        </span>
                      </Link>

                      {/* Deactivate Account */}
                      <div
                        onClick={handleOpenConfirm}
                        className="p-2 tw:flex tw:items-center tw:gap-3 tw:mt-8 tw:cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="tw:size-6 tw:text-red-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                          />
                        </svg>

                        <span className="tw:text-red-500 tw:text-[14px]">
                          Deactivate Account
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── Confirm Deactivate Modal ───────── */}
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
                    This will deactivate your Zagasm Studios account. You can
                    always contact support if you’d like to reactivate later.
                  </Dialog.Description>

                  <div className="tw:mt-4">
                    <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-800 tw:mb-1">
                      Reason for deactivating <span className="tw:text-red-500">*</span>
                    </label>
                    <textarea
                      className="tw:w-full tw:min-h-[100px] tw:rounded-xl tw:border tw:border-gray-200 tw:p-3 tw:text-sm tw:outline-none focus:tw:border-primary focus:tw:ring-1 focus:tw:ring-primary"
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
                      className="tw:inline-flex tw:justify-center tw:rounded-xl tw:border tw:border-gray-300 tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-gray-700 hover:tw:bg-gray-50"
                      onClick={() => setIsConfirmOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="tw:inline-flex tw:justify-center tw:rounded-xl tw:bg-red-500 tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-white hover:tw:bg-red-600 disabled:tw:opacity-60 disabled:tw:cursor-not-allowed"
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

      {/* ───────── Success Modal ───────── */}
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
                    be signed out and redirected to the sign in page.
                  </Dialog.Description>

                  <div className="tw:mt-6 tw:flex tw:justify-end tw:gap-3">
                    <button
                      type="button"
                      className="tw:inline-flex tw:justify-center tw:rounded-xl tw:border tw:border-gray-300 tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-gray-700 hover:tw:bg-gray-50"
                      onClick={handleForceLogout}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="tw:inline-flex tw:justify-center tw:rounded-xl tw:bg-primary tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-white hover:tw:bg-primarySecond"
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
