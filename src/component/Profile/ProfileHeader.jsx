import React from "react";
import defaultProfile from "../../assets/avater_pix.avif";
import { Users, UserPlus, ArrowUpRight, Ticket } from "lucide-react";
import { Edit } from "react-feather";
import { useNavigate } from "react-router-dom";
import "./profile.css";

export default function ProfileHeader({ user }) {
  const img = user?.profileUrl || defaultProfile;
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate("/profile/edit-profile");
  };

  // console.log(user)

  return (
    <div className="tw:rounded-3xl tw:border tw:border-gray-100 tw:bg-white tw:p-6 tw:shadow-sm">
      <div className="tw:flex tw:flex-col tw:items-center tw:gap-4">
        {/* avatar + edit */}
        <div className="tw:relative">
          <img
            src={img}
            alt={user?.name || "User"}
            className="tw:h-24 tw:w-24 tw:rounded-full tw:border tw:border-gray-200 tw:object-cover"
            loading="lazy"
          />
          <button
            type="button"
            onClick={handleEditClick}
            className="tw:absolute tw:-right-1 tw:-top-1 tw:flex tw:h-9 tw:w-9 tw:items-center tw:justify-center tw:rounded-full tw:bg-white tw:shadow-md hover:tw:bg-gray-50"
          >
            <Edit size={18} />
          </button>
        </div>

        {/* name + meta */}
        <div className="tw:text-center">
          <span className="tw:text-xl tw:md:text-2xl tw:font-semibold tw:text-gray-900">
            {user?.name || "Your Name"}
          </span>

          {user?.userName && (
            <span className="tw:block tw:mt-1 tw:text-sm tw:text-gray-500">
              {user.userName}
            </span>
          )}

          <div className="tw:mt-3 tw:flex tw:items-center tw:justify-center tw:gap-2">
            <span className="tw:inline-flex tw:items-center tw:justify-center tw:rounded-full tw:bg-gray-100 tw:px-3 tw:py-1 tw:text-xs tw:font-medium tw:text-gray-700">
              Sports
            </span>
          </div>

          <div className="tw:mt-3 tw:flex tw:items-center tw:justify-center tw:gap-2 tw:text-xs tw:md:text-sm">
            <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-emerald-600">
              <Ticket size={14} />
              <span className="tw:font-semibold">
                {user?.tickets_sold ?? 0}
              </span>
              <span className="tw:text-gray-500">Tickets Sold</span>
            </span>
          </div>
        </div>

        {/* followers / following cards */}
        <div className="tw:mt-5 tw:grid tw:w-full tw:grid-cols-2 tw:gap-3">
          <button
            type="button"
            className="tw:flex tw:flex-col tw:justify-between tw:rounded-2xl tw:bg-gray-50 tw:px-4 tw:py-3 tw:text-left hover:tw:bg-gray-100"
          >
            <div className="tw:flex tw:items-center tw:justify-between tw:text-xs tw:text-gray-500">
              <span className="tw:inline-flex tw:items-center tw:gap-1">
                <Users size={14} />
                My Followers
              </span>
              <ArrowUpRight size={14} />
            </div>
            <span className="tw:mt-1 tw:text-lg tw:font-semibold tw:text-gray-900">
              {user?.followers_count ?? 0}
            </span>
          </button>

          <button
            type="button"
            className="tw:flex tw:flex-col tw:justify-between tw:rounded-2xl tw:bg-gray-50 tw:px-4 tw:py-3 tw:text-left hover:tw:bg-gray-100"
          >
            <div className="tw:flex tw:items-center tw:justify-between tw:text-xs tw:text-gray-500">
              <span className="tw:inline-flex tw:items-center tw:gap-1">
                <UserPlus size={14} />
                Following
              </span>
              <ArrowUpRight size={14} />
            </div>
            <span className="tw:mt-1 tw:text-lg tw:font-semibold tw:text-gray-900">
              {user?.followings_count ?? 0}
            </span>
          </button>
        </div>

        {/* ranking bar */}
        <div className="tw:flex tw:flex-col tw:justify-center tw:items-center tw:jc tw:mt-5 tw:w-full tw:rounded-2xl tw:bg-black tw:px-5 tw:py-4 tw:text-white">
          <span className="tw:text-sm tw:font-medium tw:mb-2">My Ranking</span>
          <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-4 tw:text-sm">
            <span className="tw:inline-flex tw:items-center tw:gap-2">
              <img src="/images/globe.svg" alt="" />
              <span># {user?.rank_global ?? 20}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
