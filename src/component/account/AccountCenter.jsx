import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { showError, showSuccess } from "../ui/toast";
import { getInitials, hasProfileImage } from "../Organizers/organiser.utils";
import VerificationModal from "./VerificationModal";
import { api, authHeaders } from "../../lib/apiClient";
import { useAuth } from "../../pages/auth/AuthContext";

const QuickActionCard = ({ icon, iconComponent: Icon, label, to, onClick, isRed }) => {
  const Wrapper = to ? Link : "button";

  return (
    <Wrapper
      to={to}
      type={to ? undefined : "button"}
      onClick={onClick}
      className="tw:relative tw:flex tw:min-h-24 tw:w-full tw:flex-col tw:items-start tw:justify-between tw:gap-4 tw:overflow-hidden tw:rounded-[28px] tw:border tw:border-white/45 tw:bg-white/30 tw:p-4 tw:text-left tw:shadow-[0_18px_50px_rgba(148,163,184,0.18)] tw:backdrop-blur-2xl tw:transition hover:tw:-translate-y-0.5 hover:tw:border-white/60 hover:tw:bg-white/40 hover:tw:shadow-[0_22px_60px_rgba(148,163,184,0.24)]"
    >
      <span className="tw:pointer-events-none tw:absolute tw:inset-x-3 tw:top-0 tw:h-px tw:bg-white/70" />
      <span className="tw:pointer-events-none tw:absolute tw:-right-8 tw:top-3 tw:h-16 tw:w-16 tw:rounded-full tw:bg-white/25 tw:blur-2xl" />

      {icon ? (
        <div className="tw:relative tw:flex tw:h-12 tw:w-12 tw:items-center tw:justify-center tw:rounded-[18px] tw:border tw:border-white/50 tw:bg-white/35 tw:shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] tw:backdrop-blur-xl">
          <img src={icon} alt="" className="tw:size-7 tw:md:size-8 tw:shrink-0" />
        </div>
      ) : Icon ? (
        <span className="tw:flex tw:h-12 tw:w-12 tw:items-center tw:justify-center tw:rounded-[18px] tw:border tw:border-white/50 tw:bg-white/35 tw:shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] tw:backdrop-blur-xl">
          <Icon
            className={`tw:size-3 tw:md:size-5 ${
              isRed ? "tw:text-red-500" : "tw:text-gray-700"
            }`}
          />
        </span>
      ) : null}

      <span
        className={`tw:relative tw:text-[11px] tw:md:text-sm tw:font-medium tw:leading-5 ${
          isRed ? "tw:text-red-600" : "tw:text-gray-900"
        }`}
      >
        {label}
      </span>
    </Wrapper>
  );
};

export default function AccountCenter({ user, onLogout, onDeactivate }) {
  const navigate = useNavigate();
  const { token, setAuth, refreshUser } = useAuth();
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isRefreshingProfile, setIsRefreshingProfile] = useState(false);

  useEffect(() => {
    const onFocus = () => {
      if (token) refreshUser();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [token, refreshUser]);

  const profileImage = user?.profileUrl;
  const showProfileImage = hasProfileImage(profileImage);
  const fullName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.username || user?.email || "User";
  const initials = getInitials(fullName);
  const isVerified = user?.email_verified || user?.phone_verified;
  const isOrganizer = user?.is_organiser_verified;
  const profilePath = `/profile/${user.id}`;

  const handleVerificationSuccess = async () => {
    setIsRefreshingProfile(true);
    try {
      const res = await api.get("/api/v1/profile", authHeaders(token));
      setAuth({ user: res?.data?.user, token });
      showSuccess("Account verified successfully!");
    } catch (error) {
      console.error(error);
      showError(error?.response?.data?.message || "Failed to refresh profile.");
    } finally {
      setIsRefreshingProfile(false);
    }
  };

  const securityItems = [
    {
      icon: "/account-center/disable.png",
      label: "Blocked Organizers / Users",
      to: "/account/blocked",
    },
  ];

  const supportItems = [
    {
      icon: "/account-center/online-service.png",
      label: "Community Guidelines",
      to: "/community-guidelines",
    },
    {
      icon: "/account-center/law.png",
      label: "Terms of Service",
      to: "/terms-of-service",
    },
    {
      icon: "/account-center/privacy-policy.png",
      label: "Privacy Policy",
      to: "/privacy-policy",
    },
    {
      icon: "/account-center/disable.png",
      label: "Deactivate Account",
      onClick: onDeactivate,
      isRed: false,
    },
  ];

  return (
    <>
      <div className="tw:mx-auto tw:flex tw:w-full tw:max-w-5xl tw:flex-col tw:gap-6">
        <section className="tw:relative tw:overflow-hidden tw:rounded-[36px] tw:border tw:border-white/50 tw:bg-[linear-gradient(135deg,rgba(255,255,255,0.54)_0%,rgba(244,248,255,0.36)_46%,rgba(235,242,255,0.46)_100%)] tw:p-2 tw:shadow-[0_24px_80px_rgba(148,163,184,0.2)] tw:backdrop-blur-3xl tw:md:p-7">
          <span className="tw:pointer-events-none tw:absolute tw:-left-12 tw:top-6 tw:h-28 tw:w-28 tw:rounded-full tw:bg-white/35 tw:blur-3xl" />
          <span className="tw:pointer-events-none tw:absolute tw:-right-10 tw:bottom-4 tw:h-32 tw:w-32 tw:rounded-full tw:bg-sky-100/30 tw:blur-3xl" />
          <span className="tw:pointer-events-none tw:absolute tw:inset-x-6 tw:top-0 tw:h-px tw:bg-white/80" />

          <div className="tw:flex tw:flex-col tw:gap-5 tw:lg:flex-row tw:lg:items-center tw:lg:justify-between">
            <div
              role="link"
              tabIndex={0}
              onClick={() => navigate(profilePath)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(profilePath);
                }
              }}
              className="tw:relative tw:flex tw:min-w-0 tw:flex-1 tw:cursor-pointer tw:items-center tw:gap-4 tw:rounded-[30px] tw:border tw:border-white/45 tw:bg-white/24 tw:p-4 tw:shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] tw:backdrop-blur-2xl tw:transition hover:tw:bg-white/32"
            >
              <div
                className={`tw:flex tw:h-16 tw:w-16 tw:shrink-0 tw:items-center tw:justify-center tw:overflow-hidden tw:rounded-full tw:border tw:border-white/55 tw:shadow-[0_8px_20px_rgba(148,163,184,0.18)] ${
                  showProfileImage ? "tw:bg-white/30" : "tw:bg-white/45"
                }`}
              >
                {showProfileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="tw:h-full tw:w-full tw:object-cover"
                  />
                ) : (
                  <span className="tw:text-lg tw:font-semibold tw:text-primary">
                    {initials}
                  </span>
                )}
              </div>

              <div className="tw:min-w-0 tw:flex-1">
                <div className="tw:flex tw:items-center tw:gap-1.5">
                  <span className="tw:truncate tw:text-base tw:md:text-xl tw:font-semibold tw:text-gray-900">
                    {fullName}
                  </span>
                  {user?.subscription?.isActive ? (
                    <img
                      className="tw:h-5 tw:w-5"
                      src="/images/verifiedIcon.svg"
                      alt=""
                    />
                  ) : null}
                  <Link
                    to="/profile/edit-profile"
                    onClick={(event) => event.stopPropagation()}
                    className="tw:ml-1 tw:inline-flex tw:h-8 tw:w-8 tw:items-center tw:justify-center tw:rounded-full tw:border tw:border-white/55 tw:bg-white/45 tw:text-gray-500 tw:shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] tw:backdrop-blur-xl tw:transition hover:tw:bg-white/65 hover:tw:text-gray-900"
                    aria-label="Edit profile"
                    title="Edit profile"
                  >
                    <Pencil className="tw:h-4 tw:w-4" />
                  </Link>
                </div>
                <span className="tw:mt-1 tw:block tw:truncate tw:text-sm tw:text-gray-500">
                  {user?.email || "user@example.com"}
                </span>
              </div>
            </div>

            {!user?.subscription?.isActive ? (
              <div className="tw:flex tw:w-full tw:flex-col tw:gap-3 tw:rounded-[28px] tw:bg-blue-700 tw:p-5 tw:text-white tw:lg:max-w-md">
                <div>
                  <span className="tw:block tw:text-sm tw:font-semibold">
                    Zagasm Studios Verification Badge
                  </span>
                  <span className="tw:mt-1 tw:block tw:text-sm tw:text-white/90">
                    Get the blue checkmark and unlock premium features.
                  </span>
                </div>

                <Link
                  to="/subscription"
                  style={{ borderRadius: 12 }}
                  className="tw:inline-flex tw:w-full tw:items-center tw:justify-center tw:bg-white tw:px-4 tw:py-3 tw:text-sm tw:font-semibold tw:text-gray-900 tw:transition hover:tw:bg-white/90"
                >
                  Subscribe Now
                </Link>
              </div>
            ) : null}
          </div>

          {!isVerified ? (
            <div className="tw:mt-5 tw:flex tw:flex-col tw:gap-3 tw:rounded-[24px] tw:border tw:border-orange-100 tw:bg-[#FFF4E5] tw:p-4 tw:md:flex-row tw:md:items-center tw:md:justify-between">
              <div className="tw:flex tw:items-center tw:gap-3">
                <img src="/images/warning.svg" alt="Warning" />
                <span className="tw:text-sm tw:font-medium tw:text-orange-800">
                  You have not verified your account yet.
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(true)}
                style={{ borderRadius: 12 }}
                className="tw:inline-flex tw:items-center tw:justify-center tw:bg-orange-500 tw:px-4 tw:py-3 tw:text-sm tw:font-semibold tw:text-white tw:transition hover:tw:bg-orange-600"
              >
                {isRefreshingProfile ? "Refreshing..." : "Verify Now"}
              </button>
            </div>
          ) : null}
        </section>

        <section className="tw:grid tw:grid-cols-2 tw:gap-4 tw:md:grid-cols-3">
          <QuickActionCard
            icon="/images/saveIcon.svg"
            label="View Saved Events"
            to="/event/saved-events"
          />
          {isOrganizer ? (
            <QuickActionCard
              icon="/account-center/wallet.png"
              label="Payout"
              to="/account/wallet"
            />
          ) : null}
          {securityItems.map((item) => (
            <QuickActionCard
              key={item.label}
              icon={item.icon}
              label={item.label}
              to={item.to}
              onClick={item.onClick}
              isRed={item.isRed}
            />
          ))}
          {supportItems.map((item) => (
            <QuickActionCard
              key={item.label}
              icon={item.icon}
              label={item.label}
              to={item.to}
              onClick={item.onClick}
              isRed={item.isRed}
            />
          ))}
          <QuickActionCard
            icon="/account-center/switch.png"
            label="Logout"
            onClick={onLogout}
            isRed
          />
        </section>
      </div>

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
}
