import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useProfile from "../../../hooks/useProfile";
import ProfileHeader from "../../../component/Profile/ProfileHeader";
import AboutPanel from "../../../component/Profile/AboutPanel";
import ProfileTabs from "../../../component/Profile/ProfileTab";
import "./profile.css";
import { ChevronLeft } from "lucide-react";

export default function ViewProfile() {
  const { user, loading, error } = useProfile();
  const navigate = useNavigate();

  // organiser / kyc logic (only meaningful once user is loaded)
  const isOrganiser =
    user?.is_organiser_verified ||
    user?.roles?.includes("organiser") ||
    user?.roles?.includes("organizer");

  const kycStatus = user?.kyc?.status || null;
  const isKycVerified = kycStatus === "verified";

  // "not organiser + KYC not verified"
  const shouldShowBecomeOrganiser = !isOrganiser && !isKycVerified;

  return (
    <div className="tw:bg-[#f5f5f7] tw:min-h-screen tw:py-4 tw:lg:h-[calc(100vh-80px)] tw:lg:overflow-hidden">
      {/* top bar */}
      <div className="tw:bg-white tw:w-full tw:pt-16 tw:lg:pt-24 tw:pb-4 tw:border-b tw:border-gray-100">
        <div className="tw:max-w-2xl tw:mx-auto tw:flex tw:items-center tw:justify-between tw:px-4">
          <button
            style={{ borderRadius: 20 }}
            type="button"
            className="tw:inline-flex tw:items-center tw:justify-center tw:size-10 tw:bg-white tw:border tw:border-gray-200 hover:tw:bg-gray-50 tw:transition"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="tw:w-5 tw:h-5 tw:text-gray-700" />
          </button>
          <span className="tw:text-lg tw:md:text-xl tw:font-semibold tw:text-gray-900">
            Profile
          </span>
          <div className="tw:size-10" />
        </div>
      </div>

      {/* content */}
      <div className="tw:mt-4 tw:px-2 tw:md:px-6 tw:h-auto tw:lg:h-[calc(100vh-140px)]">
        {loading ? (
          // SKELETON
          <div className="tw:flex tw:flex-col tw:lg:flex-row tw:gap-6 tw:h-full">
            {/* LEFT skeleton */}
            <div className="tw:w-full tw:lg:w-[35%] tw:shrink-0 tw:lg:h-full tw:lg:overflow-y-auto">
              <div className="tw:mt-6 tw:lg:mt-10 tw:h-72 tw:rounded-3xl tw:bg-gray-100 tw:animate-pulse" />
              <div className="tw:mt-4 tw:h-56 tw:rounded-3xl tw:bg-gray-100 tw:animate-pulse" />
            </div>

            {/* RIGHT skeleton */}
            <div className="tw:flex-1 tw:h-auto tw:lg:h-full tw:lg:overflow-y-auto">
              <div className="tw:h-10 tw:w-40 tw:mt-6 tw:rounded-full tw:bg-gray-100 tw:animate-pulse" />
              <div className="tw:mt-4 tw:h-11 tw:rounded-2xl tw:bg-gray-100 tw:animate-pulse" />
              <div className="tw:mt-6 tw:grid tw:grid-cols-1 tw:md:grid-cols-2 xl:tw:grid-cols-3 tw:gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="tw:h-64 tw:rounded-2xl tw:bg-gray-100 tw:animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <p className="tw-text-red-600 tw:mt-10">
            Failed to load profile: {error}
          </p>
        ) : !user ? (
          <p className="tw-text-gray-600 tw-mt-10">No profile data found.</p>
        ) : // 1) NOT organiser + KYC not verified → "Become an Organizer"
        shouldShowBecomeOrganiser ? (
          <div className="tw:w-full tw:min-h-screen tw:bg-[#F5F5F7] tw:px-4 tw:lg:px-4">
            <div className="tw:bg-white tw:w-full tw:md:max-w-xl tw:mx-auto tw:mt-10 tw:rounded-3xl tw:px-4 tw:py-3">
              <div className="tw:flex tw:flex-col tw:items-center tw:justify-center">
                <div className="tw:size-[114px] tw:rounded-full tw:overflow-hidden">
                  <img
                    src={user?.profileUrl || "/images/avater_pix.avif"}
                    alt=""
                    className="tw:w-full tw:h-full tw:object-cover"
                  />
                </div>
                <div className="tw:mt-1 tw:text-center">
                  <span className="tw:block tw:font-semibold tw:text-[16px]">
                    {user?.name}
                  </span>
                  <span className="tw:block tw:text-xs">{user?.email}</span>
                </div>
                <div className="tw:bg-[#f5f5f5] tw:relative tw:px-4 tw:py-3 tw:rounded-2xl tw:mt-6 tw:w-full">
                  <div>
                    <span className="tw:block tw:text-xs">Following</span>
                    <span className="tw:block tw:font-semibold tw:text-[20px]">
                      {user?.followings_count ?? 0}
                    </span>
                  </div>
                  <img
                    className="tw:size-3 tw:absolute tw:top-4 tw:right-4"
                    src="/images/arrowrightbend.png"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <div className="tw:bg-white tw:w-full tw:md:max-w-xl tw:mx-auto tw:mt-2 tw:rounded-2xl tw:px-4 tw:py-3">
              <span className="tw:block tw:font-semibold">About Me</span>
              <span className="tw:block tw:text-xs">{user?.about}</span>
            </div>

            <div className="tw:bg-linear-to-r tw:from-[#8F07E7] tw:via-[#9105B4] tw:to-[#500481] tw:w-full tw:md:max-w-xl tw:mx-auto tw:mt-4 tw:rounded-2xl tw:px-4 tw:py-4 tw:text-center tw:text-white">
              <span className="tw:block tw:font-semibold tw:uppercase tw:text-xl">
                Do you have an event?
              </span>
              <span className="tw:block tw:text-xs">
                You can be an organizer and drive more audience to your event.
                People all over the world can’t wait to attend!!
              </span>

              <Link
                to="/become-an-organiser"
                className="tw:p-3 tw:block tw:bg-white tw:text-black tw:mt-5 tw:rounded-lg tw:text-center"
              >
                <span className="tw:block tw:font-semibold">
                  Become an Organizer
                </span>
              </Link>
            </div>
          </div>
        ) : // 2) Organiser but KYC not verified → notice block
        isOrganiser && !isKycVerified ? (
          <div className="tw:w-full tw:min-h-[calc(100vh-140px)] tw:flex tw-items-start tw:justify-center">
            <div className="tw:max-w-3xl tw:w-full tw-mx-auto tw-bg-white tw:rounded-3xl tw-px-4 tw:py-5 tw:mt-4 tw-shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
              <span className="tw-inline-flex tw-items-center tw-gap-2 tw-text-[11px] tw-font-medium tw-uppercase tw-tracking-[0.16em] tw-text-amber-700 tw-bg-amber-50 tw-px-3 tw-py-1 tw-rounded-full tw-mb-3">
                <span className="tw-w-1.5 tw-h-1.5 tw-rounded-full tw-bg-amber-500" />
                KYC in progress
              </span>
              <span className="tw-block tw:text-lg tw:md:text-xl tw:font-semibold tw-mb-2">
                Your organiser account is under review
              </span>
              <span className="tw-block tw:text-sm tw:mb-2 tw:text-gray-700">
                We&apos;re currently verifying your KYC details. You&apos;ll be
                able to create events as soon as your verification is completed.
              </span>
              <span className="tw-block tw:text-sm tw:text-gray-500">
                You can always check your status from your profile page. If this
                takes longer than expected, contact support with your registered
                email.
              </span>
            </div>
          </div>
        ) : (
          // 3) Normal profile layout (organiser + KYC verified OR regular user where you still want full profile)
          <div className="tw:flex tw:flex-col tw:lg:flex-row tw:lg:gap-6 tw:lg:h-full">
            {/* LEFT: profile card + about */}
            <div className="tw:w-full tw:lg:w-[35%] tw-no-scrollbar tw:pb-10 tw:shrink-0 tw:lg:h-full tw:lg:overflow-y-auto tw:lg:pr-2">
              <div className="tw:space-y-4 tw:pb-6">
                <ProfileHeader user={user} />
                <AboutPanel user={user} />
              </div>
            </div>

            {/* RIGHT: events */}
            <div className="tw:flex-1 tw:h-auto tw:lg:h-full tw:pb-20 tw:pr-1 tw:lg:overflow-y-auto">
              <ProfileTabs user={user} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
