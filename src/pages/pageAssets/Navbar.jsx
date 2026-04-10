import React, { Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  PlusSquare,
  Search,
  Bell,
  Ticket,
  Star,
  UserCircle2,
  LogOut,
  LayoutGrid,
} from "lucide-react";
import { Popover, Transition } from "@headlessui/react";
import { useAuth } from "../auth/AuthContext";
import MobileNav from "./MobileNav";
import { getInitials, hasProfileImage } from "../../component/Organizers/organiser.utils";
import WalletBalanceChip from "../../features/wallet/components/WalletBalanceChip";
import useNotifications from "../../component/Notification/useNotifications";

// src/component/Events/SingleEvent.jsx (Updated Navbar function)
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, token } = useAuth();
  const { unreadCount } = useNotifications(token);

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
    { name: "Search", to: "/search", icon: Search },
  ];

  const profilePath = user?.id ? `/profile/${user.id}` : "/account";

  return (
    <>
      {/* DESKTOP NAV (Hidden on Mobile) */}
      {/* FIX: Use tw:hidden on mobile and tw:flex on md: to prevent it from ever displaying/overflowing on small screens.
              Also, cleaned up px class to ensure consistency. */}
      <div className="tw:flex tw:w-full tw:h-[74px] tw:bg-white tw:border-b tw:border-gray-200 tw:px-4 tw:md:px-6 tw:lg:px-7 tw:items-center tw:justify-between tw:fixed tw:z-999 tw:top-0">
        {/* LEFT SECTION */}
        <Link to={'/feed'} className="tw:flex tw:items-center tw:gap-4 tw:md:gap-5">
          {/* Logo */}
          <img
            src={"/logo.png"}
            alt="Xilolo Logo"
            className="tw:w-20 tw:md:w-24 tw:lg:w-40 tw:-ml-2 tw:md:-ml-3 tw:object-contain"
          />
        </Link>

        {/* CENTER NAV LINKS */}
        <div className="tw:hidden tw:md:flex tw:md:justify-center tw:gap-8 tw:lg:gap-10 tw:mr-8 tw:lg:mr-12">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.to}
                className="tw:flex tw:flex-col tw:items-center tw:gap-0.5"
              >
                <Icon
                  className={`tw:size-5 ${active ? "tw:text-black" : "tw:text-gray-500"
                    }`}
                  fill={active ? "black" : "none"}
                />
                <span
                  className={`tw:text-[11px] ${active
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
        <div className="tw:flex tw:items-center tw:gap-3 tw:md:gap-3.5">
          {isAuthenticated ? <WalletBalanceChip /> : null}

          {/* Bell + dot */}
          <Link to={"/notifications"} className="tw:relative tw:cursor-pointer">
            <Bell className="tw:size-5 tw:text-gray-700" />
            {unreadCount > 0 && (
              <span className="tw:absolute tw:-right-2 tw:-top-2 tw:flex tw:min-w-[18px] tw:items-center tw:justify-center tw:rounded-full tw:bg-red-500 tw:px-1 tw:text-[10px] tw:font-semibold tw:leading-[18px] tw:text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          {isAuthenticated ? (
            <Popover className="tw:relative">
              <Popover.Button className="tw:size-9 tw:md:size-10 tw:rounded-full rounded-circle tw:overflow-hidden tw:cursor-pointer tw:outline-none tw:ring-0">
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
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="tw:transition tw:duration-150 tw:ease-out"
                enterFrom="tw:opacity-0 tw:translate-y-1 tw:scale-95"
                enterTo="tw:opacity-100 tw:translate-y-0 tw:scale-100"
                leave="tw:transition tw:duration-100 tw:ease-in"
                leaveFrom="tw:opacity-100 tw:translate-y-0 tw:scale-100"
                leaveTo="tw:opacity-0 tw:translate-y-1 tw:scale-95"
              >
                <Popover.Panel className="tw:absolute tw:right-0 tw:top-[calc(100%+12px)] tw:z-50 tw:w-56 tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-2 tw:shadow-[0_18px_48px_rgba(15,23,42,0.14)]">
                  <div className="tw:mb-2 tw:border-b tw:border-slate-100 tw:px-3 tw:pb-2">
                    <div className="tw:text-sm tw:font-semibold tw:text-slate-900">
                      {user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Your account"}
                    </div>
                    <div className="tw:text-xs tw:text-slate-500">
                      {user?.email || "Signed in"}
                    </div>
                  </div>

                  <div className="tw:flex tw:flex-col tw:gap-1">
                    <Popover.Button
                      as="button"
                      type="button"
                      onClick={() => navigate(profilePath)}
                      className="tw:flex tw:w-full tw:items-center tw:gap-3 tw:rounded-xl tw:px-3 tw:py-2.5 tw:text-left tw:text-sm tw:font-medium tw:text-slate-700 tw:transition hover:tw:bg-slate-50"
                    >
                      <UserCircle2 className="tw:size-4" />
                      <span>View Profile</span>
                    </Popover.Button>

                    <Popover.Button
                      as="button"
                      type="button"
                      onClick={() => navigate("/account")}
                      className="tw:flex tw:w-full tw:items-center tw:gap-3 tw:rounded-xl tw:px-3 tw:py-2.5 tw:text-left tw:text-sm tw:font-medium tw:text-slate-700 tw:transition hover:tw:bg-slate-50"
                    >
                      <LayoutGrid className="tw:size-4" />
                      <span>Account Center</span>
                    </Popover.Button>

                    <Popover.Button
                      as="button"
                      type="button"
                      onClick={() => {
                        logout?.();
                        navigate("/auth/signin");
                      }}
                      className="tw:flex tw:w-full tw:items-center tw:gap-3 tw:rounded-xl tw:px-3 tw:py-2.5 tw:text-left tw:text-sm tw:font-medium tw:text-red-600 tw:transition hover:tw:bg-red-50"
                    >
                      <LogOut className="tw:size-4" />
                      <span>Logout</span>
                    </Popover.Button>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          ) : (
            <Link
              to="/auth/signin"
              className="tw:size-9 tw:md:size-10 tw:rounded-full tw:overflow-hidden tw:cursor-pointer"
            >
              <span className="tw:flex tw:items-center tw:justify-center tw:h-full tw:w-full tw:bg-lightPurple tw:text-primary tw:text-sm tw:font-semibold">
                {initials}
              </span>
            </Link>
          )}
        </div>
      </div>

      <MobileNav />
    </>
  );
}
