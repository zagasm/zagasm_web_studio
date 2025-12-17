import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  Heart,
  PlusSquare,
  User,
  Search,
  Bell,
  Ticket,
  Star,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import MobileNav from "./MobileNav";
import logo from "../../assets/zagasm_studio_logo.png";
import { getInitials, hasProfileImage } from "../../component/Organizers/organiser.utils";

// src/component/Events/SingleEvent.jsx (Updated Navbar function)
export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();

  const profileImage = user?.profileUrl;
  const hasImage = hasProfileImage(profileImage);
  const nameForInitials =
    user?.firstName || user?.username || user?.organiser || user?.email || "User";
  const initials = getInitials(
    user?.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : nameForInitials
  );

  const nav = [
    { name: "Home", to: "/feed", icon: HomeIcon },
    { name: "Tickets", to: "/tickets", icon: Ticket },
    { name: "Create Event", to: "/event/select-event-type", icon: PlusSquare },
    { name: "Organizers", to: "/organizers", icon: Star },
    { name: "Account", to: "/account", icon: User },
  ];

  return (
    <>
      {/* DESKTOP NAV (Hidden on Mobile) */}
      {/* FIX: Use tw:hidden on mobile and tw:flex on md: to prevent it from ever displaying/overflowing on small screens.
              Also, cleaned up px class to ensure consistency. */}
      <div className="tw:flex tw:w-full tw:h-[85px] tw:bg-white tw:border-b tw:border-gray-200 tw:px-8 tw:items-center tw:justify-between tw:fixed tw:z-999 tw:top-0">
        {/* LEFT SECTION */}
        <Link to={'/feed'} className="tw:flex tw:items-center tw:gap-6">
          {/* Logo */}
          <img
            src={"/images/logo.png"}
            alt="Zagasm Logo"
            className="tw:w-24 tw:lg:w-40 tw:-ml-5 tw:object-contain"
          />
        </Link>

        {/* CENTER NAV LINKS */}
        <div className="tw:hidden tw:md:flex tw:md:justify-center tw:gap-12 tw:mr-16">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.to}
                className="tw:flex tw:flex-col tw:items-center tw:gap-1"
              >
                <Icon
                  className={`tw:size-5 ${
                    active ? "tw:text-black" : "tw:text-gray-500"
                  }`}
                  fill={active ? "black" : "none"}
                />
                <span
                  className={`tw:text-[11px] ${
                    active
                      ? "tw:text-black tw:font-semibold"
                      : "tw:text-gray-500"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* RIGHT ACTION ICONS */}
        <div className="tw:flex tw:items-center tw:gap-4">
          {/* Search */}
          <Link to='/search'>
            <Search className="tw:size-5 tw:text-gray-700 tw:cursor-pointer" />
          </Link>

          {/* Bell + dot */}
          <Link to={"/notifications"} className="tw:relative tw:cursor-pointer">
            <Bell className="tw:size-5 tw:text-gray-700" />
            <span className="tw:absolute tw:-top-1 tw:right-0 tw:w-2 tw:h-2 tw:bg-red-500 tw:rounded-full"></span>
          </Link>

          {/* Profile */}
          <Link
            to="/account"
            className="tw:size-7 tw:rounded-full tw:overflow-hidden tw:cursor-pointer"
          >
            {hasImage ? (
              <img
                src={profileImage}
                className="tw:w-full tw:h-full tw:object-cover"
                alt="Profile"
              />
            ) : (
              <span className="tw:flex tw:items-center tw:justify-center tw:h-full tw:w-full tw:bg-lightPurple tw:text-primary tw:text-sm tw:font-semibold">
                {initials}
              </span>
            )}
          </Link>
        </div>
      </div>

      <MobileNav />
    </>
  );
}
