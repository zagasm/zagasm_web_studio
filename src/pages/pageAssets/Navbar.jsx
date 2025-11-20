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
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import MobileNav from "./MobileNav";
import logo from "../../assets/zagasm_studio_logo.png";
import default_profilePicture from "../../assets/avater_pix.avif";

// src/component/Events/SingleEvent.jsx (Updated Navbar function)
export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();

  const profile = user?.profileUrl || default_profilePicture;
  const firstName = user?.firstName || "User";

  const nav = [
    { name: "Home", to: "/feed", icon: HomeIcon },
    { name: "Saved", to: "/event/saved-events", icon: Heart },
    { name: "Create Event", to: "/event/select-event-type", icon: PlusSquare },
    { name: "Tickets", to: "/tickets", icon: Ticket },
    { name: "Account", to: "/account", icon: User },
  ];

  return (
    <>
      {/* DESKTOP NAV (Hidden on Mobile) */}
      {/* FIX: Use tw:hidden on mobile and tw:flex on md: to prevent it from ever displaying/overflowing on small screens.
              Also, cleaned up px class to ensure consistency. */}
      <div className="tw:flex tw:w-full tw:h-[85px] tw:bg-white tw:border-b tw:border-gray-200 tw:px-8 tw:items-center tw:justify-between tw:fixed tw:z-999 tw:top-0">
        {/* LEFT SECTION */}
        <div className="tw:flex tw:items-center tw:gap-6">
          {/* Logo */}
          <img
            src={"/images/logo.png"}
            alt="Zagasm Logo"
            className="tw:w-40 tw:-ml-5 tw:object-contain"
          />
        </div>

        {/* CENTER NAV LINKS */}
        <div className="tw:hidden tw:md:flex tw:gap-12 tw:mr-16">
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
                  className={`tw:w-6 tw:h-6 ${
                    active ? "tw:text-black" : "tw:text-gray-500"
                  }`}
                  fill={active ? "black" : "none"}
                />
                <span
                  className={`tw:text-[13px] ${
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
        <div className="tw:flex tw:items-center tw:gap-8">
          {/* Search */}
          <Search className="tw:w-6 tw:h-6 tw:text-gray-700 tw:cursor-pointer" />

          {/* Bell + dot */}
          <Link className="tw:relative tw:cursor-pointer">
            <Bell className="tw:w-6 tw:h-6 tw:text-gray-700" />
            <span className="tw:absolute tw:-top-1 tw:-right-1 tw:w-3 tw:h-3 tw:bg-red-500 tw:rounded-full"></span>
          </Link>

          {/* Profile */}
          <Link
            to="/account"
            className="tw:size-[42px] tw:rounded-full tw:overflow-hidden tw:cursor-pointer"
          >
            <img
              src={profile}
              className="tw:w-full tw:h-full tw:object-cover"
              alt="Profile"
            />
          </Link>
        </div>
      </div>


      <MobileNav />
    </>
  );
}
