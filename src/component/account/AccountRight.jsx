import React from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Globe,
  Mail,
  Lock,
  UserX,
  ShieldCheck,
  HelpCircle,
  Headphones,
  FileText,
  Trash,
  LogOut,
} from "lucide-react";

const MenuSection = ({ title, items }) => (
  <div className="tw:mb-8">
    <span className="tw:text-[14px] tw:font-medium tw:text-gray-500 tw:mb-4 tw:pl-1">
      {title}
    </span>
    <div className="tw:flex tw:flex-col tw:gap-3">
      {items.map((item, index) => (
        <ItemCard key={index} {...item} />
      ))}
    </div>
  </div>
);

const ItemCard = ({ icon: Icon, label, to, onClick, isRed }) => {
  const Wrapper = to ? Link : "div";

  return (
    <Wrapper
      to={to}
      onClick={onClick}
      className="tw:bg-white tw:w-full tw:rounded-3xl tw:py-3 tw:px-4 tw:flex tw:items-center tw:justify-between hover:tw:shadow-md tw:transition-all tw:cursor-pointer tw:group"
    >
      <div className="tw:flex tw:items-center tw:gap-4">
        {Icon && (
          <Icon
            className={`tw:w-5 tw:h-5 ${
              isRed ? "tw:text-red-500" : "tw:text-gray-700"
            }`}
          />
        )}
        <span
          className={`tw:text-[15px] tw:font-medium ${
            isRed ? "tw:text-red-600" : "tw:text-gray-900"
          }`}
        >
          {label}
        </span>
      </div>
      {!isRed && (
        <svg
          className="tw:w-5 tw:h-5 tw:text-gray-300 group-hover:tw:text-gray-500 tw:transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Wrapper>
  );
};

const AccountRight = ({ onLogout, onDeactivate }) => {
  const preferences = [
    { icon: Bell, label: "Notifications", to: "/account/manage-notification" },
    { icon: Globe, label: "Language", to: "/account/language" },
    { icon: Mail, label: "Email & SMS Preference", to: "/account/email-pref" },
  ];

  const security = [
    { icon: Lock, label: "Password & Security", to: "/account/security" },
    {
      icon: UserX,
      label: "Blocked Organizers / Users",
      to: "/account/blocked",
    },
    {
      icon: ShieldCheck,
      label: "Two-Factor Authentication",
      to: "/account/2fa",
    },
  ];

  const support = [
    { icon: HelpCircle, label: "FAQ", to: "/account/faq" },
    { icon: Headphones, label: "Contact Support", to: "/account/support" },
    { icon: FileText, label: "Terms & Policy", to: "/account/terms" },
    {
      icon: Trash,
      label: "Delete Account",
      onClick: onDeactivate,
      isRed: false,
    }, // Kept black as per screen, usually delete is separate
  ];

  return (
    <div className="tw:pt-6 tw:md:pt-10 tw:pb-16">
      <MenuSection title="Preference" items={preferences} />
      <MenuSection title="Security & Privacy" items={security} />
      <MenuSection title="Support" items={support} />

      <div className="tw:mt-6  tw:mb-8 tw:flex tw:justify-center">
        <button
          style={{
            borderRadius: 24,
          }}
          onClick={onLogout}
          className="tw:flex tw:w-full tw:text-center tw:items-center tw:gap-2 tw:bg-white tw:px-8 tw:py-3 tw:rounded-full tw:shadow-sm hover:tw:shadow-md tw:transition-all"
        >
          <LogOut className="tw:w-5 tw:h-5 tw:text-red-600" />
          <span className="tw:text-[15px] tw:font-bold tw:text-red-600">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default AccountRight;
