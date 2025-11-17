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
      {/* DESKTOP NAV */}
      <div className="tw:hidden tw:md:flex tw:w-full tw:h-[85px] tw:bg-white tw:border-b tw:border-gray-200 tw:px-8 tw:items-center tw:justify-between tw:fixed tw:z-999 tw:top-0">
        {/* LEFT SECTION */}
        <div className="tw:flex tw:items-center tw:gap-6">
          {/* Logo */}
          <img
            src={"/images/logo.png"}
            alt="Zagasm Logo"
            className="tw:w-[160px] tw:object-contain"
          />

          {/* Hi Jessica */}
          <div className="tw:flex tw:md:hidden tw:flex-col">
            <h2 className="tw:text-[20px] tw:font-normal tw:text-gray-700">
              Hi <span className="tw:font-bold">{firstName}</span> 👋
            </h2>
            <p className="tw:text-[14px] tw:text-gray-500 -tw:mt-1">
              Manage your events & audience
            </p>
          </div>
        </div>

        {/* CENTER NAV LINKS */}
        <div className="tw:flex tw:gap-12 tw:mr-16">
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
          <div className="tw:relative tw:cursor-pointer">
            <Bell className="tw:w-6 tw:h-6 tw:text-gray-700" />
            <span className="tw:absolute tw:-top-1 tw:-right-1 tw:w-3 tw:h-3 tw:bg-red-500 tw:rounded-full"></span>
          </div>

          {/* Profile */}
          <Link
            to="/account"
            className="tw:w-[42px] tw:h-[42px] tw:rounded-full tw:overflow-hidden tw:cursor-pointer"
          >
            <img
              src={profile}
              className="tw:w-full tw:h-full tw:object-cover"
              alt="Profile"
            />
          </Link>
        </div>
      </div>

      <div className="tw:md:hidden">
        <MobileHeader name={firstName} profile={profile} />
      </div>

      <MobileNav />
    </>
  );
}

function MobileHeader({ name = "Jessica", profile }) {
  return (
    <div
      className="
      tw:w-full tw:rounded-b-4xl 
      tw:px-4 tw:pt-10 tw:pb-10
      tw:bg-linear-to-br
      tw:from-[#B07CFF] tw:via-[#8F07E7] tw:to-[#4A78FF]
      tw:text-white
    "
    >
      <div className="tw:flex tw:items-start tw:justify-between">
        {/* LEFT: TEXT */}
        <div>
          <span className="tw:block tw:text-[20px] tw:leading-tight tw:font-light">
            Hi <span className="tw:font-semibold">{name}</span> 👋
          </span>

          <span className="tw:text-[14px] tw:opacity-90 tw:mt-2">
            Manage your events & audience
          </span>
        </div>

        {/* RIGHT: ACTION ICONS */}
        <div className="tw:flex tw:items-center tw:gap-[6.5px]">
          {/* Search */}
          <button
          style={{
            borderRadius: 50
          }}
            className="
            tw:size-12
            tw:rounded-full
            tw:bg-white/20 tw:backdrop-blur-xl
            tw:flex tw:items-center tw:justify-center
            tw:border tw:border-white/20
          "
          >
            <Search className="tw:w-4 tw:h-4 tw:text-white" />
          </button>

          {/* Bell */}
          <button
          style={{
            borderRadius: 50
          }}
            className="
            tw:size-12
            tw:rounded-full
            tw:bg-white/20 tw:backdrop-blur-xl
            tw:flex tw:items-center tw:justify-center
            tw:border tw:border-white/20
            tw:relative
          "
          >
            <Bell className="tw:w-4 tw:h-4 tw:text-white" />
            <span
              className="
              tw:absolute tw:top-3 tw:right-3
              tw:w-3.5 tw:h-3.5 tw:bg-red-500
              tw:rounded-full
            "
            ></span>
          </button>

          {/* Profile */}
          <div
            className="
            tw:size-12
            tw:rounded-full tw:border-1 tw:border-white
            tw:overflow-hidden
          "
          >
            <img
              src={profile}
              alt="profile"
              className="tw:w-full tw:h-full tw:object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
