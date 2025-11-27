import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { showError, showSuccess } from "../ui/toast";
import default_profilePicture from "../../assets/avater_pix.avif"; // Adjust path
import VerificationModal from "./VerificationModal";
import { api, authHeaders } from "../../lib/apiClient";
import { useAuth } from "../../pages/auth/AuthContext";

const AccountLeft = ({ user }) => {
  const { token, setAuth } = useAuth();
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const Default_user_image = user?.profileUrl
    ? user.profileUrl
    : default_profilePicture;

  const isVerified = user?.email_verified || user?.phone_verified;

  const handleVerificationSuccess = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/v1/profile", authHeaders(token));
      setAuth({ user: res?.data?.user, token });
      showSuccess("Account verified successfully!");
    } catch (error) {
      console.error(error);
      showError(error?.response?.data?.message || "Failed to refresh profile.");
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <>
      <div className="tw:flex tw:flex-col tw:gap-4 tw:pt-6 tw:md:pt-10 tw:pb-6">
        {/* 1. Profile Card */}
        <Link
          to={`/profile/${user.id}`}
          className="tw:bg-white tw:rounded-3xl tw:px-3 tw:py-4 tw:flex tw:items-center tw:justify-between tw:shadow-sm hover:tw:shadow-md tw:transition-shadow tw:cursor-pointer"
        >
          <div className="tw:flex tw:items-center tw:gap-4">
            <div className="tw:h-12 tw:w-12 tw:rounded-full tw:overflow-hidden tw:bg-gray-200">
              <img
                src={Default_user_image}
                alt="Profile"
                className="tw:w-full tw:h-full tw:object-cover"
              />
            </div>
            <div className="tw:flex tw:flex-col">
              <span className="tw:text-[16px] tw:font-bold tw:text-gray-900">
                {user?.firstName
                  ? `${user.firstName} ${user.lastName}`
                  : "User"}
              </span>
              <span className="tw:text-[13px] tw:text-gray-500">
                {user?.email || "user@example.com"}
              </span>
            </div>
          </div>
          <ChevronRight className="tw:w-5 tw:h-5 tw:text-gray-400" />
        </Link>

        {/* 3. Verification Warning (Shows ONLY if NOT verified) */}
        {!isVerified && (
          <div className="tw:bg-[#FFF4E5] tw:border tw:border-orange-100 tw:rounded-3xl tw:px-3 tw:py-[11.5px] tw:flex tw:flex-row tw:items-center tw:justify-between tw:gap-4">
            <div className="tw:flex tw:items-center tw:gap-3">
              <div className="tw:shrink-0">
                <img src="/images/warning.svg" alt="Warning" />
              </div>
              <span className="tw:text-[12px] tw:font-medium tw:text-orange-800 tw:leading-tight">
                You have not verified <br className="tw:hidden tw:md:block" />{" "}
                your account yet.
              </span>
            </div>
            <button
              onClick={() => setIsVerifyModalOpen(true)}
              style={{ borderRadius: 8 }}
              className="tw:md:w-auto tw:bg-orange-500 hover:tw:bg-orange-600 tw:text-white tw:text-[9px] tw:font-semibold tw:px-4 tw:py-2.5 tw:transition-colors"
            >
              Verify Now
            </button>
          </div>
        )}

        {/* 2. Dashboard Banner */}
        <Link className="tw:block">
          <div className="tw:bg-[#F3E8FF] tw:rounded-3xl tw:p-5 tw:flex tw:items-center tw:justify-between tw:transition-opacity hover:tw:opacity-90">
            <div className="tw:flex tw:items-center tw:gap-4">
              <img className="tw:size-7" src="/images/dashIcon.svg" alt="" />
              <div className="tw:flex tw:flex-col">
                <span className="tw:text-[15px] tw:font-bold tw:text-gray-900">
                  My Dashboard
                </span>
                <span className="tw:text-[12px] tw:text-gray-600">
                  See all my activity metrics
                </span>
              </div>
            </div>
            <ChevronRight className="tw:w-5 tw:h-5 tw:text-gray-500" />
          </div>
        </Link>

        {/* 4. Quick Stats Grid */}
        <div className="row g-3">
          <div className="col-6">
            <Link
              to="/my-events"
              className="tw:bg-white tw:rounded-3xl tw:p-4 tw:h-24 tw:flex tw:items-center tw:gap-3 tw:shadow-sm hover:tw:shadow-md tw:transition-all"
            >
              <img src="/images/camera.svg" alt="" />
              <span className="tw:text-[13px] tw:font-medium tw:text-gray-900 tw:leading-tight">
                View My Events
              </span>
            </Link>
          </div>

          <div className="col-6">
            <Link
              to="/event/saved-events"
              className="tw:bg-white tw:rounded-3xl tw:p-4 tw:h-24 tw:flex tw:items-center tw:gap-3 tw:shadow-sm hover:tw:shadow-md tw:transition-all"
            >
              <img src="/images/saveIcon.svg" alt="" />
              <span className="tw:text-[13px] tw:font-medium tw:text-gray-900 tw:leading-tight">
                View Saved Events
              </span>
            </Link>
          </div>

          <div className="col-6">
            <Link
              to="/me/organisers"
              className="tw:bg-white tw:rounded-3xl tw:p-4 tw:h-24 tw:flex tw:items-center tw:gap-3 tw:shadow-sm hover:tw:shadow-md tw:transition-all"
            >
              <img src="/images/following.svg" alt="" />
              <span className="tw:text-[13px] tw:font-medium tw:text-gray-900 tw:leading-tight">
                Organizers I Follow
              </span>
            </Link>
          </div>

          <div className="col-6">
            <Link
              to="/me/organisers/followers"
              className="tw:bg-white tw:rounded-3xl tw:p-4 tw:h-24 tw:flex tw:items-center tw:gap-3 tw:shadow-sm hover:tw:shadow-md tw:transition-all"
            >
              <img src="/images/followers.svg" alt="" />
              <span className="tw:text-[13px] tw:font-medium tw:text-gray-900 tw:leading-tight">
                My Followers
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* --- MODAL INJECTION --- */}
      <VerificationModal
        isOpen={isVerifyModalOpen}
        closeModal={() => setIsVerifyModalOpen(false)}
        email={user?.email}
        showError={showError}
        showSuccess={showSuccess}
        onSuccess={handleVerificationSuccess}
      />
    </>
  );
};

export default AccountLeft;
