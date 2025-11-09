import React from "react";
import useProfile from "../../../hooks/useProfile";
import ProfileHeader from "../../../component/Profile/ProfileHeader";
import StatsStrip from "../../../component/Profile/StatsStrip";
import ProfileTabs from "../../../component/Profile/ProfileTab";
import SideBarNav from "../../pageAssets/SideBarNav";

export default function ViewProfile() {
  const { user, loading, error } = useProfile();

  return (
    <div className="row tw:px-3 tw:md:px-6 tw:py-4">
      <div className="col-md-1 col-lg-3">
        <SideBarNav />
      </div>

      <div className="col-md-11 tw:lg:-ml-28 col-lg-9 tw:mx-auto tw:max-w-7xl tw:space-y-4 tw:md:space-y-6">
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
