import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  HomeIcon,
  Heart,
  HeartOff,
  PlusSquare,
  Ticket,
  User,
} from "lucide-react";

export default function MobileNav() {
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      to: "/feed",
      icon: (active) => (
        <HomeIcon
          className={`tw:size-7 ${
            active ? "tw:text-white" : "tw:text-[#4A4A4A]"
          }`}
          fill={active ? "black" : "none"}
        />
      ),
    },
    {
      name: "Saved",
      to: "/event/saved-events",
      icon: (active) => (
        <Heart
          className={`tw:size-7 ${
            active ? "tw:text-white" : "tw:text-[#4A4A4A]"
          }`}
          fill={active ? "black" : "none"}
        />
      ),
    },
    {
      name: "Create Event",
      to: "/event/select-event-type",
      icon: (active) => (
        <PlusSquare
          className={`tw:size-7 ${
            active ? "tw:text-white" : "tw:text-[#4A4A4A]"
          }`}
          fill={active ? "black" : "none"}
        />
      ),
    },
    {
      name: "Tickets",
      to: "/tickets",
      icon: (active) => (
        <Ticket
          className={`tw:size-7 ${
            active ? "tw:text-white" : "tw:text-[#4A4A4A]"
          }`}
          fill={active ? "black" : "none"}
        />
      ),
    },
    {
      name: "Account",
      to: "/account",
      icon: (active) => (
        <User
          className={`tw:size-7 ${
            active ? "tw:text-white" : "tw:text-[#4A4A4A]"
          }`}
          fill={active ? "black" : "none"}
        />
      ),
    },
  ];

  return (
    <div className="tw:fixed tw:md:hidden tw:bottom-0 tw:left-0 tw:right-0 tw:bg-white tw:border-t tw:border-gray-200 tw:py-5 tw:z-999 tw:block md:tw:hidden">
      <div className="tw:flex tw:items-center tw:justify-between tw:px-6">
        {navItems.map((item) => {
          const active = location.pathname === item.to;

          return (
            <Link
              key={item.name}
              to={item.to}
              className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-1 tw:text-xs tw:font-medium"
            >
              {item.icon(active)}
              <span
                className={`tw:text-[12px] ${
                  active ? "tw:text-black tw:font-semibold" : "tw:text-[#4A4A4A]"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
