import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../pages/auth/AuthContext";

export default function Nav() {
  const { user, token } = useAuth();

  const displayName =
    user?.display_name ||
    user?.full_name ||
    user?.name ||
    user?.username ||
    "Creator";

  const avatarUrl =
    user?.avatar ||
    user?.avatar_url ||
    user?.profile_photo_url ||
    user?.image;

  const initials =
    displayName && typeof displayName === "string"
      ? displayName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((n) => n[0]?.toUpperCase())
          .join("")
      : "U";

  return (
    <div className="tw:md:fixed tw:top-0 tw:left-0 tw:right-0 tw:z-40">
      <div className="tw:mx-auto tw:max-w-7xl tw:px-5 tw:py-3 tw:md:py-4">
        <motion.div
          className="tw:flex tw:items-center tw:justify-between tw:rounded-2xl tw:border tw:border-white/60 tw:bg-[rgba(250,247,255,0.85)] tw:backdrop-blur-xl tw:shadow-[0_18px_50px_rgba(15,23,42,0.16)] tw:px-4 tw:md:px-6 tw:py-1.5"
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="tw:inline-flex tw:items-center tw:gap-2 tw:shrink-0"
          >
            <motion.img
              src="/images/logo.png"
              alt="Zagasm Studios"
              className="tw:w-44 tw:md:w-52 tw:rounded-sm tw:-ml-4 tw:md:-ml-7"
              initial={{ rotate: -6, scale: 0.9, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 14,
                delay: 0.05,
              }}
              whileHover={{ rotate: 2, scale: 1.02 }}
            />
          </Link>

          {/* Right side: auth / profile */}
          {token ? (
            <Link
              to="/feed"
              className="tw:flex tw:items-center tw:gap-3 tw:rounded-full tw:bg-white/70 tw:px-3.5 tw:py-1.5 tw:text-xs tw:md:text-sm tw:text-slate-800 tw:border tw:border-slate-200/70 tw:shadow-[0_10px_30px_rgba(15,23,42,0.12)] hover:tw:bg-white tw:transition"
            >
              <div className="tw:flex tw:items-center tw:gap-2">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="tw:h-8 tw:w-8 tw:rounded-full tw:object-cover tw:border tw:border-slate-200/70"
                  />
                ) : (
                  <div className="tw:flex tw:h-8 tw:w-8 tw:items-center tw:justify-center tw:rounded-full tw:bg-primary/10 tw:text-[11px] tw:font-semibold tw:text-primary">
                    {initials}
                  </div>
                )}
                <span className="tw:hidden tw:sm:inline tw:max-w-[140px] tw:truncate tw:text-[13px] tw:font-medium">
                  {displayName}
                </span>
              </div>
            </Link>
          ) : (
            <Link
              to="/auth/signin"
              className="tw:inline-flex tw:items-center tw:justify-center tw:rounded-3xl tw:bg-linear-to-br tw:from-primary tw:to-primarySecond tw:px-5 tw:py-2.5 tw:text-sm tw:font-medium text-white tw:shadow-[0_14px_40px_rgba(143,7,231,0.45)] hover:tw:opacity-95 tw:transition"
            >
              Sign in
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}
