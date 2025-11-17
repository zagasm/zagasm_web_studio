import React from "react";
import useProfile from "../../../hooks/useProfile";
import ProfileHeader from "../../../component/Profile/ProfileHeader";
import StatsStrip from "../../../component/Profile/StatsStrip";
import ProfileTabs from "../../../component/Profile/ProfileTab";
import SideBarNav from "../../pageAssets/SideBarNav";
import './profile.css'

export default function ViewProfile() {
  const { user, loading, error } = useProfile();

  return (
    <div className="tw:md:gap-6 tw:lg:gap-6 tw:px-2 tw:md:px-6 tw:py-4">

      <div className="profile tw:space-y-4 tw:md:space-y-6">
        {/* header */}
        {loading ? (
          <div className="tw:h-44 tw:md:h-56 tw:mt-24 tw:rounded-3xl tw:bg-gray-100 tw:animate-pulse" />
        ) : error ? (
          <p className="tw:text-red-600">Failed to load profile: {error}</p>
        ) : (
          <>
            <ProfileHeader user={user} />
            <ProfileTabs user={user} />
          </>
        )}
      </div>
    </div>
  );
}
